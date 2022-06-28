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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		CGI
COMPONENT_VERSION=	4.54
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:9608a044ae2e87cefae8e69b113e3828552ddaba0d596a02f9954c6ac17fa294
COMPONENT_ARCHIVE_URL=	http://search.cpan.org/CPAN/authors/id/L/LE/LEEJO/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://search.cpan.org/~leejo/CGI
COMPONENT_BUGDB=	perl-mod/cgi
COMPONENT_ANITYA_ID=	2687

COMPONENT_BAID=		119207

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/makemaker.mk

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-n -e "/^Result:/p"'

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

build:		$(BUILD_64)

install:	$(INSTALL_64)

# Please note that the failures are due to missing external modules. See
# TESTING for info on how to test this module successfully
test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/html-entities-5%)
REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/test-deep-5%)
REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/test-warn-5%)
REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/sub-uplevel-5%)
