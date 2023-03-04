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
# Copyright (c) 2008, 2023, Oracle and/or its affiliates.
#

BUILD_BITS =		NO_ARCH
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		font-bh-ttf
COMPONENT_VERSION=	1.0.4
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
	sha256:85a5f90d00c48c2b06fd125ea8adbc8b8ee97429e3075081c8710926efec3a56
COMPONENT_ANITYA_ID=	17191
COMPONENT_BUGDB=	x11/font

COMPONENT_BAID=		139252

include $(WS_MAKE_RULES)/x11-component.mk
include $(WS_MAKE_RULES)/font.mk

# Directory to install to
CONFIGURE_OPTIONS += --with-fontdir=$(USRSHARETTFONTSDIR)/bh-luxi

# Set correct path for fontconfig files
CONFIGURE_OPTIONS += --with-fc-confdir=$(ETCDIR)/fonts

