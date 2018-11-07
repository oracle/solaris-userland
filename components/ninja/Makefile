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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

COMPILER= gcc
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		ninja
COMPONENT_VERSION=	1.8.2
COMPONENT_PROJECT_URL=	https://ninja-build.org/
COMPONENT_ARCHIVE=	v$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:86b8700c3d0880c2b44c2ff67ce42774aaf8c28cbf57725cb881569288c1c6f4
COMPONENT_ARCHIVE_URL=	https://github.com/ninja-build/ninja/archive/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=        utility/ninja
COMPONENT_ANITYA_ID=	2089

TPNO=			45004

BUILD_STYLE = justmake
	
PKG_PROTO_DIRS += $(BUILD_DIR_64)
PKG_PROTO_DIRS += $(BUILD_DIR_64)/doc
PKG_PROTO_DIRS += $(BUILD_DIR_64)/misc

include $(WS_MAKE_RULES)/common.mk

COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_BUILD_ACTION = \
	$(CLONEY) $(SOURCE_DIR) $(@D); \
	cd $(@D); $(ENV) $(COMPONENT_BUILD_ENV) \
	./configure.py --bootstrap

COMPONENT_INSTALL_ACTION =  \
	touch $(BUILD_DIR_64)/.installed

COMPONENT_PRE_TEST_ACTION = \
	cd $(BUILD_DIR_64); \
	./ninja all; 

COMPONENT_TEST_CMD = cd $(BUILD_DIR_64); ./ninja_test
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += developer/parser/re2c
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
