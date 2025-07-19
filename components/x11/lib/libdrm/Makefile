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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
COMPILER=               gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libdrm
COMPONENT_VERSION=	2.4.120
COMPONENT_PROJECT_URL=  https://dri.freedesktop.org/
COMPONENT_ARCHIVE_HASH= \
	sha256:3bf55363f76c7250946441ab51d3a6cc0ae518055c0ff017324ab76cdefb327a
COMPONENT_ARCHIVE_URL=  $(COMPONENT_PROJECT_URL)libdrm/$(COMPONENT_ARCHIVE)
#COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1596
COMPONENT_BAID=		167437	

BUILD_STYLE=		meson

CONFIGURE_LIBDIR.32 = $(USRLIBDIR)/xorg
CONFIGURE_LIBDIR.64 = $(USRLIBDIR)/xorg/$(MACH64)

include $(WS_MAKE_RULES)/x11-component.mk

CFLAGS += -D_GNU_SOURCE -std=gnu99

CONFIGURE_OPTIONS += -Dintel=disabled
CONFIGURE_OPTIONS += -Dradeon=disabled
CONFIGURE_OPTIONS += -Dnouveau=disabled
CONFIGURE_OPTIONS += -Damdgpu=disabled

# for the tests
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" ' \
        '-e "/Skipped:/p" ' \
        '-e "/Timeout:/p" '

REQUIRED_PACKAGES += diagnostic/scanpci
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += x11/library/libpthread-stubs
