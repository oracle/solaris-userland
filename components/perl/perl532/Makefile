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
# Copyright (c) 2020, 2021, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		perl
COMPONENT_VERSION=	5.32.0
PERL_VERSION_LOCAL=	5.32
COMPONENT_PROJECT_URL=	https://www.perl.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:4d33bb24b5da0d8e45abd4983d04fa9ffb5910f45a6bd8001c56915d7f41dc06
COMPONENT_ARCHIVE_URL=	http://www.cpan.org/src/5.0/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/perl
COMPONENT_ANITYA_ID=	13599

TPNO=			60114

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/configure.mk
include $(WS_MAKE_RULES)/ips.mk

ifeq   ($(strip $(PARFAIT_BUILD)),yes)
PATH=$(PARFAIT_TOOLS):$(SPRO_VROOT)/bin:/usr/bin
endif

CONFIGURE_SCRIPT       = $(SOURCE_DIR)/Configure
COMPONENT_BUILD_ENV   += MAKE=$(GMAKE)
COMPONENT_INSTALL_ENV += DESTDIR="$(PROTO_DIR)"

# Perl remembers the compile options used and suggests them later to any perl
# modules which need compilation too. We do not want a -ffile-prefix-map pointing
# to the perl component directory to be remembered by perl we ship.
gcc_FIX_PATH =

# -Dperl_static_inline="static" turns OFF "static inline".
# This was added because Configure probes
# for static inline (C99 feature) and finds it in our default Studio
# compiler.  But in the ON build of the perl add-ons, sun-solaris, the
# shadow build with gcc 3.4.3 doesn't understand static inline so errors.
#
CONFIGURE_OPTIONS = \
			-de \
			-Dmksymlinks \
			-Ulocincpth= \
                        -Dbin=/usr/perl5/$(PERL_VERSION_LOCAL)/bin \
			-Dcc="gcc" \
			-Dcf_by="perl-bugs" \
			-Dcf_email="first.last@example.invalid" \
			-Dlibperl=libperl.so \
			-Dmyhostname="localhost" \
			-Dmydomain="foobar.example.org" \
			-Dperl_static_inline="static" \
			-Dprefix=/usr/perl5/$(PERL_VERSION_LOCAL) \
                        -Dprivlib=/usr/perl5/$(PERL_VERSION_LOCAL)/lib \
			-Dsitelib=/usr/perl5/site_perl/$(PERL_VERSION_LOCAL) \
			-Dsiteprefix=/usr/perl5/$(PERL_VERSION_LOCAL) \
			-Dvendorlib=/usr/perl5/vendor_perl/$(PERL_VERSION_LOCAL) \
			-Dvendorprefix=/usr/perl5/$(PERL_VERSION_LOCAL) \
			-Duseshrplib \
			-Dusedtrace \
			-Duse64bitall \
                        -Dusethreads \
			-Dlibpth="/lib/64 /usr/lib/64" \
			-Doptimize="$(CFLAGS.gcc)"

#
# The extra Configure parameters (cf_email, cf_by, myhostname) and
# the gawk and sed that follow are attempting to sanatize the
# resulting config.sh of values from our build environment that
# are discoverable in perl's config via "perl -V".
# I'm assuming our compilers live on a path that contains "SUNWspro".
# If that changes the sed filter needs to change.
#
COMPONENT_POST_CONFIGURE_ACTION += \
	(cd $(@D); \
	    cp config.sh config.sh_orig ; \
	    gawk \
	    '/^myuname=/{print $$1" localhost "$$3" "$$5" "$$6" "$$7"\047"} ; \
	    		!/^myuname=/ {print}' config.sh_orig \
		| \
		sed -e "s/[^ ']*SUNWspro[^ ']*//g" > config.sh; \
	diff -u config.sh_orig config.sh || : );

#
# Print just the failed tests
#  - delete everything up to Failed line
#  - delete everything not beginning with tab
#
COMPONENT_TEST_TRANSFORMS += \
	'-e "1,/^Failed /d"' \
	'-e "/^[^	]/,/$$/d"'

#
# perl's install path for sparc is based off the value of the
# "arch" command.  So we must package that way also.
#
PKG_MACROS 		+=	P_ARCH=$(shell arch)
PKG_MACROS		+=	PERL_VERSION=$(PERL_VERSION_LOCAL)

# Deliver hardlinks as they appear in the proto area
PKG_AUTO_HARDLINKS=1

configure:	$(CONFIGURE_64)

build:		$(BUILD_64)

parfait:	PARFAIT_BUILD=yes install

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += database/berkeleydb-5
REQUIRED_PACKAGES += library/database/gdbm
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
