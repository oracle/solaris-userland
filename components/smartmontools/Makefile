#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#
# Copyright (c) 2017, 2026, Oracle and/or its affiliates.
#
COMPILER =		gcc
BUILD_BITS =		64
CTF_MODE =		off	# Has no effect
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		smartmontools
COMPONENT_VERSION=	7.5
COMPONENT_PROJECT_URL=	https://www.smartmontools.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:690b83ca331378da9ea0d9d61008c4b22dde391387b9bbad7f29387f2595f76e
COMPONENT_ARCHIVE_URL=	https://github.com/smartmontools/smartmontools/releases/download/RELEASE_$(subst .,_,$(COMPONENT_VERSION))/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	4835

COMPONENT_BAID=		441748

TEST_TARGET=	$(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Run automake to pickup man page normalization changes.
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv; automake)

CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)

# Avoid using -std=c++11 with new autoconf 2.72
CONFIGURE_OPTIONS +=   ac_cv_prog_cxx_cxx11=

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
