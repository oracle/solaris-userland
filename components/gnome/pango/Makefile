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
# Copyright (c) 2016, 2023, Oracle and/or its affiliates.
#

# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =		gcc
BUILD_BITS =		64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pango
COMPONENT_VERSION=	1.50.11
COMPONENT_PROJECT_URL=	http://www.pango.org/
COMPONENT_ARCHIVE_HASH= \
    sha256:8800f812d89ee61388188703203f3a7878963c22f8695aaf1fa0a1a1428d17ae
COMPONENT_BUGDB=	gnome/pango
COMPONENT_ANITYA_ID=	11783

COMPONENT_BAID=		133089
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# doc build requires python modules we don't have (markdown, typogrify)
CONFIGURE_OPTIONS += -Dgtk_doc=false
CONFIGURE_OPTIONS.32 += -Dintrospection=disabled
CONFIGURE_OPTIONS += -Dinstall-tests=true

# Workaround for build failures due to pango Makefiles not passing CFLAGS or
# LDFLAGS, especially the -m32/64 flag, to g-ir-scanner
COMPONENT_BUILD_ENV += CFLAGS="$(strip $(CFLAGS))"
COMPONENT_BUILD_ENV += LDFLAGS="$(strip $(LDFLAGS))"

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libpango-1.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libpango-1.0.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libpangocairo-1.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libpangocairo-1.0.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libpangoft2-1.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libpangoft2-1.0.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libpangoxft-1.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libpangoxft-1.0.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libpangox-1.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libpangox-1.0.3lib; \

# cp boundaries.utf8 to tests directory in the build area
COMPONENT_PRE_TEST_ACTION += cp $(SOURCE_DIR)/tests/boundaries.utf8 \
	  $(BUILD_DIR_$(BITS))/tests/
COMPONENT_TEST_TARGETS += ; cd tests; ./cxx-test; ./markup-parse; \
        ./test-break; ./test-converage; ./test-font ; ./test-ot-tags; \
        ./testboundaries; ./testcolor; ./testiter; ./testscript; \
	./test-ellipsize; ./test-harfbuzz; ./test-itemize; ./test-layout; \
	./test-pangocairo-threads; ./test-shape; ./testmisc; ./testattributes;
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
        '-e "s/[0-9]* subtests passed/x subtests passed/"'

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/fribidi
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/glib2
# Needs fontconfig version >= 2.10.91
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libxft
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/server/xorg
