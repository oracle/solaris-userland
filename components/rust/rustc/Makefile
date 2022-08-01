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
# Copyright (c) 2018, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =	64
COMPILER =	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME =	rustc
COMPONENT_VERSION =	1.61.0
COMPONENT_BAID =	123743
COMPONENT_SRC =		$(COMPONENT_NAME)-$(COMPONENT_VERSION)-src
COMPONENT_PROJECT_URL =	http://www.rust-lang.org/
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH = \
    sha256:a63305a3ad734f170746b337a5e3d07ccaa7aa8f253dc52336b44c0a3b549d7b
COMPONENT_ARCHIVE_URL =	https://static.rust-lang.org/dist/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL =	$(COMPONENT_ARCHIVE_URL).asc

COMPONENT_BUGDB =	utility/rust
COMPONENT_ANITYA_ID =	7635

PKG_VARS += RUST_PLATFORM

# The unit tests hang and never finish.
$(SKIP_TEST_AT_TOP_LEVEL)

# Rust spuriously fails to build from time to time. To avoid the full build
# failure, rust is built in three attempts and each is assigned 5 hours
# (sequential build takes 2.5 hours). Note that rust typically fails in the
# first 10 minutes, therefore, the longer time limit does not significantly
# accumulate to the total build time of Userland gate.
GMAKE := $(WS_TOOLS)/repeat_cmd 3 5h $(GMAKE)
COMPONENT_BUILD_ENV += REPEAT_CMD_CLEANUP="gmake clean"

include $(WS_MAKE_RULES)/common.mk

$(SOURCE_DIR_crates)/.patched: PATCH_LEVEL=0

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Everything expects GNU utilities, so make sure those are preferred.
# BOOTSTRAP_PATH is used during updates before new version is seeded.
PATH = $(BOOTSTRAP_PATH):$(COMPONENT_DIR)/epoll:/usr/gnu/bin:/usr/bin

# LD_B_DIRECT breaks the build.
LD_B_DIRECT =

ifeq ($(MACH64),amd64)
	RUST_PLATFORM = x86_64-pc-solaris
else
	RUST_PLATFORM = sparcv9-sun-solaris
endif

# The configure Rust uses isn't autoconf; it's hand-rolled, and doesn't
# recognize all the autoconf options, so we start from scratch.
CONFIGURE_OPTIONS =	--prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS +=	--libdir=$(USRLIBDIR64)
CONFIGURE_OPTIONS +=	--default-linker=gcc
CONFIGURE_OPTIONS +=	--enable-local-rust

COMPONENT_PRE_CONFIGURE_ACTION += \
       ( cd $(COMPONENT_DIR)/epoll; \
       $(GCC_ROOT)/bin/gcc -shared -DDEBUG=0 -o libepoll.so -fPIC -c epoll.c ; \
       echo "\#!/bin/sh" > gcc ; \
       echo "$(GCC_ROOT)/bin/gcc -L$(COMPONENT_DIR)/epoll -lepoll \$$@" >> gcc ; \
       chmod a+x gcc ) ;

CLEAN_PATHS += epoll/libepoll.so
CLEAN_PATHS += epoll/gcc

VENDORED_SOURCES_ENFORCE = \
        cd $(BUILD_DIR); mkdir -p .cargo; \
        echo "[source.crates-io]" > .cargo/config; \
        echo "replace-with = \"vendored-sources\"" >> .cargo/config; \
        echo "[source.vendored-sources]" >> .cargo/config; \
        echo "directory = \"$(SOURCE_DIR)/vendor\"" >> .cargo/config;

COMPONENT_PRE_BUILD_ACTION = $(VENDORED_SOURCES_ENFORCE)

# Put the bits cargo downloads in a private directory.  This could be cached
# somewhere more permanent, but it's important to make sure that a person's
# $HOME/.cargo isn't used.
COMPONENT_BUILD_ENV +=	CARGO_HOME=$(BUILD_DIR)/.cargo
COMPONENT_INSTALL_ENV +=	CARGO_HOME=$(BUILD_DIR)/.cargo
COMPONENT_TEST_ENV +=	CARGO_HOME=$(BUILD_DIR)/.cargo

# Rust library names contain hash which differs between intel and sparc.
# Therefore library list need to be created to be included into p5m file.
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR); \
	ls -1 usr/lib/$(MACH64)/lib* \
	  usr/lib/$(MACH64)/rustlib/$(RUST_PLATFORM)/lib/lib* | \
	  awk '{ print "file path="$$1 " variant.arch=$(MACH)" }' > ../../libraries-hashed.$(MACH64); )

# pkg-report requires *.p5m files to be processed by pkgmogrify. Since the
# libraries-hashed normally comes from build and since pkg-report runs
# 'gmake clean' first we have to create empty file instead.
PKG_REPORT_ADDITIONAL_SETUP = touch $(BUILD_DIR)/libraries-hashed.$(MACH64)

# We put $(BOOTSTRAP_DIR)/usr/bin into $PATH if we used it because we need to
# use the same compiler during test as we did during build.  Otherwise, we'll
# end up rebuilding the world.
COMPONENT_TEST_ENV +=	PATH=$(BOOTSTRAP_DIR:%=%/usr/bin:)$(PATH)
COMPONENT_TEST_CMD =	$(PYTHON) $(SOURCE_DIR)/x.py
COMPONENT_TEST_ARGS =	test --no-fail-fast -j 8
COMPONENT_TEST_TARGETS =

REQUIRED_PACKAGES += developer/llvm/llvm
REQUIRED_PACKAGES += developer/rust/rustc
REQUIRED_PACKAGES += library/libssh2
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/curl
