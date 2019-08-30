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

COMPONENT_NAME =	cargo-vendor
COMPONENT_VERSION =	0.1.23
COMPONENT_PROJECT_URL =	https://github.com/alexcrichton/cargo-vendor
COMPONENT_SRC =		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH = \
    sha256:787dd4a6ae729ebc508a452b89508a73c724c9915e3c8ac890aa145f1433c744
COMPONENT_ARCHIVE_URL =	https://github.com/alexcrichton/cargo-vendor/archive/$(COMPONENT_VERSION).tar.gz

# hash for vendored sources
COMPONENT_ARCHIVE_HASH_crates = \
    sha256:8a01fb73e42412f7c3ec3bebcc99afcf1492a382500c49b1e558ebe2eff1fef7

COMPONENT_BUGDB =	utility/rust
TPNO = 52379

BUILD_STYLE = cargo
include $(WS_MAKE_RULES)/common.mk

# Everything expects GNU utilities, so make sure those are preferred.
PATH = /usr/gnu/bin:/usr/bin

REQUIRED_PACKAGES +=	library/libssh2
REQUIRED_PACKAGES +=	library/security/openssl
REQUIRED_PACKAGES +=	library/zlib
REQUIRED_PACKAGES +=	system/library
REQUIRED_PACKAGES +=	system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES +=	system/library/math
REQUIRED_PACKAGES +=	web/curl
