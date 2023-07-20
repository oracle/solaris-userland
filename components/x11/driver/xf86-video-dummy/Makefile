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
# Copyright (c) 2018, 2023, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-dummy
COMPONENT_VERSION=	0.4.1
COMPONENT_ARCHIVE=    	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
	sha256:146a56649ace85b307910263bcaeebfd1da7258e6706c5f72c3b509779a81f40
COMPONENT_BUGDB=        x11/devices-x86
COMPONENT_ANITYA_ID=	5216
COMPONENT_BAID=		145583

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

LD_OPTIONS += \
	-L$(X11_SERVERMODS_DIR) \
	-R$(X11_SERVERMODS_DIR) \
	-lfb
