#!/usr/bin/python2.7

#
# Copyright (c) 2012, 2017, Oracle and/or its affiliates. All rights reserved.
#

# OSNet-specific pkglint(1) checks, called as part of pkglint commands in
# usr/src/pkg/Makefile, with settings in usr/src/pkg/*pkglintrc.
#

import os
import pkg.lint.base as base


class OSNetActionChecker(base.ActionChecker):
    """An osnet-specific class to check actions."""

    name = "osnet.action"

    def __init__(self, config):
        self.description = _(
            "checks OS Net packages for common action errors")
        super(OSNetActionChecker, self).__init__(config)

    def varmigrate(self, action, manifest, engine, pkglint_id="001"):
        """Check that we only deliver directories to /var/.migrate.

        During filesystem/minimal, a script runs to migrate unpackaged
        content from /var/.migrate to the newly mounted /var/share
        dataset.

        Directories are created if necessary under /var/share, but files
        are moved.  If packaged objects were delivered under
        /var/.migrate then subsequently migrated, they would cause
        'pkg verify/fix' errors in the image.

        Ensure /var/.migrate entries that have a salvage-from attribute
        also have an actuator (needed for self-assembly of ROZR zones
        in particular)
        """

        if "path" not in action.attrs:
            return
        path = action.attrs["path"]

        if not path.startswith("var/.migrate"):
            return

        seen_preserve = action.attrs.get("preserve")

        if action.name != "dir" and (action.name != "file" or
           not seen_preserve or (seen_preserve.lower() != "true" and
                                 seen_preserve.lower().lower() != "abandon")):
            engine.error(_(
                "Bad deliverable: %(path)s. "
                "Only directories and files with the preserve attribute can"
                " be delivered to /var/.migrate by %(pkg)s") %
                {"path": path, "pkg": manifest.fmri},
                msgid="%s%s.1" % (self.name, pkglint_id))

        seen_salvage_from = action.attrs.get("salvage-from")
        seen_actuator = action.attrs.get("refresh_fmri")

        if seen_salvage_from and not seen_actuator:
            engine.error(_(
                "/var/.migrate action %(path)s must "
                "have a refresh_fmri actuator when 'salvage-from'"
                " is set in %(pkg)s") %
                {"path": path, "pkg": manifest.fmri},
                msgid="%s%s.2" % (self.name, pkglint_id))

    varmigrate.pkglint_desc = _(
        "Only directories should be delivered to /var/.migrate")

    def varshare(self, action, manifest, engine, pkglint_id="002"):
        """Ensure that we deliver nothing underneath /var/share.

        During upgrade, from a system without an <rpool>/VARSHARE
        dataset, we create that dataset and mount it there - a populated
        mountpoint would foil our plans.

        With a mounted /var/share, since the dataset is shared across
        boot environments, we can't risk packaging operations from two
        separate boot environments trying to modify content in
        /var/share.
        """

        if "path" not in action.attrs:
            return
        path = action.attrs["path"]

        if path.rstrip("/").startswith("var/share/"):
            engine.error(_(
                "Path %(path)s cannot be delivered by "
                "%(pkg)s, reserved for unpackaged content shared "
                "across boot environments.") %
                {"path": path, "pkg": manifest.fmri},
                msgid="%s%s" % (self.name, pkglint_id))

    varshare.pkglint_desc = _(
        "Packages should not deliver content beneath /var/share.")


class OSNetManifestChecker(base.ManifestChecker):
    """An osnet-specific class to check actions."""

    name = "osnet.manifest"

    def test_cfg(self, manifest, engine, pkglint_id="001"):
        """If this package delivers files to /opt/onbld/test then
        it should also deliver at least one file called <foo>.cfg to
        /opt/onbld/test/test.d.

        By delivering a *.cfg file along with packaged tests, we make it
        easier for test teams to execute those tests without having to
        consult the source tree to determine how to integrate those
        tests with their test harness.

        It's hard to police tests that are delivered to places other
        than /opt/onbld/test and which also have a *.cfg file in
        $SRC/tools/test.d but have forgotten to package it.
        """

        has_onbld_tests = False
        has_cfg_file = False
        for action in manifest.gen_actions():
            if "path" not in action.attrs:
                continue
            path = action.attrs["path"]
            if path.startswith("opt/onbld/test/"):
                has_onbld_tests = True
            else:
                continue

            if path.startswith("opt/onbld/test/test.d/") and \
                    os.path.basename(path).endswith(".cfg"):
                has_cfg_file = True

        if has_onbld_tests and not has_cfg_file:
            engine.error(_(
                "Package %(pkg)s delivers to opt/onbld/test but does not "
                "include a *.cfg file") %
                {"pkg": manifest.fmri},
                msgid="%s%s" % (self.name, pkglint_id))

    test_cfg.pkglint_desc = _(
        "ON Test packages must deliver *.cfg files.")


