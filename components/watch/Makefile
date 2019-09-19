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
# Copyright (c) 2015, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		procps-ng
COMPONENT_VERSION=	3.3.15
COMPONENT_PROJECT_URL=	https://gitlab.com/procps-ng/procps/
COMPONENT_SRC=		procps-v$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:fb2673f902c99b0c392c06b3eb074a5c80fc9fc215cfc42ed19daf7fb20cb41e
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)-/archive/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/watch
COMPONENT_ANITYA_ID=	3708

TPNO=			54100

INSTALL_TARGET= build
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Required as there is no configure file in the component archive.
COMPONENT_PREP_ACTION += \
	( cd $(@D) ; PATH="$(GNUBIN):$(PATH)" $(CONFIG_SHELL) autogen.sh)

# Build needs its file inside SOURCE_DIR.
COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

# Force the configure script to use gnu make.
CONFIGURE_ENV +=	"MAKE=gmake"

# Build directory is not detected automatically.
CONFIGURE_OPTIONS +=	"--srcdir=$(BUILD_DIR_64)"

CFLAGS +=			-I$(USRINCDIR)/ncurses

# Always show the build and link lines for easier debugging.
COMPONENT_BUILD_ARGS +=		V=1

# Don't try to link watch with .../proc/libprocps.la as it's not needed.
COMPONENT_BUILD_ARGS +=		LDADD=

COMPONENT_BUILD_TARGETS =	watch

PKG_PROTO_DIRS += $(BUILD_DIR_64)

REQUIRED_PACKAGES +=	library/ncurses
