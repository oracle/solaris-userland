#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2015, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
CTF_MODE =		off	# Has no effect
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		librsvg
COMPONENT_VERSION=	2.63.2
COMPONENT_MAJOR_MINOR=	$(basename $(COMPONENT_VERSION))
COMPONENT_PROJECT_URL=	https://gitlab.gnome.org/GNOME/librsvg
COMPONENT_ARCHIVE_HASH=	\
    sha256:852b18e1a00b8605528825a27dc7748bff2a5dd254028f59dc22a34ea57e81b6

# hash for vendored sources
COMPONENT_ARCHIVE_HASH_crates = \
    sha256:3e0419fa100a469d60d67b63c319546515cecb6e79d6bd4ebed59bbab74962a5

COMPONENT_BUGDB=        library/librsvg
COMPONENT_ANITYA_ID=	5420

COMPONENT_BAID=		446643

BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/cargo-vendored.mk
include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS += -Dintrospection=enabled
CONFIGURE_OPTIONS += -Dpixbuf=enabled
CONFIGURE_OPTIONS += -Dpixbuf-loader=enabled
CONFIGURE_OPTIONS += -Dvala=enabled
CONFIGURE_OPTIONS += -Ddocs=disabled
CONFIGURE_OPTIONS += -Davif=disabled

# g-ir-scanner links a temporary executable from non-PIC objects.
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Upstream commit 55a08a2 refreshed this reference for Pango 1.58.2's
# text-decoration rendering.  Solaris Pango 1.56.4 produces the previous
# upstream image exactly on both architectures.  Remove this override when
# Solaris Pango is updated to match the upstream test environment.
COMPONENT_PREP_ACTION += \
	$(CP) files/text-text-03-b-ref-pango-1.56.png \
	    $(SOURCE_DIR)/rsvg/tests/fixtures/reftests/svg1.1/text-text-03-b-ref.png;

COMPONENT_PRE_BUILD_ACTION += $(VENDORED_SOURCES_ENFORCE)
COMPONENT_BUILD_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo
COMPONENT_INSTALL_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo

# Upstream builds its man page with the optional API documentation.  Keep
# the man page and the existing documentation when gi-docgen is unavailable.
COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTO_DIR)/usr/share/man/man1 $(PROTO_DIR)/usr/share/doc/librsvg; \
	/usr/bin/rst2man $(SOURCE_DIR)/rsvg-convert.rst > \
	    $(PROTO_DIR)/usr/share/man/man1/rsvg-convert.1; \
	$(CP) $(SOURCE_DIR)/README.md $(SOURCE_DIR)/code-of-conduct.md \
	    $(PROTO_DIR)/usr/share/doc/librsvg;

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH64).master

CBE_PACKAGES += developer/rust/cargo
CBE_PACKAGES += developer/rust/rustc
CBE_PACKAGES += developer/documentation-tool/docutils
CBE_PACKAGES += developer/vala
CBE_PACKAGES += library/desktop/gobject/gobject-introspection
CBE_PACKAGES += system/library/fontconfig

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
