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
# Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
#

# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =		gcc
BUILD_BITS =		64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pango
COMPONENT_VERSION=	1.43.0
COMPONENT_PROJECT_URL=	http://www.pango.org/
COMPONENT_ARCHIVE_HASH= \
    sha256:d2c0c253a5328a0eccb00cdd66ce2c8713fabd2c9836000b6e22a8b06ba3ddd2
COMPONENT_BUGDB=	gnome/pango
COMPONENT_ANITYA_ID=	11783

TPNO=			53014
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS += -Denable_docs=true
# Added to build fribidi even if it finds the system installed version
CONFIGURE_OPTIONS += --wrap-mode=forcefallback

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

COMPONENT_TEST_TARGETS += ; cd tests; ./cxx-test; ./markup-parse; \
        ./test-font ; ./test-ot-tags; ./testattributes; \
        ./testboundaries; ./testcolor; ./testiter; ./testscript;
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK/p" ' \
        '-e "/Ok/p" ' \
        '-e "/Fail/p" ' \
        '-e "/Pass/p" ' \
        '-e "/Skipped/p" ' \
        '-e "/ok/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += library/desktop/cairo
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
