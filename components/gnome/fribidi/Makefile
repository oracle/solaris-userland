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
# Copyright (c) 2020, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		fribidi
COMPONENT_VERSION=	1.0.16
COMPONENT_ARCHIVE=	v$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_URL=  https://github.com/fribidi/fribidi/archive/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:5a1d187a33daa58fcee2ad77f0eb9d136dd6fa4096239199ba31e850d397e8a8
COMPONENT_BUGDB=        library/fribidi
COMPONENT_ANITYA_ID=	857

COMPONENT_BAID=		329085
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)

CONFIGURE_OPTIONS += -Ddocs=false

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
