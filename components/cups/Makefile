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
BUILD_BITS= 32_and_64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		cups

# cups 2.3 beta-6
COMPONENT_VERSION=	2.3b7
COMPONENT_ARCHIVE_HASH=	sha256:3feb8c4237f01a9998d408a95b28c361d66d372f4fd45d93e261a5233a48f969
TPNO=			48983
IPS_COMPONENT_VERSION=	2.2.99.7

# cups 2.2
#COMPONENT_VERSION=	2.2.9
#COMPONENT_ARCHIVE_HASH=	sha256:df8bad570768204e3ffe048e6f8b9b8d6adbd587ec684d2255e63484924c48bb
#TPNO=			47300

COMPONENT_PROJECT_URL=	http://www.cups.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_URL=	https://github.com/apple/cups/archive/v$(COMPONENT_VERSION).zip
COMPONENT_BUGDB=	utility/cups
COMPONENT_ANITYA_ID=	380

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

$(CONFIGURE_32):	LDFLAGS += -m32
$(CONFIGURE_64):	LDFLAGS += -m64

# Ensure dynamic shared objects are linked using same LDFLAGS as executables.
CONFIGURE_ENV += DSOFLAGS="$(LDFLAGS)"

# override MACH64
CONFIGURE_OPTIONS +=	--bindir=/usr/bin
CONFIGURE_OPTIONS +=	--sbindir=/usr/sbin
CONFIGURE_OPTIONS +=	--localedir=$(USRSHARELOCALEDIR)
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)/cups
CONFIGURE_OPTIONS +=	--with-fontpath=$(USRSHAREFONTSDIR)
CONFIGURE_OPTIONS +=	--with-logdir=$(VARDIR)/log/cups
# /var/run links to /system/volatile
CONFIGURE_OPTIONS +=	--with-domainsocket=$(VARDIR)/run/cups-socket
CONFIGURE_OPTIONS +=	--with-smfmanifestdir=$(LIBDIR)/svc/manifest/application
CONFIGURE_OPTIONS +=	--with-printcap=$(ETCDIR)/printers.conf
CONFIGURE_OPTIONS +=	--with-cups-user=lp
CONFIGURE_OPTIONS +=	--with-privateinclude=$(USRINCDIR)/cups/private
CONFIGURE_OPTIONS +=	--with-cups-group=lp
CONFIGURE_OPTIONS +=	--disable-static
CONFIGURE_OPTIONS +=	--disable-gnutls
CONFIGURE_OPTIONS +=	--without-php
CONFIGURE_OPTIONS +=	--with-python

# cups do not use DESTDIR but DSTROOT
COMPONENT_INSTALL_ARGS=	DSTROOT="$(PROTO_DIR)"

COMPONENT_PREP_ACTION += (cd $(@D) ; \
   PATH="/usr/gnu/bin:$(PATH)" autoconf -f )

COMPONENT_PRE_CONFIGURE_ACTION += $(CLONEY) $(SOURCE_DIR) $(@D)

$(BUILD_64):	COMPONENT_BUILD_TARGETS=	all
$(BUILD_32):	COMPONENT_BUILD_TARGETS=	libs unittests
$(INSTALL_64):	COMPONENT_INSTALL_TARGETS=	install-data install-headers install-libs install-exec
$(INSTALL_32):	COMPONENT_INSTALL_TARGETS=	install-libs

# Make sure that "install-sh -s" calls "strip -x" and not "strip";
# we want to remove debugging data but not the symbols.
COMPONENT_INSTALL_ENV += STRIPPROG="strip -x"

REQUIRED_PACKAGES += library/libusb-1
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/perl-522
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/device-allocation
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/network/avahi
