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

COMPONENT_NAME=		cups-browsed
COMPONENT_VERSION=	2.1.1
COMPONENT_ARCHIVE_HASH=	sha256:bc9ed54ef6940a6ee076f8627458fbc3cfed9b2f7bf4ef6e865be7644a51ce8f
COMPONENT_PROJECT_URL=	http://www.openprinting.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_URL=	https://github.com/OpenPrinting/cups-browsed/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/cups
COMPONENT_BAID=		182115
COMPONENT_ANITYA_ID=	328190

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS +=	--localedir=$(USRSHARELOCALEDIR)
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--with-cups-rundir=/system/volatile/cups
CONFIGURE_OPTIONS +=    --with-rcdir=no

LD_OPTIONS += -lresolv

# Automatic testing not available because runing network/dns/multicast
# (avahi-daemon) is required. For manual testing see TESTING file.
test:		$(NO_TESTS)
system-test:    $(NO_TESTS)

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += print/cups
REQUIRED_PACKAGES += print/cups/libcupsfilters
REQUIRED_PACKAGES += print/cups/libppd
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += system/network/avahi
REQUIRED_PACKAGES += system/network/ldap/openldap
