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
# Copyright (c) 2021, 2023, Oracle and/or its affiliates.
#

BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		ansible-core
COMPONENT_VERSION=	2.15.0
COMPONENT_ARCHIVE_HASH=	\
    sha256:cf690fd4ebb40590e00c5acdc0624758ca4c58d1e4b2b02ec026a034070ebf4d
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://www.ansible.com/
COMPONENT_BUGDB=	utility/ansible
COMPONENT_ANITYA_ID=	165410

COMPONENT_BAID=		144988
PKG_MACROS+= MICRO_VERSION=$(MICRO_VERSION)

# We need just a single Python version
PYTHON_VERSIONS=	3.11

TEST_TARGET= $(NO_TESTS)

BUILD_STYLE= setup.py

ASLR_MODE= $(ASLR_NOT_APPLICABLE)

include $(WS_MAKE_RULES)/common.mk

PKG_MACROS +=		PYVER=$(PYTHON_VERSIONS)
PKG_MACROS +=		PYV=$(shell echo $(PYTHON_VERSIONS) | tr -d .)

# Copy man pages to the standard man page location
COMPONENT_POST_INSTALL_ACTION += \
    cd $(COMPONENT_DIR) ; \
    $(MKDIR) $(PROTOUSRSHAREMAN1DIR) ; \
    $(INSTALL) --mode=644 $(COMPONENT_SRC)/docs/man/man1/* \
        $(PROTOUSRSHAREMAN1DIR)/

REQUIRED_PACKAGES += $(PYVS:%=runtime/python-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/cryptography-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/jinja2-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/packaging-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyyaml-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/importlib-metadata-%)
REQUIRED_PACKAGES += library/python/resolvelib
