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

COMPONENT_NAME =	cbindgen
COMPONENT_VERSION =	0.29.4
COMPONENT_BAID =	426209
COMPONENT_PROJECT_URL =	https://github.com/mozilla/cbindgen
COMPONENT_REVISION =	b826cb8911488fe8a209d2b693492c0c673e8cca
COMPONENT_SRC =		$(COMPONENT_NAME)-$(COMPONENT_REVISION)
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH = \
    sha256:3ffab97f4b7d05f68c54202e84f92fb1c1cab10d59b4dc0ac4588666b3273af8
COMPONENT_ARCHIVE_URL =	$(COMPONENT_PROJECT_URL)/archive/$(COMPONENT_REVISION).tar.gz

# hash for vendored sources
COMPONENT_ARCHIVE_HASH_crates = \
    sha256:725f2ef60568e3090f1c8052c9533c66706a3345342eb5d0ec0d8072fb9be3e0

COMPONENT_BUGDB =	utility/rust
COMPONENT_ANITYA_ID =	16690

BUILD_STYLE = cargo

# Firefox and Thunderbird temporarily build this component from their
# pre-configure action until cbindgen 0.29.4 is available in the CBE.  Serialize
# direct and nested builds so a stale top-level dependency graph cannot make
# them clobber the same Cargo build directory.
BUILD_TARGET =		cbindgen-bootstrap-build
INSTALL_TARGET =	cbindgen-bootstrap-install

include $(WS_MAKE_RULES)/common.mk

CBINDGEN_BOOTSTRAP_LOCK = $(BUILD_DIR)/.bootstrap.$(MACH64).lock

.PHONY: cbindgen-bootstrap-build cbindgen-bootstrap-install
cbindgen-bootstrap-build cbindgen-bootstrap-install:
	$(MKDIR) $(BUILD_DIR)
	$(PERL) -e 'open(my $$lock, ">>", shift) or die "$$!"; \
	    flock($$lock, 2) or die "$$!"; my $$status = system(@ARGV); \
	    exit($$status == -1 ? 1 : ($$status & 127) ? \
	    128 + ($$status & 127) : $$status >> 8)' \
	    $(CBINDGEN_BOOTSTRAP_LOCK) $(GMAKE) \
	    $(if $(findstring install,$@),$(INSTALL_64),$(BUILD_64))

# Tests don't like "cloney".
CLONEY=$(CP) -r $(SOURCE_DIR)/* $(BUILD_DIR_64); echo

# Tests need to be run in single thread to get reproducible results.
COMPONENT_TEST_TARGETS += -- --test-threads=1

# Everything expects GNU utilities, so make sure those are preferred.
# RUST_ALT_PATH allows to use different Rust version.
PATH = $(RUST_ALT_PATH):/usr/gnu/bin:/usr/bin

COMPONENT_TEST_TRANSFORMS += \
	'-e "s;$(BUILD_DIR)/.cargo;\$$\(BUILKD_DIR\)/.cargo;" ' \
	'-e "/^cbindgen failed:/d" ' \
	'-e "/ *Compiling /d" ' \
	'-e "/Finished /s; in .*;;" ' \
	'-e "/^test result:/s; finished in .*;;" ' \
	'-e "/Running /s;-................)$$;-xxxxxxxxxxxxxxxx);" '

CBE_PACKAGES += system/library/math

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
