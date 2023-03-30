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
# Copyright (c) 2016, 2023, Oracle and/or its affiliates.
#
BUILD_BITS=	64
COMPILER=	gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         ccid
COMPONENT_VERSION=      1.5.2
COMPONENT_PROJECT_URL=  https://ccid.apdu.fr
COMPONENT_DOWNLOAD_URL= $(COMPONENT_PROJECT_URL)/files
COMPONENT_ARCHIVE_HASH= sha256:13934487e6f8b48f699a16d367cc7a1af7a3ca874de721ac6e9633beb86e7219
COMPONENT_ARCHIVE=      $(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.bz2
COMPONENT_ARCHIVE_URL=  $(COMPONENT_DOWNLOAD_URL)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=        library/smartcard
COMPONENT_ANITYA_ID=	2612

COMPONENT_BAID =	139302

include $(WS_MAKE_RULES)/common.mk

POD2MAN_PATH = /usr/perl5/$(PERL_VERSION)/bin

COMPONENT_BUILD_ENV +=  PATH="$(PATH):$(POD2MAN_PATH)"

# build against libusb-1.0 library
CONFIGURE_ENV += LIBUSB_CFLAGS="-I$(USRINCDIR)/libusb-1.0"
CONFIGURE_ENV += LIBUSB_LIBS="-lusb-1.0"

# build against pcsc-lite library
CONFIGURE_ENV += CFLAGS="$(CFLAGS) -I$(USRINCDIR)/PCSC"
CONFIGURE_ENV += LDFLAGS="-lpcsclite"

# options needed for configure, otherwise default will install into /usr/local
CONFIGURE_OPTIONS +=    --exec-prefix=$(USRLIBDIR64)
CONFIGURE_OPTIONS +=    --enable-libusb
CONFIGURE_OPTIONS +=    --enable-usbdropdir=$(USRLIBDIR64)/pcsc/drivers

REQUIRED_PACKAGES += library/libusb-1
REQUIRED_PACKAGES += library/security/pcsc/pcsclite
