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
CTF_MODE =		off	# Has no effect
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		XML-LibXML
COMPONENT_VERSION=	2.208
HUMAN_VERSION=		2.0208
COMPONENT_SRC=		$(COMPONENT_NAME)-$(HUMAN_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:0c006b03bf8d0eb531fb56bda3ae15754ca56d888dd7b9e805ab9eb19d5fd653
COMPONENT_ARCHIVE_URL=	http://search.cpan.org/CPAN/authors/id/S/SH/SHLOMIF/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://search.cpan.org/~shlomif/XML-LibXML/
COMPONENT_BUGDB=	perl-mod/xml-libxml
COMPONENT_ANITYA_ID=	3527

COMPONENT_BAID=		137477

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/makemaker.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# man pages go in the common area
COMPONENT_INSTALL_ENV += INSTALLVENDORMAN3DIR=$(USRSHAREMAN3DIR)

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Transform to remove machine-specific lines in test results
COMPONENT_TEST_TRANSFORMS += '-n -e "/^Result:/p"'

build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)


REQUIRED_PACKAGES += library/libxml2

# Needed for testing:
REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/xml-namespacesupport-5%)
REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/xml-sax-5%)
REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/xml-sax-base-5%)
REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/alien-libxml2-5%)
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
