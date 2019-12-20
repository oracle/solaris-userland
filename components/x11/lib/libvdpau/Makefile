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
# Copyright (c) 2018, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64_and_32
COMPILER=		gcc
BUILD_STYLE=		meson
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libvdpau
COMPONENT_VERSION=	1.3
COMPONENT_PROJECT_URL=  http://freedesktop.org/wiki/Software/VDPAU/
COMPONENT_ARCHIVE_URL=	https://gitlab.freedesktop.org/vdpau/libvdpau/-/archive/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:b5a52eeac9417edbc396f26c40591ba5df0cd18285f68d84614ef8f06196e50e
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1755
TPNO=			55670

include $(WS_MAKE_RULES)/x11-component.mk

# for tests
unexport SHELLOPTS
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK/p" ' \
	'-e "/Ok/p" ' \
        '-e "/Fail/p" ' \
        '-e "/Pass/p" ' \
        '-e "/Skipped/p" ' \
        '-e "/Timeout/p" ' \
        '-e "/ok/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libx11
