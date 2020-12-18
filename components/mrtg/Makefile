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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		mrtg
COMPONENT_VERSION=	2.17.7
COMPONENT_PROJECT_URL=	https://oss.oetiker.ch/mrtg
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:9b94cb268fb15b0304ad3bb3ec92b9a8a16dacfcee72baac19298224a2c332c3
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/pub/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	2023

TPNO=			63920

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

CFLAGS += -I$(BUILD_DIR_64)/bin
# Fix 64-bit linking via compiler.
LDFLAGS += $(CC_BITS)
CONFIGURE_OPTIONS += --with-gd-inc=$(USRINCDIR)/gd2

CONFIGURE_LIBDIR.64 = $(USRLIBDIR)

# Build process expects a bin directory in compilation area.
COMPONENT_PRE_BUILD_ACTION=(cd $(@D) ; mkdir -p bin)

REQUIRED_PACKAGES += library/gd
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/library/math
