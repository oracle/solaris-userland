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
# Copyright (c) 2013, 2025, Oracle and/or its affiliates.
#
COMPILER=	gcc
BUILD_BITS= 64

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		stunnel
COMPONENT_VERSION=	5.74
COMPONENT_PROJECT_URL=	https://www.stunnel.org/
COMPONENT_ARCHIVE_HASH=	\
	sha256:9bef235ab5d24a2a8dff6485dfd782ed235f4407e9bc8716deb383fc80cd6230
COMPONENT_ANITYA_ID=	4901

COMPONENT_ARCHIVE_URL=	https://www.stunnel.org/downloads/$(COMPONENT_ARCHIVE)

#COMPONENT_PREP_ACTION += (cd $(@D) ; autoreconf -f)

COMPONENT_BAID=	322876	

include $(WS_MAKE_RULES)/common.mk

# need /usr/perl5/bin on path to access pod2man perl script, used by 
# the build to create docs
COMPONENT_BUILD_ENV +=  PATH=$(USRDIR)/perl5/bin:$(PATH)

CPPFLAGS +=	"-DPIDFILE='\"/var/run/stunnel.pid\"'"

# used to generate the 64-bit interposer location
CPPFLAGS += -DMACH64='\"$(MACH64)\"'

CONFIGURE_OPTIONS +=	--disable-fips
CONFIGURE_OPTIONS +=	--enable-ipv6
CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)

# used to generate LD_PRELOAD_* interposer pathnames
COMPONENT_BUILD_ARGS += pkglibdir=$(USRLIBDIR)/stunnel

COMPONENT_PRE_INSTALL_ACTION = \
	$(MKDIR) $(PROTOETCDIR)/stunnel ; \
	$(TOUCH) $(PROTOETCDIR)/stunnel/stunnel.pem

# need GNU utilities. /usr/sbin so ifconfig can be found
COMPONENT_TEST_ENV +=       PATH="$(GNUBIN):/usr/sbin:$(PATH)"
# test 051 is for OpenSSL 1.0
COMPONENT_TEST_TRANSFORMS += \
	'-e "/Entering directory/d" ' \
	'-e "/^Making/d" ' \
	'-e "/^make/d" ' \
	'-e "/^Compiled\/running with OpenSSL/d" ' \
	'-e "/^stunnel/d" ' \
	'-e "/Leaving directory/d" '

REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += system/library
# any Perl will do, use the default one
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
