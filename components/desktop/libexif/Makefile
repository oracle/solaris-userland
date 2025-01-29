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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

BUILD_BITS=		32_and_64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libexif
COMPONENT_VERSION=	0.6.25
COMPONENT_PROJECT_URL=  https://sourceforge.net/projects/$(COMPONENT_NAME)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
	sha256:7c9eba99aed3e6594d8c3e85861f1c6aaf450c218621528bc989d3b3e7a26307
COMPONENT_ARCHIVE_URL= \
	https://github.com/libexif/libexif/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libexif
COMPONENT_ANITYA_ID=	1607

COMPONENT_BAID=		193247

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS += --disable-static

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" '

REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += system/library/math

