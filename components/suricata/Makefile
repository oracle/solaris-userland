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
# Copyright (c) 2024, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		64
COMPILER =		gcc
CTF_MODE =		relaxed

include ../../make-rules/shared-macros.mk

COMPONENT_NAME =	suricata
COMPONENT_VERSION =	8.0.2
COMPONENT_PROJECT_URL =	https://suricata.io/
COMPONENT_ARCHIVE_HASH = sha256:9d450ca2cadbe101993e99033a62349d2bda9dfd90a6acc1bcb6cc6db76eb551
COMPONENT_ARCHIVE_URL =	https://www.openinfosecfoundation.org/download/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH_crates = \
	sha256:70df60d331aad7efeb55d28b6081299814ae12bfa7946c866419b208036abf8c

COMPONENT_BAID =	354980

# Cargo don't have an internet access during non-download gmake targets so we need
# to vendor dependencies
include $(WS_MAKE_RULES)/cargo-vendored.mk
VENDORED_CARGO_LOCK_LOCATION = $(COMPONENT_SRC)/rust # Cargo.toml location
COMPONENT_PRE_BUILD_ACTION += $(VENDORED_SOURCES_ENFORCE)

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_ENV += CARGO_HOME=$(COMPONENT_DIR)/build/.cargo

CONFIGURE_OPTIONS +=	--sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS +=	--enable-unittests
CONFIGURE_OPTIONS +=	--with-libnet-includes=/usr/include/libnet
CONFIGURE_OPTIONS +=	--with-libjansson-includes=/usr/include/jansson
CONFIGURE_OPTIONS +=	--with-libpcre2-includes=/usr/include/pcre

# Unable to link against libsuricata_rust.a while PIC is enabled
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Disable AVX as our platforms doesn't need to support it. At least VirtualBox does not.
CFLAGS.gcc.i386 += -mno-avx -mno-bmi -mno-bmi2

# Requires a reconf due a change in configure.ac and Makefile.am
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

# Fix python scripts shebang
PYTHON_VERSION = 3.13
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
	$(MKDIR) "$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES)" && \
	$(MV) "$(PROTO_DIR)/usr/lib/suricata/python/"* \
		"$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES)" && \
	$(PYTHON) -m compileall "$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES)" ;

# Cargo will not find libsuricata static library and other system libraries
# while building tests
# https://redmine.openinfosecfoundation.org/issues/6793
COMPONENT_TEST_ENV += RUSTFLAGS="-Clink-arg=--verbose -Clink-arg=$(BUILD_DIR)/$(MACH64)/src/libsuricata_c.a -Clink-arg=-lpcap -Clink-arg=-ljansson -Clink-arg=-lpcre2-8 -Clink-arg=-llua -Clink-arg=-lyaml -Clink-arg=-llz4 -Clink-arg=-Wl,-R$$(rustc --print target-libdir)"

REQUIRED_PACKAGES += compress/lz4
REQUIRED_PACKAGES += library/jansson
REQUIRED_PACKAGES += library/libyaml
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/python-313
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libpcap
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/network
