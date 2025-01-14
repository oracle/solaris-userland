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
# Copyright (c) 2012, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		procmail
COMPONENT_VERSION=	3.24
COMPONENT_PROJECT_URL=	http://www.procmail.org
COMPONENT_ARCHIVE_HASH=	\
	sha256:514ea433339783e95df9321e794771e4887b9823ac55fdb2469702cf69bd3989
COMPONENT_ANITYA_ID=	3713

# ftp://ftp.procmail.org/pub/procmail/procmail-3.22.tar.gz no longer works.
COMPONENT_ARCHIVE_URL=	https://github.com/BuGlessRB/$(COMPONENT_NAME)/archive/refs/tags/v$(COMPONENT_VERSION).tar.gz

COMPONENT_BAID=	185326	

# Use libmapmalloc instead of libc malloc to avoid a huge heap
# fragmentation caused by repeated reallocs with 16 kB increments.
# See bugs 32741107 and 32825967 for more information.
CFLAGS += -lmapmalloc

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

BUILD_STYLE= justmake
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

COMPONENT_BUILD_ENV += RPM_OPT_FLAGS="$(CFLAGS)"

COMPONENT_INSTALL_ARGS +=	BASENAME=$(PROTOUSRDIR)
COMPONENT_INSTALL_ARGS +=	MANDIR=$(PROTOUSRSHAREMANDIR)

REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
