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
# Copyright (c) 2011, 2023, Oracle and/or its affiliates.
#

BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         ghostscript
COMPONENT_VERSION=      10.0.0
COMPONENT_PROJECT_URL=	http://ghostscript.com/
COMPONENT_DOWNLOAD_URL= https://github.com/ArtifexSoftware/ghostpdl-downloads/releases/download
COMPONENT_ARCHIVE_HASH= sha256:a57764d70caf85e2fc0b0f59b83b92e25775631714dcdb97cc6e0cea414bb5a3
COMPONENT_ARCHIVE_URL=  $(COMPONENT_DOWNLOAD_URL)/gs1000/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	1157

COMPONENT_NAME_1=	tessdata_best
GIT_REPO_1=		https://github.com/tesseract-ocr/$(COMPONENT_NAME_1)
GIT_COMMIT_ID_1=	e2aad9b

COMPONENT_BAID=		136605

include $(WS_MAKE_RULES)/common.mk
# some backup files are copied to proto
GPATCH_BACKUP=

CONFIGURE_OPTIONS +=	--with-fontpath=/usr/share/fonts
CONFIGURE_OPTIONS +=	--enable-dynamic
CONFIGURE_OPTIONS +=	--disable-compile-inits
CONFIGURE_OPTIONS +=	--without-libidn

# Sparcv7 cores on test docxwrite
gcc_OPT.sparc.32 = -O0 -munaligned-doubles

# configure options to generate 32 bit binaries
$(BUILD_DIR)/$(MACH32)/.configured: CONFIGURE_OPTIONS += CC="$(CC) -m32"

# configure options to generate 64 bit binaries
$(BUILD_DIR)/$(MACH64)/.configured: CONFIGURE_OPTIONS += CC="$(CC) -m64"

# generate configuration scripts, otherwise libtiff configure fails
COMPONENT_PREP_ACTION = \
	 (cd $(@D); $(RM) -r libpng zlib jpeg tiff openjpeg; autoconf)

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

COMPONENT_INSTALL_TARGETS += \
	install-exec install-so install-scripts install-data \
	install-contrib-extras

# Ghostscript build system decided to put shared files into 10.00.0 instead of
# 10.0.0. That doesn't match COMPONENT_VERSION and our ghostscript-core.p5m
# would change after each upgrade.
GS_DEVS_SHARED_DIR=	10.00.0
PKG_MACROS +=		GS_DEVS_SHARED_DIR=$(GS_DEVS_SHARED_DIR)

COMPONENT_TEST_RESULTS_DIR =	$(COMPONENT_DIR)/test
COMPONENT_TEST_MASTER =		$(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_CMD =		sh $(COMPONENT_DIR)/test/run
COMPONENT_TEST_ENV +=		TESSDATA_PREFIX="$(SOURCE_DIR_1)"
COMPONENT_TEST_TRANSFORMS +=	"-e '/^Using/d'"
COMPONENT_TEST_TRANSFORMS +=	"-e '/extract.c:.*:extract_subpage_free/d'"

COMPONENT_SYSTEM_TEST_CMD =	sh $(COMPONENT_DIR)/test/run
COMPONENT_SYSTEM_TEST_ENV +=	TESSDATA_PREFIX="$(SOURCE_DIR_1)"
COMPONENT_SYSTEM_TEST_TARGETS =	system-check

REQUIRED_PACKAGES += image/ghostscript
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += image/library/openjpeg2
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/toolkit/libxt
