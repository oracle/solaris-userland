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
# Copyright (c) 2020, 2024, Oracle and/or its affiliates.
#

BUILD_BITS=		64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		tracker-miners
COMPONENT_VERSION=	2.3.5
COMPONENT_ARCHIVE_HASH= \
	sha256:9509d37fb29acd233058f4df5bd1234b692ac6f946bc2e5f7b8dbf51dfe5b9fa
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	86776

COMPONENT_BAID=		89903
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

CFLAGS += $(XPG6MODE)

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += -Dsystemd_user_services=no
CONFIGURE_OPTIONS += -Dminer_rss=false
CONFIGURE_OPTIONS += --libexecdir=$(USRLIBDIR)
LDFLAGS += -z gnu-version-script-compat

RENAME_FILES = \
	tracker-extract/tracker-extract.desktop.in.in \
	tracker-extract/org.freedesktop.Tracker1.Miner.Extract.service.in.in \
	miners/fs/org.freedesktop.Tracker1.Miner.Files.service.in.in \
	miners/fs/tracker-miner-fs.desktop.in.in \
	miners/rss/org.freedesktop.Tracker1.Miner.RSS.service.in.in \
	miners/rss/tracker-miner-rss.desktop.in.in

COMPONENT_POST_UNPACK_ACTION += \
	(cd $(COMPONENT_SRC)/src; \
	for file in $(RENAME_FILES); do \
	    rename_file=$$(echo $$file | $(GSED) 's/\(.*\)\.in\.in/\1.in/'); \
	    $(MV) "$$file" "$$rename_file";\
	done;)
	
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += codec/flac
REQUIRED_PACKAGES += codec/libvorbis
REQUIRED_PACKAGES += desktop/pdf-viewer/poppler-viewer
REQUIRED_PACKAGES += image/library/libexif
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += library/desktop/gstreamer-1
REQUIRED_PACKAGES += library/desktop/gstreamer-1/gst-plugins-base
REQUIRED_PACKAGES += library/desktop/libgsf
REQUIRED_PACKAGES += library/desktop/libgxps
REQUIRED_PACKAGES += library/desktop/search/tracker
REQUIRED_PACKAGES += library/exempi
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/media-player/totem-pl-parser
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/upower
