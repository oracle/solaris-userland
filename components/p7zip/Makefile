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
# When building with Studio, p7zip has many warnings about extra semicolons,
# and at least one hard error due to an extra semicolon.  It also suffers from
# the pragma pack push/pop problem (15358176).
COMPILER= gcc
include ../../make-rules/shared-macros.mk

ifeq   ($(strip $(PARFAIT_BUILD)),yes)
PATH=$(PARFAIT_TOOLS):$(GCC_ROOT)/bin:$(USRBINDIR)
else
PATH=$(GCC_ROOT)/bin:$(USRBINDIR):$(GNUBIN)
endif

COMPONENT_NAME=		p7zip
COMPONENT_VERSION=	16.02
COMPONENT_PROJECT_URL=	http://p7zip.sourceforge.net/
COMPONENT_SRC=		$(COMPONENT_NAME)_$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC)_src_all.tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:5eb20ac0e2944f6cb9c2d51dd6c4518941c185347d4089ea89087ffdd6e2341f
COMPONENT_ARCHIVE_URL=	http://downloads.sourceforge.net/p7zip/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	2583

TPNO=			43040

BUILD_STYLE= justmake
INSTALL_TARGET=
include $(WS_MAKE_RULES)/common.mk

# The .3 refers to version 16.02-3 to distinguish between community version
# of p7zip and this package, which contains all known fixes. A similar approach
# is addopted by some Linux distros.
IPS_COMPONENT_VERSION=	16.2.3
HUMAN_VERSION=		$(COMPONENT_VERSION)-3

COMPONENT_TEST_DIR =		$(@D)
COMPONENT_TEST_ENV =		P7ZIP_HOME_DIR=$(BUILD_DIR)/$(MACH$(BITS))/bin
COMPONENT_TEST_TARGETS =	test test_7z test_7zr

COMPONENT_PREP_ACTION = (cd $(@D); cp ../makefile.solaris makefile.machine)
COMPONENT_BUILD_TARGETS = all3
COMPONENT_INSTALL_ARGS += DEST_HOME=$(USRDIR) DEST_DIR=$(PROTO_DIR)

install:	build $(INSTALL_64)

# 7zr.1 is in DOS format for some reason, and geqn can't handle it.
COMPONENT_POST_INSTALL_ACTION += $(GSED) -i -e 's/\r//' $(PROTO_DIR)/usr/man/man1/7zr.1

REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
