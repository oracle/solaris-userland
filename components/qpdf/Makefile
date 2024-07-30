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
# Copyright (c) 2018, 2024, Oracle and/or its affiliates.
#
BUILD_BITS=	64_and_32
COMPILER=	gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		qpdf
COMPONENT_VERSION=	11.9.1
COMPONENT_BAID=		173569
COMPONENT_ARCHIVE_HASH=	sha256:98d509e29def377d90ff4a34e48e8e20865600342006bff53e489f689bbbb15d
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	v$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_URL=	https://github.com/qpdf/qpdf/archive/refs/tags/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://qpdf.sourceforge.net/
COMPONENT_BUGDB=	utility/qpdf
COMPONENT_ANITYA_ID=	5542

COMPONENT_TEST_TARGET= $(TEST_64_and_32)

BUILD_STYLE = cmake

include $(WS_MAKE_RULES)/common.mk

PKG_CONFIG_PATHS.64 = /usr/openssl/3/lib/64/pkgconfig
PKG_CONFIG_PATHS.32 = /usr/openssl/3/lib/pkgconfig
PKG_CONFIG_PATHS += $(PKG_CONFIG_PATHS.$(BITS))

COMPONENT_TEST_ENV += PATH=$(GNUBIN):$(PATH) 
COMPONENT_TEST_ENV += LC_ALL=C
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/tests passed.*tests failed out of/p" '

# see TESTING
test-complete: COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-complete-$(BITS).master
test-complete: test

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
