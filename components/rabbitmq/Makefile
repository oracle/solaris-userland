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
# Copyright (c) 2013, 2026, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

PATH=/usr/gnu/bin:/usr/bin:/usr/sbin

COMPONENT_NAME=		rabbitmq-server
COMPONENT_VERSION=	4.2.4
COMPONENT_SRC_NAME=	rabbitmq-server
COMPONENT_PROJECT_URL=	https://www.rabbitmq.com/
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.xz
COMPONENT_BUGDB=	service/rabbitmq
COMPONENT_ANITYA_ID=	5585
COMPONENT_ARCHIVE_HASH= sha256:5c806c0f5c66445e267b86f202d883a889e6438cb97712927b3736b59b9aa4b5
COMPONENT_ARCHIVE_URL= https://github.com/rabbitmq/rabbitmq-server/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc

COMPONENT_BAID=		370947

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
COMPONENT_PRE_BUILD_ACTION = ( cp -rd $(SOURCE_DIR)/. $(@D) ) ;

COMPONENT_BUILD_TARGETS =	all install-cli
COMPONENT_BUILD_ENV += LC_ALL=en_US.UTF-8
COMPONENT_BUILD_ENV += PATH=$(PATH)
COMPONENT_BUILD_ENV += RABBITMQ_VERSION=$(COMPONENT_VERSION)

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

REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += runtime/erlang
REQUIRED_PACKAGES += runtime/elixir
REQUIRED_PACKAGES += developer/elixir/hex
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
