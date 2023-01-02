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
# Copyright (c) 2015, 2023, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
# Additionally, colord requires support for __attribute__(cleanup), which
# Studio does not yet support until 12.5 (ER 17630845).
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		colord
COMPONENT_VERSION=	1.4.6
COMPONENT_PROJECT_URL=	https://www.freedesktop.org/software/colord/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:7407631a27bfe5d1b672e7ae42777001c105d860b7b7392283c8c6300de88e6f
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	10190

COMPONENT_BAID=		126471
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Requires fpclassify (c99).
CFLAGS += -std=gnu99 -D__EXTENSIONS__
CFLAGS += -Wstack-protector -fdata-sections -fstack-protector-all
LD_OPTIONS += -z gnu-version-script-compat

CONFIGURE_OPTIONS.64 += --libexecdir=$(USRLIBDIR64)

# Requires external package (https://bash-completion.alioth.debian.org) that we
# don't currently have in Solaris.
CONFIGURE_OPTIONS += -Dbash_completion=false
CONFIGURE_OPTIONS += -Dpnp_ids="/usr/share/hwdata/pci.ids"
CONFIGURE_OPTIONS += -Dsystemd=false
# Linux-specific.
CONFIGURE_OPTIONS += -Dudev_rules=false
# may need tweaking to give colord user sufficient rights
CONFIGURE_OPTIONS.32 += -Ddaemon=false
CONFIGURE_OPTIONS.64 += -Ddaemon_user=daemon
# Requires spotread 
CONFIGURE_OPTIONS += -Dargyllcms_sensor=false
CONFIGURE_OPTIONS += -Dlibcolordcompat=false
CONFIGURE_OPTIONS.32 += -Dintrospection=false
CONFIGURE_OPTIONS.64 += -Dintrospection=true
# Cannot build man pages without docbook-xsl-ns
CONFIGURE_OPTIONS += -Dman=false
# Build vala bindings
CONFIGURE_OPTIONS.64 += -Dvapi=true

# Assumes GNU xgettext and tail in PATH
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

COMPONENT_POST_INSTALL_ACTION.64 += \
    $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/colord.xml \
	$(PROTO_DIR)/lib/svc/manifest/system/colord.xml

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
