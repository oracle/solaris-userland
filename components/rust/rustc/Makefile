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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		64
COMPILER =		gcc
CTF_MODE =		off	# Has no effect
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME =	rustc
COMPONENT_VERSION =	1.87.0
COMPONENT_BAID =	330476
COMPONENT_SRC =		$(COMPONENT_NAME)-$(COMPONENT_VERSION)-src
COMPONENT_PROJECT_URL =	http://www.rust-lang.org/
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH = \
    sha256:8623b8651893e8c6aebfa45b6a90645a4f652f7b18189a0992a90d11ac2631f4
COMPONENT_ARCHIVE_URL =	https://static.rust-lang.org/dist/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL =	$(COMPONENT_ARCHIVE_URL).asc

COMPONENT_BUGDB =	utility/rust
COMPONENT_ANITYA_ID =	7635

PKG_VARS += RUST_PLATFORM

# The unit tests hang and never finish.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

$(SOURCE_DIR_crates)/.patched: PATCH_LEVEL=0

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Everything expects GNU utilities, so make sure those are preferred.
# BOOTSTRAP_PATH is used during updates before new version is seeded.
PATH = $(BOOTSTRAP_PATH):/usr/gnu/bin:/usr/bin

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
CONFIGURE_OPTIONS +=	--libdir=lib/$(MACH64)
CONFIGURE_OPTIONS +=	--default-linker=gcc
CONFIGURE_OPTIONS +=	--enable-local-rust
CONFIGURE_OPTIONS +=	--release-channel=stable
CONFIGURE_OPTIONS +=	--docdir=/usr/share/doc/rust

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

# Rust library names (and some other file names) contain hash which differs
# between intel and sparc. Therefore library list need to be created to be
# included into p5m file.
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR); \
	ls -1 usr/lib/$(MACH64)/lib* \
	  usr/lib/$(MACH64)/rustlib/$(RUST_PLATFORM)/lib/lib* \
	  usr/share/doc/rust/html/rustc/searchindex-* \
	  usr/share/doc/rust/html/static.files/* | \
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
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/curl
