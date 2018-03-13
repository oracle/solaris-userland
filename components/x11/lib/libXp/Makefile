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

BUILD_BITS =            64_and_32
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libXp
COMPONENT_VERSION=	1.0.3
COMPONENT_ARCHIVE_HASH= \
	sha256:7f360c9905849c3587d48efc0f0ecbc852c19f61a52b18530d6b005cb9148c57
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1786

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=xp.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

# Override the libraries pkg-config returns, to exclude the unneeded libXau
CONFIGURE_ENV += XPRINT_LIBS='-lX11 -lXext'

CONFIGURE_ENV += LIB_MAN_SUFFIX=3xp

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
