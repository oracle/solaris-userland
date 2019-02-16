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

COMPONENT_NAME=		mesa-demos
COMPONENT_VERSION=	8.4.0
COMPONENT_PROJECT_URL=	https://mesa3d.org/
COMPONENT_ARCHIVE_URL=  https://mesa.freedesktop.org/archive/demos/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ARCHIVE_HASH= \
	sha256:01e99c94a0184e63e796728af89bfac559795fb2a0d6f506fa900455ca5fff7d
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	16781

TPNO=			49525

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

# Override some configure checks for libraries we don't need in the subset
# we build & ship - have to set them to be non-empty strings though or
# configure will fail.
CONFIGURE_ENV += GLEW_CFLAGS="-I-have-no-GLEW-" 
CONFIGURE_ENV += GLEW_LIBS="-I-have-no-GLEW-"

REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/mesa
