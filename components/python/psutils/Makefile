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
# Copyright (c) 2024, 2025, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		psutils
COMPONENT_VERSION=	3.3.10
COMPONENT_ARCHIVE_HASH=	\
    sha256:698a18f291183d48d63cd43b6a2e43d133e89ab438d5aef5baa24374660729f7
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/rrthomas/psutils
COMPONENT_BUGDB=	utility/psutils
COMPONENT_ANITYA_ID=	12921
COMPONENT_BAID=		330304

# We need just a single version
PYTHON_VERSIONS=	3.11

# Install man pages
COMPONENT_POST_INSTALL_ACTION += \
    $(INSTALL) -d $(PROTO_DIR)/usr/share/man/man1; \
    (cd $(COMPONENT_SRC) && ls *.man | while read f; do \
        t=$$(basename "$$f" '-include.man').1; \
	[ ! "$$t" = man.1 ] && \
        $(INSTALL) -m 0444 "$$f" $(PROTO_DIR)/usr/share/man/man1/"$$t"; \
    done);

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-venv-test.mk

# This component uses venv installed packages for testing
PYTHON_VENV_TEST_COMPONENTS = pytest-datafiles

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(VENV_PYTHON) -m pytest
COMPONENT_TEST_ARGS =

PKG_MACROS += PYVER=$(PYTHON_VERSIONS)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# Common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

venv-test:	$(TEST_64)

venv-system-test: $(SYSTEM_TEST_64)

REQUIRED_PACKAGES += image/imagemagick
REQUIRED_PACKAGES += library/libpaper
REQUIRED_PACKAGES += library/python/puremagic
REQUIRED_PACKAGES += library/python/pypdf
REQUIRED_PACKAGES += library/python/wand
