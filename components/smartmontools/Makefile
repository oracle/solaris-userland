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
# Copyright (c) 2017, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64
CTF_MODE =		off	# Has no effect
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		smartmontools
COMPONENT_VERSION=	6.5
COMPONENT_PROJECT_URL=	https://www.smartmontools.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:89e8bb080130bc6ce148573ba5bb91bfe30236b64b1b5bbca26515d4b5c945bc
COMPONENT_ARCHIVE_URL=	https://sourceforge.net/projects/$(COMPONENT_NAME)/files/$(COMPONENT_NAME)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	4835

COMPONENT_BAID=		37704

TEST_TARGET=	$(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

#
# This utility reads specific hardware pages, so it would be hard to
# ensure aligned access to them in all cases. Therefore ask the compiler, to
# do the dirty stuff instead of us.
# 
studio_ALIGN.sparc.32 = -xmemalign=8i
studio_ALIGN.sparc.64 = -xmemalign=16i

# Run automake to pickup man page normalization changes.
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv; automake)

CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)

REQUIRED_PACKAGES += system/library/c++-runtime
