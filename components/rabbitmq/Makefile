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
# Copyright (c) 2013, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

PATH=/usr/gnu/bin:/usr/bin:/usr/sbin

COMPONENT_NAME=		rabbitmq-server
COMPONENT_VERSION=	3.8.18
COMPONENT_SRC_NAME=	rabbitmq-server
COMPONENT_PROJECT_URL=	https://www.rabbitmq.com/
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.xz
COMPONENT_BUGDB=	service/rabbitmq
COMPONENT_ANITYA_ID=	5585
COMPONENT_ARCHIVE_HASH= sha256:75372b483f141cb938b6ef8a6064f10ff7c1ea2ab0649f056992b6eaa0670471
COMPONENT_ARCHIVE_URL= https://github.com/rabbitmq/rabbitmq-server/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc

TPNO=			72148

BUILD_STYLE= justmake

# This is just a workaround to a problem we occasionally see. The build stops
# and never finishes. The process erl_child_setup seems to be stuck. Rabbitmq
# normally builds under 15 minutes, so 45 minutes timeout should be more than
# enough. This change makes sure that the automated builds are not halted but
# rather RabbitMQ is built in three attempts.
GMAKE := $(WS_TOOLS)/repeat_cmd 3 45m $(GMAKE)
COMPONENT_BUILD_ENV += REPEAT_CMD_CLEANUP="gmake clean"

include $(WS_MAKE_RULES)/common.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# Use a simple copy instead of cloney.
CLONEY := echo
# Copy the RabbitMQ source code, remove the bundled hex (bytecode),
# and use the system hex to extract sources of Elixir dependencies.
COMPONENT_PRE_BUILD_ACTION = (	\
	cp -rd $(SOURCE_DIR)/. $(@D);	cd $(@D); \
	gmake deps/.hex/cache.ets; \
	rm -Rf deps/.mix/; cd deps/rabbitmq_cli/; \
	env HEX_OFFLINE=1 HOME=../ DEPS_DIR=../ MIX_ENV=prod \
	LC_ALL=en_US.UTF-8 mix deps.get --only prod \
);

COMPONENT_BUILD_ACTION +=	/usr/bin/true
COMPONENT_BUILD_TARGETS =	all
COMPONENT_BUILD_ENV += LC_ALL=en_US.UTF-8

COMPONENT_INSTALL_TARGETS = install install-man
COMPONENT_INSTALL_ENV +=	DESTDIR=$(PROTO_DIR)
COMPONENT_INSTALL_ENV +=	MANDIR=/usr/share/man
COMPONENT_INSTALL_ENV +=	RMQ_ROOTDIR=/usr
COMPONENT_INSTALL_ENV +=	RMQ_BINDIR=/usr/lib/rabbitmq/bin
COMPONENT_INSTALL_ENV +=	RMQ_LIBDIR=/usr/lib
COMPONENT_INSTALL_ENV +=	RMQ_ERLAPP_DIR=/usr/lib/rabbitmq
COMPONENT_INSTALL_ENV +=	LC_ALL=en_US.UTF-8

# We need to create and install plugins before the tests.
$(TEST_TARGET): $(INSTALL_TARGET)

# Execute a quick test to verify RabbitMQ installation.
# RabbitMQ service has to be disabled before the testing.
COMPONENT_TEST_DIR =		$(COMPONENT_DIR)
COMPONENT_TEST_CMD =		$(SHELL)
COMPONENT_TEST_ENV =		LC_ALL=en_US.UTF-8
COMPONENT_TEST_TARGETS =	test.sh $(BUILD_DIR_64) $(BUILD_DIR_64)/test-rabbit
COMPONENT_TEST_TRANSFORMS +=	'-e "/is updated to a safe effective value of/d"'

# Deliver hardlinks as they appear in the proto area
PKG_AUTO_HARDLINKS=1

REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += runtime/erlang
REQUIRED_PACKAGES += runtime/elixir
REQUIRED_PACKAGES += developer/elixir/hex
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
