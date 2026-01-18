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
# Copyright (c) 2021, 2025, Oracle and/or its affiliates.
#

BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		ansible_core
COMPONENT_VERSION=	2.20.1
COMPONENT_ARCHIVE_HASH=	\
    sha256:a891e5f90cd46626778f0f3d545ec1115840c9b50e8adf25944c5e1748452106
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://www.ansible.com/
COMPONENT_BUGDB=	utility/ansible
COMPONENT_ANITYA_ID=	165410

COMPONENT_BAID=		360444
PKG_MACROS+= MICRO_VERSION=$(MICRO_VERSION)

# We need just a single Python version
PYTHON_VERSIONS=	3.13

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE= $(ASLR_NOT_APPLICABLE)

# common targets
build:          $(BUILD_NO_ARCH)
install:        $(INSTALL_NO_ARCH)
test:           $(NO_TESTS)

PKG_MACROS +=		PYVER=$(PYTHON_VERSIONS)
PKG_MACROS +=		PYV=$(shell echo $(PYTHON_VERSIONS) | tr -d .)

# Copy man pages to the standard man page location
COMPONENT_POST_INSTALL_ACTION += \
    cd $(COMPONENT_DIR) ; \
    $(MKDIR) $(PROTOUSRSHAREMAN1DIR) ; \
    echo Generating man pages... ; \
    LC_ALL=C.UTF-8 $(PYTHON) $(SOURCE_DIR)/packaging/cli-doc/build.py man \
    --output-dir $(PROTOUSRSHAREMAN1DIR)/

REQUIRED_PACKAGES += $(PYVS:%=library/python/cryptography-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/jinja2-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/packaging-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/pyyaml-%)
REQUIRED_PACKAGES += library/python/resolvelib
