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
BUILD_BITS=		64
COMPILER=		gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		iperf
COMPONENT_VERSION=	3.18
COMPONENT_PROJECT_URL=	http://software.es.net/iperf/
COMPONENT_ARCHIVE_HASH=	sha256:c0618175514331e766522500e20c94bfb293b4424eb27d7207fb427b88d20bab
COMPONENT_ARCHIVE_URL=	https://downloads.es.net/pub/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/iperf
COMPONENT_ANITYA_ID=	1389
COMPONENT_BAID=	191414

# See the TESTING file.
TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# Needed to successfully run the test_commands.sh script in a built workspace.
COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS+=	--without-openssl

REQUIRED_PACKAGES += system/library/math
