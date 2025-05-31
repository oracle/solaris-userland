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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

COMPILER =		gcc
BUILD_BITS =            32_and_64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		json-c
COMPONENT_VERSION=	0.18
COMPONENT_PROJECT_URL=	https://github.com/json-c/json-c/wiki/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:876ab046479166b869afc6896d288183bbc0e5843f141200c677b3e8dfb11724
COMPONENT_ARCHIVE_URL=	https://s3.amazonaws.com/json-c_releases/releases/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/json-c
COMPONENT_ANITYA_ID=	1477
COMPONENT_BAID=		330765

BUILD_STYLE = cmake

include $(WS_MAKE_RULES)/common.mk

# Tests can't find their headers or data files unless we clone the source tree
COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR) $(@D));

# Double formatting on 32bit Intel behaves unexpectedly
# and breaks one of the tests.
COMPONENT_TEST_ENV += ARGS="-E test_double_serializer"
COMPONENT_TEST_TRANSFORMS += '-n -e "/tests/p" '
# Remove any color coding from the test output.
COMPONENT_TEST_ARGS += COLOR=no

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Lint library needs to be built against proto
# area headers rather than system ones.
LINT_FLAGS += -I$(PROTOUSRINCDIR)
