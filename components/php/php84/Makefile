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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64
# Must use gcc because of 21090206
COMPILER =		gcc
CTF_MODE =		relaxed

include ../../../make-rules/shared-macros.mk

MAJOR_VERSION=8.4
MICRO_VERSION=10

COMPONENT_NAME=		php
COMPONENT_VERSION=	$(MAJOR_VERSION).$(MICRO_VERSION)
UL_PHP_MINOR_VERSION=	$(MAJOR_VERSION)
COMPONENT_PROJECT_URL=	http://php.net/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=\
    sha256:14983a9ef8800e6bc2d920739fd386054402f7976ca9cd7f711509496f0d2632
COMPONENT_ARCHIVE_URL=	https://www.php.net/distributions/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	57896

COMPONENT_BAID=		336218

include $(WS_MAKE_RULES)/common.mk
include $(PHP_TOP_DIR)/php.mk

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

PKG_MACROS+= MAJOR_VERSION=$(MAJOR_VERSION)
PKG_MACROS+= EXTENSIONS=no-debug-zts-20240924

# NOTES: See http://php.net/manual/en/install.unix.apache2.php
# The contents of files/php7.3.conf would normally go into Apache's httpd.conf
# but we put it in a separate file for our convenience.
# See http://php.net/manual/en/configuration.file.php
# The contents of files/extensions.ini would normally go into php.ini file

# but is in a separate file for our convenience.
# Both of these files are hand crafted.

# need GCC_ROOT/bin for configure, usr/sbin for dtrace 
export PATH=$(GCC_ROOT)/bin:$(GNUBIN):$(USRBINDIR):$(USRSBINDIR)

# We patch configure.in to allow building just modules (no SAPI's), e.g. intl.
# Since we are sharing the source, regenerate configure here.
COMPONENT_PREP_ACTION += (cd $(SOURCE_DIR) ; autoreconf) ;

include enable-extensions.mk

CONFIGURE_OPTIONS += --enable-dtrace

# Without this, the build seems to interrogate GCC for potential library
# search path information and then embed it into the RUNPATH of selected ELF
# files it creates.  This includes GCC private directories
CONFIGURE_OPTIONS += --disable-rpath

ETCPHPDIR= $(ETCDIR)/php/$(MAJOR_VERSION)
VARPHPDIR= $(VARDIR)/php/$(MAJOR_VERSION)
# .conf files go under /etc, not /usr
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCPHPDIR)
# var doesn't go under /usr either!
CONFIGURE_OPTIONS +=	--localstatedir=$(VARPHPDIR)
# Nor does php.ini and its friends.
CONFIGURE_OPTIONS +=	--with-config-file-path=$(ETCPHPDIR)
CONFIGURE_OPTIONS +=	--with-config-file-scan-dir=$(ETCPHPDIR)/conf.d
# Nor does PEAR (default: $PREFIX/lib/php)
CONFIGURE_OPTIONS +=	--with-pear=$(VARPHPDIR)/pear
# No debug php's.  They won't build anyways.
CONFIGURE_OPTIONS +=	--disable-phpdbg
CONFIGURE_OPTIONS +=	--disable-phpdbg-debug

# if debug is desired do this
# https://bugs.php.net/bugs-generating-backtrace.php
ifdef DEBUG
CONFIGURE_OPTIONS +=    --enable-debug
endif

# icu's switch to g++
# 21090206 icu should build C++ to C++11
# causes this in php forcing php to switch also
# 23003672 PHP fails all or most tests
CXXFLAGS += -std=c++11
CONFIGURE_OPTIONS += CXXFLAGS="$(CXXFLAGS)"

# Use openldap
LDFLAGS += -lldap
# but ensure "make" gets the point
COMPONENT_BUILD_ARGS += LDAP_SHARED_LIBADD="-lldap"

CFLAGS += -std=gnu99

# Disable SSLv2 and SSLv3 for security reasons
CFLAGS += -DOPENSSL_NO_SSL2
CFLAGS += -DOPENSSL_NO_SSL3

PROTOUSRPHPVERDIR = $(PROTO_DIR)/$(CONFIGURE_PREFIX)

COMPONENT_PRE_CONFIGURE_ACTION += $(MKDIR) $(BUILD_DIR)/temp;

