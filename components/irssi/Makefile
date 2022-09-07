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
# Copyright (c) 2015, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER=gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         irssi
COMPONENT_VERSION=	1.4.2
COMPONENT_PROJECT_URL=	https://irssi.org/
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=\
    sha256:2d72c9a178bf5cbe4dfab499818005abb85f79376476f924fc09c969cb1c8419
COMPONENT_ARCHIVE_URL=	https://github.com/irssi/irssi/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	1404
COMPONENT_BAID=	129591

PKG_CONFIG_PATHS += /usr/openssl/3/lib/64/pkgconfig

# Without this, linker flags from pkgconfig are added too late to take effect
LDFLAGS += -L/usr/openssl/3/lib/64
COMPONENT_BUILD_ARGS += LDFLAGS="$(LDFLAGS)"

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

CONFIGURE_ENV += "ac_cv_path_perlpath=$(PERL)"

CONFIGURE_OPTIONS +=    --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=    --with-perl
CONFIGURE_OPTIONS +=    --with-proxy
CONFIGURE_OPTIONS +=    --with-perl-lib=$(USRDIR)/perl5/vendor_perl/$(PERL_VERSION)

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
