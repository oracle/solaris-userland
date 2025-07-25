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
# Copyright (c) 2020, 2025, Oracle and/or its affiliates.
#

BUILD_BITS= 64
COMPILER= gcc

include ../../make-rules/shared-macros.mk

# Assumes GNU sed for the installation.
PATH=/usr/gnu/bin:/usr/bin:/usr/sbin

COMPONENT_NAME=		lz4
COMPONENT_VERSION=	1.10.0
COMPONENT_PROJECT_URL=	https://lz4.github.io/lz4/
COMPONENT_ARCHIVE_HASH=	\
    sha256:537512904744b35e232912055ccf8ec66d768639ff3abe5788d90d792ec5f48b
COMPONENT_ARCHIVE_URL=	https://github.com/lz4/lz4/archive/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/lz4
COMPONENT_ANITYA_ID=	1865

COMPONENT_BAID=		189541

BUILD_STYLE= justmake
include $(WS_MAKE_RULES)/common.mk

# Verbose compilation output
COMPONENT_BUILD_ARGS += Q=

COMPONENT_BUILD_ARGS += CFLAGS='$(CFLAGS)'

# Tests require the full copy of source dir.
CLONEY = echo
COMPONENT_PRE_BUILD_ACTION = $(CP) -rp $(SOURCE_DIR)/. $(@D)


COMPONENT_BUILD_ENV   +=	PREFIX=$(USRDIR)
COMPONENT_INSTALL_ENV +=	PREFIX=$(USRDIR)
COMPONENT_INSTALL_ENV +=	LIBDIR=$(USRLIBDIR64)

# The test results differ for x86 and SPARC
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH$(BITS)).master

# To allow reproducible tests (note "frametest", "fuzzer" in tools/time.c).
TIME_CONSTANT = 1272503297
COMPONENT_TEST_ENV += $(CONSTANT_TIME)

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_ENV += CC="$(CC)"
COMPONENT_TEST_COMPARE_CMD =	$(GDIFF) -uN --ignore-blank-lines
COMPONENT_TEST_TRANSFORMS += -e '"s/tests in [0-9\.]\+s/tests in TIME/" '
COMPONENT_TEST_TRANSFORMS += -e '"s/20[2-9][0-9]\/[0-1][0-9]\/[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]/DATETIME/" '
COMPONENT_TEST_TRANSFORMS += -e '"s/[ ]\+[0-9]\+\(\.[0-9]\{1,2\}\)\? Mi\?B\/s/ COMPRESS_SPEED/g" '
COMPONENT_TEST_TRANSFORMS += -e '"s/ [0-9]\+\(\.[0-9]\+\(e-[0-9]\+\)\?\)\? s[ ,]/ X s /g" '
COMPONENT_TEST_TRANSFORMS += -e '"s/cpu load : [0-9]\+%/cpu load X%/"  '
# Removes GCC specific path.
COMPONENT_TEST_TRANSFORMS += -e '"s/\/usr\/gcc\/.*\/bin\/gcc/gcc/" '
# Avoids lines with carriage return(s) as produced during default verbose output.
COMPONENT_TEST_TRANSFORMS += -e '"/^\r/d" '
# Removes output generated by: set -x (which can be messed with error output when pipes are used).
COMPONENT_TEST_TRANSFORMS += -e '"/^+/d" '
# lz4 version info in verbose mode can mess around too.
COMPONENT_TEST_TRANSFORMS += -e '"/^\*\*\* lz4 /d" '
