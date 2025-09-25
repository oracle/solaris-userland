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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		32_and_64
PREFERRED_BITS =	64
COMPILER =		gcc
CTF_MODE =		off	# C++
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		cups

COMPONENT_VERSION=	2.4.14
COMPONENT_ARCHIVE_HASH=	sha256:660288020dd6f79caf799811c4c1a3207a48689899ac2093959d70a3bdcb7699
COMPONENT_BAID=		343753

COMPONENT_PROJECT_URL=	http://www.cups.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC)-source.tar.gz
COMPONENT_ARCHIVE_URL=	\
	https://github.com/OpenPrinting/cups/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/cups
COMPONENT_ANITYA_ID=	380

TEST_32 =		$(SKIP_TEST)
system-test:    	$(SYSTEM_TESTS_NOT_IMPLEMENTED)

include $(WS_MAKE_RULES)/common.mk

$(CONFIGURE_32):	LDFLAGS += -m32
$(CONFIGURE_64):	LDFLAGS += -m64

# Ensure dynamic shared objects are linked using same LDFLAGS as executables.
CONFIGURE_ENV +=	DSOFLAGS="$(LDFLAGS)"

CONFIGURE_OPTIONS.32 +=	--with-components=core
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS +=	--with-smfmanifestdir=$(LIBDIR)/svc/manifest/application
CONFIGURE_OPTIONS +=	--with-tls=gnutls
CONFIGURE_OPTIONS +=	--enable-libpaper

COMPONENT_PREP_ACTION += (cd $(@D) ; \
	PATH="/usr/gnu/bin:$(PATH)" autoconf -f )

COMPONENT_PRE_CONFIGURE_ACTION += $(CLONEY) $(SOURCE_DIR) $(@D)

# Make sure that "install-sh -s" calls "strip -x" and not "strip";
# we want to remove debugging data but not the symbols.
COMPONENT_INSTALL_ENV += STRIPPROG="strip -x"

# Work in our test dir, not /tmp.
COMPONENT_TEST_ENV += CUPS_TESTBASE=$(COMPONENT_TEST_DIR)/test/work
# Keep just fails.
COMPONENT_TEST_TRANSFORMS = \
	'-e "/^httpAddrGetList.*: FAIL/d" ' \
	'-e "/: FAIL/p" ' \
	'-e "/FAIL: /p" ' \
	'-e "/ tests failed./p" ' \
	'-e "d" '

REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/libpaper
REQUIRED_PACKAGES += library/libusb-1
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/network/avahi
