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
# Build requirements, needed before inclusion of shared-macros.
BUILD_BITS=		64
COMPILER=		gcc
include ../../make-rules/shared-macros.mk

# Component information, used for download and packaging.
# -------------------------------------------------------
# BIND version encoding within IPS, our rule is:
#   BIND <x>.<y>.<z>        =>   IPS <x>.<y>.<z>.0.<s>
#   BIND <x>.<y>.<z>-P<n>   =>   IPS <x>.<y>.<z>.<n>.<s>
# <s> is for Solaris specific modifications as necessary.
COMPONENT_NAME=		bind
COMPONENT_VERSION=	9.11.6
IPS_COMPONENT_VERSION=	9.11.6.0.0
HUMAN_VERSION=		$(COMPONENT_VERSION)
COMPONENT_BUGDB=	service/dns-server
TPNO=			50036
COMPONENT_PROJECT_URL=	http://www.isc.org/software/bind/

# hash from: sha256sum $(COMPONENT_ARCHIVE) | sed 's/\(.[^ ]*\).*/sha256:\1/'
COMPONENT_ARCHIVE_HASH=	\
	sha256:4499007f3a6b8bba84fc757053caeabf36466d6f7d278baccef9fd109beac6d4

COMPONENT_ARCHIVE_URL=	\
	http://ftp.isc.org/isc/bind9/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)

# ISC OpenPGP Key obtained from https://ftp.isc.org/isc/pgpkeys
# Added to repository using command:
#   gpg2 --homedir "$(hg root)/tools/.gnupg" --import codesign2019.txt
# Care must be taken if mercurial merge required!
#   see ../../doc/makefile-variables.txt
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sha512.asc

# For check_anitya target, see 'gmake print-ANITYA_API_URL'
COMPONENT_ANITYA_ID=	14923

# Test Targets.
# -------------
TEST_TARGET=		$(TEST_64)
SYSTEM_TEST_TARGET=	$(SYSTEM_TEST_64)

include $(WS_MAKE_RULES)/common.mk

# Component Configuration.
# ------------------------

# PYVER is important for packaging and computing requisites.
PYTHON_VERSION =	3.4
PKG_MACROS +=		PYVER=$(PYTHON_VERSION)

# Patches to configure.in require configure script re-creation.
# COMPONENT_PREP_ACTION +=(cd $(@D); autoreconf -vfi);

# Specify "configure" options and features.
# FYI, The configure options are displayed by 'named -V'.
CONFIGURE_OPTIONS +=	--enable-full-report
# Python: specifying version helps with packaging.
CONFIGURE_OPTIONS +=	--with-python=$(PYTHON.$(PYTHON_VERSION))
# - libtool: Build dynamic libraries, static libraries are not shipped.
CONFIGURE_OPTIONS +=	--with-libtool
# - openssl: use openssl, required for DNSSEC features.
CONFIGURE_OPTIONS +=	--with-openssl=/usr
# - pkcs11: Use openSSL pkcs11 engine
CONFIGURE_OPTIONS +=	--with-pkcs11=/usr/lib/$(MACH64)/libpkcs11.so.1
# - Use xml2-config found uder /usr without checking its version.
CONFIGURE_OPTIONS +=	--with-libxml2=$(USRDIR)
CONFIGURE_OPTIONS +=	--enable-threads
CONFIGURE_OPTIONS +=	--enable-devpoll
# - Enabled fixed [order] resource-record sets for backward compatibility.
# - Requires more memory to store the sets so is not the default.
CONFIGURE_OPTIONS +=	--enable-fixed-rrset
# Increases length of several queues by ultimately defining TUNE_LARGE.
CONFIGURE_OPTIONS +=	--with-tuning=large
# Enable large file support.
CONFIGURE_OPTIONS +=	--enable-largefile

# Override / set specific pathnames:
# - DNS libraries are in usr/lib/dns - Override settings from configure.mk
CONFIGURE_LIBDIR.64 =	$(CONFIGURE_PREFIX)/lib/dns/$(MACH64)
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS +=	--with-randomdev=/dev/random
CONFIGURE_OPTIONS +=	--with-gssapi=krb5-config
CONFIGURE_OPTIONS +=	--with-docbook-xsl=/usr/share/sgml/docbook
# - Python modules in vendor directory
CONFIGURE_OPTIONS +=	--with-python-install-dir=$(PYTHON_VENDOR_PACKAGES.32)