class ExtractLicense(base.ManifestChecker):

    """A class to extract license(s) from manifests. This is a more strict
    version of the licensing checks used by Solaris Release Engineering,
    which emits errors rather than warnings """

    name = "re.pkglint.license"

    def __init__(self, config):
        self.description = _("Extract license from manifest.")
        super(ExtractLicense, self).__init__(config)
        self.licenses = {}

    @staticmethod
    def _construct_license(ldict):
        license = {}
        for key in ["tpno", "name", "version", "description"]:
            license[key] = ldict.get("com.oracle.info.%s" % key, "")
        return license

    @staticmethod
    def _construct_set_attrs(manifest):
        result = {}
        for action in manifest.gen_actions_by_type("set"):
            map = {}
            name = ""
            for attr in action.attrs:
                if attr == "name":
                    name = action.attrs[attr]
                else:
                    val = action.attrs[attr]
                    map[attr] = val
            result[name] = map
        return result

    @staticmethod
    def _construct_notempty_attrs(manifest):
        result = {}
        for action in manifest.gen_actions():
            if action.name == "file":
                result = "hascontent"
                break
        return result

    def licensing(self, manifest, engine, pkglint_id="001"):
        licensespkg = []
        licenseslic = []
        licensepkg = {}
        licenselic = {}

        # old method of defining license info, using "set" actions
        pkgvers = ""
        if "com.oracle.info.tpno" in manifest:
            licensepkg = ExtractLicense._construct_license(manifest)
            fileaction = ExtractLicense._construct_notempty_attrs(manifest)
            licensespkg.append(licensepkg)
            licenseslic.append(licensepkg)
        else:
            if "com.oracle.info.version" in manifest:
                try:
                    pkgvers = ExtractLicense._construct_license(
                        manifest)["version"]
                except ValueError:
                    pkgvers = ""

        # extract license action attributes
        for action in manifest.gen_actions_by_type("license"):
            licenselic = ExtractLicense._construct_license(action.attrs)
            licenselic["license"] = action.attrs.get("license", "")
            licenseslic.append(licenselic)

        # manifest cannot use both set actions and license actions to define
        # tpno attribute.
        if not licensepkg and not licenselic:
            return
        pkgpath = manifest.fmri.get_pkg_stem()

        pkglint_id = "001"
        if licensepkg:
            if licensepkg["tpno"] != "" and not licenselic:
                if fileaction == "hascontent":
                    lint_id = "%s%s" % (self.name, pkglint_id)
                    engine.error(
                        _("%(fmri)s has tpno but no license action")
                        % {"fmri": pkgpath},
                        msgid=lint_id)
                    return
                return

        pkglint_id = "002"
        tpnostr = licenselic["tpno"]
        if licensespkg and licenseslic and tpnostr:
            lint_id = "%s%s" % (self.name, pkglint_id)
            engine.error(_(
                "%(fmri)s has both license and set actions for "
                "tpno") % {"fmri": pkgpath}, msgid=lint_id)

        for license in [licensepkg, licenselic]:

            if not license:
                continue
            # validation of tpno format
            pkglint_id = "003"
            tpnostr = license["tpno"]
            if tpnostr != "":
                try:
                    # force cast it to integer to compare
                    tpnoval = int(tpnostr)
                except ValueError:
                    lint_id = "%s%s.1" % (self.name, pkglint_id)
                    engine.error(_(
                        "%(pkg)s has non-integer TPNO "
                        "value of %(key)s") %
                        {"pkg": pkgpath, "key": tpnostr},
                        msgid=lint_id)

            # com.oracle.info.name, com.oracle.info.description cannot be
            # empty.
            # com.oracle.info.version may be empty if there is no version for
            # the technology
            pkglint_id = "004"
            for infofield in ["tpno", "name", "description", "version"]:
                infoval = license[infofield]
                if infoval == "":

                    if infofield == "tpno":
                        return

                    if infofield == "name":
                        lint_id = "%s%s.2" % (self.name, pkglint_id)
                        engine.error(_(
                            "%s has empty value for license attribute "
                            "com.oracle.info.%s") % (pkgpath, infofield),
                            msgid=lint_id)

                    if infofield == "description":
                        lint_id = "%s%s.3" % (self.name, pkglint_id)
                        engine.error(_(
                            "%s has empty value for license attribute "
                            "com.oracle.info.%s") %
                            (pkgpath, infofield),
                            msgid=lint_id)

                    if infofield == "version":
                        if pkgvers == "":
                            lint_id = "%s%s.4" % (self.name, pkglint_id)
                            engine.warning(_(
                                "%s has empty value for license attribute "
                                "com.oracle.info.%s") % (pkgpath, infofield),
                                msgid=lint_id)

    licensing.pkglint_desc = _("A series of license checks for Solaris RE")
