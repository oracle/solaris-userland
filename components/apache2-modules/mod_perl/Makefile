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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mod_perl
COMPONENT_VERSION=	2.0.11
COMPONENT_PROJECT_URL=	https://perl.apache.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:ca2a9e18cdf90f9c6023e786369d5ba75e8dac292ebfea9900c29bf42dc16f74
COMPONENT_ARCHIVE_URL=	https://www.apache.org/dist/perl/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	utility/apache
COMPONENT_ANITYA_ID=	1998

TPNO=			63801

BUILD_STYLE= justmake
CONFIGURE_DEFAULT_DIRS= no
SYSTEM_TEST_TARGET= build $(SYSTEM_TEST_64)

include $(WS_MAKE_RULES)/common.mk

APACHE_USR_PREFIX=/usr/apache2/2.4

AP_PERL5LIB=$(APACHE_USR_PREFIX)/lib/perl
AP_PERL5BIN=$(APACHE_USR_PREFIX)/bin
PERLMAN=$(APACHE_USR_PREFIX)/man

COMPONENT_PRE_BUILD_ACTION += ( \
	cd $(@D); $(PERL) Makefile.PL \
	INSTALLDIRS=perl \
	INSTALLSITELIB=$(AP_PERL5LIB) \
	INSTALLARCHLIB=$(AP_PERL5LIB) \
	INSTALLSITEARCH=$(AP_PERL5LIB) \
	INSTALLPRIVLIB=$(AP_PERL5LIB) \
	SITEARCHEXP=$(AP_PERL5LIB) \
	SITELIBEXP=$(AP_PERL5LIB) \
	INSTALLMAN1DIR=$(PERLMAN)/man1 \
	INSTALLMAN3DIR=$(PERLMAN)/man3 \
	INSTALLSCRIPT=$(AP_PERL5BIN) \
	MP_APXS=$(APACHE_USR_PREFIX)/bin/apxs; \
	);

# I haven't find a way to make MakeMaker write 'gmake' as a make program into
# the generated Makefile files. This is hack, but it makes the thing to compile.
COMPONENT_PRE_BUILD_ACTION += ( \
	cd $(@D); \
        find . -name Makefile | xargs perl -pi -e 's/^MAKE = make/MAKE = gmake/' \
	);

COMPONENT_TEST_TARGETS=	test
COMPONENT_SYSTEM_TEST_TARGETS=	system_test

COMPONENT_PRE_TEST_ACTION= ( \
	$(MKDIR) $(@D)/Solaris ; \
	$(CP) -f /etc/apache2/2.4/original/httpd.conf $(@D)/Solaris; \
	$(LN) -s ../Solaris $(@D)/ModPerl-Registry/Solaris; \
	$(LN) -s ../Solaris $(@D)/Apache-Reload/Solaris; \
	$(GSED) -e '/IfDefine/d' \
		-e '/mpm_worker_module/d' \
		-e '/mpm_event_module/d' \
		-e '/auth_digest_module/s/^\#//' \
		-e '/deflate_module/s/^\#//' \
		-e '/proxy_module/s/^\#//' \
		-e '/proxy_http_module/s/^\#//' \
		-e '/rewrite_module/s/^\#//' \
		-i $(@D)/Solaris/httpd.conf )

COMPONENT_TEST_TRANSFORMS += \
	-n \
	'-e "/^Result:/p"' \
	'-e "/Fail/p"' \
	'-e "/^cd /p"'

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += library/apr-1
REQUIRED_PACKAGES += library/apr-util-1
REQUIRED_PACKAGES += library/perl-5/CGI-532
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/server/apache-24
