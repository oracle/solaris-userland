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
# Copyright (c) 2023, Oracle and/or its affiliates.
#
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		autoconf-archive
COMPONENT_VERSION=	2022.09.03
IPS_COMPONENT_VERSION=	2022.9.3
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:e07454f00d8cae7907bed42d0747798927809947684d94c37207a4d63a32f423
COMPONENT_BUGDB=  	utility/autoconf
COMPONENT_SIG_URL=      $(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ANITYA_ID=	142

COMPONENT_BAID=		136245

include $(WS_MAKE_RULES)/gnu-component.mk
