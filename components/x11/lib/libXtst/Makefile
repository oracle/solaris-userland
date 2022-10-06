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
# Copyright (c) 2018, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libXtst
COMPONENT_VERSION=	1.2.4
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:84f5f30b9254b4ffee14b5b0940e2622153b0d3aed8286a3c5b7eeb340ca33c8
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1794
COMPONENT_BAID=		130962

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=xtst.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

CONFIGURE_ENV += LIB_MAN_SUFFIX=3xtst

LD_OPTIONS += -M$(COMPONENT_DIR)/mapfile

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxi
