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
# Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_ARCH=		i386
BUILD_BITS=		64

# Parallel build jobs are supported only if GNU make is used.
COMPONENT_MAKE_JOBS=1

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		drm
COMPONENT_VERSION=	1.6
COMPONENT_PROJECT_URL=	http://dri.freedesktop.org/
COMPONENT_ARCHIVE_SRC=	none
COMPONENT_SRC=		sun-src
COMPONENT_BUGDB=        driver/drm

TPNO=			5772
TPNO_i915=		5800

BUILD_STYLE= justmake
TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_MAKE=		$(SPRO_VROOT)/bin/dmake
PATH=	$(USRBINDIR):$(SPRO_VROOT)/bin:$(ONBLD_BIN):$(ONBLD_BIN)/$(MACH)

COMPONENT_BUILD_ENV +=	DMAKE_MODE="parallel"
COMPONENT_BUILD_ENV +=	DMAKE_OUTPUT_MODE="TXT2"
COMPONENT_BUILD_ENV +=	MODULE_COMPILER="$(COMPILER)"
COMPONENT_BUILD_ENV +=	PATH="$(PATH)"
COMPONENT_BUILD_ENV +=	PROTODIR="$(PROTO_DIR)"

# Override user space defaults
LD_OPTIONS=		$(LD_Z_STRIP_CLASS)

COMPONENT_BUILD_ACTION= \
        cd $(@D); $(ENV) $(COMPONENT_BUILD_ENV) \
        $(COMPONENT_MAKE) $(COMPONENT_BUILD_ARGS) $(COMPONENT_BUILD_TARGETS)

COMPONENT_INSTALL_ENV += $(COMPONENT_BUILD_ENV)
COMPONENT_INSTALL_ENV += INSTALL="$(INSTALL)"

COMPONENT_INSTALL_ACTION= \
        cd $(@D); $(ENV) $(COMPONENT_INSTALL_ENV) \
        $(COMPONENT_MAKE) $(COMPONENT_INSTALL_ARGS) $(COMPONENT_INSTALL_TARGETS)

PKG_OPTIONS +=	-I$(WS_TOP)/transforms

# Needed for resolving kernel module dependencies under /platform/*
PKGDEP_TOKENS.i386=	'PLATFORM=i86pc'
PKGDEP_TOKENS.sparc=	'PLATFORM=sun4v'
PKGDEP_TOKENS= 		$(PKGDEP_TOKENS.$(MACH))
PKGDEPEND_GENERATE_OPTIONS += $(PKGDEP_TOKENS:%=-D %)

# Needed for ctf utilities
REQUIRED_PACKAGES += developer/build/onbld
# Needed for building mdb modules
REQUIRED_PACKAGES += developer/debug/mdb
# Needed for agp headers
REQUIRED_PACKAGES.i386 += driver/graphics/agpgart
REQUIRED_PACKAGES += $(REQUIRED_PACKAGES.$(MACH))
# Needed for kernel module dependency resolution
REQUIRED_PACKAGES += system/kernel
REQUIRED_PACKAGES += system/kernel/platform
