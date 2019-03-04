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
# Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=		64_and_32
COMPILER=		gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libusb
COMPONENT_VERSION=     1.0.21
COMPONENT_ARCHIVE_HASH= sha256:1a5b08c05bc5e38c81c2d59c29954d5916646f4ff46f51381b3f624384e4ac01
COMPONENT_ARCHIVE_URL=  https://sourceforge.net/projects/libusb/files/libusb-1.0/$(COMPONENT_SRC)/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=  http://libusb.info/
COMPONENT_ANITYA_ID=	1749

TPNO=			39479

SYSTEM_TEST_TARGET= $(SYSTEM_TESTS_NOT_IMPLEMENTED)
include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS  +=	--enable-static=no
CONFIGURE_OPTIONS  +=   --enable-log

COMPONENT_BUILD_ARGS+=	"LDFLAGS=$(LDFLAGS)"
COMPONENT_BUILD_ARGS+=	"INSTALL=$(INSTALL)"
COMPONENT_BUILD_ARGS+=	"MAKE=$(GMAKE)"

COMPONENT_BUILD_ARGS+=	-C doc docs

PROTOUSRSHAREDOCDIR = $(PROTOUSRSHAREDIR)/doc/libusb-1.0

COMPONENT_PREP_ACTION = (cd $(@D); $(AUTORECONF) -if)

install:	$(INSTALL_32_and_64)
	cd $(BUILD_DIR_64); \
	$(MKDIR) -p $(PROTOUSRSHAREDOCDIR); \
	$(CP) -r doc/html $(PROTOUSRSHAREDOCDIR)

REQUIRED_PACKAGES += system/library/devinfo
