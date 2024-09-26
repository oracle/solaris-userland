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
# Copyright (c) 2013, 2024, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pycodestyle
COMPONENT_VERSION=	2.12.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_PROJECT_URL=	https://pycodestyle.readthedocs.io/en/latest/
COMPONENT_BUGDB=	python-mod/pycodestyle
COMPONENT_ANITYA_ID=	11773
COMPONENT_BAID=		178103

# pypi archive doesn't include the test suite
GIT_REPO=	https://github.com/PyCQA/pycodestyle
GIT_COMMIT_ID=	$(COMPONENT_VERSION)
GIT_HASH=	sha256:85af4e592999f56f4e810a2e2523d8243ce499f70fb183e4b8357f2e12c7552a

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Replace "#!/usr/bin/env ..." shebang lines with properly versioned ones.
COMPONENT_PRE_BUILD_ACTION = \
	/usr/bin/find $(SOURCE_DIR) -name *.py \
		-exec $(GSED) -i -e 's/env python/python$(PYTHON_VERSION)/' "{}" \; ;

# Put the correct pycodestyle version number on the .TH line in the man page in
# the proto area.
COMPONENT_POST_INSTALL_ACTION += \
	($(MKDIR) $(PROTO_DIR)/usr/share/man/man1; \
	$(GSED) -e 's/XXX/$(COMPONENT_VERSION)/' \
	    $(COMPONENT_DIR)/files/pycodestyle.1 > \
	    $(PROTO_DIR)/usr/share/man/man1/pycodestyle.1);

COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTOUSRBINDIR)/pycodestyle $(PROTOUSRBINDIR)/pycodestyle-$(PYTHON_VERSION)

COMPONENT_TEST_DIR =	$(COMPONENT_SRC)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

COMPONENT_SYSTEM_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_SYSTEM_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_SYSTEM_TEST_ENV =
COMPONENT_SYSTEM_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TEST_NO_ARCH)
