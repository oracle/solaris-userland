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
# Copyright (c) 2013, 2023, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		XML-NamespaceSupport
COMPONENT_VERSION=	1.12
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:47e995859f8dd0413aa3f22d350c4a62da652e854267aa0586ae544ae2bae5ef
COMPONENT_ARCHIVE_URL=	http://search.cpan.org/CPAN/authors/id/P/PE/PERIGRIN/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://search.cpan.org/~perigrin/XML-NamespaceSupport-1.11/lib/XML/NamespaceSupport.pm
COMPONENT_BUGDB=	perl-mod/xml-namespace 
COMPONENT_ANITYA_ID=	3530

COMPONENT_BAID=		137478

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/makemaker.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# man pages go in the common area
COMPONENT_INSTALL_ENV += INSTALLVENDORMAN3DIR=$(USRSHAREMAN3DIR)

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Transform to remove machine-specific lines in test results
COMPONENT_TEST_TRANSFORMS += \
	'-e "/^PERL_DL_NONLAZY/d" ' \
	'-e "s|,[^,]*wallclock secs.*||" '

build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)
