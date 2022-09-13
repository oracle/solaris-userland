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
BUILD_BITS= 64_and_32

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

# Component information, used for download and packaging.
# -------------------------------------------------------
# DHCP version encoding within IPS, our rule is:
#   DHCP <x>.<y>.<z>        =>   IPS <x>.<y>.<z>.0.<s>
#   DHCP <x>.<y>.<z>-P<n>   =>   IPS <x>.<y>.<z>.<n>.<s>
# <s> is for Solaris specific modifications as necessary.
COMPONENT_NAME=		isc-dhcp
COMPONENT_VERSION=	4.4.3
HUMAN_VERSION=		$(COMPONENT_VERSION)
IPS_COMPONENT_VERSION=	$(COMPONENT_VERSION).0.0
COMPONENT_SRC_NAME=	dhcp
COMPONENT_PROJECT_URL=	http://www.isc.org/software/dhcp/
COMPONENT_ARCHIVE_URL=  \
    http://ftp.isc.org/isc/dhcp/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
    sha256:0e3ec6b4c2a05ec0148874bcd999a66d05518378d77421f607fb0bc9d0135818
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sha512.asc
COMPONENT_BUGDB=	service/dhcp-server
COMPONENT_ANITYA_ID=	5584

COMPONENT_BAID=		127222

INSTALL_TARGET=
include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

# Some patches need configure script re-creation.
COMPONENT_PREP_ACTION +=(cd $(@D); autoreconf -vfi);

CONFIGURE_OPTIONS  +=	--sysconfdir=$(ETCDIR)/inet
CONFIGURE_OPTIONS  +=	--sbindir=$(USRLIBDIR)/inet
CONFIGURE_OPTIONS  +=	--bindir=$(USRSBINDIR)
CONFIGURE_OPTIONS  +=	--enable-use-sockets
CONFIGURE_OPTIONS  +=	--enable-ipv4-pktinfo
CONFIGURE_OPTIONS  +=	--srcdir=$(BUILD_DIR_$(BITS))

COMPONENT_TEST_DIR =	$(@D)

install:	build $(INSTALL_32_and_64) $(PROTO_DIR)/dhcpd.leases

$(PROTO_DIR)/dhcpd.leases:	$(INSTALL_32_and_64)
	$(TOUCH) $@

# Package dependencies
# Created by 'gmake REQUIRED_PACKAGES', manually verified.
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network
