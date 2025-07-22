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
# Copyright (c) 2012, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64
# Python 3.13 module doesn't build with Studio compiler without needing Studio specific atomic library.
# This can be avoided by using GCC.
COMPILER= gcc
CONSOLIDATION = python
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mod_wsgi
COMPONENT_VERSION=	5.0.2
COMPONENT_ARCHIVE_HASH=	sha256:6fe5557c3ef25c184c2c994905fe52be1c06ae5c46235ecafe558e84789e2159
COMPONENT_ARCHIVE_URL=	https://pypi.python.org/packages/source/m/mod_wsgi/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=  https://modwsgi.readthedocs.io/
COMPONENT_BUGDB=	utility/apache
COMPONENT_ANITYA_ID=	2001
COMPONENT_BAID=		191665

GCC_APXS=gcc-apxs
CLEAN_PATHS += $(GCC_APXS)

# Since the Studio compiler and flags are hardcoded in Apache apxs, APR libtool, and apr-1-config,
# they need to be modified before the build to enable compilation with GCC.
COMPONENT_PREP_ACTION += ( \
	$(MKDIR)  $(GCC_APXS); \
	$(CP) $(APACHE_24_USR_PREFIX)/bin/apxs $(GCC_APXS); \
	$(GSED) -i "/^get_config_vars/c\get_config_vars(\"$(COMPONENT_DIR)/$(GCC_APXS)/config_vars.mk\",\\\%config_vars);" $(GCC_APXS)/apxs; \
	$(CP)  $(APACHE_24_USR_PREFIX)/build/config_vars.mk $(GCC_APXS); \
	$(GSED) -i "/^CC = cc/c\CC = $(GCC_ROOT)/bin/gcc" $(GCC_APXS)/config_vars.mk; \
	$(GSED) -i "/^APR_CONFIG = /c\APR_CONFIG = $(COMPONENT_DIR)/$(GCC_APXS)/apr-1-config" $(GCC_APXS)/config_vars.mk; \
	$(GSED) -i "/^CFLAGS = /s/KPIC/fPIC/" $(GCC_APXS)/config_vars.mk; \
	$(GSED) -i "/^CFLAGS = /s/-xO4 -xchip=generic//" $(GCC_APXS)/config_vars.mk; \
	$(GSED) -i "/^CFLAGS = /s/-xregs=no%frameptr -mt -xcheck=no%stkovf//" $(GCC_APXS)/config_vars.mk; \
	$(GSED) -i "/^CFLAGS = /s/-xO4 -xtarget=generic -xarch=sparcvis -xchip=generic -Qoption cg -xregs=no%appl -W2,-xwrap_int -xmemalign=16s -mt -xcheck=no%stkovf//" $(GCC_APXS)/config_vars.mk; \
	$(CP) /usr/apr/1/bin/$(BUILD64)/apr-1-config $(GCC_APXS); \
	$(GSED) -i 's;echo "$${installbuilddir}/libtool";echo "$(COMPONENT_DIR)/$(GCC_APXS)/libtool";' $(GCC_APXS)/apr-1-config; \
	$(CP) /usr/apr/1/build/$(BUILD64)/libtool $(GCC_APXS); \
	$(GSED) -i "/^CC=\"cc\"/c\CC=\"$(GCC_ROOT)/bin/gcc\"" $(GCC_APXS)/libtool; \
	$(GSED) -i "/^pic_flag=/s/KPIC/fPIC/" $(GCC_APXS)/libtool; );

# Don't use default CPPFLAGS; it causes Apache's custom CPP to fail.
CONFIGURE_CPPFLAGS=
VARIANTS_64 += $(BUILD_DIR)/apache24-python39
VARIANTS_64 += $(BUILD_DIR)/apache24-python311
VARIANTS_64 += $(BUILD_DIR)/apache24-python313
include ../modules.mk

$(BUILD_DIR)/apache24-%/$(MACH64)/.configured: APXS=$(COMPONENT_DIR)/$(GCC_APXS)/apxs BITS=64
$(BUILD_DIR)/apache24-%/$(MACH64)/.built: BITS=64
$(BUILD_DIR)/apache24-%/$(MACH64)/.tested: BITS=64

$(BUILD_DIR)/apache2%-python39/$(MACH64)/.configured: PYTHON=$(PYTHON.3.9)
$(BUILD_DIR)/apache2%-python311/$(MACH64)/.configured: PYTHON=$(PYTHON.3.11)
$(BUILD_DIR)/apache2%-python313/$(MACH64)/.configured: PYTHON=$(PYTHON.3.13)

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS += --with-python=$(PYTHON)

REQUIRED_PACKAGES += runtime/python-39
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += runtime/python-313
REQUIRED_PACKAGES += system/library/math
