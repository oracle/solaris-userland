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
# Copyright (c) 2020, Oracle and/or its affiliates.
#
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		py3c
COMPONENT_VERSION=	1.2
COMPONENT_PROJECT_URL=	https://py3c.readthedocs.io/
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:0e28ea43f5f092967a344294194f55a81fb55adc3c17a0314545d606eb5f6267
COMPONENT_ARCHIVE_URL=	https://github.com/encukou/py3c/archive/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/py3c
COMPONENT_ANITYA_ID=	104113

TPNO=			63454

BUILD_STYLE= justmake

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_INSTALL_ENV +=	prefix=$(USRDIR)
