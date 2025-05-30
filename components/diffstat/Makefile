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
# Copyright (c) 2014, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		diffstat
COMPONENT_VERSION=	1.67
COMPONENT_PROJECT_URL=	http://invisible-island.net/diffstat/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tgz
COMPONENT_ARCHIVE_HASH=	\
	sha256:760ed0c99c6d643238d41b80e60278cf1683ffb94a283954ac7ef168c852766a
COMPONENT_ARCHIVE_URL=	https://invisible-mirror.net/archives/diffstat/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	utility/diffstat
COMPONENT_ANITYA_ID=	434

COMPONENT_BAID=	190049	

SYSTEM_TEST_TARGET= $(SYSTEM_TEST_64)

ifeq ($(MACH),i386)
# The unit tests failed to start.
$(SKIP_TEST_AT_TOP_LEVEL)
endif

include $(WS_MAKE_RULES)/common.mk

# Fix 64-bit linking done via compiler.
LDFLAGS += $(CC_BITS)

COMPONENT_TEST_TRANSFORMS += \
	'-e "/^Checking/d" '

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_ENV =	PATH=$(@D):$(SOURCE_DIR):$(PATH)
COMPONENT_TEST_CMD =	./testing/run_test.sh
COMPONENT_TEST_ARGS =	./testing/case*.pat
COMPONENT_TEST_TARGETS =

COMPONENT_SYSTEM_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_SYSTEM_TEST_ENV =	PATH=$(USRBINDIR):$(SOURCE_DIR):$(PATH)
COMPONENT_SYSTEM_TEST_CMD =	./testing/run_test.sh
COMPONENT_SYSTEM_TEST_ARGS =	./testing/case*.pat
COMPONENT_SYSTEM_TEST_TARGETS =
