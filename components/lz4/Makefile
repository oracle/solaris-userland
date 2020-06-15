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

BUILD_BITS= 64
COMPILER= gcc

include ../../make-rules/shared-macros.mk

# Assumes GNU sed for the installation.
PATH=/usr/gnu/bin:/usr/bin:/usr/sbin

COMPONENT_NAME=		lz4
COMPONENT_VERSION=	1.9.2
COMPONENT_PROJECT_URL=	https://lz4.github.io/lz4/
COMPONENT_ARCHIVE_HASH=	\
    sha256:658ba6191fa44c92280d4aa2c271b0f4fbc0e34d249578dd05e50e76d0e5efcc
COMPONENT_ARCHIVE_URL=	https://github.com/lz4/lz4/archive/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/lz4
COMPONENT_ANITYA_ID=	1865

TPNO=			55170

BUILD_STYLE= justmake
include $(WS_MAKE_RULES)/common.mk

# Tests require the full copy of source dir.
CLONEY = echo
COMPONENT_PRE_BUILD_ACTION = $(CP) -rp $(SOURCE_DIR)/. $(@D)


COMPONENT_INSTALL_ENV +=	PREFIX=$(USRDIR)
COMPONENT_INSTALL_ENV +=	LIBDIR=$(USRLIBDIR64)

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_ENV += CC="$(CC)"
COMPONENT_TEST_COMPARE_CMD =	$(GDIFF) -uN --ignore-blank-lines
COMPONENT_TEST_TRANSFORMS += '-e "s/[^[:print:]]//g" -e "s/[0-9\.]\+ MB\/s/X MB\s/g" -e "/stdin.*decoded/d" '
COMPONENT_TEST_TRANSFORMS += '-e "/gcc/d" -e "/make/d" -e "/ln \-sf/d" -e "/Decompressed/d" -e "/^Completed in/d" '
COMPONENT_TEST_TRANSFORMS += '-e "/^Read : /d" -e "/Common subdirectories:/d" -e "/^Seed = /d" '
COMPONENT_TEST_TRANSFORMS += '-e "s/: Compressed [0-9]\+ bytes into\( a\)\{0,1\} [0-9]\+ bytes/: Compressed X bytes into Y bytes/i" '
COMPONENT_TEST_TRANSFORMS += '-e "s/\(LZ4F_compressFrame_usingCDict.*:\) [0-9]\+ bytes/\1 X bytes/" '
COMPONENT_TEST_TRANSFORMS += '-e "/[aA]ll tests completed/d" -e "/compression ratio/d" -e "/ratio with dict/d" '
COMPONENT_TEST_TRANSFORMS += '-e "/^SAME/d" -e "/^EMPTY/d" -e "s/tests in [0-9\.]\+s/tests in TIME/" '
COMPONENT_TEST_TRANSFORMS += '-e "s/20[2-9][0-9]\/[0-1][0-9]\/[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]/DATETIME/" '
COMPONENT_TEST_TRANSFORMS += '-e "/==>/d" -e "/decoded.*bytes/d" -e "/\-Synthetic/d" -e "/buffer at address/d" '
COMPONENT_TEST_TRANSFORMS += '-e "/^Makefile:/d" -e "/^Writing [0-9]\+ bytes/d" -e "/creating pkgconfig/d" -e "/COPYING :/d" '
COMPONENT_TEST_TRANSFORMS += '-e "/^test.*\-lt/d" -e "/^test.*\-eq/d" -e "s/\->.*MBs\$$/COMPRESS_RATE/" -e "/byte\(s\)\{0,1\}.*copied/d" '
COMPONENT_TEST_TRANSFORMS += '-E -e "s/(Frame[[:blank:]]+(B7[DI]|\-)[[:blank:]]+(XXH32|\-)[[:blank:]]+)[0-9]+/\1 X/" '
