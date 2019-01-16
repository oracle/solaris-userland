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
# Copyright (c) 2018, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =	64
COMPILER =	gcc
include ../../../make-rules/shared-macros.mk
include ../../../make-rules/cargo-vendored.mk

COMPONENT_NAME =	rustc
COMPONENT_VERSION =	1.28.0
COMPONENT_SRC =		$(COMPONENT_NAME)-$(COMPONENT_VERSION)-src
COMPONENT_PROJECT_URL =	http://www.rust-lang.org/
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH = \
    sha256:8a899afd4b502b4ebff5cfc82cba77a8cb37113b5e6018f15c09545936081848
COMPONENT_ARCHIVE_URL =	https://static.rust-lang.org/dist/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL =	$(COMPONENT_ARCHIVE_URL).asc

COMPONENT_ANITYA_ID =	7635

TPNO =			45247

COMPONENT_ARCHIVE_HASH_crates = \
    sha256:c375782bea7250b9a7dd86af64279bc6a3a4de8beced12353e82e7142890e814

VENDORED_CARGO_LOCK = $(COMPONENT_SRC)/src/Cargo.lock

PKG_VARS += RUST_PLATFORM

include $(WS_MAKE_RULES)/common.mk

$(SOURCE_DIR_crates)/.patched: PATCH_LEVEL=0

# Everything expects GNU utilities, so make sure those are preferred.
PATH =			/usr/gnu/bin:/usr/bin

# We don't seem to get much speedup beyond this
COMPONENT_BUILD_ARGS =	-j8

# LD_B_DIRECT breaks the build.
LD_B_DIRECT =

$(MANIFEST_BASE)-%.mogrified: RUST_PLATFORM = $(MACH64:amd64=x86_64)-sun-solaris

# The configure Rust uses isn't autoconf; it's hand-rolled, and doesn't
# recognize all the autoconf options, so we start from scratch.
CONFIGURE_OPTIONS =	--prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS +=	--default-linker=gcc
CONFIGURE_OPTIONS +=	--enable-local-rust
CONFIGURE_OPTIONS +=	--enable-llvm-link-shared
CONFIGURE_OPTIONS +=	--llvm-root=/usr

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
	ls -1 usr/lib/lib* \
	  usr/lib/rustlib/$(MACH64:amd64=x86_64)-sun-solaris/codegen-backends/lib* \
	  usr/lib/rustlib/$(MACH64:amd64=x86_64)-sun-solaris/lib/lib* | \
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
