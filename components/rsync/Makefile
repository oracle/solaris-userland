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
# Copyright (c) 2009, 2025, Oracle and/or its affiliates.
#

# Use GNU compiler to automatically remove the build path from macros and debug information.
COMPILER=	gcc
BUILD_BITS=	64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		rsync
COMPONENT_VERSION=	3.4.1
COMPONENT_BAID=	192526
COMPONENT_ARCHIVE_HASH=	sha256:2924bcb3a1ed8b551fc101f740b9f0fe0a202b115027647cf69850d65fd88c52
COMPONENT_PROJECT_URL=	http://rsync.samba.org/
COMPONENT_ARCHIVE_URL=	https://download.samba.org/pub/rsync/src/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	4217

include $(WS_MAKE_RULES)/common.mk

ifeq ($(DEBUG), yes)
gcc_OPT= -Og -g
endif

CONFIGURE_OPTIONS  +=		SHELL_PATH=$(BINDIR)/sh
CONFIGURE_OPTIONS  +=		--with-included-popt
CONFIGURE_OPTIONS  +=		--enable-xattr-support
CONFIGURE_OPTIONS  +=		--disable-xxhash
CONFIGURE_OPTIONS  +=		--disable-zstd
CONFIGURE_OPTIONS  +=		--disable-openssl
CONFIGURE_OPTIONS  +=		--disable-iconv-open
CONFIGURE_OPTIONS  +=		--enable-iconv
CONFIGURE_ENV +=		CFLAGS="$(CFLAGS)"

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/passed$$/p" ' \
	'-e "/skipped$$/p" '

REQUIRED_PACKAGES += compress/lz4
