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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
# Prefer 32-bit as only "binary" delivered is a script with embedded paths.
BUILD_BITS= 32_and_64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libpcap
COMPONENT_VERSION=	1.8.1
COMPONENT_PROJECT_URL=	https://www.tcpdump.org/
COMPONENT_ARCHIVE_HASH=	\
	sha256:673dbc69fdc3f5a86fb5759ab19899039a8e5e6c631749e48dcd9c6f0c83541e
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)release/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=	library/libpcap
COMPONENT_ANITYA_ID=	1702

TPNO=			39211

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Rebuild the configure script so the man pages are normalized.
COMPONENT_PREP_ACTION =	(cd $(@D); autoconf);

# libpcap Makefile does not use CFLAGS when building shared library.
LDFLAGS += $(CC_BITS)

CFLAGS += -DHAVE_CONFIG_H
CFLAGS += -DBUILDING_PCAP
CONFIGURE_OPTIONS  +=	--disable-dbus

REQUIRED_PACKAGES += developer/lexer/flex
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/network/bpf
