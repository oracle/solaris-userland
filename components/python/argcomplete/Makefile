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
# Copyright (c) 2024, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		argcomplete
COMPONENT_VERSION=	3.2.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:f3e49e8ea59b4026ee29548e24488af46e30c9de57d48638e24f54a1ea1000a2
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/kislyuk/argcomplete
COMPONENT_BUGDB=	python-mod/argcomplete
COMPONENT_ANITYA_ID=	3773
COMPONENT_BAID=		158056

# No need for multiple versions, we need just the one used py pipx
PYTHON_VERSIONS= 3.11
PYV=$(shell echo $(PYTHON_VERSIONS) | tr -d .)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

PKG_MACROS += PYVER=$(PYTHON_VERSIONS)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:          $(BUILD_NO_ARCH)

install:        $(INSTALL_NO_ARCH)

test:           $(NO_TESTS)
