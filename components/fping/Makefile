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

#
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		fping
COMPONENT_VERSION=	5.5
COMPONENT_PROJECT_URL=	https://www.fping.org/
COMPONENT_ARCHIVE_HASH=	\
	sha256:15c4e32b6c55ff105bafe03e8c91c7ca1b2eda31bf9a7127326bb87887ee18fe
COMPONENT_ARCHIVE_URL=	https://github.com/schweikert/fping/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	834

COMPONENT_BAID=	465615

# Deliver 'sbin' binaries to 'bin'.
CONFIGURE_SBINDIR.64= $(CONFIGURE_BINDIR.64)

CFLAGS +=		$(XPG6MODE)

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION =  \
        ($(CLONEY) $(SOURCE_DIR) $(@D))

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
