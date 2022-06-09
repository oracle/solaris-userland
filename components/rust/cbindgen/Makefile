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

COMPONENT_NAME =	cbindgen
COMPONENT_VERSION =	0.24.3
COMPONENT_BAID =	124793
COMPONENT_PROJECT_URL =	https://github.com/eqrion/cbindgen
COMPONENT_SRC =		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH = \
    sha256:5d693ab54acc085b9f2dbafbcf0a1f089737f7e0cb1686fa338c2aaa05dc7705
COMPONENT_ARCHIVE_URL =	https://github.com/eqrion/cbindgen/archive/v$(COMPONENT_VERSION).tar.gz

# hash for vendored sources
COMPONENT_ARCHIVE_HASH_crates = \
    sha256:91806554eb6d8207c7bceb097072cb2e427e93bb9de1f064e831bc33ff65b890

COMPONENT_BUGDB =	utility/rust
COMPONENT_ANITYA_ID =	16690

BUILD_STYLE = cargo

include $(WS_MAKE_RULES)/common.mk

# Everything expects GNU utilities, so make sure those are preferred.
# RUST_ALT_PATH allows to use different Rust version.
PATH = $(RUST_ALT_PATH):/usr/gnu/bin:/usr/bin

REQUIRED_PACKAGES +=	library/libssh2
REQUIRED_PACKAGES +=	library/security/openssl
REQUIRED_PACKAGES +=	library/zlib
REQUIRED_PACKAGES +=	system/library
REQUIRED_PACKAGES +=	system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES +=	system/library/math
REQUIRED_PACKAGES +=	web/curl
