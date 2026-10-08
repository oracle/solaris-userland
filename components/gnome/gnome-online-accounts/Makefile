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
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-online-accounts
COMPONENT_VERSION=	3.58.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GnomeOnlineAccounts
COMPONENT_ARCHIVE_HASH= \
	sha256:9ec1900cc51409c2067c07c828c10be06fe3bf68d2999bb72d7d5ed325ed9bbc
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	10943

COMPONENT_BAID=		434398
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

LD_OPTIONS += -lresolv

# This requires GTK4/libadwaita and is not needed by GVFS.
CONFIGURE_OPTIONS += -Dgoabackend=false
# Avoid the Solaris krb5.h and p11-kit conflict.
CONFIGURE_OPTIONS += -Dkerberos=false
# The current Solaris package does not deliver documentation or man pages.
CONFIGURE_OPTIONS += -Ddocumentation=false
CONFIGURE_OPTIONS += -Dman=false

CBE_PACKAGES += developer/vala
CBE_PACKAGES += library/desktop/gobject/gobject-introspection

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
