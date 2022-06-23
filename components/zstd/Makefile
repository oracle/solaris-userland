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
# Copyright (c) 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER = gcc

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		zstd
COMPONENT_VERSION=	1.5.2
COMPONENT_LABEL=	v$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=	https://github.com/facebook/zstd
COMPONENT_ARCHIVE_HASH= \
    sha256:7c42d56fac126929a6a85dbc73ff1db2411d04f104fae9bdea51305663a83fd0
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/download/$(COMPONENT_LABEL)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	12083
COMPONENT_BAID=		125214

BUILD_STYLE = justmake

include $(WS_MAKE_RULES)/common.mk

COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# Set up arguments for install
COMPONENT_INSTALL_ARGS += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ARGS += CC="$(CC)"
COMPONENT_INSTALL_ARGS += PREFIX=$(USRDIR)
COMPONENT_INSTALL_ARGS += LIBDIR=$(USRLIBDIR64)
COMPONENT_INSTALL_ARGS += MANDIR=$(USRSHAREMANDIR)

# Set up arguments for test
COMPONENT_TEST_ARGS += CC="$(CC)"

# Keep list of tests performed
COMPONENT_TEST_TRANSFORMS += \
  '-n' \
  '-e "/^test/p" '

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += compress/lz4
