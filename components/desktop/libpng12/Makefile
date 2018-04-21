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
# Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved.
#

COMPILER =		gcc
BUILD_BITS = 		32_and_64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libpng
COMPONENT_VERSION=	1.2.57
COMPONENT_PROJECT_URL=	http://www.libpng.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:09ec37869fc5b130f5eb06ffb9bf949796e8d2d78e0788f78ab1c78624c6e9da
COMPONENT_ARCHIVE_URL= https://sourceforge.net/projects/libpng/files/libpng12/older-releases/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/libpng
COMPONENT_ANITYA_ID=	7991

TPNO=		34783

SYSTEM_TEST_TARGET= $(SYSTEM_TESTS_NOT_IMPLEMENTED)
include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS += --disable-static

# Required because upstream Makefiles use --version-script with GNU-style
# version scripts (similar to Solaris linker mapfiles)
LDFLAGS += -Wl,-zgnu-version-script-compat

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS = -k -i
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Pass /p" ' \
        '-e "/TOTAL:/p" ' \
        '-e "/Filter/p" ' \
        '-e "/PASS/p" ' \
        '-e "/ERROR:/p" '

# for pngtest to run
COMPONENT_TEST_ENV +=   libtool_install_magic='%%%MAGIC variable%%%'
COMPONENT_TEST_ENV +=   libtool_execute_magic='%%%MAGIC variable%%%'

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
