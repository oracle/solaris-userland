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

COMPONENT_VERSION=	2.3rc1
COMPONENT_ARCHIVE_HASH=	sha256:42e85110a65dde8b897970264aa0e42e0646a85690a189dc1dfbb3440bab2734
TPNO=			52286
IPS_COMPONENT_VERSION=	2.2.100

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
CONFIGURE_OPTIONS.64 +=	--with-components=all
CONFIGURE_OPTIONS.32 +=	--with-components=libcups
CONFIGURE_OPTIONS.64 +=	--bindir=/usr/bin
CONFIGURE_OPTIONS.32 +=	--bindir=/usr/bin/$(MACH32)
CONFIGURE_OPTIONS.64 +=	--sbindir=/usr/sbin
CONFIGURE_OPTIONS +=	--localedir=$(USRSHARELOCALEDIR)
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS +=	--with-cachedir=$(VARDIR)/cache/cups
CONFIGURE_OPTIONS +=	--with-fontpath=$(USRSHAREFONTSDIR)
CONFIGURE_OPTIONS +=	--with-logdir=$(VARDIR)/log/cups
CONFIGURE_OPTIONS +=	--with-rundir=/system/volatile/cups
CONFIGURE_OPTIONS +=	--with-smfmanifestdir=$(LIBDIR)/svc/manifest/application
CONFIGURE_OPTIONS +=	--without-rcdir
CONFIGURE_OPTIONS +=	--with-cups-user=lp
CONFIGURE_OPTIONS +=	--with-privateinclude=$(USRINCDIR)/cups/private
CONFIGURE_OPTIONS +=	--with-cups-group=lp
CONFIGURE_OPTIONS +=	--disable-static
#CONFIGURE_OPTIONS +=	--with-optim=-g0 -g
# CDSA is first choice GNU TLS is second openssl is not supported
#CONFIGURE_OPTIONS +=	--enable-gnutls
CONFIGURE_OPTIONS +=	--without-php
CONFIGURE_OPTIONS +=	--with-python

# cups do not use DESTDIR but DSTROOT
COMPONENT_INSTALL_ARGS=	DSTROOT="$(PROTO_DIR)"

COMPONENT_PREP_ACTION += (cd $(@D) ; \
   PATH="/usr/gnu/bin:$(PATH)" autoconf -f )

COMPONENT_PRE_CONFIGURE_ACTION += $(CLONEY) $(SOURCE_DIR) $(@D)

# Make sure that "install-sh -s" calls "strip -x" and not "strip";
# we want to remove debugging data but not the symbols.
COMPONENT_INSTALL_ENV += STRIPPROG="strip -x"

# Create package objects lists with mutually exclusive contents.
# cups-libs:	cups API
# cups:		cups scheduler
CUPSOBJ =	cups.pkgobjs
CUPSLIBSOBJ =	cups-libs.pkgobjs
BCUPSOBJ =	$(BUILD_DIR)/$(CUPSOBJ)
BCUPSLIBSOBJ =	$(BUILD_DIR)/$(CUPSLIBSOBJ)
METADATA_TEMPLATE=

ADD_TO_HEAP =		^file|^link|^dir .*path=var.*/cups|^dir .*path=usr/lib/cups/
EXCLUDE_FROM_HEAP =	etc/pam.d/cups
EXCLUSION_CRITERIA =	usr/include/.*\.h|usr/lib.*/lib.*\.so.*

new-manifest:	$(BCUPSOBJ) $(BCUPSLIBSOBJ)

$(CHECKED): new-manifest

# all.pkgobjs: collects pkg-rules for files + links + conf.dirs (/etc/samba/) + state dirs (/var/samba/)
# - rules for 'path=mangled' are not reasonable
# - objects in etc/pam.d/cups have conflict with system/core-os
$(BUILD_DIR)/all.pkgobjs:	$(GENERATED).p5m
	nawk '{if (sub(/\\$$/,"")) printf "%s", $$0; else print $$0}' $(GENERATED).p5m \
		| egrep -v 'path=mangled' \
		| /usr/xpg4/bin/egrep -e '$(ADD_TO_HEAP)' \
		| /usr/xpg4/bin/egrep -v -e '$(EXCLUDE_FROM_HEAP)' > $@

# cups.pkgobjs: objects of scheduler
# if diff will find a differences against CUPSOBJ it returns !0 then make fails
# note: in such case the diff seen in build-log can be directly applied to samba.pkgobjs in component dir by gpatch
$(BCUPSOBJ): $(BUILD_DIR)/all.pkgobjs
	/usr/xpg4/bin/egrep -v -e '$(EXCLUSION_CRITERIA)' $(BUILD_DIR)/all.pkgobjs >$@
	gdiff -u $(CUPSOBJ) $@

# cups-libs.pkgobjs: objects of cups API pkg
# - extract lib.+\.{so[.<ver>[.<subver>]]|h} from all.pkgobjs actions
# if diff will find a differences against CUPSLIBSOBJ it returns !0 then make fails
# note: in such case the diff seen in build-log can be directly applied to libsmbclient.pkgobjs in component dir by gpatch
$(BCUPSLIBSOBJ): $(BUILD_DIR)/all.pkgobjs
	/usr/xpg4/bin/egrep -e '$(EXCLUSION_CRITERIA)' $(BUILD_DIR)/all.pkgobjs >$@
	gdiff -u $(CUPSLIBSOBJ) $@

REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/libusb-1
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/perl-526
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/iconv
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/network/avahi
