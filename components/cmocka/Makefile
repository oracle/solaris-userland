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
# Copyright (c) 2025, Oracle and/or its affiliates.
#

# Refer to ../../doc/makefile-variables.txt
#
# Build requirements, needed before inclusion of shared-macros.
BUILD_BITS=		64_and_32
COMPILER=		gcc

include ../../make-rules/shared-macros.mk

BUILD_STYLE=		cmake
# Required for linking __stack_chk_fail __stack_chk_guard
LDFLAGS +=	-lssp

COMPONENT_NAME=		cmocka
COMPONENT_VERSION=	1.1.8
IPS_COMPONENT_VERSION=	$(COMPONENT_VERSION).0.0
HUMAN_VERSION=		$(COMPONENT_VERSION)
COMPONENT_BUGDB=	library/libcmocka
COMPONENT_BAID=		341767
COMPONENT_PROJECT_URL=	https://cmocka.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
	sha256:58435b558766d7f4c729ba163bdf3aec38bed3bc766dab684e3526ed0aa7c780
MINOR_VERSION=		$(basename $(COMPONENT_VERSION))
COMPONENT_ARCHIVE_URL=	\
	https://cmocka.org/files/$(MINOR_VERSION)/$(COMPONENT_ARCHIVE)

# For check_anitya target, https://release-monitoring.org/project/11779
COMPONENT_ANITYA_ID=	11779
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc

# 64 and 32 bit results are the same, override ../../make-rules/shared-macros.mk
COMPONENT_TEST_MASTER =		\
	$(COMPONENT_TEST_RESULTS_DIR)/results.master
# Redact timing information from the results for the comparison.
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "s|[0-9]*\.[0-9]* sec|n.nn sec|" '

include $(WS_MAKE_RULES)/common.mk

PATH=			$(GNUBIN):$(USRBINDIR)
ADIHEAP_MODE=		$(ADIHEAP_ENABLE)
ADISTACK_MODE=		$(ADISTACK_ENABLE)

# Package dependencies.
# ---------------------
# Created by 'gmake REQUIRED_PACKAGES', manually verified.
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
