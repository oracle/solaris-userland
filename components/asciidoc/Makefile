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
# Copyright (c) 2013, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		asciidoc
COMPONENT_VERSION=	10.2.0
COMPONENT_PROJECT_URL=	https://asciidoc.org/
COMPONENT_ARCHIVE_HASH= \
    sha256:237b2ba5c35c0ae7ccd4cd44ebf1d87c20b2695dae01798954416d492ef7fa0e
COMPONENT_ARCHIVE_URL=	\
    https://github.com/asciidoc/asciidoc-py3/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	13262
COMPONENT_BAID=		133659

SYSTEM_TEST_TARGET= $(SYSTEM_TEST_64)

PYTHON_VERSION = 3.11
PYTHON_VERSIONS = $(PYTHON_VERSION)

BUILD_STYLE= pybuild
include $(WS_MAKE_RULES)/common.mk

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	\
	$(PYTHON) ./testasciidoc.py update --force; \
	$(PYTHON) ./testasciidoc.py run
COMPONENT_TEST_ARGS =
COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-$(BITS).master

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/passed/p" ' \
	'-e "/^[1-9]: /p" ' \
	'-e "/^[1-9][0-9]: /p" ' \
	'-e "/^SOURCE/p" ' \
	'-e "/^PASSED/p" ' \
	'-e "/^FAILED/p" ' \
	'-e "/^TOTAL/p" '

PKG_MACROS +=	PYVER=$(PYTHON_VERSION)

REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += web/browser/lynx

# Testing related dependencies
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += library/python/pygments
