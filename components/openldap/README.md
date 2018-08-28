Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.

# OpenLDAP notes.

These notes are for engineering only.  They are not distributed with the
packaging but are available with the source code.

## OpenLDAP compatibility

DATABASE compatibility between versions of OpenLDAP is not guaranteed.  When
upgrading OpenLDAP server it is imperative that before upgrade its database
is exported in LDIF format. Following package activation the old database
should be removed and the previously exported LDIF imported.

The openldap SMF service, ldap/server, (file Solaris/ldap-olslapd) includes a
version check to help prevent accidental damage when versions do not match.
A future update will hopefully move that check to within slapd(8oldap), until
that time version updates will need to modify those checks.

## Packaging

Originally packaged within a single package (openldap.p5m,
pkg:/library/openldap) it has subsequently been broken up into:

- openldap-client.p5m (pkg:/system/network/ldap/openldap)
- openldap-server.p5m (pkg:/service/network/ldap/openldap)

### openldap-server.p5m

When the OpenLDAP server package is installed or updated it logs a short note
(Solaris/openldap-notice.txt), also viewable via "pkg history", to review
openldap-transition.txt (Solaris/openldap-transition.txt).  The short note is
displayed as the full instructions are rather long.

Note: source file Solaris/openldap-notice.txt has two entries

  - usr/share/doc/release-notes/openldap-install.txt

    Which includes attribute *release-note=feature/pkg/self@0* causing
    it to be displayed on installation of the package.

  - usr/share/doc/release-notes/openldap-update.txt

    Which includes attribute *self@$(IPS\_COMPONENT\_VERSION)*
    causing it to be displayed when the component version is incremented.

    By specifying the version as IPS\_COMPONENT\_VERSION the
    release-note will correctly be applied when openldap component is
    updated, and COMPONENT\_VERSION is modified in Makefile.  As
    updates do not have to be applied incrementally it is not possible
    to use the version as a definitive comparison to the
    compatibility.

    Originally set to $(IPS\_COMPONENT\_VERSION),$(BUILD\_VERSION)
    which erroneously caused every build to display the release-note
    as BUILD\_VERSION includes the branch-id (BRANCHID).

### openldap-client.p5m

**Caution**

- Oracle Solaris only provides the MT HOT library libldap\_r.so.  For
  compatibility libldap.so and specific version-ed libraries are links
  to libldap\_r.so.

