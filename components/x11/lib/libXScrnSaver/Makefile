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
# Copyright (c) 2018, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libXScrnSaver
COMPONENT_VERSION=	1.2.3
COMPONENT_ARCHIVE_HASH= \
	sha256:f917075a1b7b5a38d67a8b0238eaab14acd2557679835b154cf2bca576e89bf8
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1791
TPNO=			49240

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=xscrnsaver.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

LINT_FLAGS += -I$(SOURCE_DIR)/include/X11/extensions

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

CONFIGURE_ENV += LIB_MAN_SUFFIX=3xss

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
