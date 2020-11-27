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
# Copyright (c) 2020, Oracle and/or its affiliates.
#

BUILD_BITS =		64_and_32
COMPILER =		gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libpsl
COMPONENT_VERSION=	0.21.1
COMPONENT_PROJECT_URL=	https://github.com/rockdaboot/libpsl
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_URL= \
	https://github.com/rockdaboot/libpsl/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH=	\
	sha256:ac6ce1e1fbd4d0254c4ddb9d37f1fa99dec83619c1253328155206b896210d4c
COMPONENT_BUGDB=	library/libpsl
COMPONENT_ANITYA_ID=	7305

TPNO=			63453
BUILD_STYLE=		meson

# default libidn2 would need additional dependency 'libunistring'
CONFIGURE_OPTIONS += -Druntime=libicu
CONFIGURE_OPTIONS += -Dbuiltin=libicu

include $(WS_MAKE_RULES)/common.mk

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok:/p" ' \
        '-e "/Pass:/p" ' \
        '-e "/Fail:/p" '

REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
