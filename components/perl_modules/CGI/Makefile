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
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
#
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		CGI
COMPONENT_VERSION=	4.37
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:1548c25841565908314e4591eb16236067bda4cc72618f68b6975c3b84cb0c99
COMPONENT_ARCHIVE_URL=	http://search.cpan.org/CPAN/authors/id/L/LE/LEEJO/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://search.cpan.org/~leejo/CGI
COMPONENT_BUGDB=	perl-mod/cgi
COMPONENT_ANITYA_ID=	2687

TPNO=			39158

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/makemaker.mk

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# The test results are full of missing "Test::Entities" and "Test::Deep"
# modules. That means we can't run all the tests, but it does not limit use of
# the CGI perl module itself.
COMPONENT_TEST_TARGETS = test

COMPONENT_TEST_TRANSFORMS += \
	 '-n ' \
	 '-e "s/\s*[0-9][0-9]* wallclock secs (.*CPU)$$/ <TIMINGS REMOVED>/" ' \
	 '-e "/^All tests successful/p" ' \
	 '-e "/^Files=/p" ' \
	 '-e "/^Result:/p" ' \
	 '-e "/^Failed .* test programs/p" '


ASLR_MODE = $(ASLR_NOT_APPLICABLE)

build:		$(BUILD_64)

install:	$(INSTALL_64)

# Please note that the failures are due to missing external modules. See
# TESTING for info on how to test this module successfully
test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)
