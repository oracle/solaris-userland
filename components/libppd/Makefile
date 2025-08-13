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
# Copyright (c) 2025, Oracle and/or its affiliates.
#

BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libppd
COMPONENT_VERSION=	2.1.1
COMPONENT_ARCHIVE_HASH=	sha256:b356aeed1335ef0ca7f799741782a2544e7acee63fb4b047b94e4e0395a9cb62
COMPONENT_PROJECT_URL=	http://www.openprinting.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_URL=	https://github.com/OpenPrinting/libppd/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/cups
COMPONENT_BAID=		182114
COMPONENT_ANITYA_ID=	328127

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION = \
        ($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS +=	--localedir=$(USRSHARELOCALEDIR)
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--with-cups-rundir=/system/volatile/cups
# use gs or poppler according to printer PPD make-and-model; see README
CONFIGURE_OPTIONS +=	--with-pdftops=hybrid
CONFIGURE_OPTIONS +=	--disable-mutool

REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += print/cups/libcupsfilters
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