# Remove unnecessary default library path which breaks OpenSSL 3 linking.
COMPONENT_POST_CONFIGURE_ACTION += \
	$(GSED) -i '/L\/usr\/openssl\/3\/lib/s/-L\/usr\/lib\/$(MACH64)//' \
	    $(BUILD_DIR_64)/Makefile ;

COMPONENT_BUILD_ENV += TMPDIR=$(BUILD_DIR)/temp
CONFIGURE_ENV += TMPDIR=$(BUILD_DIR)/temp
COMPONENT_INSTALL_ENV += TMPDIR=$(BUILD_DIR)/temp

# In order to build pear on public build machine every engineer needs to use
# his own temporary directory and not /var/tmp/pear. Unfortunately this
# temporary directory is then stored into pear.conf file. So we need to correct
# it back to the default which would be used without us specifying TMPDIR -
# that is to /tmp/pear/temp
COMPONENT_POST_INSTALL_ACTION += \
	../fix_temp_dirs.pl \
	    $(PROTO_DIR)/etc/php/$(MAJOR_VERSION)/pear.conf \
	    $(BUILD_DIR)/temp ;

# Adapted from PHP 5.3 Makefile.
# Creates alternate versions of the scripts needed for building extensions
# separately, since the generated versions of these scripts hardcode
# configuration for a PHP that is installed on the system.
COMPONENT_POST_INSTALL_ACTION += \
	( set -e; \
	mkdir -p proto-scripts; \
	cat $(BUILD_DIR_64)/scripts/phpize | \
	 sed -e "s,^\#!/bin/sh,\#!$(CONFIG_SHELL)," | \
	 sed -e "s%^prefix=.*%prefix=$(PROTOUSRPHPVERDIR)%" | \
	 sed -e "s%^includedir=.*%includedir=$(PROTOUSRPHPVERDIR)/include/php%" | \
	 sed -e "s%^phpdir=.*%phpdir=$(SOURCE_DIR)%"  | \
	 sed -e "s%phpdir/phpize.m4%phpdir/scripts/phpize.m4%" | \
	 sed -e "s%$PHP_AUTOCONF   || exit 1%$PHP_AUTOCONF -f   || exit 1%" | \
	 sed -e "s%$PHP_AUTOHEADER || exit 1%$PHP_AUTOHEADER -f || exit 1%" | \
	 sed -e 's%(cd "$$phpdir" && cp $$FILES_BUILD "$$builddir"/build)%(cd "$$phpdir/build" \&\& cp $$FILES_BUILD "$$builddir"/build)%' | \
	 sed -e "s%^builddir=.*%builddir=$(BUILD_DIR_64)%" \
	 > proto-scripts/phpize-proto ; \
	chmod 755 proto-scripts/phpize-proto ) ; \
	( set -e; \
	 cat $(BUILD_DIR_64)/scripts/php-config | \
	 sed -e "s,^\#! /bin/sh,\#!$(CONFIG_SHELL)," | \
	 sed -e "s%^prefix=.*%prefix=$(PROTOUSRPHPVERDIR)%" | \
	 sed -e "s%^include_dir=.*%include_dir=$(PROTOUSRPHPVERDIR)/include/php%" \
	 > proto-scripts/php-config-proto ; \
	chmod 755 proto-scripts/php-config-proto ) ;

