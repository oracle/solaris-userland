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
# Copyright (c) 2020, 2023, Oracle and/or its affiliates.
#

BUILD_BITS =		64_and_32
COMPILER =		gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libpsl
COMPONENT_VERSION=	0.21.2
COMPONENT_PROJECT_URL=	https://github.com/rockdaboot/libpsl
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_URL= \
	https://github.com/rockdaboot/libpsl/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH=	\
	sha256:e35991b6e17001afa2c0ca3b10c357650602b92596209b7492802f3768a6285f
COMPONENT_BUGDB=	library/libpsl
COMPONENT_ANITYA_ID=	7305

COMPONENT_BAID=		137238
BUILD_STYLE=		meson

PYTHON_VERSION=		3.11

# default libidn2 would need additional dependency 'libunistring'
CONFIGURE_OPTIONS += -Druntime=libicu
CONFIGURE_OPTIONS += -Dbuiltin=true

include $(WS_MAKE_RULES)/common.mk

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# pkgdepend complains if it doesn't find a version of python specified
PYTHON_SCRIPTS += $(PROTOUSRBINDIR)/psl-make-dafsa

REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
