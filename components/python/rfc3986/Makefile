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
# Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		rfc3986
COMPONENT_VERSION=	1.3.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:d5ff7e9cc8d6186ccbf9644a667c35798eec70476ffe55fb2dcdb80dc7643454
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://rfc3986.readthedocs.io/en/latest/
COMPONENT_BUGDB=	python-mod/rfc3986
COMPONENT_ANITYA_ID=	13218

TPNO=			55816

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Meta package has to rename 3.4 variant to legacy
# as there was never a non legacy one
FIX_MANIFEST_LEGACY:
	echo "<transform depend fmri=(.*)rfc3986-34 \
		-> edit fmri library/python legacy/library/python>" | \
	$(PKGMOGRIFY) /dev/fd/0 $(MANIFEST_BASE)-rfc3986.mogrified \
		> $(MANIFEST_BASE)-rfc3986.mogrified-fixed ;
	$(MV) $(MANIFEST_BASE)-rfc3986.mogrified-fixed \
		$(MANIFEST_BASE)-rfc3986.mogrified

$(MANIFEST_BASE)-rfc3986.mangled: FIX_MANIFEST_LEGACY


COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)
