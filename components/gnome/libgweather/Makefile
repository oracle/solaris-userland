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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libgweather
COMPONENT_VERSION=	4.4.4
# This is being hardcoded here since we are updating from 40.0 to 4.4.0
IPS_COMPONENT_VERSION=  44.4
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/LibGWeather
COMPONENT_ARCHIVE_HASH=	\
	sha256:7017677753cdf7d1fdc355e4bfcdb1eba8369793a8df24d241427a939cbf4283
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	13147

COMPONENT_BAID=		329214
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

CPPFLAGS += -std=gnu99 -D_XOPEN_SOURCE=700 -D__EXTENSIONS__

# Requires gi-docgen
CONFIGURE_OPTIONS += -Dgtk_doc=false
CONFIGURE_OPTIONS += -Dzoneinfo_dir=/usr/share/lib/zoneinfo
CONFIGURE_OPTIONS += -Dtests=true
CONFIGURE_OPTIONS += -Dsoup2=false

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" ' \
        '-e "/Skipped:/p" ' \
        '-e "/Timeout:/p" '

REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/desktop/geocode-glib
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/json-glib
REQUIRED_PACKAGES += library/libsoup-3
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += system/library/math
