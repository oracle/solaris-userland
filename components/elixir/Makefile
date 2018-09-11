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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

# Only executable scripts and bytecode files.
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

# Assumes GNU sed for the installation.
PATH=/usr/gnu/bin:/usr/bin:/usr/sbin

COMPONENT_NAME=		elixir
COMPONENT_VERSION=	1.7.3
COMPONENT_PROJECT_URL=	https://elixir-lang.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:c9beabd05e820ee83a56610cf2af3f34acf3b445c8fabdbe98894c886d2aa28e
COMPONENT_ARCHIVE_URL=	https://github.com/elixir-lang/$(COMPONENT_NAME)/archive/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/elixir
COMPONENT_ANITYA_ID=	673

TPNO=			45294

BUILD_STYLE= justmake
include $(WS_MAKE_RULES)/common.mk

# Elixir does not like cloney, so a simple copy is used instead.
CLONEY = echo
COMPONENT_PRE_BUILD_ACTION = $(CP) -rp $(SOURCE_DIR)/. $(@D)

COMPONENT_BUILD_TARGETS =	compile
# Required to avoid possible malfunctions.
COMPONENT_BUILD_ENV += LC_ALL=en_US.UTF-8

COMPONENT_INSTALL_TARGETS = install
COMPONENT_INSTALL_ENV +=	DESTDIR=$(PROTO_DIR)
COMPONENT_INSTALL_ENV +=	MANDIR=/usr/share/man
COMPONENT_INSTALL_ENV +=	PREFIX=$(USRDIR)

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_ENV += LC_ALL=en_US.UTF-8
# Remove progress dots, make output, all empty lines, and git lines.
COMPONENT_TEST_TRANSFORMS += '-e "/\.\./d" -e "/^make/d" -e "/^$$/d" -e "/git_repo/d"'
# Ignore runtime statistics and random seeds used for the elixir testing.
COMPONENT_TEST_TRANSFORMS += '-e "/^Finished in/d" -e "/^Randomized with seed/d"'
# Ignore the spurious error message (see issue #8183 on elixir github).
COMPONENT_TEST_TRANSFORMS += '-e "/resides in sticky dir/d"'

REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += runtime/erlang

