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
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS= 		32_and_64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libvorbis
COMPONENT_VERSION=	1.3.6
COMPONENT_PROJECT_URL=	https://xiph.org/vorbis/
COMPONENT_ARCHIVE_HASH= \
	sha256:6ed40e0241089a42c48604dc00e362beee00036af2d8b3f46338031c9e0351cb
COMPONENT_ARCHIVE_URL=	http://downloads.xiph.org/releases/vorbis/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/multimedia
COMPONENT_ANITYA_ID=	1758

TPNO=			42388

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"

unexport SHELLOPTS
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS = -k -i
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Testing/p" ' \
        '-e "/ok/p" '

REQUIRED_PACKAGES += codec/libogg
REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += system/library/math
