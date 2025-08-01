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
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		unzip
COMPONENT_VERSION=	610c25
COMPONENT_BAID=		117337
IPS_COMPONENT_VERSION=	6.0.3.25
COMPONENT_SRC=		$(COMPONENT_NAME)$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_HASH=	sha256:134e8feaca6171ce26695cc39b3cbb26862fc0e6054f9517959cbb17f4debf5d
COMPONENT_ARCHIVE_URL=	http://antinode.info/ftp/info-zip/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://www.info-zip.org/UnZip.html
COMPONENT_BUGDB=	utility/zip
COMPONENT_ANITYA_ID=	8684

BUILD_STYLE= justmake
TEST_TARGET= $(NO_TESTS)
HUMAN_VERSION= $(COMPONENT_VERSION)
include $(WS_MAKE_RULES)/common.mk

# Would need patching the build system
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# remove the unwanted file.
COMPONENT_PREP_ACTION = $(RM) $(SOURCE_DIR)/crc_i386.S

# env. var. LOCAL_UNZIP is tested by configure for CC options
# see INSTALL file in archive for details
LOCAL_UNZIP += -D_GNU_SOURCE
LOCAL_UNZIP += -DRCC_LAZY
LOCAL_UNZIP += -DWILD_STOP_AT_DIR
LOCAL_UNZIP += -DLARGE_FILE_SUPPORT
LOCAL_UNZIP += -DUNICODE_SUPPORT
LOCAL_UNZIP += -D__STDC_ISO_10646__
LOCAL_UNZIP += -DUNICODE_WCHAR
LOCAL_UNZIP += -DUTF8_MAYBE_NATIVE
LOCAL_UNZIP += -DUSE_ICONV_MAPPING
LOCAL_UNZIP += -DNO_WORKING_ISPRINT
COMPONENT_BUILD_ENV += LOCAL_UNZIP="$(LOCAL_UNZIP)"

# The Makefile we want is under unix/Makefile
COMPONENT_BUILD_ARGS += -f unix/Makefile
# GCC 14 requirement: -Wno-implicit-function-declaration (should be resolved)
COMPONENT_BUILD_TARGETS += generic CC="$(CC) -Wno-implicit-function-declaration"
COMPONENT_INSTALL_ARGS += -f unix/Makefile

# Unzip build ignores DESTDIR
COMPONENT_INSTALL_ARGS += BINDIR=$(PROTOUSRBINDIR)
COMPONENT_INSTALL_ARGS += MANDIR=$(PROTOUSRSHAREMANDIR)

REQUIRED_PACKAGES += shell/ksh93
