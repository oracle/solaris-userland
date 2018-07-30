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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#

# Note that the use of this module itself is discouraged in new code.
# Other modules like XML::LibXML are highly recommended.

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		XML-Simple
COMPONENT_VERSION=	2.24
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:9a14819fd17c75fbb90adcec0446ceab356cab0ccaff870f2e1659205dc2424f
COMPONENT_ARCHIVE_URL=	\
    http://www.cpan.org/authors/id/G/GR/GRANTM/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://search.cpan.org/dist/XML-Simple/
COMPONENT_BUGDB=	perl-mod/xml-parser
COMPONENT_ANITYA_ID=	3537

TPNO=			35762

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/makemaker.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# man pages go in the common area
COMPONENT_INSTALL_ENV += INSTALLVENDORMAN3DIR=$(USRSHAREMAN3DIR)

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-e "/^PERL_DL_NONLAZY/d" ' \
	'-e "/^\#/d" ' \
	'-e "s|\(^Files=\).*|\1|" '

build:		$(BUILD_64)

install:	$(INSTALL_64)

# Must have xml-parser installed for these tests to pass.
test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

# Needed for testing:
REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/xml-namespacesupport-5%)
REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/xml-sax-base-5%)
