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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

COMPILER =		gcc
BUILD_BITS =		64
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cython
COMPONENT_VERSION=	3.0.11
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=		\
    sha256:2af4f1c0dadb8613126d345da3cd93b0658685e8b34a7a6b083694a8188ac83e
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=  http://cython.org/
COMPONENT_BUGDB=	python-mod/cython
COMPONENT_ANITYA_ID=	12679
COMPONENT_BAID=		185614

# Avoid warnings about use of the deprecated NumPy API. Please see
# http://docs.cython.org/en/latest/src/reference/compilation.html#configuring-the-c-build
# for details.
CPPFLAGS +=		-DNPY_NO_DEPRECATED_API=NPY_1_7_API_VERSION
CFLAGS +=		$(CPPFLAGS)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Tests take several hours to finish.
$(SKIP_TEST_AT_TOP_LEVEL)

# Since each version of the package delivers the same
# files to usr/bin, we need mediation. This is enabled
# by making a copy of the script with an appropriate
# suffix.
COMPONENT_POST_INSTALL_ACTION += \
        (cd $(PROTO_DIR)/usr/bin ; \
            for c in cython cythonize cygdb; do \
                $(MV) $$c $$c-$(PYTHON_VERSION) ; \
            done )

COMPONENT_TEST_ENV += CC=gcc CXX=g++ MAKE=gmake
COMPONENT_TEST_DIR =    $(SOURCE_DIR)
COMPONENT_TEST_CMD =    $(PYTHON) ./runtests.py
COMPONENT_TEST_ARGS=    --no-cleanup-failures

COMPONENT_TEST_TRANSFORMS += \
'-n -e "/^FAIL:/p" ' \
'-e "/^ERROR:/p" ' \
'-e "/^FAILED/p"'

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(PYTHON_VERSION).$(MACH).master

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += developer/debug/gdb
