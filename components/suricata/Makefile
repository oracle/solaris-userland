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
# Copyright (c) 2024, Oracle and/or its affiliates.
#

BUILD_BITS=		64
COMPILER=		gcc

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		suricata
COMPONENT_VERSION=	7.0.5
COMPONENT_PROJECT_URL=	https://suricata.io/
COMPONENT_ARCHIVE_HASH=	sha256:1ffb568158f265c08554464bfb854e6568ef683bf03312923b51f28c50790a4e
COMPONENT_ARCHIVE_URL=	https://www.openinfosecfoundation.org/download/$(COMPONENT_ARCHIVE)

COMPONENT_BAID=		166220

CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS +=	--enable-unittests
CONFIGURE_OPTIONS +=	--with-libnet-includes=/usr/include/libnet
CONFIGURE_OPTIONS +=	--with-libjansson-includes=/usr/include/jansson
CONFIGURE_OPTIONS +=	--with-libpcre2-includes=/usr/include/pcre

# Unit tests failed to build on Solaris
# https://redmine.openinfosecfoundation.org/issues/6793
TEST_TARGET=		$(NO_TESTS)
SYSTEM_TEST_TARGET=	$(NO_TESTS)
# Prevents 'undefined __stack_chk_fail' during test target build
#LDFLAGS += -fstack-protector
# Needed for "gmake test" to work around "unbound variable" error
#unexport SHELLOPTS

include $(WS_MAKE_RULES)/common.mk

# Disable AVX as our platforms doesn't need to support it. At least VirtualBox does not.
CFLAGS.gcc.i386 += -mno-avx
LDFLAGS += -lm

# Requires a reconf due to patch to configure.ac.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);
# Source dir include directories has priority over build dir. Then distribution
# src/build-info.h is used instead the generated (and accurate) one.
COMPONENT_PREP_ACTION += \
	$(MV) $(SOURCE_DIR)/src/build-info.h $(SOURCE_DIR)/src/build-info.h~

# Fix python scripts shebang
PYTHON_VERSION = 3.11
PKG_MACROS += PYVER="$(PYTHON_VERSION)"
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/bin/suricatactl
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/bin/suricata-update
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/bin/suricatasc

# Install-conf target expects suricata.yaml at source dir
COMPONENT_POST_BUILD_ACTION += \
	$(CP) $(BUILD_DIR)/$(MACH64)/suricata.yaml $(SOURCE_DIR) ;

# Install config files
COMPONENT_INSTALL_TARGETS = install install-conf

# Python module is installed on non-standard place
COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) "$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE)" && \
	$(MV) "$(PROTO_DIR)/usr/lib/suricata/python/"* \
		"$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE)" && \
	$(PYTHON) -m compileall "$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES_BASE)" ;

REQUIRED_PACKAGES += compress/lz4
REQUIRED_PACKAGES += library/jansson
REQUIRED_PACKAGES += library/libyaml
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libpcap
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/network
