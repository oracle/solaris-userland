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
# Copyright (c) 2020, 2025, Oracle and/or its affiliates.
#

CTF_MODE =		off	# Has no effect
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		HTML-Parser
COMPONENT_VERSION=	3.81
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:c0910a5c8f92f8817edd06ccfd224ba1c2ebe8c10f551f032587a1fc83d62ff2
COMPONENT_ARCHIVE_URL=	\
    https://cpan.metacpan.org/authors/id/O/OA/OALDERS/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	https://metacpan.org/pod/HTML::Entities
COMPONENT_BUGDB=	perl-mod/html-entities
COMPONENT_ANITYA_ID=	2967

COMPONENT_BAID=		137470

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/makemaker.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-n -e "/^Result:/p"'

build:		$(BUILD_64)

install:	$(INSTALL_64)

# We are missing Clone, URI and HTTP::Headers
test:          $(NO_TESTS)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/html-tagset-5%)
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
