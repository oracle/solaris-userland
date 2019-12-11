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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#
# Prefer 32-bit as only "binary" delivered is a script with embedded paths.
BUILD_BITS= 32_and_64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libpcap
COMPONENT_VERSION=	1.9.1
COMPONENT_PROJECT_URL=	https://www.tcpdump.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:635237637c5b619bcceba91900666b64d56ecb7be63f298f601ec786ce087094
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)release/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=	library/libpcap
COMPONENT_ANITYA_ID=	1702

TPNO=			55279

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Rebuild the configure script so the man pages are normalized.
COMPONENT_PREP_ACTION =	(cd $(@D); autoconf);

# libpcap Makefile does not use CFLAGS when building shared library.
LDFLAGS += $(CC_BITS)

CFLAGS += -DHAVE_CONFIG_H
CFLAGS += -DBUILDING_PCAP
CONFIGURE_OPTIONS  +=	--disable-dbus

#
# the private header file now depends on other internal header files, but since
# we use it only to get the pcap structure, it's safe to get rid of them
#
COMPONENT_POST_INSTALL_ACTION += $(GSED) -i -e 's/^\#include "varattrs.h"//' $(PROTO_DIR)/usr/include/pcap-int.h;
COMPONENT_POST_INSTALL_ACTION += $(GSED) -i -e 's/^\#include "fmtutils.h"//' $(PROTO_DIR)/usr/include/pcap-int.h;

REQUIRED_PACKAGES += developer/lexer/flex
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/network/bpf
REQUIRED_PACKAGES += network/open-fabrics
