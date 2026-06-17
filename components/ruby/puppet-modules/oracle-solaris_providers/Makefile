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
# Copyright (c) 2013, 2026, Oracle and/or its affiliates.
#
include ../../../../make-rules/shared-macros.mk


GIT_REPO= https://github.com/oracle/puppet-solaris_providers
GIT_COMMIT_ID= v2.0.4
GIT_HASH=  sha256:c978159b84cdfb3bf4d5acf431a1ac8d0ecfd2b24670a1a98e251b941ce261a3

COMPONENT_NAME=		puppet-solaris_providers
COMPONENT_VERSION=	$(GIT_COMMIT_ID:v%=%)
COMPONENT_PROJECT_URL=	https://github.com/oracle/puppet-solaris_providers
COMPONENT_SRC=$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_BUGDB=	utility/puppet
COMPONENT_ANITYA_ID=	13323

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/puppetmodule.mk
include $(WS_MAKE_RULES)/ips.mk

MODULE_NAME =	solaris_providers

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build: $(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(NO_TESTS)

system-test:    $(NO_TESTS)

REQUIRED_PACKAGES += system/management/puppet
