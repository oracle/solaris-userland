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
# Copyright (c) 2015, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		yelp
COMPONENT_VERSION=	41.2
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Yelp
COMPONENT_ARCHIVE_HASH= \
	sha256:b00bf033f02dd79b6d3f255031c71df8d6ed38e552c870b8f391a374724c43c5
COMPONENT_BUGDB=        gnome/docviewer
COMPONENT_ANITYA_ID=	14867

COMPONENT_BAID=		115919

# gmake check works but produces no useful output
TEST_TARGET = $(SKIP_TEST)

include $(WS_MAKE_RULES)/gnome-component.mk

CFLAGS += -Wno-cast-function-type
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=940164
CFLAGS += -Wno-error

CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

ifeq ($(MACH),sparc)
# Webkit expects that only 48 bits from the address are effectively used.
# This is not true on Solaris SPARC platform, so we use a mapfile to limit virtual address space.
LD_EXEC_OPTIONS += -M $(WS_COMPONENTS)/desktop/webkitgtk4/mapfile_sparc_48bits
endif

# Needed due to patch to configure.ac.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

CONFIGURE_OPTIONS += --disable-schemas-compile
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-bz2
CONFIGURE_OPTIONS += --enable-lzma
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += --with-webkit2gtk-4-0

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/gnome-help.1 \
                $(PROTO_DIR)/usr/share/man/man1/gnome-help.1; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/yelp.1 \
                $(PROTO_DIR)/usr/share/man/man1/yelp.1; 


REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/desktop/webkitgtk4
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/yelp-xsl
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += system/library/math
