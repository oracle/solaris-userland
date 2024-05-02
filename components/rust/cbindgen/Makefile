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
# Copyright (c) 2018, 2024, Oracle and/or its affiliates.
#

BUILD_BITS =	64
COMPILER =	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME =	cbindgen
COMPONENT_VERSION =	0.26.0
COMPONENT_BAID =	164728
COMPONENT_PROJECT_URL =	https://github.com/eqrion/cbindgen
COMPONENT_SRC =		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH = \
    sha256:b45e1a64875b615702a86ac3084ef69ae32926241cd2b687a30c12474be15105
COMPONENT_ARCHIVE_URL =	https://github.com/eqrion/cbindgen/archive/v$(COMPONENT_VERSION).tar.gz

# hash for vendored sources
COMPONENT_ARCHIVE_HASH_crates = \
    sha256:0943529f59f1fcf74ff1bb833eebd4c2d94a3dd893f9f8702024dc101e9acdf8

COMPONENT_BUGDB =	utility/rust
COMPONENT_ANITYA_ID =	16690

BUILD_STYLE = cargo

include $(WS_MAKE_RULES)/common.mk

# Tests don't like "cloney".
CLONEY=$(CP) -r $(SOURCE_DIR)/* $(BUILD_DIR_64); echo

# Tests need to be run in single thread to get reproducible results.
COMPONENT_TEST_TARGETS += -- --test-threads=1

# Everything expects GNU utilities, so make sure those are preferred.
# RUST_ALT_PATH allows to use different Rust version.
PATH = $(RUST_ALT_PATH):/usr/gnu/bin:/usr/bin

COMPONENT_TEST_TRANSFORMS += \
	'-e "/ *Compiling /d" ' \
	'-e "/Finished test/s; in .*;;" ' \
	'-e "/^test result:/s; finished in .*;;" ' \
	'-e "/Running /s;-................)$$;-xxxxxxxxxxxxxxxx);" '

REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
