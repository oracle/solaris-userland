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
# Copyright (c) 2019, 2020, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		xmlsec
COMPONENT_VERSION=	1.2.28
COMPONENT_PROJECT_URL=	https://www.aleksey.com/xmlsec
COMPONENT_SRC_NAME=	xmlsec1
COMPONENT_ARCHIVE_HASH= \
    sha256:13eec4811ea30e3f0e16a734d1dbf7f9d246a71d540b48d143a07b489f6222d4
COMPONENT_ARCHIVE_URL=	http://www.aleksey.com/xmlsec/download/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/xmlsec
COMPONENT_ANITYA_ID=	5200

TPNO=			52162

PKG_CONFIG_PATH.64=	/usr/lib/64/pkgconfig

#
# most of tests using the gcrypt/gnutls backend skipped as they try
# to use secure memory, which requires additional privileges
# run sudo gmake test to get a better pass rate
#
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMS += '-e "/^--- TOTAL/p" ' \
	'-e "/.*/d" '

include $(WS_MAKE_RULES)/common.mk

# Make docs does not like cloney, so a simple copy is used instead.
COMPONENT_PRE_CONFIGURE_ACTION= \
	$(CP) -rp $(SOURCE_DIR)/. $(@D)

CONFIGURE_OPTIONS+=	PATH="$(GNUBIN):$$PATH"

REQUIRED_PACKAGES+=	system/library
REQUIRED_PACKAGES+=	system/library/math
REQUIRED_PACKAGES+=	library/libxml2
REQUIRED_PACKAGES+=	library/libxslt
REQUIRED_PACKAGES+=	system/library/security/libgcrypt
REQUIRED_PACKAGES+=	library/gnutls-3
REQUIRED_PACKAGES+=	library/security/openssl
REQUIRED_PACKAGES+=	library/security/nss
REQUIRED_PACKAGES+=	library/nspr
