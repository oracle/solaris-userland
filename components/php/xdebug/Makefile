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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xdebug
COMPONENT_VERSION=	3.4.0
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tgz
COMPONENT_ARCHIVE_HASH= \
	sha256:89667b8d04aaf04c023eb109900e1cce97ca39f97f2f3f24199630cc0e1cc77d
COMPONENT_ARCHIVE_URL=	http://xdebug.org/files/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://xdebug.org/
COMPONENT_BUGDB=	utility/php
COMPONENT_ANITYA_ID=	13302

COMPONENT_BAID=		190415

TEST_TARGET= $(NO_TESTS)
include $(PHP_TOP_DIR)/phpize.mk
include $(WS_MAKE_RULES)/common.mk
include $(PHP_TOP_DIR)/php.mk

CONFIGURE_OPTIONS +=	--enable-xdebug

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/php-82
REQUIRED_PACKAGES += web/php-83
REQUIRED_PACKAGES += web/php-84
