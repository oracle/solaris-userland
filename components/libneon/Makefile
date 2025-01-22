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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#

BUILD_BITS= 32_and_64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME = libneon
COMPONENT_VERSION = 0.33.0
COMPONENT_PROJECT_URL=	https://notroj.github.io/neon/
COMPONENT_SRC_NAME = neon
COMPONENT_ARCHIVE_HASH = \
    sha256:659a5cc9cea05e6e7864094f1e13a77abbbdbab452f04d751a8c16a9447cf4b8
COMPONENT_ARCHIVE_URL = $(COMPONENT_PROJECT_URL)$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/neon
COMPONENT_ANITYA_ID=	7604

COMPONENT_BAID=		177629

include $(WS_MAKE_RULES)/common.mk

CLONEY = true
COMPONENT_PRE_CONFIGURE_ACTION += $(CP) -rp $(SOURCE_DIR)/. $(@D);
CONFIGURE_SCRIPT = ./configure

$(BUILD_64): LDFLAGS = -m64

# Make test results a little bit easier to parse
COMPONENT_TEST_ENV +=	TEST_QUIET=0
COMPONENT_TEST_ENV +=	PATH="$(GNUBIN):$(PATH)"
COMPONENT_TEST_MASTER = \
       $(COMPONENT_TEST_RESULTS_DIR)/results-libneon.master
COMPONENT_TEST_TRANSFORMS += '-n '
COMPONENT_TEST_TRANSFORMS += '-e "/^<- summary/p"'

CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)
CONFIGURE_OPTIONS += --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-webdav
CONFIGURE_OPTIONS += --enable-threadsafe-ssl=posix
CONFIGURE_OPTIONS += --enable-nls
CONFIGURE_OPTIONS += --disable-warnings
CONFIGURE_OPTIONS += --disable-ld-version-script
CONFIGURE_OPTIONS += --with-zlib
CONFIGURE_OPTIONS += --with-ssl=openssl
CONFIGURE_OPTIONS += --with-libproxy
CONFIGURE_OPTIONS += --with-gssapi
CONFIGURE_OPTIONS += --with-libxml2
CONFIGURE_OPTIONS += --with-pic

REQUIRED_PACKAGES += library/libproxy
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += security/kerberos-5
