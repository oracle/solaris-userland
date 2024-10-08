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
# Copyright (c) 2022, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER = gcc

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		zstd
COMPONENT_VERSION=	1.5.6
COMPONENT_BAID=		175373
COMPONENT_ARCHIVE_HASH= sha256:8c29e06cf42aacc1eafc4077ae2ec6c6fcb96a626157e0593d5e82a34fd403c1
COMPONENT_LABEL=	v$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=	https://github.com/facebook/zstd
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/download/$(COMPONENT_LABEL)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	12083

BUILD_STYLE = justmake

include $(WS_MAKE_RULES)/common.mk

COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# Set up arguments for install
COMPONENT_INSTALL_ARGS += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ARGS += CC="$(CC)"
COMPONENT_INSTALL_ARGS += CFLAGS="$(CFLAGS)"
COMPONENT_INSTALL_ARGS += prefix=$(USRDIR)
COMPONENT_INSTALL_ARGS.32 += LIBDIR=$(USRLIBDIR)
COMPONENT_INSTALL_ARGS.64 += LIBDIR=$(USRLIBDIR64)
COMPONENT_INSTALL_ARGS += MANDIR=$(USRSHAREMANDIR)

COMPONENT_BUILD_ARGS   += $(COMPONENT_INSTALL_ARGS)

# strip -L/usr/lib from 32b. pc-file
COMPONENT_POST_INSTALL_ACTION += $(GSED) -i -e 's|-L\$${libdir}||g' \
  $(PROTO_DIR)/usr/lib/pkgconfig/libzstd.pc ;

# Set up arguments for test
COMPONENT_TEST_ARGS += CC="$(CC)"

# Keep list of tests performed
COMPONENT_TEST_TRANSFORMS += \
  '-n' \
  '-e "/^test/p" '

REQUIRED_PACKAGES += compress/lz4
REQUIRED_PACKAGES += compress/xz
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/libc
