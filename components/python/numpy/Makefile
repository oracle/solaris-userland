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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

COMPILER =		gcc
BUILD_BITS = 		64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		numpy
COMPONENT_VERSION=	1.26.4
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:7e96b748c09ccadedfb3878ea107a3c9423ab4342efc342eef8e46320d98ff4e
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://www.numpy.org/
COMPONENT_BUGDB=	python-mod/numpy
COMPONENT_ANITYA_ID=	2509
COMPONENT_BAID=		326363
 
# this version of numpy is not Python 3.13 ready yet
PYTHON_VERSIONS = $(WITHOUT_PYTHON3.13)

BUILD_STYLE= setup.py
include $(WS_MAKE_RULES)/common.mk

COMPONENT_BUILD_ARGS.gcc	+= --compiler=gnu --fcompiler=gnu95
COMPONENT_BUILD_ARGS 		+= $(COMPONENT_BUILD_ARGS.$(COMPILER)) -lm

PYTHON_ENV +=   CC="$(CC) $(CC_BITS)"

PYTHON_SCRIPTS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES)/numpy/*.py
PYTHON_SCRIPTS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES)/numpy/*/*.py
PYTHON_SCRIPTS += $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES)/numpy/*/*/*.py

COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin ; $(MV) -f f2py f2py$(PYTHON_VERSION));

# Our PYTHON_SCRIPTS processing modifies some files after they have been
# compiled, making the previously created pyc files stale. Because of that,
# we have to recompile them all.
COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON) -m compileall $(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES)


COMPONENT_TEST_DIR  = $(@D)
COMPONENT_TEST_ARGS = -c 'import numpy; numpy.test()'
COMPONENT_TEST_ENV += F90="$(GCC_ROOT)/bin/gfortran -m$(BITS)"
# Do not use tmp directory for tests to avoid persistent RAM usage.
COMPONENT_TEST_ENV += PYTEST_DEBUG_TEMPROOT=$(BUILD_DIR)/$(MACH64)-$(PYTHON_VERSION)/

COMPONENT_TEST_TRANSFORMS += \
	'-nE -e "s/ ?=+ ?//g" ' \
	'-e "s/ in [0-9]+(\.[0-9]*)?s.*//" ' \
	'-e "s/[0-9]+ (deselected|passed|skipped|warnings|xfailed|xpassed)/XXX \1/g" ' \
	'-e "/^FAILED/p" ' \
	'-e "/^ERROR/p" ' \
	'-e "/passed,/p"'

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(PYTHON_VERSION).$(MACH).master

REQUIRED_PACKAGES += library/python/cython
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
