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
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
#

COMPILER =		gcc
BUILD_BITS =		32_and_64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		Cython
COMPONENT_VERSION=	0.28.2
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=		\
    sha256:e0ab1a807792f60fb5cd9efc0044cbeefa0a69d39e1003bd9cfa7e66916608b9
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=  http://cython.org/
COMPONENT_BUGDB=	python-mod/cython
COMPONENT_ANITYA_ID=	12679

TPNO=			42613

# Avoid warnings about use of the deprecated NumPy API. Please see
# http://docs.cython.org/en/latest/src/reference/compilation.html#configuring-the-c-build
# for details.
CPPFLAGS +=		-DNPY_NO_DEPRECATED_API=NPY_1_7_API_VERSION
CFLAGS +=		$(CPPFLAGS)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/setup.py.mk

# Since each version of the package delivers the same
# files to usr/bin, we need mediation. This is enabled
# by making a copy of the script with an appropriate
# suffix.
COMPONENT_POST_INSTALL_ACTION += \
        (cd $(PROTO_DIR)/usr/bin ; \
         if [[ "$(PYTHON_VERSION)" == "2.7" && "$(BITS)" == "64" ]]; then \
            $(MKDIR) $(PROTO_DIR)/usr/bin/$(MACH64); \
            for c in cython cythonize cygdb; do \
                $(MV) $$c $(MACH64)/$$c-$(PYTHON_VERSION) ; \
            done; \
         else \
	    for c in cython cythonize cygdb; do \
	         $(MV) $$c $$c-$(PYTHON_VERSION) ; \
	    done; fi )


COMPONENT_TEST_ENV += CC=gcc CXX=g++ MAKE=gmake
COMPONENT_TEST_DIR =    $(SOURCE_DIR)
COMPONENT_TEST_CMD =    $(PYTHON) ./runtests.py
COMPONENT_TEST_ARGS=    --no-cleanup-failures

build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

test:		$(TEST_64)

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += developer/debug/gdb
