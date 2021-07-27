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
# Copyright (c) 2019, 2021, Oracle and/or its affiliates.
#
BUILD_BITS=		64_and_32
COMPILER=		gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		lasso
COMPONENT_VERSION=	2.7.0
BASEURL=		https://dev.entrouvert.org
COMPONENT_PROJECT_URL=	$(BASEURL)/projects/lasso
COMPONENT_ARCHIVE_HASH= \
    sha256:9282f2a546ee84b6d3a8236970fea3a47bea51cb247c31a05a374c22eb451d8d
COMPONENT_ARCHIVE_URL=	\
	$(BASEURL)/releases/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/lasso
COMPONENT_ANITYA_ID=	96894

TPNO=			71746

PKG_CONFIG_PATH.64=	/usr/lib/64/pkgconfig

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS+=	--disable-perl
CONFIGURE_OPTIONS+=	--disable-java
CONFIGURE_OPTIONS+=	--disable-python
CONFIGURE_OPTIONS+=	PATH="$(GNUBIN):$$PATH"
CONFIGURE_OPTIONS.64+=	--with-pkg-config=$(PKG_CONFIG_PATH.64)

REQUIRED_PACKAGES+=	system/library
REQUIRED_PACKAGES+=	library/security/openssl
REQUIRED_PACKAGES+=	library/glib2
REQUIRED_PACKAGES+=	system/library/math
REQUIRED_PACKAGES+=	library/libxml2
REQUIRED_PACKAGES+=	library/xmlsec
REQUIRED_PACKAGES+=	library/libxslt
REQUIRED_PACKAGES+=	library/zlib
