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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#

CTF_MODE =		off	# Has no effect
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		Net-SSLeay
COMPONENT_VERSION=	1.92
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_PROJECT_URL=	http://search.cpan.org/dist/Net-SSLeay/
COMPONENT_ARCHIVE_HASH=	\
    sha256:47c2f2b300f2e7162d71d699f633dd6a35b0625a00cbda8c50ac01144a9396a9
COMPONENT_ARCHIVE_URL=	https://cpan.metacpan.org/authors/id/C/CH/CHRISN/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	perl-mod/net-ssleay
COMPONENT_BAID=		124297
COMPONENT_ANITYA_ID=	6575

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/makemaker.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)


# The component Makefile.PL file will ask some questions on whether we want
# to run external tests, to which we want to answer with "n".
CONFIGURE_ENV += ; echo "n" |

# If we ever need to link to OpenSSL 1.1
# CONFIGURE_ENV += OPENSSL_PREFIX=/usr/openssl/1.1

# Test failures.  keep going
COMPONENT_TEST_ARGS = -k -i
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_TRANSFORMS += '-n -e "/^Result:/p"'

build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)


REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
