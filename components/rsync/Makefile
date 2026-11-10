#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2009, 2026, Oracle and/or its affiliates.
#

# Use GNU compiler to automatically remove the build path from macros and debug information.
BUILD_BITS=	64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		rsync
COMPONENT_VERSION=	3.5.2
COMPONENT_BAID=	465761
COMPONENT_ARCHIVE_HASH=	sha256:a10d591825251e070f74c98df3daad195def4ed81b4a2de16169026aea33f6c8
COMPONENT_PROJECT_URL=	http://rsync.samba.org/
COMPONENT_ARCHIVE_URL=	https://download.samba.org/pub/rsync/src/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_PUBLIC_KEY_URL= \
	https://keys.openpgp.org/vks/v1/by-fingerprint/C0E1054505704F757D925AB26A64E8AA2EFBCF5D
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
CPPFLAGS += $(shell pkg-config --cflags libidn2)
CONFIGURE_ENV +=		CFLAGS="$(CFLAGS)"

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/passed$$/p" ' \
	'-e "/skipped$$/p" '

REQUIRED_PACKAGES += compress/lz4
REQUIRED_PACKAGES += library/libidn2
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
