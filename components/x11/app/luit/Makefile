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
# Copyright (c) 2018, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		luit
COMPONENT_VERSION=	20250912
HUMAN_VERSION=		2.0-$(COMPONENT_VERSION)
IPS_COMPONENT_VERSION=	2.0.$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_HASH= \
	sha256:46958060e66f35bcb8a51ba22da1c13d726d28a86c1cf520511bcf7914bef39e
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tgz
COMPONENT_ARCHIVE_URL=  https://invisible-mirror.net/archives/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	15047
COMPONENT_BAID=		418360

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
