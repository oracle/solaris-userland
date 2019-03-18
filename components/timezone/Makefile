#
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
# Copyright (c) 2005, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME= 	timezone
COMPONENT_VERSION=    	2018.8
COMPONENT_PROJECT_URL=	http://www.iana.org/time-zones
COMPONENT_SRC=
COMPONENT_ARCHIVE_SRC=	none
HUMAN_VERSION=		2018i
TPNO=			49973
COMPONENT_ANITYA_ID=	5021

OS_META_VERSION=	-$(PKG_SOLARIS_VERSION)

# "etcetera" must be listed before "backward" because it sets up links that
# "backward" needs.
TZFILES= africa antarctica asia australasia etcetera europe \
	 factory northamerica pacificnew \
	 southamerica backward

BUILD_STYLE= archive
COMMON_TARGETS= no
include $(WS_MAKE_RULES)/common.mk

PKG_MACROS +=		OS_META_VERSION=$(OS_META_VERSION)

POFILE=zoneinfo.po

CLEAN_PATHS += $(POFILE)

build:
	@/bin/sh ./do_pofile.sh | /usr/bin/msguniq > $(POFILE)

install: build
	/usr/sbin/zic -d $(PROTOUSRSHARELIBDIR)/zoneinfo $(TZFILES)

# empty test target
test:	$(NO_TESTS)

system-test:    $(NO_TESTS)

