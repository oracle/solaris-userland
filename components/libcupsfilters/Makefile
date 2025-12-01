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
# Copyright (c) 2025, Oracle and/or its affiliates.
#

BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libcupsfilters
COMPONENT_VERSION=	2.1.1
COMPONENT_ARCHIVE_HASH=	sha256:ff31778a438bf335ceed254ccc706d5cd0eee55f608fcf567d88699b15f4fa9e
COMPONENT_PROJECT_URL=	http://www.openprinting.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_URL=	https://github.com/OpenPrinting/libcupsfilters/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/cups
COMPONENT_BAID=		182113
COMPONENT_ANITYA_ID=	358477

# Enable ADI security extensions
ADIHEAP_MODE=		$(ADIHEAP_ENABLE)
ADISTACK_MODE=		$(ADISTACK_ENABLE)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION += $(CP) files/labeltops.c $(SOURCE_DIR)/cupsfilters;
COMPONENT_PREP_ACTION += (cd $(@D); $(AUTORECONF_ENV) $(AUTORECONF) -fiv);

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS +=	--localedir=$(USRSHARELOCALEDIR)
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--with-cups-rundir=/system/volatile/cups
CONFIGURE_OPTIONS +=	--disable-mutool
CONFIGURE_OPTIONS +=	LIBS="-ltsol"

REQUIRED_PACKAGES += image/library/libexif
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += print/filter/poppler
REQUIRED_PACKAGES += print/filter/qpdf
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
