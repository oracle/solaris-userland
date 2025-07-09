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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64
COMPILER =		gcc
CTF_MODE =		off	#C++
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		re2c
COMPONENT_VERSION=	4.2
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_PROJECT_URL=	http://re2c.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:c9dc2b24f340d135a07a1ac63ff53f7f8f74997fed5a4e9132a64050dbc3da1f
COMPONENT_ARCHIVE_URL=	https://github.com/skvadrik/$(COMPONENT_NAME)/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	7664

COMPONENT_BAID =	332416

SYSTEM_TEST_TARGET= build $(SYSTEM_TEST_64)

include $(WS_MAKE_RULES)/common.mk

export PATH=$(GCC_ROOT)/bin:$(GNUBIN):$(USRBINDIR)

# Needed to get the tests to run successfully.
COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS +=	--disable-golang
CONFIGURE_OPTIONS +=	--disable-rust

COMPONENT_SYSTEM_TEST_ENV +=	RE2C_BIN=$(USRBINDIR)/re2c
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/TOTAL:/p" ' \
	'-e "/PASS:/p" ' \
	'-e "/FAIL:/p" ' \
	'-e "/ERROR:/p" ' \
	'-e "/SKIP:/p" '

REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
