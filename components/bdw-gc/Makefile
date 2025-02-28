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
# Copyright (c) 2025, Oracle and/or its affiliates.
#

COMPILER= gcc
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		bdw-gc
COMPONENT_VERSION=	8.2.8
#COMPONENT_SRC=		gc-$(COMPONENT_VERSION)
#COMPONENT_ARCHIVE_URL=	\
    https://github.com/ivmai/bdwgc/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
#COMPONENT_ARCHIVE_HASH=	\
    sha256:7649020621cb26325e1fb5c8742590d92fb48ce5c259b502faf7d9fb5dabb160
GIT_REPO=		https://github.com/ivmai/bdwgc
GIT_COMMIT_ID=		64b73a16a413e7723d923052176c94fb3cd1d5dc
COMPONENT_PROJECT_URL=	https://github.com/ivmai/bdwgc
COMPONENT_BUGDB=	library/bdw-gc
COMPONENT_ANITYA_ID=	336648
COMPONENT_BAID=		193784

COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv)

# This will make the gctest pass
CONFIGURE_OPTIONS += --disable-thread-local-alloc

include $(WS_MAKE_RULES)/common.mk
