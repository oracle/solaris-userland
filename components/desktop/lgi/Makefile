#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2015, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=         lgi
COMPONENT_VERSION=      0.9.2.20260728
COMPONENT_PROJECT_URL=  https://github.com/lgi-devs/lgi
COMPONENT_SRC=          $(COMPONENT_NAME)-$(COMPONENT_VERSION)
GIT_REPO=               $(COMPONENT_PROJECT_URL).git
GIT_COMMIT_ID=          7a2276f9657a50ee548a636f2e646f96ec748bbd
GIT_HASH=              sha256:e1bbf4e748802319f260221b072a55bd33ed6e1eb1c682e7ee2c46dc6847f4f9
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	1851

COMPONENT_BAID=                   471072

# Tests do not build on Solaris yet
TEST_TARGET= $(SKIP_TEST)

BUILD_STYLE= justmake

include $(WS_MAKE_RULES)/common.mk

LDFLAGS += $(CC_BITS)

LUA_VERSION = 5.4
PKG_MACROS += LUA_VERSION=$(LUA_VERSION)

COMPONENT_BUILD_ENV += PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)"

COMPONENT_INSTALL_ARGS += LUA_VERSION=$(LUA_VERSION) PREFIX=$(USRDIR)
COMPONENT_INSTALL_ARGS.64 += LUA_LIBDIR=$(USRDIR)/lib/lua/$(LUA_VERSION)/64

CBE_PACKAGES += runtime/lua

REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
