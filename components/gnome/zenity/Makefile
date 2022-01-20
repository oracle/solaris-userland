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

BUILD_BITS=		64
COMPILER=		gcc

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		zenity
COMPONENT_VERSION=	3.41.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Zenity
COMPONENT_ARCHIVE_HASH= \
	sha256:19b676c3510e22badfcc3204062d432ba537402f5e0ae26128c0d90c954037e1
COMPONENT_BUGDB=	gnome/applications
COMPONENT_ANITYA_ID=	13165

COMPONENT_BAID=		115221
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# Ensures gdialog script specifies explicit version of perl.
CONFIGURE_ENV += PERL="$(PERL)"

CONFIGURE_OPTIONS += -Dlibnotify=true
CONFIGURE_OPTIONS += -Dwebkitgtk=true

ifeq ($(MACH),sparc)
# Webkit expects that only 48 bits from the address are effectively used.
# This is not true on Solaris SPARC platform, so we use a mapfile to limit virtual address space.
LD_EXEC_OPTIONS += -M $(WS_COMPONENTS)/desktop/webkitgtk4/mapfile_sparc_48bits
endif

# Assumes GNU msgfmt in PATH.
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/gdialog.1 \
                $(PROTO_DIR)/usr/share/man/man1/gdialog.1;

REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/libnotify
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/desktop/webkitgtk4
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += x11/library/libx11
