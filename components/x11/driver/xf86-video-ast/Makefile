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

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xf86-video-ast
COMPONENT_VERSION=	1.1.5
COMPONENT_ARCHIVE_HASH= \
	sha256:1edbbc55d47d3fd71dec99b15c2483e22738c642623a0fb86ef4a81a9067a2de
COMPONENT_BUGDB=        x11/devices-ast
COMPONENT_ANITYA_ID=	17163

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

COMPONENT_POST_UNPACK_ACTION += \
        $(CP) sun-src/src/* $(SOURCE_DIR)/src;

CONFIGURE_OPTIONS += --disable-dri

# Libraries/modules to link with
AST_LIBRARIES.sparc = # nothing extra
AST_LIBRARIES.i386 = -lint10 -lpciaccess -lvbe -lvgahw
AST_LIBRARIES = -lfb -lshadow $(AST_LIBRARIES.$(MACH))
LD_SHARED_OPTIONS += -L$(X11_SERVERMODS_DIR) -R$(X11_SERVERMODS_DIR)
LD_SHARED_OPTIONS += $(AST_LIBRARIES)

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += x11/server/xorg
