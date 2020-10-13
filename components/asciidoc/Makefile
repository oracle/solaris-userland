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
# Copyright (c) 2013, 2020, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		asciidoc
COMPONENT_VERSION=	9.0.2
COMPONENT_PROJECT_URL=	https://asciidoc.org/
COMPONENT_ARCHIVE_HASH= \
    sha256:2494b54e87dd1018a0b809de401b7e6cb957ab2ad3840e91db5de08c372e4c45
COMPONENT_ARCHIVE_URL=	\
    https://github.com/asciidoc/asciidoc-py3/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	13262

TPNO=			62592

SYSTEM_TEST_TARGET= configure $(SYSTEM_TEST_64)
include $(WS_MAKE_RULES)/common.mk

PYTHON_VERSION = 3.7

# AsciiDoc configuration and data files belong in /usr/share, not /etc based
# on discussion from ARC pre-review.
#
CONFIGURE_OPTIONS +=    --sysconfdir=$(USRSHAREDIR)

# pkgdepend doesn't like the first line of a Python script to be:
# '#!/usr/bin/env python' so turn it into '#!/usr/bin/python$(PYTHON_VERSION)'
#
COMPONENT_POST_INSTALL_ACTION += \
        $(GSED) -i -e 's?env python3?python$(PYTHON_VERSION)?' \
                $(PROTOUSRBINDIR)/asciidoc.py;
COMPONENT_POST_INSTALL_ACTION += \
        $(GSED) -i -e 's?env python3?python$(PYTHON_VERSION)?' \
                $(PROTOUSRBINDIR)/a2x.py;

COMPONENT_PRE_CONFIGURE_ACTION = \
        ($(CLONEY) $(SOURCE_DIR) $(@D))

COMPONENT_TEST_DIR =	$(@D)/tests
COMPONENT_TEST_ENV_CMD =
COMPONENT_TEST_ENV =	export PATH=$(@D):$$PATH;
COMPONENT_TEST_CMD =	\
	$(PYTHON) ../asciidocapi.py; \
	if [ $$? -eq 0 ] ; \
		then print "asciidocapi test passed"; \
		else print "asciidocapi test failed"; \
	fi; \
	$(PYTHON) ./testasciidoc.py update --force; \
	$(PYTHON) ./testasciidoc.py run
COMPONENT_TEST_TARGETS =

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/passed/p" ' \
	'-e "/^[1-9]: /p" ' \
	'-e "/^[1-9][0-9]: /p" ' \
	'-e "/^SOURCE/p" ' \
	'-e "/^PASSED/p" ' \
	'-e "/^FAILED/p" ' \
	'-e "/^TOTAL/p" '

COMPONENT_SYSTEM_TEST_DIR =    $(@D)/tests
COMPONENT_SYSTEM_TEST_ENV_CMD =
COMPONENT_SYSTEM_TEST_CMD =    \
	$(PYTHON) ../asciidocapi.py; \
	if [ $$? -eq 0 ] ; \
		then print "asciidocapi test passed"; \
		else print "asciidocapi test failed"; \
	fi; \
	$(PYTHON) ./testasciidoc.py update --force; \
	$(PYTHON) ./testasciidoc.py run
COMPONENT_SYSTEM_TEST_TARGETS =


REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += web/browser/lynx
# test dependencies
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += library/python/pygments
