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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		tcpdump
COMPONENT_VERSION=	4.99.1
COMPONENT_PROJECT_URL=	https://www.tcpdump.org/
COMPONENT_ARCHIVE_HASH=	sha256:79b36985fb2703146618d87c4acde3e068b91c553fb93f021a337f175fd10ebe
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)release/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ANITYA_ID=	4947

COMPONENT_BAID=		130343

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

SYSTEM_TEST_TARGET= configure $(SYSTEM_TEST_64)
include $(WS_MAKE_RULES)/common.mk

ifeq ($(OS_VERSION),11.3)
# Prevent macro redefinition error
CFLAGS += -D _NETINET_IP_H
endif

# Rebuild the configure script so the man pages are normalized.
COMPONENT_PREP_ACTION = (cd $(@D); autoconf);

# lazyloading (indirectly enabled by -Bdirect) seems to cause problems with
# libpcap device enumeration.
LD_B_DIRECT=

CONFIGURE_OPTIONS += --enable-ipv6=yes
CONFIGURE_OPTIONS += --with-user=nobody
CONFIGURE_OPTIONS += --without-crypto

COMPONENT_TEST_TRANSFORMS += \
	'-e "/Entering directory/d" ' \
	'-e "/Leaving directory/d" ' \
	'-e "/cd tests/d" '

COMPONENT_PRE_TEST_ACTION = \
        ($(CP) -r $(SOURCE_DIR)/tests $(@D)/.)

# We don't want to build tcpdump, so override the equivalent of "gmake check"
# in the main Makefile.
COMPONENT_SYSTEM_TEST_CMD =	./TESTrun.sh
COMPONENT_SYSTEM_TEST_DIR =	$(@D)/tests
COMPONENT_SYSTEM_TEST_ENV +=	TCPDUMP_BIN=$(USRSBINDIR)/tcpdump
COMPONENT_SYSTEM_TEST_TARGETS =
COMPONENT_PRE_SYSTEM_TEST_ACTION = \
        ($(CP) -r $(SOURCE_DIR)/tests $(@D)/.)

REQUIRED_PACKAGES += system/library/libpcap
