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
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME =	libzip
COMPONENT_VERSION =	1.7.3
COMPONENT_PROJECT_URL =	https://libzip.org/
COMPONENT_ARCHIVE_HASH = \
    sha256:0e2276c550c5a310d4ebf3a2c3dfc43fb3b4602a072ff625842ad4f3238cb9cc
COMPONENT_ARCHIVE_URL = $(COMPONENT_PROJECT_URL)download/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/zip
COMPONENT_ANITYA_ID=	10649

TPNO = 60980

BUILD_STYLE= cmake

include $(WS_MAKE_RULES)/common.mk

# elfedit removes wrong RUNPATH/RPATH 
COMPONENT_POST_INSTALL_ACTION.64 = ( \
	for i in bin/zipcmp bin/zipmerge bin/ziptool \
	         lib/libzip.so.5.3 lib/$(MACH64)/libzip.so.5.3; do \
 	$(ELFEDIT) -e "dyn:delete RUNPATH" -e "dyn:delete RPATH" \
 	  $(PROTOUSRDIR)/$$i ; done ) ;

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_TRANSFORMS += '-e "s/  *[0-9][0-9]*\.[0-9][0-9] sec//" ' 

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += compress/xz
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/security/nettle
REQUIRED_PACKAGES += library/zlib
