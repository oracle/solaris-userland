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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		modsecurity
COMPONENT_VERSION=	2.9.2
COMPONENT_PROJECT_URL=	https://www.modsecurity.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:41a8f73476ec891f3a9e8736b98b64ea5c2105f1ce15ea57a1f05b4bf2ffaeb5
COMPONENT_ARCHIVE_URL= \
    $(COMPONENT_PROJECT_URL)tarball/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	9933

TPNO=			36801

MODULES_INSTALL=
include ../modules.mk

COMPONENT_POST_UNPACK_ACTION += \
  (cd $(SOURCE_DIR); \
  $(CP) modsecurity.conf-recommended modsecurity-24.conf-recommended)

CONFIGURE_OPTIONS += --disable-mlogc
CONFIGURE_OPTIONS += LTFLAGS="--silent --tag=CC"
CONFIGURE_OPTIONS += --with-apr=`$(APXS) -q APR_CONFIG`
CONFIGURE_OPTIONS += --with-apu=`$(APXS) -q APU_CONFIG`

COMPONENT_TEST_ARGS += CFLAGS="$(CFLAGS) -DMSC_TEST"

REQUIRED_PACKAGES += library/apr-16
REQUIRED_PACKAGES += library/apr-util-16
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/pcre
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += web/curl
