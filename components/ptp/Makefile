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
# Copyright (c) 2013, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64
COMPILER =		gcc
CTF_MODE =		off	# Has no effect
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		ptpd
COMPONENT_VERSION=	2.2.0
COMPONENT_PROJECT_URL=	http://ptpd.sourceforge.net/
COMPONENT_ARCHIVE_HASH=	\
    sha256:f2266a22db84318d8b9ce266ea83772c03438c31f4993fa9643fa675a07c26b4
COMPONENT_ARCHIVE_URL= \
	http://downloads.sourceforge.net/project/ptpd/ptpd/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	service/ptp
COMPONENT_ANITYA_ID=	3726

COMPONENT_BAID=	160874

BUILD_STYLE= justmake
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# The build would need patching to support PIC mode
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

PKG_PROTO_DIRS += $(BUILD_DIR_64)

REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/libv12n
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/datalink
