
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
# Copyright (c) 2021, 2023, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

# Puppet and its modules are built to use the currently
# supported version of Ruby runtime only.
RUBY_VERSIONS = $(RUBY_PUPPET_VERSION)

COMPONENT_NAME=		ffi
COMPONENT_VERSION=      1.16.3
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).gem
COMPONENT_ARCHIVE_HASH=	\
    sha256:6d3242ff10c87271b0675c58d68d3f10148fabc2ad6da52a18123f06078871fb
COMPONENT_ARCHIVE_URL=	https://rubygems.org/downloads/$(COMPONENT_SRC).gem
COMPONENT_PROJECT_URL=  https://github.com/ffi/ffi
COMPONENT_BUGDB=	utility/puppet
COMPONENT_ANITYA_ID=	4292

COMPONENT_BAID=		153019

GEM_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)
GEM_INSTALL_ENV += PKG_CONFIG_PATH=$(PKG_CONFIG_PATH.64)
FFI_SPECIFIC_INSTALL_ARGS += -- --enable-system-libffi

# Create gemspec
COMPONENT_POST_UNPACK_ACTION += \
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
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += library/libffi
