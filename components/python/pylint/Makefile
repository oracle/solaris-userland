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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
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

# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.
COMPONENT_VERSION_OLD=	1.6.4
COMPONENT_SRC_OLD=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD=	\
	sha256:ef901a34b62ed7a734370ba5b162d890231ba8822abe88c6dda1268e2575f5f1
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)
COMPONENT_BAID_OLD=	34816

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/python-multiver.mk

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

COMPONENT_POST_INSTALL_ACTION_NEW += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) pylint-config pylint-config-$(PYTHON_VERSION)) ;

COMPONENT_POST_INSTALL_ACTION_OLD += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) pylint-gui pylint-gui-$(PYTHON_VERSION)) ;
COMPONENT_POST_INSTALL_ACTION_OLD += \
	$(MKDIR) $(PDOC_PYLINT) ;
COMPONENT_POST_INSTALL_ACTION_OLD += \
	$(CP) $(COMPONENT_SRC)/README.rst $(PDOC_PYLINT) ;
COMPONENT_POST_INSTALL_ACTION_OLD += \
	$(MKDIR) $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION_OLD += \
	$(CP) $(COMPONENT_SRC)/examples/custom.py $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION_OLD += \
	$(CP) $(COMPONENT_SRC)/examples/custom_raw.py $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION_OLD += \
	$(CP) $(COMPONENT_SRC)/elisp/pylint.el $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION_OLD += \
	$(CP) $(COMPONENT_SRC)/examples/pylintrc_camelcase $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION_OLD += \
	$(CP) $(COMPONENT_SRC)/examples/pylintrc $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION_OLD += \
	($(PYTHON) -m py_compile $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages/pylint/testutils.py) ;

# pylint-gui is no longer delivered in newer version
$(BUILD_DIR)/%-2.7/.installed: COMPONENT_POST_INSTALL_ACTION += \
	$(COMPONENT_POST_INSTALL_ACTION_OLD)

# pylint-config is only delivered in newer version
$(BUILD_DIR)/%-3.7/.installed: COMPONENT_POST_INSTALL_ACTION += \
	$(COMPONENT_POST_INSTALL_ACTION_NEW)
$(BUILD_DIR)/%-3.9/.installed: COMPONENT_POST_INSTALL_ACTION += \
	$(COMPONENT_POST_INSTALL_ACTION_NEW)
$(BUILD_DIR)/%-3.11/.installed: COMPONENT_POST_INSTALL_ACTION += \
	$(COMPONENT_POST_INSTALL_ACTION_NEW)

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
REQUIRED_PACKAGES += library/python/backports.functools_lru_cache-27
REQUIRED_PACKAGES += library/python/six-27
REQUIRED_PACKAGES += $(PYVS3:%=library/python/dill-%)
REQUIRED_PACKAGES += $(PYVS3:%=library/python/tomli-%)
REQUIRED_PACKAGES += $(PYVS3:%=library/python/tomlkit-%)
REQUIRED_PACKAGES += $(PYVS3:%=library/python/typing-extensions-%)
