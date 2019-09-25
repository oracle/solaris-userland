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
# Copyright (c) 2013, 2019, Oracle and/or its affiliates. All rights reserved.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		Django
COMPONENT_VERSION=	1.11.23
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:e2ea3b61bbd21a34d0543969bc47542ee8bd7c7c364bf8208c0167a8aee9d70c
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://www.djangoproject.com/
COMPONENT_BUGDB=	python-mod/django
COMPONENT_ANITYA_ID=	3828

TPNO=			53579

COMPONENT_NAME_NEW=		$(COMPONENT_NAME)
COMPONENT_VERSION_NEW=	2.2.5
COMPONENT_SRC_NEW=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_NEW)
COMPONENT_ARCHIVE_NEW=	$(COMPONENT_SRC_NEW).tar.gz
COMPONENT_ARCHIVE_HASH_NEW=	\
	sha256:2e23ecb1a814d1c028fdf1e837a6749780ea488779d746f6b18cfa8e8213055c
COMPONENT_ARCHIVE_URL_NEW=	$(call pypi_url,NEW)

TPNO_NEW=		54222

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Replace "#!/usr/bin/env ..." shebang lines with properly versioned ones.
COMPONENT_POST_BUILD_ACTION = \
    /usr/bin/find $(@D)/lib/django -name *.py \
	-exec $(GSED) -i -e 's/env python/python$(PYTHON_VERSION)/' "{}" \; ;

COMPONENT_POST_INSTALL_ACTION = \
    (cd $(PROTO_DIR)/usr/bin ; \
     $(MV) -f django-admin.py django-admin-$(PYTHON_VERSION)) ;

# add 1 extra transform to get rid of the facet created on
# locale/__init__.py
PUBLISH_TRANSFORMS +=	$(COMPONENT_DIR)/django-locale-transform

# reset the test environment to only contain PATH, PYTHONPATH, and LC_ALL
# (because many tests need to be able to access non-ASCII codepoints).
COMPONENT_TEST_DIR=	$(SOURCE_DIR)/tests
COMPONENT_TEST_ARGS +=	--settings test_sqlite
COMPONENT_TEST_ENV=	PYTHONPATH=$(SOURCE_DIR)
COMPONENT_TEST_ENV +=	LC_ALL=en_US.UTF-8

# Prevent HTTP 502: cannotconnect errors when unit testing on live server
COMPONENT_TEST_ENV += http_proxy=
COMPONENT_TEST_ENV += https_proxy=

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

$(MANIFEST_BASE)-django-27.mogrified: MULTI_VER = \#
$(MANIFEST_BASE)-django-34.mogrified: MULTI_VER = \#
$(MANIFEST_BASE)-django-35.mogrified: MULTI_VER = \#
$(MANIFEST_BASE)-django-37.mogrified: SINGLE_VER = \#

PKG_MACROS += SINGLE_VER="$(SINGLE_VER)"
PKG_MACROS += MULTI_VER="$(MULTI_VER)"

PKG_MACROS += COMPONENT_VERSION_NEW="$(COMPONENT_VERSION_NEW)"

# Convenience variables
TARGET_OLD = $(BUILD_DIR)/$(MACH)-3.7/
TARGET_NEW = $(BUILD_DIR)/$(MACH)-2-3.7/
SOURCE_DIR_NEW = $(COMPONENT_DIR)/$(COMPONENT_SRC_NEW)

# Added targets for new and optional Django version
$(TARGET_NEW).built: SOURCE_DIR = $(SOURCE_DIR_NEW)

$(TARGET_NEW).installed: SOURCE_DIR = $(SOURCE_DIR_NEW)

$(TARGET_OLD).installed: COMPONENT_POST_INSTALL_ACTION += ( \
	$(MV) $(PROTO_DIR)$(PYTHON_LIB)/django $(PROTO_DIR)$(PYTHON_LIB)/django1.11 )
$(TARGET_NEW).installed: COMPONENT_POST_INSTALL_ACTION += ( \
	$(MV) $(PROTO_DIR)$(PYTHON_LIB)/django $(PROTO_DIR)$(PYTHON_LIB)/django2.5 )

# common targets
build:		$(BUILD_NO_ARCH) $(TARGET_NEW).built

install:	$(INSTALL_NO_ARCH) $(TARGET_NEW).installed

test:		$(TEST_NO_ARCH) $(TARGET_NEW).tested-and-compared

COMPONENT_TEST_ARGS += --parallel=1
COMPONENT_TEST_ARGS += --verbosity=3

# To run single test you can just add it's name like here:
# COMPONENT_TEST_ARGS += admin_scripts.tests.StartProject
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_TRANSFORMS += \
	` : Disable normal test output ` \
	'-n ' \
	'-e "/^ERROR/p"' \
	'-e "/^FAIL/p"' \
	'-e "s/^Ran .* tests in.*/Tests were executed/g"' \
	'-e "/Tests were executed/p"'

system-test:	$(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += library/python/mock
REQUIRED_PACKAGES += library/python/setuptools
REQUIRED_PACKAGES += library/python/sqlparse
REQUIRED_PACKAGES += text/gnu-gettext
