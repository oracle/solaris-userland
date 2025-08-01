#
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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		64
COMPILER =		gcc
CTF_MODE =		off	# Has no effect
PYTHON3_SOABI =		bare
# parallel build will not survive the build process atrocity 
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         hplip
COMPONENT_VERSION=      3.25.2
COMPONENT_BAID=		327928
COMPONENT_ARCHIVE_HASH= sha256:e872ff28eb2517705a95f6e1839efa1e50a77a33aae8905278df2bd820919653
COMPONENT_ARCHIVE_URL=	https://downloads.sourceforge.net/project/$(COMPONENT_NAME)/$(COMPONENT_NAME)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://hplipopensource.com/
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	1327

PYTHON_VERSION = 3.11

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS +=	--localedir=$(CONFIGURE_LOCALEDIR)
CONFIGURE_OPTIONS +=	--with-hpppddir=$(USRSHAREDIR)/cups/model/hplip
CONFIGURE_OPTIONS +=	--enable-new-hpcups
CONFIGURE_OPTIONS +=	--enable-cups-ppd-install
CONFIGURE_OPTIONS +=	--disable-gui-build
CONFIGURE_OPTIONS +=    --disable-imageProcessor-build
CONFIGURE_OPTIONS +=	PYTHON=$(PYTHON)
# bye, bye SANE backends
CONFIGURE_OPTIONS +=	--disable-scan-build

CONFIGURE_CPPFLAGS += $(CC_PIC_ENABLE)

# Generate configuration scripts
COMPONENT_PREP_ACTION = (cd $(@D) ; \
    libtoolize --force ; \
    aclocal ; \
    automake --foreign --add-missing ; \
    autoconf );

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# Fix python script shebang
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/lib/cups/filter/pstotiff

# Pre-compile python source code
COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON) -m compileall $(PROTO_DIR)/usr/share/hplip;

PKG_MACROS +=	PYLIB=$(PYTHON_LIB)
PKG_MACROS +=	PYVER=$(PYTHON_VERSION)

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += library/libusb-1
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/management/snmp/net-snmp
REQUIRED_PACKAGES += system/network/avahi
