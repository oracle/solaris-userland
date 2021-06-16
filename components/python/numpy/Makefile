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
# Copyright (c) 2016, 2021, Oracle and/or its affiliates.
#

COMPILER =		gcc
BUILD_BITS = 		32_and_64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		numpy
COMPONENT_VERSION=	1.19.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_HASH=	\
    sha256:76766cc80d6128750075378d3bb7812cf146415bd29b588616f72c943c00d598
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://www.numpy.org/
COMPONENT_BUGDB=	python-mod/numpy
COMPONENT_ANITYA_ID=	2509

TPNO=			59912

PYTHON_VERSIONS = $(PYTHON3_VERSIONS)

BUILD_STYLE= setup.py
include $(WS_MAKE_RULES)/common.mk

COMPONENT_BUILD_ARGS.gcc	+= --compiler=gnu --fcompiler=gnu95
COMPONENT_BUILD_ARGS 		+= $(COMPONENT_BUILD_ARGS.$(COMPILER)) -lm

PYTHON_ENV +=   CC="$(CC) $(CC_BITS)"

PYTHON_SCRIPTS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES_BASE)/numpy/*.py
PYTHON_SCRIPTS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES_BASE)/numpy/*/*.py
PYTHON_SCRIPTS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES_BASE)/numpy/*/*/*.py

# Our PYTHON_SCRIPTS processing modifies some files after they have been
# compiled, making the previously created pyc files stale. Because of that,
# we have to recompile them all.
COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON) -m compileall $(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE)


COMPONENT_TEST_DIR  = $(@D)
COMPONENT_TEST_ARGS = -c 'import numpy; numpy.test()'
COMPONENT_TEST_ENV += F90="$(GCC_ROOT)/bin/gfortran -m$(BITS)"

COMPONENT_TEST_TRANSFORMS = '-n -e "s/, [0-9]* warnings//" -e "s/\(in \).*\(seconds\)/\1x \2/p"'
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(PYTHON_VERSION)-$(BITS).$(MACH).master

REQUIRED_PACKAGES += library/python/cython
REQUIRED_PACKAGES += library/python/nose
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/math
