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

COMPONENT_NAME=		libXext
COMPONENT_VERSION=	1.3.3
COMPONENT_ARCHIVE_HASH= \
	sha256:b518d4d332231f313371fdefac59e3776f4f0823bcb23cf7c7305bfb57b16e35
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1774

TEST_TARGET = $(NO_TESTS)

FIX_PC_FILES=xext.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_POST_UNPACK_ACTION = \
        $(CP) sun-src/src/* $(SOURCE_DIR)/src; \
        $(CP) sun-src/man/* $(SOURCE_DIR)/man; \
        $(CP) sun-src/include/X11/extensions/xinerama.h $(SOURCE_DIR)/include/X11/extensions/;

CONFIGURE_ENV += LIB_MAN_SUFFIX=3xext

# Enable Solaris-specific code
CPPFLAGS += -DSUNSOFT

LD_OPTIONS += -M $(COMPONENT_DIR)/mapfile

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxevie
REQUIRED_PACKAGES += x11/library/libxscrnsaver
