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
BUILD_BITS= 64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		modsecurity
COMPONENT_VERSION=	2.9.10
COMPONENT_BAID=		332163
COMPONENT_PROJECT_URL=	https://github.com/owasp-modsecurity/ModSecurity
COMPONENT_ARCHIVE_HASH=	\
    sha256:081cda52975494139922fa4b54f474fed8a6db4b7f586cb0d3aeec635f7a4d53
COMPONENT_SRC= modsecurity-v$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_URL= \
    $(COMPONENT_PROJECT_URL)/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/apache
COMPONENT_ANITYA_ID=	9933

MODULES_INSTALL=
MODULES_TEST= $(TEST_AND_COMPARE_64)

include ../modules.mk

COMPONENT_POST_UNPACK_ACTION += \
  (cd $(SOURCE_DIR); \
  $(CP) modsecurity.conf-recommended modsecurity-24.conf-recommended)

CONFIGURE_OPTIONS += --disable-mlogc
CONFIGURE_OPTIONS += LTFLAGS="--silent --tag=CC"
CONFIGURE_OPTIONS += --with-apr=`$(APXS) -q APR_CONFIG`
CONFIGURE_OPTIONS += --with-apu=`$(APXS) -q APU_CONFIG`
CONFIGURE_OPTIONS += --with-pcre2

COMPONENT_TEST_ARGS += CFLAGS="$(CFLAGS) -DMSC_TEST"
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/ERROR/p" '

REQUIRED_PACKAGES += library/apr-1
REQUIRED_PACKAGES += library/apr-util-1
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += web/curl
