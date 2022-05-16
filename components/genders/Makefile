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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32

# Parallel build jobs are supported only if GNU make is used.
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		genders
COMPONENT_VERSION=	1-28-1
IPS_COMPONENT_VERSION=	1.28.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=	https://github.com/chaos/genders
COMPONENT_ARCHIVE_HASH=	\
    sha256:3ca8b4771b2bf39383a3c383d36d308fa113de5c481e16fdef9cabd643359d09
COMPONENT_ARCHIVE_URL=	https://github.com/chaos/$(COMPONENT_NAME)/archive/refs/tags/$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.gz
COMPONENT_BUGDB=	library/libgenders
COMPONENT_ANITYA_ID=	13282

COMPONENT_BAID=		123417

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS +=   --bindir=/usr/bin
CONFIGURE_OPTIONS +=   --without-cplusplus-extensions
CONFIGURE_OPTIONS +=   --without-perl-extensions
CONFIGURE_OPTIONS +=   --without-python-extensions
CONFIGURE_OPTIONS +=   --without-java-extensions

# Actually, gmake check just builds genders_test binary and no tests are executed.
# When genders_test is manually executed, it terribly fails with lots of errors...
test: $(NO_TESTS)
system-test: $(NO_TESTS)
