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
# Copyright (c) 2016, 2023, Oracle and/or its affiliates.
#

BUILD_BITS= 64

# Parallel build jobs are supported only if GNU make is used.
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

# COMPONENT_VERSION number in ./history must be >= s11 COMPONENT_VERSION
# at all times, so update ./history if planning to backport an update.

COMPONENT_NAME=		libpki
COMPONENT_VERSION=	0.9.2
# The new form includes the commit as a disambiguator, but the current archive
# wasn't created with that in its name, so we use the old form until the next
# update.
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=	https://www.openca.org/projects/libpki/
COMPONENT_ARCHIVE_SRC=	git
COMPONENT_BUGDB=	library/smartcard
COMPONENT_ANITYA_ID=	13309

GIT_REPO= https://github.com/openca/libpki
GIT_COMMIT_ID= a8099c5
GIT_HASH=  sha256:b203907ece2d6d73ccf4aa9de63319b72d77757a20958531ebf74772b84c27d9

COMPONENT_BAID =		136660

include $(WS_MAKE_RULES)/common.mk

unexport SHELLOPTS

PKG_PROTO_DIRS += $(COMPONENT_SRC)/docs

# Need to include the path below because not all headers are available in
# $(BUILD_DIR)/src/libpki.
CPPFLAGS += -I$(COMPONENT_DIR)/$(COMPONENT_SRC)/src

# configure.in and Makefile.am patches need configure script recreation.
COMPONENT_PREP_ACTION +=(cd $(@D); autoreconf);

# This is necessary because 'gmake install' tries to install some files under
# /usr/bin without it.
CONFIGURE_ENV +=	DESTDIR="$(PROTO_DIR)"

CONFIGURE_OPTIONS +=	--with-libdir=$(USRLIBDIR64)

OPENSSL_CFLAGS= -I/usr/openssl/3/include
OPENSSL_LIBS= -L/usr/openssl/3/lib/64/ -lssl -lcrypto

CONFIGURE_OPTIONS += OPENSSL_CFLAGS="$(OPENSSL_CFLAGS)"
CONFIGURE_OPTIONS += OPENSSL_LIBS="$(OPENSSL_LIBS)"

COMPONENT_PRE_TEST_ACTION = files/setup_test.sh $(@D) $(COMPONENT_SRC)

# Tests may output some compilation lines, so just pull out the relevant test
# output lines for the test results comparison.
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/\# TOTAL:/p" ' \
	'-e "/\# PASS:/p" ' \
	'-e "/\# SKIP:/p" ' \
	'-e "/\# XFAIL:/p" ' \
	'-e "/\# FAIL:/p" ' \
	'-e "/\# XPASS:/p" ' \
	'-e "/\# ERROR:/p" '

REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/network/ldap/openldap
