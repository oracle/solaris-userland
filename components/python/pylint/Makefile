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
# Copyright (c) 2011, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pylint
COMPONENT_VERSION=	2.15.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=  https://www.pylint.org/
COMPONENT_BUGDB=	utility/pylint
COMPONENT_ANITYA_ID=	5344
COMPONENT_BAID=		129768

# pypi archive doesn't include the test suite
GIT_REPO=	https://github.com/PyCQA/pylint
GIT_COMMIT_ID=	v$(COMPONENT_VERSION)
GIT_HASH=	sha256:4c311dbdbb3261ec999b0403587ae798c3e43adfe1f70c5a9102ba0b9ce317e8

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# There are several pylint documentation files that setup.py isn't installing
# but are present in the pylint package on other distributions. Copy them into
# the proto area "manually", so they can be included in the package.
PDOC_PYLINT =		$(PROTOUSRSHAREDOCDIR)/pylint
PDOC_PYLINT_EXAMPLES =	$(PDOC_PYLINT)/examples

COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) epylint epylint-$(PYTHON_VERSION)) ;
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) pylint pylint-$(PYTHON_VERSION)) ;
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) pyreverse pyreverse-$(PYTHON_VERSION)) ;
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) symilar symilar-$(PYTHON_VERSION)) ;
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) pylint-config pylint-config-$(PYTHON_VERSION)) ;

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
# Ignore tests that need PythonGit, which is not available on Solaris
COMPONENT_TEST_ARGS =	--ignore=tests/primer --ignore=tests/testutils/_primer -v

COMPONENT_TEST_TRANSFORMS += \
	'-nE -e "s/ ?=+ ?//g" ' \
	'-e "s/ in [0-9]+(\.[0-9]*)?(s| seconds).*//" ' \
	'-e "s/[0-9]+ warnings/x warnings/g" ' \
	'-e "/::.*FAILED/p" ' \
	'-e "/::.*ERROR/p" ' \
	'-e "\\$$p"'

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TEST_NO_ARCH)

REQUIRED_PACKAGES += $(PYVS:%=library/python/astroid-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/isort-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/mccabe-%)
REQUIRED_PACKAGES += $(PYVS3:%=library/python/dill-%)
REQUIRED_PACKAGES += $(PYVS3:%=library/python/tomli-%)
REQUIRED_PACKAGES += $(PYVS3:%=library/python/tomlkit-%)
REQUIRED_PACKAGES += $(PYVS3:%=library/python/typing-extensions-%)
