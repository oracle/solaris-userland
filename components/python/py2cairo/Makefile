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
# Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            32_and_64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		py2cairo
COMPONENT_SRC_NAME=	pycairo
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.gz
COMPONENT_VERSION=	1.8.10
COMPONENT_PROJECT_URL=	http://cairographics.org/pycairo/
COMPONENT_ARCHIVE_HASH=	\
    sha256:b15f71019e42e06d86f7e8fe5587f07c3de5a59a6c3a071b25fe100796dbcd56
COMPONENT_ARCHIVE_URL=	http://cairographics.org/releases/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	python-mod/pycairo
COMPONENT_ANITYA_ID=	13167

TPNO=			19938

# upstream delivers python3 support separately as "pycairo" (without the "2")
PYTHON_VERSIONS=        $(PYTHON2_VERSIONS)

BUILD_STYLE= setup.py

include $(WS_MAKE_RULES)/common.mk

PYTHON_DATA = $(USRDIR)

# the test scripts aren't hooked into the test target in pycairo, so run directly
COMPONENT_TEST_DIR =   $(SOURCE_DIR)
COMPONENT_TEST_CMD =   $(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

COMPONENT_TEST_TRANSFORMS += '-n -e "s/\(in \).*\(seconds\)/\1x \2/p"'
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += library/desktop/cairo
