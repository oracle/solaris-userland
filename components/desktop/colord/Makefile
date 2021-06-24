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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
# Additionally, colord requires support for __attribute__(cleanup), which
# Studio does not yet support until 12.5 (ER 17630845).
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		colord
COMPONENT_VERSION=	1.3.5
COMPONENT_PROJECT_URL=	https://www.freedesktop.org/software/colord/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= sha256:2daa8ffd2a532d7094927cd1a4af595b8310cea66f7707edcf6ab743460feed2
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	10190

TPNO=			34440

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# Requires fpclassify (c99).
CFLAGS += -std=gnu99

# Required due to patches.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv; intltoolize --force);

# Requires external package (https://bash-completion.alioth.debian.org) that we
# don't currently have in Solaris.
CONFIGURE_OPTIONS += --disable-bash-completion
# gusb appears to be an abandoned project.
CONFIGURE_OPTIONS += --disable-gusb
CONFIGURE_OPTIONS.32 += --disable-polkit
CONFIGURE_OPTIONS.64 += --enable-polkit
CONFIGURE_OPTIONS += --disable-static
# Linux-specific.
CONFIGURE_OPTIONS += --disable-systemd-login
# Linux-specific.
CONFIGURE_OPTIONS += --disable-udev
CONFIGURE_OPTIONS += --enable-gtk-doc
# Required for other components.
CONFIGURE_OPTIONS.32 += --disable-introspection
CONFIGURE_OPTIONS.64 += --enable-introspection
CONFIGURE_OPTIONS += --enable-shared
# Required for other components.
CONFIGURE_OPTIONS += --enable-vala
# may need tweaking to give colord user sufficient rights
CONFIGURE_OPTIONS += --with-daemon-user=daemon
CONFIGURE_OPTIONS += --with-pic
# Mostly a placebo value; udev support is disabled above, but it still delivers
# 'rule' files for udev (omitted from package manifest).
CONFIGURE_OPTIONS += --with-udevrulesdir=/etc/udev/rules.d
# Requires spotread 
CONFIGURE_OPTIONS += --disable-argyllcms-sensor

# Assumes GNU xgettext and tail in PATH
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

COMPONENT_POST_INSTALL_ACTION.64 += \
    $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/colord.xml \
	$(PROTO_DIR)/lib/svc/manifest/system/colord.xml; \
    $(INSTALL) -D -m 0555 $(COMPONENT_DIR)/files/svc-colord \
	$(PROTO_DIR)/lib/svc/method/svc-colord; \
    $(INSTALL) -D -m 0444 $(COMPONENT_SRC)/man/cd-create-profile.1 \
	$(PROTO_DIR)/usr/share/man/man1/cd-create-profile.1; \
    $(INSTALL) -D -m 0444 $(COMPONENT_SRC)/man/colormgr.1 \
	$(PROTO_DIR)/usr/share/man/man1/colormgr.1; \
    $(INSTALL) -D -m 0444 $(COMPONENT_SRC)/man/cd-it8.1 \
	$(PROTO_DIR)/usr/share/man/man1/cd-it8.1; \
    $(INSTALL) -D -m 0444 $(COMPONENT_SRC)/man/cd-fix-profile.1 \
	$(PROTO_DIR)/usr/share/man/man1/cd-fix-profile.1;

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/polkit
