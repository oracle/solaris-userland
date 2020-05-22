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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates. 
#

BUILD_BITS =            64
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=         lgi
COMPONENT_VERSION=      0.9.2
COMPONENT_PROJECT_URL=  https://github.com/pavouk/lgi
COMPONENT_ARCHIVE_HASH= \
        sha256:cfc4105482b4730b3a40097c9d9e7e35c46df2fb255370bdeb2f45a886548c4f
COMPONENT_ARCHIVE_URL=  https://github.com/pavouk/lgi/archive/$(COMPONENT_VERSION).tar.gz
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	1851

TPNO=                   55245

# Tests do not build on Solaris yet
TEST_TARGET= $(SKIP_TEST)

BUILD_STYLE= justmake

include $(WS_MAKE_RULES)/common.mk

LDFLAGS += $(CC_BITS)

COMPONENT_BUILD_ENV += PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)"

COMPONENT_INSTALL_ARGS += LUA_VERSION=5.2 PREFIX=$(USRDIR)
COMPONENT_INSTALL_ARGS.64 += LUA_LIBDIR=$(USRDIR)/lib/lua/5.2/64

REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += runtime/lua
