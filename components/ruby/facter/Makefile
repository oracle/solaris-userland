
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

# Puppet and its modules are built to use the currently
# supported version of Ruby runtime only.
RUBY_VERSIONS = $(RUBY_PUPPET_VERSION)

COMPONENT_NAME=		facter
COMPONENT_VERSION=	4.5.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).gem
COMPONENT_ARCHIVE_HASH=	\
    sha256:c4263ae04a517f3759b4885c22c1b99093fdc416e9e639c763445e158cf92643
COMPONENT_ARCHIVE_URL=	http://rubygems.org/gems/$(COMPONENT_SRC).gem
COMPONENT_PROJECT_URL=  http://puppetlabs.com/facter
COMPONENT_BUGDB=	utility/puppet
COMPONENT_ANITYA_ID=	67127

COMPONENT_BAID=		153026

# No gemspec is shipped with the gem. Create one
COMPONENT_POST_UNPACK_ACTION= \
    $(GEM) spec $(COMPONENT_ARCHIVE) --ruby > $(SOURCE_DIR)/$(GEMSPEC)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/gem.mk
include $(WS_MAKE_RULES)/ruby.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# Facter4.x requires hocon, thor and ffi as part of the install phase
HOCON_LIB=$(WS_TOP)/components/ruby/hocon/build/$(MACH)-$(RUBY_PUPPET_VERSION)/lib
THOR_LIB=$(WS_TOP)/components/ruby/thor/build/$(MACH)-$(RUBY_PUPPET_VERSION)/lib
FFI_LIB=$(WS_TOP)/components/ruby/ffi/build/$(MACH)-$(RUBY_PUPPET_VERSION)/lib
FFI_C_LIB=$(PROTO_DIR)/$(VENDOR_GEM_DIR)/gems/ffi-1.13.1/lib
COMPONENT_INSTALL_ENV   += RUBYLIB="$(FFI_C_LIB):$(HOCON_LIB):$(FFI_LIB):$(THOR_LIB)"


../hocon/build/%/.installed:
	cd ../hocon ; $(GMAKE) install

../thor/build/%/.installed:
	cd ../thor ; $(GMAKE) install

../ffi/build/%/.installed:
	cd ../ffi ; $(GMAKE) install

build:		$(BUILD_NO_ARCH)

install:	../thor/build/$(MACH)-$(RUBY_PUPPET_VERSION)/.installed \
                        ../hocon/build/$(MACH)-$(RUBY_PUPPET_VERSION)/.installed \
                        ../ffi/build/$(MACH)-$(RUBY_PUPPET_VERSION)/.installed \
                        $(INSTALL_NO_ARCH)

# facter requires the installation of the following rubygems to run
# the unittests:  rspec rspec-expectations mocha rake rack hiera
# Disable the tests until these rubygems are available.
test:		$(NO_TESTS)

system-test:    $(NO_TESTS)


REQUIRED_PACKAGES += runtime/ruby-$(RUBY_PUPPET_NODOT_VERSION)
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += library/ruby/thor
REQUIRED_PACKAGES += library/ruby/hocon
REQUIRED_PACKAGES += library/ruby/ffi
