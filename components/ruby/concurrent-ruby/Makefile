
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
# Copyright (c) 2021, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

# Puppet and its modules are built to use the currently
# supported version of Ruby runtime only.
RUBY_VERSIONS = $(RUBY_PUPPET_VERSION)

COMPONENT_NAME=		concurrent-ruby
COMPONENT_VERSION=      1.1.8
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).gem
COMPONENT_ARCHIVE_HASH=	\
    sha256:e35169e8e01c33cddc9d322e4e793a9bc8c3c00c967d206d17457e0d301f2257
COMPONENT_ARCHIVE_URL=	https://rubygems.org/downloads/$(COMPONENT_SRC).gem
COMPONENT_PROJECT_URL=  https://github.com/ruby-concurrency/concurrent-ruby
COMPONENT_BUGDB=	utility/puppet
COMPONENT_ANITYA_ID=	11037

TPNO=                   68041

# Create gemspec.
COMPONENT_POST_UNPACK_ACTION= \
    $(GEM) spec $(COMPONENT_ARCHIVE) --ruby > $(SOURCE_DIR)/$(GEMSPEC)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/gem.mk
include $(WS_MAKE_RULES)/ruby.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(NO_TESTS)

system-test:    $(NO_TESTS)


REQUIRED_PACKAGES += runtime/ruby-$(RUBY_PUPPET_NODOT_VERSION)
