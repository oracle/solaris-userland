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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#

# Refer to ../../doc/makefile-variables.txt
#
# Build requirements, needed before inclusion of shared-macros.
BUILD_BITS=		64
COMPILER=		gcc
# Set BINDDEBUG=yes in environment to make this a debug build.
ifeq ($(BINDDEBUG), yes)
gcc_OPT.sparc.64 =	-g
gcc_OPT.i386.64 =	-g
endif

include ../../make-rules/shared-macros.mk

# Component information, used for download and packaging.
# -------------------------------------------------------
# BIND version encoding within IPS, our rule is:
#   BIND <x>.<y>.<z>        =>   IPS <x>.<y>.<z>.0.<s>
#   BIND <x>.<y>.<z>-P<n>   =>   IPS <x>.<y>.<z>.<n>.<s>
# <s> is for Solaris specific modifications as necessary.
COMPONENT_NAME=		bind
COMPONENT_VERSION=	9.18.38
IPS_COMPONENT_VERSION=	$(COMPONENT_VERSION).0.0
HUMAN_VERSION=		$(COMPONENT_VERSION)
COMPONENT_BUGDB=	service/dns-server
COMPONENT_BAID=		336653
COMPONENT_PROJECT_URL=	http://www.isc.org/software/bind/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
	sha256:b11fce934773ec25dd6d7253caeaf9c5bbf073fd327acc29daffeca3987e31a1
COMPONENT_ARCHIVE_URL=	\
	http://downloads.isc.org/isc/bind9/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
# For check_anitya target, https://release-monitoring.org/project/242117
COMPONENT_ANITYA_ID=	242117

# ISC OpenPGP Key obtained from https://ftp.isc.org/isc/pgpkeys
# Added to repository using command:
#   gpg2 --homedir "$(hg root)/tools/.gnupg" --import codesign2021.txt
# Care must be taken if mercurial merge required!
# see ../../doc/makefile-variables.txt
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc

# To use BIND's test target later, need to build in-place, and not use cloney.
# Note that this Makefile does not use BIND's test target.
COMPONENT_PRE_CONFIGURE_ACTION = \
        ($(CP) -rp $(SOURCE_DIR)/. $(@D));
CLONEY :=		echo

# Test Targets.
# -------------
TEST_TARGET=		install $(TEST_64)
SYSTEM_TEST_TARGET=	$(SYSTEM_TEST_64)

# Disable tests since it requires packages that are not available in CBE.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

# Component Configuration.
# ------------------------

# Patches to configure.in require configure script re-creation.
# COMPONENT_PREP_ACTION +=(cd $(@D); autoreconf -vfi);

# Specify "configure" options and features, sorted as per configure usage.
# FYI, The configure options applied are displayed by 'named -V'.
#
# Optional Features
#
# We have no need of static libraries.
CONFIGURE_OPTIONS +=	--disable-static
# use pthread rwlock instead of internal rwlock implementation
CONFIGURE_OPTIONS +=	--enable-pthread-rwlock
# Enabled fixed [order] resource-record sets for backward compatibility.
# - Requires more memory to store the sets so is not the default.
CONFIGURE_OPTIONS +=	--enable-fixed-rrset
# Report values of all configure options
CONFIGURE_OPTIONS +=	--enable-full-report

# Get GSSAPI configuration from krb5-config command.
CONFIGURE_OPTIONS +=	--with-gssapi=krb5-config

# Override / set specific installation pathnames:
# - DNS libraries are in usr/lib/dns - Override settings from configure.mk
CONFIGURE_LIBDIR.64 =	$(CONFIGURE_PREFIX)/lib/dns/$(MACH64)
# CONFIGURE_LIBDIR.32 =	$(CONFIGURE_PREFIX)/lib/dns
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)

# Configure needs to use gmake, not make.
CONFIGURE_ENV += MAKE=$(GMAKE)
# Needed for `cp -a`, `date -r -u` and possibly others.
PATH=$(GNUBIN):$(USRBINDIR)

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =		$(ADIHEAP_ENABLE)
ADISTACK_MODE =		$(ADISTACK_ENABLE)

# $(SOURCE_DIR)/configure is using CC_FOR_BUILD, so append our flags to enable
# PIC, apply CTF_MODE, etc; see ../../make-rules/shared-macros.mk
COMPONENT_BUILD_ARGS += \
	CC_FOR_BUILD='$(CC) $(CONFIGURE_CPPFLAGS) $(CFLAGS)'

# Verbose gmake, the default is not show the executed commands.
ifneq ($(strip $(GMAKE_VERBOSE_MAKEFILE)),)
COMPONENT_BUILD_ARGS +=	V=1
endif

# Documentation.
# --------------
#
# With 9.16.x and beyond we're no longer providing HTML or PDF
# documentation.  An interactive searchable version is available from
# https://bind9.readthedocs.io/ which is added to named(8) via
# ./patches/001-manpage_named_8.patch.  The following action updates
# the link to point to the specific version.  Note, $(@D) used in
# place of $(SOURCE_DIR).
COMPONENT_PREP_ACTION += \
	if grep -q COMPONENT_VERSION  $(@D)/bin/named/named.rst; then \
	    gsed --in-place -e "s/COMPONENT_VERSION/$(COMPONENT_VERSION)/" \
		$(@D)/bin/named/named.rst; \
	fi;

