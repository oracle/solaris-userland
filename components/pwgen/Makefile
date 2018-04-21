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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
COMPILER=gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		pwgen
COMPONENT_VERSION=	2.08
COMPONENT_PROJECT_URL=	https://sourceforge.net/projects/pwgen/
COMPONENT_ARCHIVE_HASH=	\
    sha256:dab03dd30ad5a58e578c5581241a6e87e184a18eb2c3b2e0fffa8a9cf105c97b
COMPONENT_ARCHIVE_URL=	https://downloads.sourceforge.net/pwgen/pwgen/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	3738

TPNO=			39010

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Use Solaris' implementation of SHA1
CFLAGS += -DSHA_SOLARIS

# Fix 64-bit linking via compiler.
LDFLAGS += $(CC_BITS)

# Link with Solaris sha1 implementation
LDFLAGS += -lmd

# IPS Package versions contain sequences of non-negative (for now) integers,
# separated by dots.  Leading zeroes are not allowed, due to ordering
# ambiguity. For example, IPS team has to massage "06" into "6" and thus IPS 
# version of pwgen 2.06 becomes 2.6.  IPS_COMPONENT_VERSION is by default
# set to $(COMPONENT_VERSION) but in this case it has to be set specifically
# to comply with the convention described above.
#
IPS_COMPONENT_VERSION=	2.8
HUMAN_VERSION=		$(COMPONENT_VERSION)

REQUIRED_PACKAGES += system/library/security/crypto
