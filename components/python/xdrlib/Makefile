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
# Copyright (c) 2024, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xdrlib
# version mirrors the one of Python these sources were taken from
COMPONENT_VERSION=	3.9.19
COMPONENT_SRC=		files
COMPONENT_ARCHIVE_SRC=	none
COMPONENT_BUGDB=	python-mod/xdrlib
COMPONENT_ANITYA_ID=	N/A
COMPONENT_BAID=		164093

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/python-common.mk
include $(WS_MAKE_RULES)/ips.mk


$(BUILD_DIR)/%/.built:	$(SOURCE_DIR)/.prep
	$(RM) -r $(@D) ; $(MKDIR) $(@D)
	$(TOUCH) $@

$(BUILD_DIR)/%/.installed: $(BUILD_DIR)/%/.built
	$(MKDIR) $(PROTO_DIR)$(PYTHON_LIB)/solaris
	$(CP) $(SOURCE_DIR)/xdrlib.py $(PROTO_DIR)$(PYTHON_LIB)/solaris
	$(PYTHON) -m compileall $(PROTO_DIR)$(PYTHON_LIB)/solaris
	$(TOUCH) $@

COMPONENT_PRE_TEST_ACTION = \
	touch $(PROTO_DIR)$(PYTHON_LIB)/solaris/__init__.py

COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -B -m unittest
COMPONENT_TEST_ARGS =	test_xdrlib.py

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TEST_NO_ARCH)
