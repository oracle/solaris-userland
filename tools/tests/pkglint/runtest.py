#!/usr/bin/python3.7
#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at usr/src/OPENSOLARIS.LICENSE
# or http://www.opensolaris.org/os/licensing.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at usr/src/OPENSOLARIS.LICENSE.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2021, Oracle and/or its affiliates.
#

# Tests for Userland pkglint check extension (from userland.py)

import pathlib
import subprocess
import platform
import unittest


class TestUserlandPkglint(unittest.TestCase):

    solaris_ver = "XXX"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Find the locations of Userland pkglint extensions, pkglintrc and
        # test manifests based on the expected location of this script.
        here = pathlib.Path(__file__).parent.absolute()
        tools = here.parent.parent
        self.extension_path = tools / "python"
        self.pkglintrc = tools / "pkglintrc"
        self.manifests = here / "manifests"
        self.protoarea = here / "proto"

    # override these for better debugging
    def assertIn(self, member, container, msg=None):
        if member not in container:
            standardMsg = f"'{member}' not found in\n{container}"
            self.fail(self._formatMessage(msg, standardMsg))

    def assertNotIn(self, member, container, msg=None):
        if member in container:
            standardMsg = f"'{member}' unexpectedly found in\n{container}"
            self.fail(self._formatMessage(msg, standardMsg))

    def with_manifest(manifest, proto=False):
        def decorator(function):
            def wrapper(self):
                manifest_path = self.manifests / manifest
                self.assertTrue(
                    manifest_path.exists(),
                    msg=f"Manifest {manifest} was not found here: {manifest_path}.")

                env = {"SOLARIS_VERSION": self.solaris_ver}
                if proto:
                    env["PROTO_PATH"] = self.protoarea

                res = subprocess.run(
                    ["/bin/pkglint", "-e", self.extension_path, "-f", self.pkglintrc, manifest_path],
                    text=True, capture_output=True, env=env)
                return function(self, res.returncode, res.stdout, res.stderr)
            return wrapper
        return decorator


    @with_manifest("userland.action001_1.in")
    def test_action001_clean(self, ret, stdout, stderr):
        """Correctly used attributes don't report errors."""
        self.assertEqual(ret, 0)
        self.assertEqual(stderr, "")


    @with_manifest("userland.action001_2.in")
    def test_action001_mode(self, ret, stdout, stderr):
        """Mode and preserve attribute misuse is detected."""
        self.assertIn("ERROR userland.action001.0        "
            "usr/lib/pkglinttest/first.py is writable (0644), but missing a preserve attribute\n", stderr)
        self.assertIn("ERROR userland.action001.4        "
            "usr/lib/pkglinttest/second.py has a preserve action, but is not writable (0444)\n", stderr)
        self.assertIn("ERROR userland.action001.3        "
            "usr/lib/pkglinttest/third.py has a preserve action, but no mode\n", stderr)


    @with_manifest("userland.action001_3.in", proto=True)
    def test_action001_protoarea(self, ret, stdout, stderr):
        """Missing files are detected."""
        self.assertEqual(ret, 0)
        self.assertNotIn("usr/lib/pkglinttest/foo.py", stderr)
        # missing file at this stage is INFO only (with return code 0)
        self.assertIn("INFO userland.action001.1         "
            "usr/lib/pkglinttest/missing.py missing from proto area, skipping content checks\n", stderr)


    @with_manifest("userland.action001_4.in", proto=True)
    def test_action001_bitscheck(self, ret, stdout, stderr):
        """checks for 32/64 elf locations work correctly."""

        for val in ["usr/bin/sparcv7/64in32a", "usr/bin/sparcv7/64in32x"]:
            self.assertIn("ERROR userland.action001.2        "
                f"64-bit object '{val}' in 32-bit path\n", stderr)

        for val in ["usr/bin/amd64/32in64a", "usr/bin/amd64/32in64x"]:
            self.assertIn("ERROR userland.action001.2        "
                f"32-bit object '{val}' in 64-bit path(['usr', 'bin', 'amd64'])\n", stderr)

        for val in ["32in32b", "32in64b", "64in32b", "64in64b",
                    "32in32a", "32in32x", "64in64a", "64in64x"]:
            self.assertNotIn(val, stderr)

        pathlist32 = [
            "i86",
            "sparcv7",
            "32",
            "i86pc-solaris-64int",
            "sun4-solaris-64int",
            "i386-solaris" + self.solaris_ver,
            "sparc-solaris" + self.solaris_ver
        ]

        for path in pathlist32:
            self.assertNotIn(f"usr/bin/{path}/32bin", stderr)
            self.assertIn("ERROR userland.action001.2        "
                f"64-bit object 'usr/bin/{path}/64bin' in 32-bit path", stderr)

        pathlist64 = [
            "amd64",
            "sparcv9",
            "64",
            "fbconfig",
            "i86pc-solaris-64",
            "sun4-solaris-64",
            "i86pc-solaris-thread-multi-64",
            "sun4-solaris-thread-multi-64",
            "amd64-solaris" + self.solaris_ver,
            "sparcv9-solaris" + self.solaris_ver,
            "sparcv9-sun-solaris" + self.solaris_ver,
            "amd64-solaris-" + self.solaris_ver,
            "sparcv9-solaris-" + self.solaris_ver,
            "x86_64-pc-solaris" + self.solaris_ver
        ]

        for path in pathlist64:
            self.assertNotIn(f"usr/bin/{path}/64bin", stderr)
            self.assertIn("ERROR userland.action001.2        "
                f"32-bit object 'usr/bin/{path}/32bin' in 64-bit path(['usr', 'bin', '{path}'])\n", stderr)

        self.assertNotIn("usr/lib/xorg/modules/64bin", stderr)
        self.assertNotIn("usr/lib/xorg/modules/dri", stderr)
        self.assertIn("ERROR userland.action001.2        "
            "32-bit object 'usr/lib/xorg/modules/32bin' in 64-bit path(['usr', 'lib', 'xorg', 'modules'])\n", stderr)


    @with_manifest("userland.action001_5.in", proto=True)
    def test_action001_runpathcheck(self, ret, stdout, stderr):
        """RUNPATH checks work correctly."""

        # basic checks
        self.assertNotIn("good32", stderr)
        self.assertNotIn("good64", stderr)
        self.assertIn("ERROR userland.action001.3        "
            f"bad RUNPATH, '{self.protoarea}/usr/lib/runpath/bad' includes '/wrong:/tmp'\n", stderr)

        # 32/64 bit runpath checks
        self.assertNotIn("32with32", stderr)
        self.assertNotIn("64with64", stderr)
        self.assertIn("WARNING userland.action001.3      "
            f"32-bit runpath in 64-bit binary, '{self.protoarea}/usr/lib/runpath/64with32' includes '/lib'\n", stderr)
        self.assertIn("WARNING userland.action001.3      "
            f"64-bit runpath in 32-bit binary, '{self.protoarea}/usr/lib/runpath/32with64' includes '/lib/amd64'\n", stderr)

        # link checks
        self.assertIn("WARNING userland.action001.3      "
            f"runpath '/usr/openwin/lib' in '{self.protoarea}/usr/lib/runpath/linka' not found "
            "in reference paths but contains symlink at 'usr/openwin'\n", stderr)
        self.assertIn("WARNING userland.action001.3      "
            f"runpath '/usr/openwin/bin' in '{self.protoarea}/usr/lib/runpath/linkb' not found "
            "in reference paths but contains symlink at 'usr/openwin'\n", stderr)
        self.assertIn("ERROR userland.action001.3        "
            f"bad RUNPATH, '{self.protoarea}/usr/lib/runpath/linkc' includes '/usr/X11/bin'", stderr)


    @with_manifest("userland.action001_6.in", proto=True)
    def test_action001_aslrcheck(self, ret, stdout, stderr):
        """ASLR checks work correctly."""
        self.assertNotIn("aslr/enabled", stderr)
        self.assertIn("WARNING userland.action001.6      "
            f"'{self.protoarea}/usr/lib/aslr/disabled' does not have aslr enabled\n", stderr)
        self.assertIn("ERROR userland.action001.5        "
            f"'{self.protoarea}/usr/lib/aslr/noflag' is not tagged for aslr\n", stderr)


    @with_manifest("userland.action002_1.in")
    def test_action002_working_links(self, ret, stdout, stderr):
        """Working links are not being reported."""
        self.assertEqual(ret, 0)
        self.assertEqual(stderr, "")


    @with_manifest("userland.action002_2.in")
    def test_action002_broken_links(self, ret, stdout, stderr):
        """All broken links are correctly detected."""
        self.assertIn("ERROR userland.action002.0        "
            "link usr/bin/first has unresolvable target '/usr/lib/pkglinttest/foo.py'\n", stderr)
        self.assertIn("ERROR userland.action002.0        "
            "link usr/bin/second has unresolvable target '/usr/lib/pkglinttest/xyz.py'\n", stderr)
        self.assertIn("ERROR userland.action002.0        "
            "link usr/bin/third has unresolvable target '/usr/lib/'\n", stderr)
        self.assertIn("ERROR userland.action002.0        "
            "link usr/bin/fouth has unresolvable target '/home/'\n", stderr)
        self.assertIn("ERROR userland.action002.0        "
            "hardlink usr/bin/firstx has unresolvable target '/usr/lib/pkglinttest/foo.py'\n", stderr)
        self.assertIn("ERROR userland.action002.0        "
            "hardlink usr/bin/secondx has unresolvable target '/usr/lib/pkglinttest/xyz.py'\n", stderr)
        self.assertIn("ERROR userland.action002.0        "
            "hardlink usr/bin/thirdx has unresolvable target '/usr/lib/'\n", stderr)
        self.assertIn("ERROR userland.action002.0        "
            "hardlink usr/bin/fouthx has unresolvable target '/home/'\n", stderr)


    @with_manifest("userland.action003.in")
    def test_action003(self, ret, stdout, stderr):
        """SVR4 startup actions are reported as warnings."""
        self.assertEqual(ret, 0)
        self.assertIn("WARNING userland.action003.0      "
            "SVR4 startup 'etc/rca.d/foo.py', deliver SMF service instead\n", stderr)
        self.assertIn("WARNING userland.action003.0      "
            "SVR4 startup 'etc/init.d/bar.py', deliver SMF service instead\n", stderr)


    @with_manifest("userland.action004.in")
    def test_action004(self, ret, stdout, stderr):
        """Files are delivered in allowed locations only."""
        self.assertNotIn("correct", stderr)
        self.assertIn("ERROR userland.action004.0        "
            "object delivered into non-standard location: Solaris/wrong", stderr)
        self.assertIn("ERROR userland.action004.0        "
            "object delivered into non-standard location: bin/wrong", stderr)
        self.assertIn("ERROR userland.action004.0        "
            "object delivered into non-standard location: var/share/wrong", stderr)


    @with_manifest("userland.manifest001_1.in")
    def test_manifest001_empty(self, ret, stdout, stderr):
        """Packages without license and files are ok."""
        self.assertEqual(ret, 0)
        self.assertEqual(stderr, "")


    @with_manifest("userland.manifest001_2.in")
    def test_manifest001_license_only(self, ret, stdout, stderr):
        """Packages with license and without files are ok."""
        self.assertEqual(ret, 0)
        self.assertEqual(stderr, "")


    @with_manifest("userland.manifest001_3.in")
    def test_manifest001_missing_license(self, ret, stdout, stderr):
        """Packages with files missing license and ARC are reported."""
        self.assertIn("ERROR userland.manifest001.0      "
            "missing license action\n", stderr)
        self.assertIn("ERROR userland.manifest001.0      "
            "missing ARC data (org.opensolaris.arc-caseid)\n", stderr)


    @with_manifest("userland.manifest002_1.in")
    def test_manifest002_allowed_publishers(self, ret, stdout, stderr):
        """Allowed publisher is not incorrectly reported."""
        self.assertEqual(ret, 0)
        self.assertEqual(stderr, "")


    @with_manifest("userland.manifest002_2.in")
    def test_manifest002_forbidden_publisher(self, ret, stdout, stderr):
        """Package fmri doesn't have a publisher set."""
        package = "pkg://unknown/library/foobar@1.0.0,11.4-11.4.33.0.0.92.0"

        self.assertEqual("ERROR userland.manifest002.2      "
            f"package {package} has a publisher set!\n", stderr)


    @with_manifest("userland.manifest003_1.in")
    def test_manifest003_missing_incorporate(self, ret, stdout, stderr):
        """CFFI is incorporated when package depends on it."""
        package = "pkg:/library/foobar@1.0.0,11.4-11.4.33.0.0.92.0"

        self.assertIn("ERROR userland.manifest003.2      "
            f"package {package} depends on CFFI, but does not incorporate it (should be at", stderr)


    @with_manifest("userland.manifest003_2.in")
    def test_manifest003_wrong_incorporate(self, ret, stdout, stderr):
        """CFFI is incorporated at a correct version."""
        package = "pkg:/library/foobar@1.0.0,11.4-11.4.33.0.0.92.0"

        self.assertIn("ERROR userland.manifest003.3      "
            f"package {package} depends on CFFI, but incorporates it at the wrong version (", stderr)


    @with_manifest("userland.manifest004.in")
    def test_manifest004(self, ret, stdout, stderr):
        """Unexpanded variables are correctly detected."""
        package = "pkg:/library/foobar@1.0.0,11.4-11.4.33.0.0.92.0"

        self.assertIn("ERROR userland.manifest004.0      "
            f"Unexpanded make variable in {package}:\nset name=com.oracle.info.tpno value=$(TPNO)", stderr)
        self.assertIn("ERROR userland.manifest004.0      "
            f"Unexpanded make variable in {package}:\n"
            "file NOHASH group=bin mode=0444 owner=root path=usr/lib/$(VERSION)/foo.py", stderr)


    @with_manifest("userland.manifest005.in")
    def test_manifest005(self, ret, stdout, stderr):
        """Only files for local architecture are being delivered."""
        package = "pkg:/library/foobar@1.0.0,11.4-11.4.33.0.0.92.0"

        self.assertIn("ERROR userland.manifest005.1      "
            f"Package {package} is being published for wrong architecture {{'arm64'}} instead of {platform.processor()}:\n"
            "('variant.arch', {'arm64'})", stderr)
        self.assertIn("ERROR userland.manifest005.2      "
            f"The manifest {package} contains action with wrong architecture '['arm64']' (instead of '{platform.processor()}'):\n"
            "file NOHASH group=bin mode=0444 owner=root path=usr/lib/pkglinttest/xyz.py variant.arch=arm64", stderr)

        # the following assertions differ based on the architecture
        if platform.processor() == "i386":
            self.assertIn("ERROR userland.manifest005.2      "
                f"The manifest {package} contains action with wrong architecture '['sparc']' (instead of 'i386'):\n"
                "file NOHASH group=bin mode=0444 owner=root path=usr/lib/pkglinttest/foo.py variant.arch=sparc", stderr)
        else:
            self.assertIn("ERROR userland.manifest005.2      "
                f"The manifest {package} contains action with wrong architecture '['i386']' (instead of 'sparc'):\n"
                "file NOHASH group=bin mode=0444 owner=root path=usr/lib/pkglinttest/bar.py variant.arch=i386", stderr)


if __name__ == '__main__':
    unittest.main()
