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
# Copyright (c) 2016, 2026, Oracle and/or its affiliates.
#

COMPILER=		gcc
BUILD_BITS=		64

include ../../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		pycairo
COMPONENT_VERSION=	1.29.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:f3f7fde97325cae80224c09f12564ef58d0d0f655da0e3b040f5807bd5bd3142
COMPONENT_ARCHIVE_URL=	pypi:///pycairo==$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=	http://cairographics.org/pycairo/
COMPONENT_BUGDB=	python-mod/pycairo
COMPONENT_ANITYA_ID=	13166
COMPONENT_BAID=		371849

BUILD_STYLE=		meson
CONSOLIDATION=		python

# replicated from $(WS_MAKE_RULES)/python-common.mk
CONFIGURE_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
$(BUILD_DIR)/%-3.11/.configured:	PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.configured:	PYTHON_VERSION=3.13

BUILD_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
$(BUILD_DIR)/%-3.11/.built:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.built:		PYTHON_VERSION=3.13

INSTALL_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
$(BUILD_DIR)/%-3.11/.installed:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.installed:		PYTHON_VERSION=3.13

TEST_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.tested)
$(BUILD_DIR)/%-3.11/.tested:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.tested:		PYTHON_VERSION=3.13

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS += -Dpython=$(PYTHON)
CONFIGURE_OPTIONS += -Dtests=true

# Required to setup the prefix path to generate valid *.pc file.
CONFIGURE_OPTIONS += --prefix $(PYTHON_VENDOR_PACKAGES)

# The .pc file needs to be moved to respective vendor-packages directory.
COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES)/lib/pkgconfig; \
	$(MV) $(PROTOPKGCONFIGDIR64)/py3cairo.pc \
	$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES)/lib/pkgconfig/py3cairo.pc

REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += runtime/python-313

# Testing related components
REQUIRED_PACKAGES += library/python/pytest
