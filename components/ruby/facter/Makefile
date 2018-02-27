
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
# Copyright (c) 2013, 2018, Oracle and/or its affiliates. All rights reserved.
#
include ../../../make-rules/shared-macros.mk
RUBY_VERSION=2.1
RUBY_LIB_VERSION=2.1.0
RUBY_VERSIONS=2.1.0

COMPONENT_NAME=		facter
COMPONENT_VERSION=	2.5.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).gem
COMPONENT_ARCHIVE_HASH=	\
    sha256:6108a6178ee727088915984d161c2006e5bf991134fd37f29417ec5fbdfee51c
COMPONENT_ARCHIVE_URL=	http://rubygems.org/gems/$(COMPONENT_SRC).gem
COMPONENT_PROJECT_URL=  http://puppetlabs.com/facter
COMPONENT_BUGDB=	utility/puppet
COMPONENT_ANITYA_ID=	778

TPNO=                   40627

# No gemspec is shipped with the gem. Create one
COMPONENT_POST_UNPACK_ACTION= \
    $(GEM) spec $(COMPONENT_ARCHIVE) --ruby > $(SOURCE_DIR)/$(GEMSPEC)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/gem.mk
include $(WS_MAKE_RULES)/ruby.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

# facter requires the installation of the following rubygems to run
# the unittests:  rspec rspec-expectations mocha rake rack hiera
# Disable the tests until these rubygems are available.
test:		$(NO_TESTS)

system-test:    $(NO_TESTS)


REQUIRED_PACKAGES += runtime/ruby-21
REQUIRED_PACKAGES += system/core-os