TESTS_DISABLED += ext/curl/tests/bug48203_multi.phpt
TESTS_DISABLED += ext/curl/tests/curl_basic_018.phpt
TESTS_DISABLED += ext/curl/tests/curl_multi_getcontent_basic3.phpt
TESTS_DISABLED += ext/curl/tests/curl_setopt_ssl.phpt
TESTS_DISABLED += ext/curl/tests/ext/curl/tests/curl_setopt_ssl.phpt
TESTS_DISABLED += ext/date/tests/bug33532.phpt
TESTS_DISABLED += ext/date/tests/strtotime2.phpt
TESTS_DISABLED += ext/dba/tests/dba_db4_018.phpt
TESTS_DISABLED += ext/gd/tests/gh13082.phpt
TESTS_DISABLED += ext/gd/tests/gh16559.phpt
TESTS_DISABLED += ext/openssl/tests/bug72333.phpt
TESTS_DISABLED += ext/openssl/tests/bug77390.phpt
TESTS_DISABLED += ext/pcntl/tests/pcntl_cpuaffinity.phpt
TESTS_DISABLED += ext/pcntl/tests/pcntl_getcpu.phpt
TESTS_DISABLED += ext/pcntl/tests/pcntl_getpriority_error.phpt
TESTS_DISABLED += ext/pcntl/tests/pcntl_setpriority_error.phpt
TESTS_DISABLED += ext/posix/tests/posix_isatty_value_errors.phpt
TESTS_DISABLED += ext/sockets/tests/socket_cmsg_rights.phpt
TESTS_DISABLED += ext/soap/tests/bugs/bug49278.phpt
TESTS_DISABLED += ext/soap/tests/bugs/bug62900.phpt
TESTS_DISABLED += ext/standard/tests/file/lstat_stat_variation10.phpt
TESTS_DISABLED += ext/standard/tests/file/lstat_stat_variation18.phpt
TESTS_DISABLED += ext/standard/tests/file/touch_basic.phpt
TESTS_DISABLED += ext/standard/tests/streams/bug74556.phpt
TESTS_DISABLED += ext/standard/tests/streams/gh9590-001.phpt
TESTS_DISABLED += ext/standard/tests/streams/gh9590-002.phpt
TESTS_DISABLED += ext/standard/tests/streams/proc_open_bug60120.phpt
TESTS_DISABLED += ext/standard/tests/streams/proc_open_bug64438.phpt
TESTS_DISABLED += ext/xsl/tests/maxTemplateVars_modification_validation_bypass.phpt
TESTS_DISABLED += sapi/cli/tests/022.phpt
TESTS_DISABLED += sapi/fpm/tests/bug68591-conf-test-listen-group.phpt
TESTS_DISABLED += sapi/fpm/tests/bug68591-conf-test-listen-owner.phpt
TESTS_DISABLED += sapi/fpm/tests/bug80024-socket-reduced-inherit.phpt
TESTS_DISABLED += sapi/fpm/tests/fcgi-env-pif-apache-handler-uds.phpt
TESTS_DISABLED += sapi/fpm/tests/socket-uds-basic.phpt
TESTS_DISABLED += sapi/fpm/tests/socket-uds-numeric-ugid-nonroot.phpt
TESTS_DISABLED += sapi/fpm/tests/status-ping.phpt
TESTS_DISABLED += tests/output/stream_isatty_out-err.phpt
TESTS_DISABLED += Zend/tests/arginfo_zpp_mismatch.phpt

# Some tests are known to hang or they have inconsistent results
COMPONENT_PRE_TEST_ACTION += ( \
	list1='$(TESTS_DISABLED)' ; for f in $$list1 ; do \
	   $(RM) $(SOURCE_DIR)/$$f; \
	done ) ;

# need to avoid clashes in /var/tmp directory
COMPONENT_PRE_TEST_ACTION += ( rm -rf $(BUILD_DIR)/tmp-$(MACH); \
	mkdir $(BUILD_DIR)/tmp-$(MACH) );
# enable for tests openssl plugin module from build directory
COMPONENT_PRE_TEST_ACTION += ( \
	gsed -e 's|^;extension=openssl|extension=$(BUILD_DIR_64)/modules/openssl.so|' \
	  $(SOURCE_DIR)/php.ini-production > $(BUILD_DIR_64)/sapi/cli/php.ini );
COMPONENT_TEST_ENV += TMPDIR=$(BUILD_DIR)/tmp-$(MACH)
# test failures; keep going
COMPONENT_TEST_ARGS += -k -i
# some tests go to internet and others behave differently when proxy is set
COMPONENT_TEST_ENV += http_proxy=
COMPONENT_TEST_ENV += SKIP_ONLINE_TESTS=1
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master
COMPONENT_TEST_TRANSFORMS += \
    '-e "/^make/d" ' \
    '-e "/^Exts skipped/s;(.*);;" ' \
    '-e "/^TEST RESULT SUMMARY$$/,\$$p" ' \
    '-e "/.*/d" '

CLEAN_PATHS += proto-scripts

# Add directory for generate check
GENERATE_PROTO_DIRS += files^files

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/icu
REQUIRED_PACKAGES += library/gd
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/oniguruma
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += system/dtrace
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/management/snmp/net-snmp
REQUIRED_PACKAGES += system/network/ldap/openldap
REQUIRED_PACKAGES += text/gnu-sed
