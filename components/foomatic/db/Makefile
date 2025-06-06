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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#
BUILD_BITS=	64
COMPILER=	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		foomatic-db
DAILY_VERSION=		20250519
# foomatic-db creates only the daily snapshots
COMPONENT_VERSION=	$(DAILY_VERSION)
FOO_VERSION=		4.0
IPS_COMPONENT_VERSION=	$(FOO_VERSION).$(DAILY_VERSION)
COMPONENT_BAID=		329524
# version (4.0) is relative to foomatic-db-engine
#  ...do not combine foomatic-db with foomatic-db-engine of the different versions
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(FOO_VERSION)-$(DAILY_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	sha256:3d8ab424708af682bef59fb24d3634c7dd5a0db07d5f5bb87ed068db34f5ead2
COMPONENT_ARCHIVE_URL=	http://www.openprinting.org/download/foomatic/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	https://wiki.linuxfoundation.org/openprinting/database/foomatic
COMPONENT_BUGDB=	utility/foomatic

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# var is needed to check the "weird symlinks"
PKG_MACROS += COMPONENT_DIR="$(COMPONENT_DIR)"

COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);
COMPONENT_PRE_CONFIGURE_ACTION = $(CLONEY) $(SOURCE_DIR) $(@D)

CONFIGURE_OPTIONS +=	--with-drivers=NOOBSOLETES
CONFIGURE_OPTIONS +=	INSTALL=/usr/sbin/install
CONFIGURE_OPTIONS +=	TAR=/usr/gnu/bin/tar

ASLR_MODE = $(ASLR_NOT_APPLICABLE)
