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
# Copyright (c) 2018, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xfs
COMPONENT_VERSION=	1.2.0
COMPONENT_ARCHIVE_HASH= \
	sha256:db2212115783498f8eeaaee1349461d6c4e9d2005e142bacd3a984fe57269860
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	5256
TPNO=			49528

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += --enable-syslog
CONFIGURE_OPTIONS += --sysconfdir=$(CONFIGURE_PREFIX)/lib
CONFIGURE_OPTIONS += --enable-inetd
CONFIGURE_OPTIONS += --disable-devel-docs
CONFIGURE_OPTIONS += --with-default-font-path='catalogue:/etc/X11/fontpath.d'
CONFIGURE_OPTIONS += --with-default-config-file='/etc/X11/fs/config,/usr/lib/X11/fs/config,/etc/openwin/fs/fontserver.cfg,/usr/openwin/lib/X11/fontserver.cfg'

CPPFLAGS += -DNO_ALLOCA

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libxfont2
REQUIRED_PACKAGES += x11/library/xtrans
