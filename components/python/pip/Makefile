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
# Copyright (c) 2013, 2021, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=         pip
COMPONENT_VERSION=      20.3.4
COMPONENT_SRC=          $(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:05ac8afe08b5fc34c61e1f91e3cd8effba42250419938c2070a139efdc5d0d57
COMPONENT_ARCHIVE_URL=  https://github.com/pypa/pip/archive/$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=  https://github.com/pypa/pip
COMPONENT_BUGDB=	utility/pip
COMPONENT_ANITYA_ID=	6529

COMPONENT_BAID=		101202

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# allow pkg to create the mediated link
COMPONENT_POST_INSTALL_ACTION = \
	(cd $(PROTO_DIR)/usr/bin ; $(MV) -f pip pip-$(PYTHON_VERSION));

# INSTALLER file with 'pkg' as content prevents notices about newer available
# pip version from appearing to our customers. We don't want our users to
# update pip themselves, because our pip is patched to prevent damage to IPS
# and other Python-related software.
COMPONENT_EGG_DIR = $(COMPONENT_NAME)-$(COMPONENT_VERSION)-py$(PYTHON_VERSION).egg-info
COMPONENT_POST_INSTALL_ACTION += \
	(echo 'pkg' > $(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE)/$(COMPONENT_EGG_DIR)/INSTALLER)

# common targets
build:          $(BUILD_NO_ARCH)

install:        $(INSTALL_NO_ARCH)

# pip requires scripttest >= 1.3 to execute tests.
# When this module is available, update this directive to test pip.
test:           $(NO_TESTS)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += library/python/requests
