Copyright (c) 2018, 2024, Oracle and/or its affiliates.

# OpenLDAP notes.

These notes are for engineering only.  They are not distributed with the
packaging but are available with the source code.


# OpenLDAP compatibility

DATABASE compatibility between versions of OpenLDAP is not guaranteed.  When
upgrading OpenLDAP server it is imperative that before upgrade its database
is exported in LDIF format. Following package activation the old database
should be removed and the previously exported LDIF imported.

The openldap SMF service, ldap/server, (file Solaris/ldap-olslapd) includes a
version check to help prevent accidental damage when versions do not match.  A
future update will hopefully move that check to within slapd(8oldap), until
that time version updates will need to modify those checks.  See also
openldap-server.p5m below.


# Packaging

Originally packaged within a single package (openldap.p5m,
pkg:/library/openldap) it has subsequently been broken up into:

- openldap-client.p5m (pkg:/system/network/ldap/openldap)
- openldap-server.p5m (pkg:/service/network/ldap/openldap)

When modifying the packaging p5m files one needs to also modify the generate
files which may includes a number of transform lines so that the generated
text matches.  Note that generation occurs toward the end of `gmake publish`
step which is after the p5m file is used to package up (the generation is a
cross check, not the author).


## Packaging file openldap-server.p5m

### Solaris/openldap-notice.txt has two entries:

When the OpenLDAP server package is installed or updated it logs a short note
(Solaris/openldap-notice.txt), also viewable via "pkg history", to review
/usr/share/doc/release-notes/openldap-transition.txt
(Solaris/openldap-transition.org).  The short note is displayed as the full
instructions are rather long.

  - usr/share/doc/release-notes/openldap-install.txt

    Which includes attribute *release-note=feature/pkg/self@0* causing
    it to be displayed on installation of the package.

  - usr/share/doc/release-notes/openldap-update.txt

    Which includes attribute *self@$(IPS\_COMPONENT\_VERSION)*
    causing it to be displayed when the component version is incremented.

    By specifying the version as IPS\_COMPONENT\_VERSION the release-note will
    correctly be applied when openldap component is updated, and
    COMPONENT\_VERSION is modified in Makefile.  As updates do not have to be
    applied incrementally it is not possible to use the version as a
    definitive comparison to the compatibility.

    Originally set to $(IPS\_COMPONENT\_VERSION),$(BUILD\_VERSION) which
    erroneously caused every build to display the release-note as
    BUILD\_VERSION includes the branch-id (BRANCHID).


### Solaris/openldap-transition.org

The source for /usr/share/doc/release-notes/openldap-transition.txt.  This is
built as a post installation action within the Makefile.  There is also a
`test-org-export` target which can be used to test against a previous version
of the file.  For example:

    cd $(hg root)/components/openldap
    hg cat -r 'last(file("./Solaris/openldap-transition.org"))' \
     ./Solaris/openldap-transition.org > openldap-transition.org
    gmake test-org-export ORGSRCDIR=$PWD
    cp build/prototype/*/usr/share/doc/release-notes/openldap-transition.txt .
    gmake test-org-export ORGCMP=./openldap-transition.txt


### Dependency on cyrus-sasl

OpenLDAP requires a specific version of cyrus-sasl library (libsasl2.so)
because it stashes away the version number from compilation and refuses to work
if that is not the version used at load time.  Hence at the end of the file
there is a dependency on the current expected version (depend type=require
fmri=.../libsasl2@...).  This does however then require additional
`pkg.depend.bypass-generate=libsasl2.so.3` entries to prevent pkglint from
reporting error "duplicate depend actions".


## Packaging file openldap-client.p5m

Includes the same dependeny as openldap-server.p5m on libsasl2.

### /usr/lib/libldap_r*.so

In the Solaris distribution of OpenLDAP 2.4.x the libldap.so library was a
link to the MT HOT library `libldap_r.so`.  With 2.6.x `libldap_r.so` has
officially been renamed `libldap.so`.  For backward compatibility we continue
to provide `libldap_r.so` and also the SONAME compatibility links to
`libldap_r-2.4.so.2` and `liblber-2.1.so.2`.

