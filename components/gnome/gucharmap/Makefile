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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#

BUILD_BITS=		64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gucharmap
COMPONENT_VERSION=	15.1.2
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Apps/Gucharmap
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_URL=	https://gitlab.gnome.org/GNOME/gucharmap/-/archive/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:f8580cb191d0a430513d0384b1f619a5eb8ad40dbd609d0c0f8370afa756c1fe
COMPONENT_BUGDB=        gnome/applications
COMPONENT_ANITYA_ID=	1276
COMPONENT_BAID=		157673

# gucharmap needs the Unicode data files at build time, for the exact
# version of Unicode that the command supports

COMPONENT_NAME_1=	UCD
COMPONENT_VERSION_1=	15.1.0
COMPONENT_PROJECT_URL_1= https://www.unicode.org/ucd/
COMPONENT_SRC_1=	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=	$(COMPONENT_NAME_1).zip
UNPACK_ARGS_1=		--relocate-to $(SOURCE_DIR_1)
COMPONENT_ARCHIVE_URL_1= \
 https://www.unicode.org/Public/$(COMPONENT_VERSION_1)/ucd/$(COMPONENT_ARCHIVE_1)
COMPONENT_ARCHIVE_HASH_1= \
	sha256:cb1c663d053926500cd501229736045752713a066bd75802098598b7a7056177
COMPONENT_BAID_1=	157791

COMPONENT_NAME_2=	Unihan
COMPONENT_VERSION_2=	$(COMPONENT_VERSION_1)
# COMPONENT_SRC_2 not set, as we don't unpack this ourselves
COMPONENT_ARCHIVE_2=	$(COMPONENT_NAME_2).zip
COMPONENT_ARCHIVE_URL_2= \
 $(COMPONENT_ARCHIVE_URL_1:$(COMPONENT_ARCHIVE_1)=$(COMPONENT_ARCHIVE_2))
COMPONENT_ARCHIVE_HASH_2= \
	sha256:a0226610e324bcf784ac380e11f4cbf533ee1e6b3d028b0991bf8c0dc3f85853
COMPONENT_BAID_2=	$(COMPONENT_BAID_1)


BUILD_STYLE = meson
TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# gucharmap looks for UCD files at configure time
$(SOURCE_DIR_1)/$(COMPONENT_ARCHIVE_2): $(UNPACK_STAMP_1) $(COMPONENT_ARCHIVE_2)
	$(RM) $@
	$(SYMLINK) ../$(COMPONENT_ARCHIVE_2) $@
$(BUILD_DIR_64)/.configured: $(SOURCE_DIR_1)/$(COMPONENT_ARCHIVE_2)
CONFIGURE_OPTIONS += -Ducd_path=$(SOURCE_DIR_1)

# Required for other components.
CONFIGURE_OPTIONS += -Dgir=true
# Required for other components.
CONFIGURE_OPTIONS += -Dvapi=true
CONFIGURE_OPTIONS += -Dgtk3=true

# Assumes GNU msgfmt in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# Avoid text relocation errors from g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

REQUIRED_PACKAGES += desktop/xdg/desktop-file-utils
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
