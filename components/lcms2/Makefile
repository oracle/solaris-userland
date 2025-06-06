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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		lcms2
COMPONENT_VERSION=	2.16
COMPONENT_PROJECT_URL=	http://www.littlecms.com/
COMPONENT_ARCHIVE_HASH=	\
    sha256:d873d34ad8b9b4cea010631f1a6228d2087475e4dc5e763eb81acc23d9d45a51
COMPONENT_ARCHIVE_URL=	\
    https://sourceforge.net/projects/lcms/files/lcms/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/lcms
COMPONENT_ANITYA_ID=	9815

COMPONENT_BAID=		186083

include $(WS_MAKE_RULES)/common.mk

# In order to run the tests, we need to use cloney
COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

# Seems that we have no other way to designate that we want large file support.
CFLAGS += $(CPP_LARGEFILES)

# Need to ensure lcms custom chunk memory allocator aligns properly for all
# of our platforms - see _cmsALIGNMEM macro in src/lcms2_internal.h and
# _MAX_ALIGNMENT definition in per-platform sections of <sys/isa_defs.h>
CPPFLAGS += -DCMS_PTR_ALIGNMENT=_MAX_ALIGNMENT

CONFIGURE_OPTIONS +=	--includedir=$(USRINCDIR)/lcms
CONFIGURE_OPTIONS +=	--enable-shared
CONFIGURE_OPTIONS +=	--disable-static
CONFIGURE_OPTIONS +=	--with-jpeg
CONFIGURE_OPTIONS +=	--with-tiff
CONFIGURE_OPTIONS +=	--with-zlib
CONFIGURE_OPTIONS +=	--with-pic

COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(SOURCE_DIR)/utils/linkicc/linkicc.1 $(PROTOUSRSHAREMAN1DIR) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(SOURCE_DIR)/utils/psicc/psicc.1 $(PROTOUSRSHAREMAN1DIR) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(SOURCE_DIR)/utils/transicc/transicc.1 $(PROTOUSRSHAREMAN1DIR) ;

# Needed to get past trying to copy identical files because the top_srcdir
# is not the same as the top_builddir.
COMPONENT_TEST_ARGS =	-k -i
COMPONENT_TEST_DIR =	$(@D)/testbed
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master

COMPONENT_TEST_TRANSFORMS += '-n -e "/^Checking/p" '

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += system/library/math
