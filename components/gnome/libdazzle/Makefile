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
# Copyright (c) 2020, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libdazzle
COMPONENT_VERSION=	3.42.0
COMPONENT_PROJECT_URL=	https://gitlab.gnome.org/GNOME/libdazzle
COMPONENT_ARCHIVE_HASH=	\
	sha256:eae67a3b3d9cce408ee9ec0ab6adecb83e52eb53f9bc93713f4df1e84da16925
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=    73149

COMPONENT_BAID=		110574
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

CFLAGS += -Wstack-protector -fdata-sections -fstack-protector-all

# Version 3.38.0 requires following for GCC 11 build.
CFLAGS += -Wno-error=incompatible-pointer-types

COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS.32 += -Dwith_introspection=false
CONFIGURE_OPTIONS.64 += -Dwith_introspection=true

COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
