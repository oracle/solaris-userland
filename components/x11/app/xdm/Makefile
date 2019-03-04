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

COMPONENT_NAME=		xdm
COMPONENT_VERSION=	1.1.9
COMPONENT_ARCHIVE_HASH= \
	sha256:e7b1db0e1b0d0113a301d94e40b0314e55f7e0006415f50a9cf06f636b11b134
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	5255

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

# Only build shared greeter module, not static
CONFIGURE_OPTIONS += --enable-shared=yes
CONFIGURE_OPTIONS += --enable-static=no
# Set various paths to better match Solaris
CONFIGURE_OPTIONS += --with-xdmconfigdir=/etc/X11/xdm
CONFIGURE_OPTIONS += --disable-secure-rpc
CONFIGURE_OPTIONS += --with-piddir=/var/run/xdm
CONFIGURE_OPTIONS += --with-authdir=/var/run/xdm
CONFIGURE_OPTIONS += --bindir=$(USRSBINDIR)
CONFIGURE_OPTIONS += --libdir=$(CONFIGURE_LIBDIR.32)
# Find xrdb & xterm in /usr/bin even with --bindir set to /usr/sbin
CONFIGURE_OPTIONS += --with-xrdb='/usr/bin/xrdb'
CONFIGURE_OPTIONS += --with-default-session=command='/usr/bin/xterm -ls'
CONFIGURE_OPTIONS += DEF_SERVER='/usr/bin/X'
CONFIGURE_OPTIONS += DEF_USER_PATH=/usr/bin:/usr/sbin
CONFIGURE_OPTIONS += DEF_SYSTEM_PATH=/usr/bin:/usr/sbin

COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTO_DIR)/usr/lib/X11/xdm; \
	$(MV) $(PROTO_DIR)/usr/sbin/xdmshell $(PROTO_DIR)/usr/lib/X11/xdm/; \
	$(CP) $(PROTO_DIR)/etc/X11/xdm/X* $(PROTO_DIR)/usr/lib/X11/xdm/; \
	$(CP) $(PROTO_DIR)/etc/X11/xdm/xdm-config $(PROTO_DIR)/usr/lib/X11/xdm/;

REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxau
REQUIRED_PACKAGES += x11/library/libxdmcp
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxft
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/libxpm
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
