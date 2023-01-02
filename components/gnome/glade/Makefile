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

BUILD_BITS=		64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		glade
COMPONENT_VERSION=	3.40.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Glade
COMPONENT_ARCHIVE_HASH= \
	sha256:31c9adaea849972ab9517b564e19ac19977ca97758b109edc3167008f53e3d9c
COMPONENT_BUGDB=	gnome/libglade
COMPONENT_ANITYA_ID=	1174
COMPONENT_BAID=		133507

BUILD_STYLE=		meson
PYTHON_VERSION=		3.7

include $(WS_MAKE_RULES)/gnome-component.mk
include $(WS_MAKE_RULES)/test-x11.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

ifeq ($(MACH),sparc)
# Webkit expects that only 48 bits from the address are effectively used.
# This is not true on Solaris SPARC platform, so we use a mapfile to limit virtual address space.
LD_EXEC_OPTIONS.64 += -M $(WS_COMPONENTS)/desktop/webkitgtk4/mapfile_sparc_48bits
LD_EXEC_OPTIONS = $(LD_EXEC_OPTIONS.$(BITS))
endif

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += -Dgtk_doc=true
CONFIGURE_OPTIONS += -Dgladeui=true

# Temporary workaround until all build machines are running meson-0.63
COMPONENT_POST_INSTALL_ACTION += \
for f in $(PROTO_DIR)/usr/share/help/[a-z]*/glade/figures ; do \
    (cd $$f ; $(RM) *.png ; $(SYMLINK) ../../../C/glade/figures/*.png . ); \
done ;

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gjs
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/desktop/webkitgtk4
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += system/library/math
