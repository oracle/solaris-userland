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

BUILD_BITS =  32_and_64

include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		orc
COMPONENT_VERSION=	0.4.44
COMPONENT_PROJECT_URL=	https://gstreamer.freedesktop.org/projects/orc.html
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:4aeb97aea2b58224029dc2b23d7d064cfa990cb4fb8c4da440bcbe9c95bc5d2d
COMPONENT_ARCHIVE_URL=	https://gstreamer.freedesktop.org/src/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	gnome/multimedia
COMPONENT_ANITYA_ID=	2573

COMPONENT_BAID=		455135

BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/common.mk

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master
COMPONENT_TEST_ARGS =   -k 0

# The AVX backend requires AVX2. Do not force it on older build hosts.
ifeq ($(MACH),i386)
ifeq ($(shell /usr/bin/isainfo -x | $(GNU_GREP) -w avx2),)
COMPONENT_TEST_CMD = $(MESON)
COMPONENT_TEST_ARGS = test --no-rebuild --print-errorlogs --no-suite avx
COMPONENT_TEST_TARGETS =
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-i386-no-avx2.master
endif
endif

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
