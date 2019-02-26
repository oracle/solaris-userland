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
# Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
#

#
# This .mk file is shared between all ruby modules and gems (but not ruby
# runtime itself).  Its main purpose is to generate make targets for each
# currently used version of ruby.
#

#
# All ruby related packages are build based on the RUBY_VERSIONS variable
# (never RUBY_VERSION).  To build component for multiple versions, rename the
# .p5m file so that it ends with -RUBYVER.p5m.
#
# All manifests should use variables RUBYVER, RUBY_LIBVER and VENDOR_GEM_DIR to
# work with multi version build and also to keep everything clean.
#

BUILD_NO_ARCH=
INSTALL_NO_ARCH=
TEST_NO_ARCH=
SYSTEM_TEST_NO_ARCH=

BUILD_64=
INSTALL_64=
TEST_64=
SYSTEM_TEST_64=

# Dynamically build targets based on RUBY_VERSIONS.
define generate-ruby-version-targets
  $(BUILD_DIR)/%-$(1)/.configured: RUBY_VERSION=$(1)
  $(BUILD_DIR)/%-$(1)/.built: RUBY_VERSION=$(1)
  $(BUILD_DIR)/%-$(1)/.installed: RUBY_VERSION=$(1)

  $(BUILD_DIR)/%-$(1)/.tested: RUBY_VERSION=$(1)
  $(BUILD_DIR)/%-$(1)/.tested-and-compared: RUBY_VERSION=$(1)

  $(BUILD_DIR)/%-$(1)/.system-tested: RUBY_VERSION=$(1)
  $(BUILD_DIR)/%-$(1)/.system-tested-and-compared: RUBY_VERSION=$(1)


  BUILD_NO_ARCH += $(BUILD_DIR)/$(MACH)-$(1)/.built
  INSTALL_NO_ARCH += $(BUILD_DIR)/$(MACH)-$(1)/.installed

  ifeq ($(strip $(wildcard $(COMPONENT_TEST_RESULTS_DIR)/results-*.master)),)
    TEST_NO_ARCH += $(BUILD_DIR)/$(MACH)-$(1)/.tested
  else
    TEST_NO_ARCH += $(BUILD_DIR)/$(MACH)-$(1)/.tested-and-compared
  endif

  ifeq ($(strip $(wildcard $(COMPONENT_TEST_RESULTS_DIR)/results-*.master)),)
    SYSTEM_TEST_NO_ARCH += $(BUILD_DIR)/$(MACH)-$(1)/.system-tested
  else
    SYSTEM_TEST_NO_ARCH += $(BUILD_DIR)/$(MACH)-$(1)/.system-tested-and-compared
  endif


  BUILD_64 += $(BUILD_DIR)/$(MACH64)-$(1)/.built
  INSTALL_64 += $(BUILD_DIR)/$(MACH64)-$(1)/.installed

  ifeq ($(strip $(wildcard $(COMPONENT_TEST_RESULTS_DIR)/results-*.master)),)
    TEST_64 += $(BUILD_DIR)/$(MACH64)-$(1)/.tested
  else
    TEST_64 += $(BUILD_DIR)/$(MACH64)-$(1)/.tested-and-compared
  endif

  ifeq ($(strip $(wildcard $(COMPONENT_TEST_RESULTS_DIR)/results-*.master)),)
    SYSTEM_TEST_64 += $(BUILD_DIR)/$(MACH64)-$(1)/.system-tested
  else
    SYSTEM_TEST_64 += $(BUILD_DIR)/$(MACH64)-$(1)/.system-tested-and-compared
  endif
endef
$(foreach ver,$(RUBY_VERSIONS),$(eval $(call generate-ruby-version-targets,$(ver))))


# Additional BITS variables for all MACH64 build targets
$(BUILD_DIR)/$(MACH64)-%/.configured: BITS=64
$(BUILD_DIR)/$(MACH64)-%/.built: BITS=64
$(BUILD_DIR)/$(MACH64)-%/.installed: BITS=64
$(BUILD_DIR)/$(MACH64)-%/.tested: BITS=64
$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared: BITS=64
$(BUILD_DIR)/$(MACH64)-%/.system-tested: BITS=64
$(BUILD_DIR)/$(MACH64)-%/.system-tested-and-compared: BITS=64


RUBY_LIB_VERSION = $(RUBY_VERSION).0

# These are used only by the single version packages
VENDOR_RUBY = usr/ruby/$(RUBY_VERSION)/lib/ruby/vendor_ruby/$(RUBY_LIB_VERSION)
VENDOR_GEM_DIR = usr/ruby/$(RUBY_VERSION)/lib/ruby/vendor_ruby/gems/$(RUBY_LIB_VERSION)

# Forward following variables to the pkg.
#
# Needed for single version components (without -RUBYVER manifests). Multiver
# manifests will have these already replaced when their manifest is being
# generated.
PKG_MACROS += RUBY_VERSION=$(RUBY_VERSION)
PKG_MACROS += RUBY_LIB_VERSION=$(RUBY_LIB_VERSION)
PKG_MACROS += VENDOR_RUBY=$(VENDOR_RUBY)
PKG_MACROS += VENDOR_GEM_DIR=$(VENDOR_GEM_DIR)

# RUBY_VERSION without the dot
RUBYV = $(shell echo $(RUBY_VERSION) | tr -d .)
PKG_MACROS += RUBYV=$(RUBYV)

# Create variable without the dot in the RUBY_PUPPET_VERSION
RUBY_PUPPET_NODOT_VERSION = $(shell echo $(RUBY_PUPPET_VERSION) | tr -d .)

# Modify ruby scripts in the ruby-version-specific path of the proto area,
# under usr/ruby/$(RUBY_VERSION), containing "#!/usr/bin/env ruby" to
# use the version-specific ruby path, defined by the $(RUBY_VERSION) macro.
# Without this change, the mediated ruby version in /usr/bin/ruby
# will probably be used, which may not match the ruby
# version supported by the component.
COMPONENT_POST_INSTALL_ACTION += \
    cd $(PROTO_DIR)/usr/ruby/$(RUBY_VERSION); \
    $(RUBY_SCRIPT_FIX_FUNC);

REQUIRED_PACKAGES += library/gmp
