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
# Copyright (c) 2020, Oracle and/or its affiliates.
#

BUILD_ARCH=     i386
BUILD_BITS=		64
COMPILER=       gcc

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		qemu
COMPONENT_VERSION=	4.1.0

COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:656e60218689bdeec69903087fd7582d5d3e72238d02f4481d8dc6d79fd909c6
COMPONENT_ANITYA_ID=	13607

COMPONENT_ARCHIVE_URL=  https://download.qemu.org/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=
COMPONENT_PROJECT_URL=	https://www.qemu.org
COMPONENT_BUGDB=    utility/qemu-img

TPNO=			55157

BUILD_STYLE= configure

# Disable non-tools targets
CONFIGURE_OPTIONS=  --disable-system --disable-user --disable-tpm \
    --disable-guest-agent --disable-blobs

# There are some test failures, the master test file is missing.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

PATH=   $(GNUBIN):$(USRBINDIR64):$(USRBINDIR)

COMPONENT_BUILD_ENV += PATH="$(PATH)"

# Configure won't accept building docs since we don't have sphinx, so
# we override it here and patch Makefile to avoid the sphinx targets
COMPONENT_BUILD_ARGS += BUILD_DOCS=1
COMPONENT_INSTALL_ARGS += BUILD_DOCS=1

# Tests are focused on emulator, don't cover tools
test:		$(NO_TESTS)

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/security/nettle
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += web/curl
