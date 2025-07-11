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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64
COMPILER =		gcc
CTF_MODE =		relaxed
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		fltk
COMPONENT_VERSION=	1.3.9
COMPONENT_PROJECT_URL=  http://fltk.org
COMPONENT_ARCHIVE=	$(COMPONENT_SRC)-source.tar.bz2
COMPONENT_ARCHIVE_URL=	http://fltk.org/pub/fltk/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:103441134915402808fd45424d4061778609437e804334434e946cfd26b196c2
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	823
COMPONENT_BAID=		176032

# Tests exists but need work to get hooked up
TEST_TARGET = $(SKIP_TEST)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-shared

# check_rtime fails to find the 64 bit libraries without the 64->$(MACH64) link
check_rtime:   $(PROTOUSRLIBDIR)/64

$(PROTOUSRLIBDIR)/64: $(INSTALL_TARGET)
	$(SYMLINK) $(MACH64) $@


REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcursor
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxft
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/mesa
REQUIRED_PACKAGES += x11/x11-server-utilities
