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
# Copyright (c) 2013, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

PATH=/usr/gnu/bin:/usr/bin:/usr/sbin

COMPONENT_NAME=		rabbitmq-server
COMPONENT_VERSION=	3.7.8
COMPONENT_SRC_NAME=	rabbitmq-server
COMPONENT_PROJECT_URL=	https://www.rabbitmq.com/
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.xz
COMPONENT_BUGDB=	service/rabbitmq
COMPONENT_ANITYA_ID=	5585
COMPONENT_ARCHIVE_HASH= sha256:bed39fd72b8c932fe5f356fbbc7d30a19d651213e1667d81f084bc31468f5a02
COMPONENT_ARCHIVE_URL= https://github.com/rabbitmq/rabbitmq-server/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc

TPNO=			46909

BUILD_STYLE= justmake
include $(WS_MAKE_RULES)/common.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# Use a simple copy instead of cloney.
CLONEY := echo
# Copy the RabbitMQ source code, remove the bundled hex (bytecode),
# and use the system hex to extract sources of Elixir dependencies.
COMPONENT_PRE_BUILD_ACTION = (	\
	cp -rd $(SOURCE_DIR)/. $(@D);	cd $(@D); \
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

# Hardlinks rabbitmq-plugins and rabbitmqctl are created from rabbitmq-diagnostics file.
PKG_HARDLINKS += usr/lib/rabbitmq/escript/rabbitmq-diagnostics

REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += runtime/erlang
REQUIRED_PACKAGES += runtime/elixir
REQUIRED_PACKAGES += developer/elixir/hex
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
