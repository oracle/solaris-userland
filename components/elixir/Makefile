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
# Copyright (c) 2018, 2026, Oracle and/or its affiliates.
#

# Only executable scripts and bytecode files.
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

# Assumes GNU sed for the installation.
PATH=/usr/gnu/bin:/usr/bin:/usr/sbin

COMPONENT_NAME=		elixir
COMPONENT_VERSION=	1.19.5
COMPONENT_PROJECT_URL=	https://elixir-lang.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:10750b8bd74b10ac1e25afab6df03e3d86999890fa359b5f02aa81de18a78e36
COMPONENT_ARCHIVE_URL=	https://github.com/elixir-lang/$(COMPONENT_NAME)/archive/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/elixir
COMPONENT_ANITYA_ID=	673

COMPONENT_BAID=		370926

BUILD_STYLE= justmake

ifeq ($(MACH),sparc)
# Disable tests on SPARC since they are unreproducible with regressions.
$(SKIP_TEST_AT_TOP_LEVEL)
endif

# This is just a workaround to a problem we mostly see on sparc.
# The build stops and never finishes in about 8 % of cases. The process
# erl_child_setup seems to be stuck. Elixir normally builds under five
# minutes, so 15 minutes timeout should be more than enough. This change
# makes sure that elixir is built in 4 attempts and if all attempts fail,
# then there is about 99.995 % probability that there is a problem in
# code or Common Build Environment...
GMAKE := $(WS_TOOLS)/repeat_cmd 4 15m $(GMAKE)
COMPONENT_BUILD_ENV += REPEAT_CMD_CLEANUP="gmake clean"

# Solaris: Erlang VM may hang during Elixir build when running under GNU make
# with an interactive TTY (jobserver FD inheritance). Force non-interactive
# Erlang startup to avoid erl_child_setup deadlock.
COMPONENT_BUILD_ENV += ERL_FLAGS="-noshell -noinput"

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
COMPONENT_TEST_TRANSFORMS += '-e "s/\x1B\[[0-9;]*[[:alpha:]]//g"'
COMPONENT_TEST_TRANSFORMS += '-e "s/with seed: [0-9]\+, //"'
COMPONENT_TEST_TRANSFORMS += '-e "s/ max_cases: [0-9]\+//"'
COMPONENT_TEST_TRANSFORMS += '-e "s/^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]\.[0-9][0-9][0-9] //"'
COMPONENT_TEST_TRANSFORMS += '-e "s|/tmp/mix-local-installer-fetcher-[^/]\+/|/tmp/mix-local-installer-fetcher-XXXX/|g"'
COMPONENT_TEST_TRANSFORMS += '-e "s/^\.\+//"'
COMPONENT_TEST_TRANSFORMS += '-e "/^\[notice\] Application parsetools exited: :stopped/d"'
COMPONENT_TEST_TRANSFORMS += '-e "/^[[:space:]]*warning: redefining module .* (current version .*)$$/,+5d"'
COMPONENT_TEST_TRANSFORMS += '-e "/^warning: using single-quoted strings to represent charlists is deprecated\.$$/,+4d"'
COMPONENT_TEST_TRANSFORMS += '-e "/^warning: single-quoted string represent charlists\./,+1d"'
COMPONENT_TEST_TRANSFORMS += '-e "/^Finished in/d"'
COMPONENT_TEST_TRANSFORMS += '-e "/^$$/d"'

REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += runtime/erlang

