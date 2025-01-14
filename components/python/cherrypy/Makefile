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
# Copyright (c) 2011, 2024, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

PATH=/usr/bin:/usr/gnu/bin:/usr/sbin

COMPONENT_NAME=		cherrypy
COMPONENT_VERSION=	18.10.0
COMPONENT_PROJECT_URL=	http://www.cherrypy.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:d50898a6b49804be034c3210f96affd99b0c6997f32f338cbe7da0900fc31e65
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_BUGDB=	python-mod/cherrypy
COMPONENT_ANITYA_ID=	3799
COMPONENT_BAID=		191201


include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

COMPONENT_POST_INSTALL_ACTION = \
	(cd $(PROTO_DIR)/usr/bin ; $(MV) cherryd cherryd$(PYTHON_VERSION))

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# Some tests can fail with proxy set
COMPONENT_TEST_ENV += http_proxy= HTTP_PROXY=
COMPONENT_TEST_ENV += https_proxy= HTTPS_PROXY=

COMPONENT_TEST_DIR = 	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =	-q
COMPONENT_TEST_TRANSFORMS += \
   '-e "s/\(in \).*\(seconds.*\)/\1x \2/"' \
   '-e "/hypothesis/d"' \
   '-e "/^platform/d"' \
   '-e "/^SKIP/d"' \
   '-e "s/\(tmp\).*/\1\/XXX/"' \
   '-e "s/=*//"'

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += $(PYVS:%=library/python/cheroot-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/filelock-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/more_itertools-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/portend-%)

# Setup related components
REQUIRED_PACKAGES += library/python/setuptools_scm
