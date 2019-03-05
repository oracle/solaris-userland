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
# Copyright (c) 2018, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libxcb
COMPONENT_VERSION=	1.13.1
COMPONENT_CATEGORY=	xcb
COMPONENT_PROJECT_URL=	https://xcb.freedesktop.org/
COMPONENT_ARCHIVE_HASH= \
	sha256:a89fb7af7a11f43d2ce84a844a4b38df688c092bf4b67683aef179cdf2a647c4
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1767
TPNO=			49914

COMPONENT_NAME_1=	xcb-proto
COMPONENT_VERSION_1=	1.13
COMPONENT_SRC_1=	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1).tar.bz2
COMPONENT_ARCHIVE_URL_1=$(COMPONENT_PROJECT_URL)/dist/$(COMPONENT_ARCHIVE_1)
COMPONENT_ARCHIVE_HASH_1= \
        sha256:7b98721e669be80284e9bbfeab02d2d0d54cd11172b72271e47a2fe875e2bde1
COMPONENT_ANITYA_ID_1=  13646
TPNO_1=			49165

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=*.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

PYTHON_VERSION = 3.4
CONFIGURE_ENV += PYTHON="$(PYTHON)"
PKG_MACROS += PYVER="$(PYTHON_VERSION)"

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

CONFIGURE_ENV += LIB_MAN_SUFFIX=3xcb

CONFIGURE_OPTIONS += --disable-libtool-lock
CONFIGURE_OPTIONS += --enable-devel-docs=no
CONFIGURE_OPTIONS += --enable-composite
CONFIGURE_OPTIONS += --enable-damage
CONFIGURE_OPTIONS += --enable-dri2
CONFIGURE_OPTIONS += --enable-dpms
CONFIGURE_OPTIONS += --enable-glx
CONFIGURE_OPTIONS += --enable-randr
CONFIGURE_OPTIONS += --enable-record
CONFIGURE_OPTIONS += --enable-render
CONFIGURE_OPTIONS += --enable-resource
CONFIGURE_OPTIONS += --enable-screensaver
CONFIGURE_OPTIONS += --enable-shape
CONFIGURE_OPTIONS += --enable-shm
CONFIGURE_OPTIONS += --enable-sync
CONFIGURE_OPTIONS += --enable-xevie
CONFIGURE_OPTIONS += --enable-xfixes
CONFIGURE_OPTIONS += --enable-xfree86-dri
CONFIGURE_OPTIONS += --enable-xinerama
CONFIGURE_OPTIONS += --enable-xinput
CONFIGURE_OPTIONS += --enable-xprint
CONFIGURE_OPTIONS += --enable-xtest
CONFIGURE_OPTIONS += --enable-xv
CONFIGURE_OPTIONS += --enable-xvmc
CONFIGURE_OPTIONS += --with-queue-size=32768
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += INSTALL="$(INSTALL) -p"
CONFIGURE_ENV += am_cv_python_pythondir=$(PYTHON_VENDOR_PACKAGES)

$(BUILD_TARGET): $(INSTALL_32:%/.installed=%_1/.installed)
$(BUILD_TARGET:.built=.configured):  $(INSTALL_32:%/.installed=%_1/.installed)

COMPONENT_PREP_ACTION += \
	$(CP) $(COMPONENT_DIR)/files/xia.xml $(SOURCE_DIR_1)/src/ ;
$(SOURCE_PC_FILES_1): $(SOURCE_DIR_1)/.unpacked
$(BUILD_DIR)/%_1/.configured: SOURCE_DIR=$(SOURCE_DIR_1)
$(BUILD_DIR)/$(MACH32)_1/%: BITS=32
$(BUILD_DIR)/%_1/.installed: COMPONENT_INSTALL_ARGS += \
	pkgconfigdir="$(DESTDIR)/usr/share/pkgconfig"

COMPONENT_POST_INSTALL_ACTION.64 += \
	$(MKDIR) $(PROTO_DIR)/usr/share/man/man3xcb/ ; \
	$(INSTALL) -m 0444 $(BUILD_DIR_64)/src/man/*.3xcb \
		$(PROTO_DIR)/usr/share/man/man3xcb/ ;

REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += image/graphviz
# xcb-proto runs xmllint
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += runtime/python-34
REQUIRED_PACKAGES += x11/library/libxau
REQUIRED_PACKAGES += x11/library/libxdmcp
