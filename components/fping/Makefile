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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		fping
COMPONENT_VERSION=	5.1
COMPONENT_PROJECT_URL=	http://www.fping.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:1ee5268c063d76646af2b4426052e7d81a42b657e6a77d8e7d3d2e60fd7409fe
#gmake download fails (even with different proxies). Inform gatekeepers to 
# download the tar ball and cache it in server
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)dist/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	834

COMPONENT_BAID=		117128

# Deliver 'sbin' binaries to 'bin'.
CONFIGURE_SBINDIR.64= $(CONFIGURE_BINDIR.64)

CFLAGS +=		$(XPG6MODE)

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION =  \
        ($(CLONEY) $(SOURCE_DIR) $(@D))
