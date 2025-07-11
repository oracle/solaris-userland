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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		64_and_32
COMPILER =		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		fontconfig
COMPONENT_VERSION=	2.17.1
COMPONENT_PROJECT_URL=	https://fontconfig.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_URL=	\
 https://gitlab.freedesktop.org/api/v4/projects/890/packages/generic/fontconfig/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:9f5cae93f4fffc1fbc05ae99cdfc708cd60dfd6612ffc0512827025c026fa541
COMPONENT_BUGDB=	x11/font
COMPONENT_ANITYA_ID=	827
COMPONENT_BAID=		335831

CONFIGURE_BINDIR.32 =  $(CONFIGURE_PREFIX)/bin/$(MACH32)
CONFIGURE_BINDIR.64 =  $(CONFIGURE_PREFIX)/bin/$(MACH64)

# Set here so we only have to update this one line, instead of multiple lines
# in the *.p5m file on every new version
FONTCONFIG_SOVERSION =    1.16.1
PKG_VARS += FONTCONFIG_SOVERSION

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS += --libexecdir="$(USRLIB)"
CONFIGURE_OPTIONS += --localstatedir="$(VARDIR)"
CONFIGURE_OPTIONS += --sysconfdir="$(ETCDIR)"
CONFIGURE_OPTIONS += --with-baseconfigdir='/etc/fonts'
CONFIGURE_OPTIONS += --with-templatedir='/etc/fonts/conf.avail'
CONFIGURE_OPTIONS += --with-xmldir='/etc/fonts'
CONFIGURE_OPTIONS += --with-default-fonts='/usr/share/fonts'
CONFIGURE_OPTIONS += --with-add-fonts='/etc/X11/fontpath.d,/usr/share/ghostscript/fonts,/usr/X11/lib/X11/fonts'
CONFIGURE_OPTIONS += --with-cache-dir=/var/cache/fontconfig
# Don't run fc-cache during the build
CONFIGURE_OPTIONS += --disable-cache-build
CONFIGURE_OPTIONS += --enable-iconv

# Makefile.am files of this component are not compatible with Solaris make.
# Use GNU make to avoid the configuration error when makefile fragments are processed.
CONFIGURE_OPTIONS += MAKE=$(GMAKE)

# Add a note about the SMF service to the end of the man page
COMPONENT_POST_INSTALL_ACTION += \
    cat files/sunman-notes-fc-cache >> $(PROTOUSRSHAREMAN1DIR)/fc-cache.1 ;

# Because both the 32-bit & 64-bit builds install the config files, whichever
# runs second creates a backup of the first that we don't need in our packages.
COMPONENT_POST_INSTALL_ACTION += $(RM) $(PROTOETCDIR)/fonts/fonts.conf.bak ;

# Make links in conf.d be relative links to ../conf.avail instead of absolute
COMPONENT_POST_INSTALL_ACTION += \
    (cd $(PROTOETCDIR)/fonts/conf.d/ ; \
    for f in *.conf ; do \
	$(RM) $${f} ; \
	$(SYMLINK) ../conf.avail/$${f} $${f} ; \
    done) ;

# tests require GNU cp (support for -a) & date (support for -d)
COMPONENT_TEST_ENV += PATH="$(GNUBIN):$(USRBINDIR)"
# prevent run-test.sh from downloading files from the internet
COMPONENT_TEST_ENV += NO_PROXY='*'
# disable test that tries to download fonts from Google so that run-test.sh
# skips it instead of reporting the entire run failed
COMPONENT_PRE_TEST_ACTION += \
    $(CHMOD) a-x $(COMPONENT_TEST_DIR)/test/test-crbug1004254 ;
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Set packages to be part of the X consolidation incorporation
PKGMOGRIFY_TRANSFORMS += $(WS_TOP)/transforms/X-incorporation

REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/freetype-2

# JSON-C is required to build and run tests, but is not used in the packaged
# software
REQUIRED_PACKAGES += library/json-c
