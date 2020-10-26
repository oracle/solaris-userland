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
# Copyright (c) 2016, 2020, Oracle and/or its affiliates.
#

BUILD_BITS= NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=         desktop-cache
COMPONENT_VERSION=      0.2.9
COMPONENT_SRC=          # all files under files/
COMPONENT_BUGDB=	gnome/install
COMPONENT_ARCHIVE_SRC=	none
COMPONENT_ANITYA_ID=	N/A

# nothing to download or build; just package
BUILD_STYLE= pkg

SMF_MANIFESTS += $(COMPONENT_DIR)/files/desktop-mime-cache.xml
SMF_MANIFESTS += $(COMPONENT_DIR)/files/gconf-cache.xml
SMF_MANIFESTS += $(COMPONENT_DIR)/files/icon-cache.xml
SMF_MANIFESTS += $(COMPONENT_DIR)/files/input-method-cache.xml
SMF_MANIFESTS += $(COMPONENT_DIR)/files/mime-types-cache.xml
SMF_MANIFESTS += $(COMPONENT_DIR)/files/pixbuf-loaders-installer.xml

include $(WS_MAKE_RULES)/common.mk

REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/core-os
