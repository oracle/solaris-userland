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

BUILD_BITS =            64_and_32
COMPILER=               gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libxkbcommon
COMPONENT_VERSION=	1.13.1
COMPONENT_SRC=		libxkbcommon-xkbcommon-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	xkbcommon-$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=	http://xkbcommon.org
COMPONENT_ARCHIVE_URL=	https://github.com/xkbcommon/libxkbcommon/archive/refs/tags/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:aeb951964c2f7ecc08174cb5517962d157595e9e3f38fc4a130b91dc2f9fec18
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1780
COMPONENT_BAID=		382168

BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += -Denable-wayland=false
CONFIGURE_OPTIONS += -Denable-docs=true
LD_OPTIONS += -z gnu-version-script-compat 
CONFIGURE_ENV += $(COMPONENT_BUILD_ENV)

# for tests
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# xvfb is needed for testing
REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/server/xvfb
