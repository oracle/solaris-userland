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
# Copyright (c) 2016, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =		64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gst-python
COMPONENT_VERSION=	1.18.4
COMPONENT_PROJECT_URL=	https://gstreamer.freedesktop.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:cb68e08a7e825e08b83a12a22dcd6e4f1b328a7b02a7ac84f42f68f4ddc7098e
COMPONENT_ARCHIVE_URL=	https://gstreamer.freedesktop.org/src/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	gnome/multimedia
COMPONENT_ANITYA_ID=	3881

TPNO=			71121

BUILD_STYLE=		meson
PYTHON_VERSIONS= $(PYTHON3_VERSIONS)

# Replicated from $(WS_MAKE_RULES)/setup.py.mk since this uses meson.
CONFIGURE_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
$(BUILD_DIR)/%-3.7/.configured:		PYTHON_VERSION=3.7
$(BUILD_DIR)/%-3.9/.configured:		PYTHON_VERSION=3.9

BUILD_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
$(BUILD_DIR)/%-3.7/.built:		PYTHON_VERSION=3.7
$(BUILD_DIR)/%-3.9/.built:		PYTHON_VERSION=3.9

INSTALL_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
$(BUILD_DIR)/%-3.7/.installed:		PYTHON_VERSION=3.7
$(BUILD_DIR)/%-3.9/.installed:		PYTHON_VERSION=3.9

TEST_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared)
$(BUILD_DIR)/%-3.7/.tested-and-compared:		PYTHON_VERSION=3.7
$(BUILD_DIR)/%-3.9/.tested-and-compared:		PYTHON_VERSION=3.9

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS += -Dpython=$(PYTHON)
CONFIGURE_OPTIONS += -Dpygi-overrides-dir=$(PYTHON_VENDOR_PACKAGES_BASE)/gi/overrides/64

# Generate python's bytecode manually since Meson does not support it.
COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON) -m compileall $(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE)

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-e "s/\s*[0-9]\+\.[0-9]\+s//" '

REQUIRED_PACKAGES += library/desktop/gstreamer-1
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/python/pygobject-3
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += runtime/python-39
