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
# Copyright (c) 2024, 2025, Oracle and/or its affiliates.
#

BUILD_BITS = 	      	64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =		gcc
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libsoup
COMPONENT_VERSION=	3.6.5
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/libsoup
COMPONENT_ARCHIVE_HASH=	\
    sha256:6891765aac3e949017945c3eaebd8cc8216df772456dc9f460976fbdb7ada234
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	11483

COMPONENT_BAID=		325677
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)

CONFIGURE_OPTIONS += -Dsysprof=disabled
# Requires gi-docgen
CONFIGURE_OPTIONS += -Ddocs=disabled
CONFIGURE_OPTIONS += -Dpkcs11_tests=disabled
CONFIGURE_OPTIONS.32 += -Dintrospection=disabled

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" ' \
        '-e "/Skipped:/p" ' \
        '-e "/Timeout:/p" '

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libpsl
REQUIRED_PACKAGES += library/nghttp2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += security/kerberos-5
