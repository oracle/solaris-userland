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
# Copyright (c) 2014, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		pflogd
COMPONENT_VERSION=	OPENBSD_5_5
IPS_COMPONENT_VERSION=	5.5
COMPONENT_PROJECT_URL=	http://www.openbsd.org
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
# The archive exists only in the userland cache.  In order to update the cache,
# we have to get the sources via CVS manually and ask the gatekeepers to add it.
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_URL=
COMPONENT_ARCHIVE_SRC=	cache
COMPONENT_ARCHIVE_HASH= sha256:cfa97a28da9c4c5d07a2c6c8225e867d031417a427effb7152f9e8beea614957
COMPONENT_BUGDB=	service/pflogd

TPNO=	24254

BUILD_STYLE= justmake
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

#
# Don't overwrite CFLAGS here, just add our options there.
#
COMPONENT_BUILD_ENV += CFLAGS="$(CFLAGS) -D_SOLARIS_ -DOBSD_COMP -lscf"

COMPONENT_PRE_BUILD_ACTION = \
	($(CP) pflogd.Solaris/smf-config.c $(@D)/. ; \
	$(CP) pflogd.Solaris/smf-config.h $(@D)/. )

COMPONENT_INSTALL_ARGS +=	PREFIX=$(PROTOUSRDIR)
COMPONENT_INSTALL_ARGS +=	MANDIR=$(PROTOUSRSHAREMANDIR)
COMPONENT_INSTALL_ARGS +=	INSTALL=/usr/gnu/bin/install

REQUIRED_PACKAGES += network/firewall
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/header
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/datalink
REQUIRED_PACKAGES += system/library/libpcap
REQUIRED_PACKAGES += system/library/smf