# Test configuration.
# -------------------
#
# Target 'test' is run from PROTO_DIR, while 'system-test' uses root
# ("/") directory.
#
# BIND has its own test target which requires a number of additional
# loopback addresses to be configured.  Those are not normally
# configured on the build server so for now do some basic testing
# rather than $(NO_TESTS).  See also ./README.md file.
#
TEST_HOSTNAME :=	$(shell uname -n)	# To redact from test output.
COMPONENT_TEST_TRANSFORMS +=	\
	'-e "s|$(PROTO_DIR)|\\$$(PROTO_DIR)|g" ' \
	'-e "s|$(MACH64)|\\$$(MACH64)|g" ' \
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
	'-e "s|$(COMPONENT_VERSION)|\\$$(COMPONENT_VERSION)|g" ' \
	'-e "s|^Generating key pair.*|Generating key pair.|" ' \
	'-e "s|dnssec-keygen -K [^ ]* |dnssec-keygen -K /tmp |" ' \
	'-e "s|Ksecure\.example\.+[0-9]*+[0-9]*|Ksecure\.example\.+nnn\.+nnn|" '

COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ENV +=	\
	LD_LIBRARY_PATH=$(PROTO_DIR)$(CONFIGURE_LIBDIR.64)
COMPONENT_TEST_CMD =	ksh  $(COMPONENT_DIR)/Solaris/testing.ksh
COMPONENT_TEST_ARGS =	-k -d $(BUILD_DIR)/test/config
COMPONENT_TEST_ARGS +=	-p $(PROTO_DIR)

COMPONENT_SYSTEM_TEST_TARGETS =
COMPONENT_SYSTEM_TEST_CMD =	$(COMPONENT_TEST_CMD)
COMPONENT_SYSTEM_TEST_ARGS =	-d /tmp/BIND/test/config
COMPONENT_SYSTEM_TEST_ARGS +=	-p /

COMPONENT_TEST_TRANSFORMS +=	\
	'-e "s|/tmp/BIND|\\$$(BUILD_DIR)|g" '

# This is a handy test target for developer.  Please leave functional.
test-named-version test-version: build
	LD_LIBRARY_PATH=$(PROTO_DIR)$(CONFIGURE_LIBDIR.64) \
		$(PROTO_DIR)$(CONFIGURE_SBINDIR.64)/named -V; \

# Check bind.license against source files. The real source should be that
# obtained from the TPNO database . This serves as a reminder.
e = /usr/gnu/bin/echo
test-license: unpack
	@$(MKDIR) -p $(BUILD_DIR)
	@( \
		$e -n '-------------------------------';\
		$e ' Top-level license --------------------------'; \
		$e ; \
		iconv -sct UTF-8 $(SOURCE_DIR)/LICENSE; $e; $e; \
		$e -n '-------------------------------'; \
		$e 'Copyright notices --------------------------'; \
		$e; \
		iconv -sct UTF-8 $(SOURCE_DIR)/COPYRIGHT; \
	)  > $(BUILD_DIR)/bind.license.new;
	@cmp $(COMPONENT_DIR)/bind.license \
	    $(BUILD_DIR)/bind.license.new >/dev/null || \
		( \
		$e 'WARNING: Built license differs:'; \
		$e -n 'diff -w bind.license '; \
		$e '$(subst $(COMPONENT_DIR)/,,$(BUILD_DIR))/bind.license.new'; \
		$e 'ACTION: Check $(BUILD_DIR)/bind.license'; \
		$e ' against TPNO:'; \
		$e '   /ws/bugdb-tools/bin/tpno --arn -ba $(COMPONENT_BAID)';\
		)

# Create bind tar file of build directory and source for testing else where.
test-tar: build
	$(TAR) zcf test.$(COMPONENT_SRC).$(MACH).tar.gz build $(COMPONENT_SRC)
	@$e 'created test.$(COMPONENT_SRC).$(MACH).tar.gz'
	@$e 'unpack into identical directory name on test machine:'
	@pwd

.PHONY: republish test-license test-named-version test-version test-tar

# When updating workspace from one version to another, i.e. 9.16.28 to 9.16.29,
# it seems the publisher package repository needs clearing out;
# which this achieves, simply use `gmake republish` instead of `gmake publish`.
republish:
	$(GMAKE) publish PKGREPO_REMOVE_BEFORE_PUBLISH=yes

# Packaging.
# ---------
# see ./generate directory and use `gmake manifest-update` as necessary.
#

# Package dependencies.
# ---------------------
REQUIRED_PACKAGES += system/library/smf
# Created by 'gmake REQUIRED_PACKAGES', manually verified.
REQUIRED_PACKAGES += library/json-c
REQUIRED_PACKAGES += library/libedit
REQUIRED_PACKAGES += library/libuv
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/nghttp2
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
# Service package requires client package for libraries.
REQUIRED_PACKAGES += network/dns/bind
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += system/core-os

# The following are already identified in ../../make-rules/shared-macros.mk
# REQUIRED_PACKAGES += shell/ksh93
# REQUIRED_PACKAGES += system/library
# REQUIRED_PACKAGES += system/library/libc


