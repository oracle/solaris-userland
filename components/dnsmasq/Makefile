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
# Copyright (c) 2013, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

# i18n component requires GNU xgettext
PATH=$(GNUBIN):$(USRBINDIR):$(USRSBINDIR)

COMPONENT_NAME=		dnsmasq
COMPONENT_VERSION=	2.90
COMPONENT_BAID=		159275
COMPONENT_ARCHIVE_HASH=	\
	sha256:8f6666b542403b5ee7ccce66ea73a4a51cf19dd49392aaccd37231a2c51b303b
COMPONENT_PROJECT_URL=	https://www.thekelleys.org.uk/$(COMPONENT_NAME)
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	service/dnsmasq
COMPONENT_ANITYA_ID=	444

BUILD_STYLE= justmake
TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

LDFLAGS += $(ASLR_ENABLE)
CPPFLAGS += $(CPP_XPG6MODE)
CPPFLAGS += $(CPP_LARGEFILES)

# build
COMPONENT_BUILD_ENV = PATH=$(PATH)
COMPONENT_BUILD_ENV += PKG_CONFIG_PATH=/usr/lib/$(MACH64)/pkgconfig
COMPONENT_BUILD_ARGS += MACH64=$(MACH64)
COMPONENT_BUILD_ARGS += PATH="$(PATH)"
COMPONENT_BUILD_ARGS += CC="$(CC)"
# variables announced to redefine in component Makefile
COMPONENT_BUILD_ARGS += USRDIR=$(PREFIX)
COMPONENT_BUILD_ARGS += LIBDIR=$(USRLIBDIR)/inet
# probably by a previous mistake we install dnsmasq also here
COMPONENT_BUILD_ARGS += BINDIR=$(USRLIBDIR)/inet
COMPONENT_BUILD_ARGS += MANDIR=$(USRSHAREMANDIR)
COMPONENT_BUILD_ARGS += LOCALEDIR=$(USRSHARELOCALEDIR)
COMPONENT_BUILD_ARGS += BUILDDIR=$(BUILD_DIR_64)/src
COMPONENT_BUILD_ARGS += DESTDIR=$(PROTO_DIR)
COMPONENT_BUILD_ARGS += CFLAGS="$(CFLAGS)"
COMPONENT_BUILD_ARGS += LDFLAGS="$(LD_OPTIONS) $(LDFLAGS) $(CC_BITS)"
COMPONENT_BUILD_ARGS += COPTS="-DHAVE_LIBIDN2 -DHAVE_DNSSEC $(CPPFLAGS)"
COMPONENT_BUILD_ARGS += RPM_OPT_FLAGS=""
COMPONENT_BUILD_ARGS += LIBS="$(LIBS)"
COMPONENT_BUILD_ARGS += PKG_CONFIG=pkg-config
COMPONENT_BUILD_ARGS += INSTALL=install
COMPONENT_BUILD_ARGS += MSGMERGE=msgmerge
COMPONENT_BUILD_ARGS += MSGFMT=gmsgfmt
COMPONENT_BUILD_ARGS += XGETTEXT=gxgettext
COMPONENT_BUILD_TARGETS = all-i18n
# install
COMPONENT_INSTALL_ENV = PATH=$(PATH)
COMPONENT_INSTALL_ENV += PKG_CONFIG_PATH=/usr/lib/$(MACH64)/pkgconfig
COMPONENT_INSTALL_ARGS += MACH64=$(MACH64)
COMPONENT_INSTALL_ARGS += PATH="$(PATH)"
COMPONENT_INSTALL_ARGS += CC="$(CC)"
# variables announced to redefine in component Makefile
COMPONENT_INSTALL_ARGS += USRDIR=$(PREFIX)
COMPONENT_INSTALL_ARGS += LIBDIR=$(USRLIBDIR)/inet
COMPONENT_INSTALL_ARGS += BINDIR=$(USRLIBDIR)/inet
COMPONENT_INSTALL_ARGS += MANDIR=$(USRSHAREMANDIR)
COMPONENT_INSTALL_ARGS += LOCALEDIR=$(USRSHARELOCALEDIR)
COMPONENT_INSTALL_ARGS += BUILDDIR=$(BUILD_DIR_64)/src
COMPONENT_INSTALL_ARGS += DESTDIR=$(PROTO_DIR)
COMPONENT_INSTALL_ARGS += CFLAGS="$(CFLAGS)"
COMPONENT_INSTALL_ARGS += LDFLAGS="$(LD_OPTIONS) $(LDFLAGS) $(CC_BITS)"
COMPONENT_INSTALL_ARGS += COPTS="-DHAVE_LIBIDN2 -DHAVE_DNSSEC $(CPPFLAGS)"
COMPONENT_INSTALL_ARGS += RPM_OPT_FLAGS=""
COMPONENT_INSTALL_ARGS += LIBS="$(LIBS)"
COMPONENT_INSTALL_ARGS += PKG_CONFIG=pkg-config
COMPONENT_INSTALL_ARGS += INSTALL=install
COMPONENT_INSTALL_ARGS += MSGMERGE=msgmerge
COMPONENT_INSTALL_ARGS += MSGFMT=gmsgfmt
COMPONENT_INSTALL_ARGS += XGETTEXT=gxgettext
COMPONENT_INSTALL_TARGETS = install-i18n

REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/libidn2
REQUIRED_PACKAGES += library/security/nettle
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/libc
