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
# Copyright (c) 2018, 2021, Oracle and/or its affiliates.
#

# Only bytecode and text files.
BUILD_BITS= NO_ARCH

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		hex
COMPONENT_VERSION=	0.21.2
COMPONENT_PROJECT_URL=	https://hex.pm/
COMPONENT_ARCHIVE_HASH=	\
    sha256:a3cf167ad1158bfd098f69735f97c5ae53a758e9a688aadfc2b2122202e7e765
COMPONENT_ARCHIVE_URL=	https://github.com/hexpm/$(COMPONENT_NAME)/archive/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/elixir
COMPONENT_ANITYA_ID=	132546

TPNO=			71796

BUILD_STYLE= justmake
include $(WS_MAKE_RULES)/common.mk

CLONEY = echo
COMPONENT_PRE_BUILD_ACTION = $(CP) -r $(SOURCE_DIR)/. $(@D)

# MIX_ENV=prod selects the production version of the component.
# MIX_HOME=$(@D) changes the mix working directory from $HOME to build directory.
# LC_ALL=en_US.UTF-8 is set to avoid warnings about possible Elixir malfunctions.
# DO_NOT_LOAD_HEX_MODULES=1 ensures that system hex modules are not loaded (avoid warnings and errors).
MIX_BUILDTOOL_ENV= MIX_ENV=prod MIX_HOME=$(@D) LC_ALL=en_US.UTF-8 DO_NOT_LOAD_HEX_MODULES=1
COMPONENT_BUILD_ACTION = cd $(@D); \
			$(MIX_BUILDTOOL_ENV) mix compile

# Path where mix command searches for extensions.
ELIXIR_INSTALL_PATH= $(PROTO_DIR)/usr/lib/elixir/lib
# Build the hex component and copy the required bytecode files to the install path.
COMPONENT_INSTALL_ACTION = cd $(@D); \
			$(MIX_BUILDTOOL_ENV) mix install; \
			$(MKDIR) $(ELIXIR_INSTALL_PATH); \
			cd $(ELIXIR_INSTALL_PATH); \
			unzip $(@D)/hex.ez 1> /dev/null

# Hex provides automated tests but it requires external dependencies and postgresql database.
# As a result, the manual testing according to the TESTING file is preferred.
test:		$(NO_TESTS)
system-test: $(NO_TESTS)
COMPONENT_TEST_CMD= true


REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += runtime/erlang
REQUIRED_PACKAGES += runtime/elixir

