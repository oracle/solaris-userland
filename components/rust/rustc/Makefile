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
# Copyright (c) 2018, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =		64
CTF_MODE =		off	# Has no effect
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME =	rustc
COMPONENT_VERSION =	1.96.0
COMPONENT_BAID =	393856
COMPONENT_SRC =		$(COMPONENT_NAME)-$(COMPONENT_VERSION)-src
COMPONENT_PROJECT_URL =	http://www.rust-lang.org/
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH = \
    sha256:b99ce16cdf0ecfc761b585ac84d131b46733465a02f8ecd0ff2de9713c62ee09
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
CONFIGURE_OPTIONS +=	--enable-lld
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
# Some rustdoc outputs are also architecture-dependent and need to be
# variant-tagged through a generated include.
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR); \
	ls -1 usr/lib/$(MACH64)/lib* \
	  usr/lib/$(MACH64)/rustlib/$(RUST_PLATFORM)/lib/lib* \
	  usr/share/doc/rust/html/rustc/searchindex-* \
	  usr/share/doc/rust/html/static.files/* | \
	  awk '{ print "file path="$$1 " variant.arch=$(MACH)" }' > ../../libraries-hashed.$(MACH64); \
	/usr/gnu/bin/find usr/share/doc/rust/html/search.index \
	  usr/share/doc/rust/html/src/std_detect/detect/os -type f | \
	  awk '{ print "file path="$$1 " variant.arch=$(MACH)" }' > ../../documentation-arch.$(MACH64); )

# pkg-report requires *.p5m files to be processed by pkgmogrify. Since the
# libraries-hashed normally comes from build and since pkg-report runs
# 'gmake clean' first we have to create empty file instead.
PKG_REPORT_ADDITIONAL_SETUP = \
	touch $(BUILD_DIR)/libraries-hashed.$(MACH64) \
	    $(BUILD_DIR)/documentation-arch.$(MACH64)

# We put $(BOOTSTRAP_DIR)/usr/bin into $PATH if we used it because we need to
# use the same compiler during test as we did during build.  Otherwise, we'll
# end up rebuilding the world.
COMPONENT_TEST_ENV +=	PATH=$(BOOTSTRAP_DIR:%=%/usr/bin:)$(PATH)
COMPONENT_TEST_CMD =	$(PYTHON) $(SOURCE_DIR)/x.py
COMPONENT_TEST_ARGS =	test --no-fail-fast -j 8
COMPONENT_TEST_TARGETS =

GENERATE_COPYRIGHT_MANIFESTS = \
$(SOURCE_DIR)/src/tools/cargo/Cargo.toml,\
$(SOURCE_DIR)/src/tools/clippy/clippy_test_deps/Cargo.toml,\
$(SOURCE_DIR)/src/tools/rust-analyzer/Cargo.toml,\
$(SOURCE_DIR)/compiler/rustc_codegen_cranelift/Cargo.toml,\
$(SOURCE_DIR)/compiler/rustc_codegen_gcc/Cargo.toml,\
$(SOURCE_DIR)/library/Cargo.toml,\
$(SOURCE_DIR)/src/bootstrap/Cargo.toml,\
$(SOURCE_DIR)/src/tools/rustbook/Cargo.toml,\
$(SOURCE_DIR)/src/tools/rustc-perf/Cargo.toml,\
$(SOURCE_DIR)/src/tools/opt-dist/Cargo.toml,\
$(SOURCE_DIR)/src/doc/book/packages/trpl/Cargo.toml

GENERATE_COPYRIGHT_HTML = $(BUILD_DIR)/COPYRIGHT.full.html
GENERATE_COPYRIGHT_LIBSTD_HTML = $(BUILD_DIR)/COPYRIGHT-library.full.html
GENERATE_COPYRIGHT_LOG = $(BUILD_DIR)/generate-copyright.log
GENERATE_COPYRIGHT_TARGET_DIR = $(BUILD_DIR)/generate-copyright-target

.PHONY: license
license:
	test -f $(SOURCE_DIR)/license-metadata.json || $(MAKE) prep
	rm -f $(GENERATE_COPYRIGHT_HTML) $(GENERATE_COPYRIGHT_LIBSTD_HTML) \
	    $(GENERATE_COPYRIGHT_LOG) rust.license.new
	cd $(SOURCE_DIR) && \
	    CARGO_MANIFESTS="$$(printf '%s' '$(GENERATE_COPYRIGHT_MANIFESTS)' | tr -d '[:space:]')" \
	    CARGO_HOME='$(SOURCE_DIR)/vendor' \
	    CARGO_TARGET_DIR='$(GENERATE_COPYRIGHT_TARGET_DIR)' \
	    CARGO_NET_OFFLINE=true \
	    DEST='$(GENERATE_COPYRIGHT_HTML)' \
	    DEST_LIBSTD='$(GENERATE_COPYRIGHT_LIBSTD_HTML)' \
	    SRC_DIR='$(SOURCE_DIR)' \
	    VENDOR_DIR='$(SOURCE_DIR)/vendor' \
	    CARGO="$$(command -v cargo)" \
	    LICENSE_METADATA='$(SOURCE_DIR)/license-metadata.json' \
	    cargo run \
	        --config 'source.crates-io.replace-with="vendored-sources"' \
	        --config 'source.vendored-sources.directory="$(SOURCE_DIR)/vendor"' \
	        --manifest-path '$(SOURCE_DIR)/src/tools/generate-copyright/Cargo.toml' \
	        --quiet > '$(GENERATE_COPYRIGHT_LOG)' 2>&1
	LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8 \
	    lynx --display_charset=utf-8 -stdin --dump -nolist \
	    < $(GENERATE_COPYRIGHT_HTML) > rust.license.new
	cd $(SOURCE_DIR) && \
	    ls -1 LICENSES | while read f; do \
	        echo "-- licenses/$$f --"; \
	        echo; \
	        cat LICENSES/$$f; \
	        echo; \
	        echo; \
	    done >> $(CURDIR)/rust.license.new
	mv rust.license.new rust.license

CBE_PACKAGES += developer/gcc-14
CBE_PACKAGES += developer/llvm/llvm
CBE_PACKAGES += developer/rust/rustc
CBE_PACKAGES += library/libssh2
CBE_PACKAGES += web/browser/lynx

REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/curl
