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
#XXXCTF_MODE =		off	# Breaks config
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pixman
COMPONENT_VERSION=	0.46.0
COMPONENT_ARCHIVE_HASH= \
	sha256:d2eab57e1ce79de991f8ceb3fcd726a6978b970382c8ac8c8f112b61ceaa9167
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	3648
COMPONENT_BAID=		327847
COMPONENT_SIG_URL= 

BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += -Dgtk=disabled

COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Ok:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" ' \
        '-e "/Skipped:/p" ' \
        '-e "/Timeout:/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master

REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += system/library/math