# Compiler and compiler options:
# - configure will add "-mt" to CC which is already set in CFLAGS, so override.
CONFIGURE_OPTIONS +=	CC="$(CC)"

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =		$(ADIHEAP_ENABLE)
ADISTACK_MODE =		$(ADISTACK_ENABLE)

# BIND 'install' target does not install html or pdf files into
# PROTO_DIR.  While it is possible to instruct package generation to
# gather files direct from SOURCE_DIR, it requires a fair amount of
# work at each update to make sure p5m files are in order.  By
# delivering it where we intend it to be, the Userland framework does
# the right thing.
#
# Note, patches add links to this documentation.
#
COMPONENT_POST_INSTALL_ACTION +=	\
	$(MKDIR) -p $(PROTO_DIR)/usr/share/doc/bind/html; \
	$(FIND) $(SOURCE_DIR)/doc/arm -name "*.html" \
	    -exec cp {} $(PROTO_DIR)/usr/share/doc/bind/html \; ; \
	$(FIND) $(SOURCE_DIR)/doc/arm \
	    -name isc-logo.pdf -prune -o -name "*.pdf" \
	    -exec cp {} $(PROTO_DIR)/usr/share/doc/bind \; ;

# Identify source_file files in hard links for manifest generator.
PKG_HARDLINKS +=	usr/sbin/named

# Test configuration.
# -------------------
# Target 'test' is run from PROTO_DIR, while 'system-test' uses root
# ("/") directory.
#
# BIND has its own test target which requires IP addresses 10.53.0.1
# through 10.53.0.8 to be configured.  Those are not normally
# configured on the build server so for now do some basic testing
# rather than $(NO_TESTS).
#
TEST_HOSTNAME :=	$(shell uname -n)	# To redact from test output.
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "s|$(PROTO_DIR)||g" ' \
	'-e "s|$(BUILD_DIR)|\\$$(BUILD_DIR)|g" ' \
	'-e "s|<id:[^>]*>$$|<id:REDACTED>|" ' \
	'-e "s| id: [0-9].*$$| id: REDACTED|g" ' \
	'-e "s| COOKIE: [^ ]* | COOKIE: REDACTED |g" ' \
	'-e "/;; WHEN:/d" ' \
	'-e "/;; Query time:/d" ' \
	'-e "/^REDACT:/d" ' \
	'-e "s|$(TEST_HOSTNAME)*[^$$ ]*|\\$$(HOSTNAME)|g" ' \
	'-e "s|rcvd: [0-9]*|rcvd: REDACTED|"g ' \
	'-e "s|bytes [0-9]*|bytes REDACTED|"g ' \
	'-e "s|$(COMPONENT_VERSION)|\\$$(COMPONENT_VERSION)|g" '

COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ENV +=	LD_LIBRARY_PATH=$(PROTO_DIR)$(CONFIGURE_LIBDIR.64)
COMPONENT_TEST_CMD =	ksh  $(COMPONENT_DIR)/Solaris/testing.ksh
COMPONENT_TEST_ARGS =	-d $(BUILD_DIR)/test/config
COMPONENT_TEST_ARGS +=	-p $(PROTO_DIR)

COMPONENT_SYSTEM_TEST_TARGETS =
COMPONENT_SYSTEM_TEST_CMD =	$(COMPONENT_TEST_CMD)
COMPONENT_SYSTEM_TEST_ARGS =	-d /tmp/BIND/test/config
COMPONENT_SYSTEM_TEST_ARGS +=	-p /

COMPONENT_TEST_TRANSFORMS +=	\
	'-e "s|/tmp/BIND|\\$$(BUILD_DIR)|g" '

# This is a handy test target for developer.  Please leave functional.
test-named-version:
	LD_LIBRARY_PATH=$(PROTO_DIR)$(CONFIGURE_LIBDIR.64) \
		$(PROTO_DIR)$(CONFIGURE_SBINDIR.64)/named -V; \

# Package dependencies.
# ---------------------
# Created by 'gmake REQUIRED_PACKAGES', manually verified.
REQUIRED_PACKAGES += library/json-c
REQUIRED_PACKAGES += library/libedit
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/security/openssl/openssl-fips-140
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += network/dns/bind
REQUIRED_PACKAGES += runtime/python-34
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/smf
