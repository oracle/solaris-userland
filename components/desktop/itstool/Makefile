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
# Copyright (c) 2016, 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS= 		NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		itstool
COMPONENT_VERSION=	2.0.6
COMPONENT_PROJECT_URL=	http://itstool.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
    sha256:6233cc22726a9a5a83664bf67d1af79549a298c23185d926c3677afa917b92a9
COMPONENT_ARCHIVE_URL=	 http://files.itstool.org/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	13109
COMPONENT_BUGDB=        utility/itstool

TPNO=			55275

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Use explicit Python version rather than the default one
CONFIGURE_ENV +=	PYTHON=$(PYTHON.2.7)

# pkgdepend complains if it doesn't find a version of python specified
PYTHON_SCRIPTS += $(PROTOUSRBINDIR)/itstool

REQUIRED_PACKAGES += library/python/libxml2-27
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += text/gawk
