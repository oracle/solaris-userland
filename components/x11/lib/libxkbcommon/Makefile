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
# Copyright (c) 2018, 2024, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
COMPILER=               gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libxkbcommon
COMPONENT_VERSION=	1.7.0
COMPONENT_PROJECT_URL=	http://xkbcommon.org
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/download/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:65782f0a10a4b455af9c6baab7040e2f537520caa2ec2092805cdfd36863b247
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1780
COMPONENT_BAID=		176526

BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/x11-component.mk

CONFIGURE_OPTIONS += -Denable-wayland=false
CONFIGURE_OPTIONS += -Denable-docs=true
LD_OPTIONS += -z gnu-version-script-compat 
CONFIGURE_ENV += $(COMPONENT_BUILD_ENV)

# for tests
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += x11/library/libxcb
