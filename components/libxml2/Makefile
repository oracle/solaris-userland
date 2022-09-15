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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libxml2
COMPONENT_VERSION=	2.10.2
COMPONENT_BAID=		129954
COMPONENT_PROJECT_URL=	http://xmlsoft.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:d240abe6da9c65cb1900dd9bf3a3501ccf88b3c2a1cb98317d03f272dda5b265
COMPONENT_ARCHIVE =     $(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.xz
COMPONENT_ARCHIVE_URL=	https://download.gnome.org/sources/libxml2/2.10/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libxml
COMPONENT_ANITYA_ID=	1783

# W3C XML Conformance Test Suites
COMPONENT_ARCHIVE_1= xmlts20080827.tar.gz
COMPONENT_ARCHIVE_HASH_1= \
    sha256:96151685cec997e1f9f3387e3626d61e6284d4d6e66e0e440c209286c03e9cc7
COMPONENT_ARCHIVE_URL_1= http://www.w3.org/XML/Test/$(COMPONENT_ARCHIVE_1)

SYSTEM_TEST_TARGET= configure $(SYSTEM_TEST_32_and_64)
include $(WS_MAKE_RULES)/common.mk

# xmlversion.h is generated into proto area.
LINT_FLAGS += -I$(PROTOUSRINCDIR)/libxml2

CFLAGS +=	$(CPP_LARGEFILES)
LDFLAGS +=	$(LD_Z_DEFS) $(LD_Z_TEXT) -lpthread

CONFIGURE_OPTIONS += --disable-static
# See comments in:
# https://github.com/GNOME/libxml2/commit/865520f04830531fc0a610129202b645521e435f
CONFIGURE_OPTIONS += --sysconfdir=/etc
CONFIGURE_OPTIONS += --with-ftp
CONFIGURE_OPTIONS += --with-legacy
CONFIGURE_OPTIONS += --with-xptr-locs
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += --with-threads
# Cannot link to lzma since it's not in /lib and install media still has separate /usr.
CONFIGURE_OPTIONS += --without-lzma

PYTHON_VERSION = 3.7
CONFIGURE_OPTIONS.32 += --without-python
CONFIGURE_OPTIONS.64 += --with-python
CONFIGURE_ENV.64     += PYTHON=$(PYTHON.$(PYTHON_VERSION))
COMPONENT_INSTALL_ARGS.64 += pythondir=$(PYTHON_VENDOR_PACKAGES)
COMPONENT_INSTALL_ARGS.64 += pyexecdir=$(PYTHON_VENDOR_PACKAGES)
COMPONENT_BUILD_ARGS.64 += pythondir=$(PYTHON_VENDOR_PACKAGES)
COMPONENT_BUILD_ARGS.64 += pyexecdir=$(PYTHON_VENDOR_PACKAGES)

COMPONENT_PREP_ACTION += (cd $(@D) ; cp ../mapfile libxml2.syms ; autoreconf -if)

# After we have configured, make a copy of the python bits so we can build and
# test another python 3 versions.
COMPONENT_POST_CONFIGURE_ACTION.64 += \
    (cd $(@D) ; cp -rp python python3.9 ; \
    $(GSED) -i -e 's|-lpython3[.]7m|-lpython3.9|' \
     -e 's|usr/bin/$(MACH64)/python3[.]7|usr/bin/python3.9|' \
     -e 's|usr/include/python3[.]7m|usr/include/python3.9|' \
     -e 's/3[.]7/3.9/g' \
     `find python3.9 -name Makefile` ; \
)

# It's also nice to test another python 3 modules (LC_ALL is set to avoid test failure).
COMPONENT_POST_TEST_ACTION.64 += \
    ( cd $(@D)/python3.9 ; \
	LC_ALL=en_US.utf8  $(GMAKE) $(COMPONENT_TEST_ARGS) check ; ) ;

COMPONENT_PRE_TEST_ACTION += \
    (cd $(@D) ; gtar xf $(COMPONENT_DIR)/$(COMPONENT_ARCHIVE_1));

COMPONENT_TEST_TRANSFORMS = \
	'-e "s/^make\[.*$$/[EnD]/" ' \
	'-e "/^\#\# XML regression tests/,/^\[EnD\]/p" ' \
	'-e "/^\#\# running Python regression tests/,/^\[EnD\]/p" ' \
        '-e "/.*/d" '

COMPONENT_SYSTEM_TEST_TARGETS = system-test 
COMPONENT_PRE_SYSTEM_TEST_ACTION += $(COMPONENT_PRE_TEST_ACTION)

# After we have built/installed libxml2, build/install the python
# support for python 3.9.
COMPONENT_POST_INSTALL_ACTION.64 += \
	cd $(@D)/python3.9 ; \
	$(GMAKE) pythondir=$(PYTHON.3.9.VENDOR_PACKAGES) \
	         pyexecdir=$(PYTHON.3.9.VENDOR_PACKAGES) \
	         DESTDIR=$(PROTO_DIR) \
	         install ;

REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += runtime/python-39
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
