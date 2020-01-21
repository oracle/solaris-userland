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
# Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64_and_32
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libsass
COMPONENT_VERSION=	3.6.3
COMPONENT_PROJECT_URL=	https://sass-lang.com/libsass
COMPONENT_SRC=		libsass-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:dadb470bb9141e91b437119d367654427180ed2b3d04b8000eab5b0ca47cd5bb
COMPONENT_ARCHIVE_URL= https://github.com/sass/libsass/archive/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libsass
COMPONENT_ANITYA_ID=	11766

TPNO=			55137

include $(WS_MAKE_RULES)/gnome-component.mk

# Generate configure
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
