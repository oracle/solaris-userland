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
# Copyright (c) 2020, 2026, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME =	libzip
COMPONENT_VERSION =	1.12.1
COMPONENT_PROJECT_URL =	https://libzip.org/
COMPONENT_ARCHIVE_HASH = \
    sha256:3b66fe92cbc768d8d4d16e1427bfb7399e15d9c2795c2fc482e7b30a6332a422
COMPONENT_ARCHIVE_URL = $(COMPONENT_PROJECT_URL)download/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/zip
COMPONENT_ANITYA_ID=	10649
COMPONENT_BAID =	467563

# Upstream regression tests use nihtest since libzip 1.10.
COMPONENT_SRC_1 =	nihtest-1.11.1
COMPONENT_ARCHIVE_1 =	$(COMPONENT_SRC_1).tar.gz
COMPONENT_ARCHIVE_HASH_1 = \
    sha256:9307197235c107f24a569a2847ee02ebd771a395d8d081dac9aab0f7b9139a75
COMPONENT_ARCHIVE_URL_1 = https://github.com/nih-at/nihtest/releases/download/v1.11.1/$(COMPONENT_ARCHIVE_1)

BUILD_STYLE= cmake

include $(WS_MAKE_RULES)/common.mk

CMAKE_OPTIONS += -DCMAKE_POLICY_VERSION_MINIMUM=3.5
# Use OpenSSL 3 backend.
CMAKE_OPTIONS += -DENABLE_OPENSSL=ON
CMAKE_OPTIONS += -DENABLE_GNUTLS=OFF
CMAKE_OPTIONS += -DOPENSSL_ROOT_DIR=/usr/openssl/3
# Keep command arguments as strings rather than converting them to file paths.
CMAKE_OPTIONS += '-DNIHTEST:STRING=$(PYTHON);-m;nihtest'

# elfedit removes wrong RUNPATH/RPATH 
COMPONENT_POST_INSTALL_ACTION.64 = ( \
	for i in bin/zipcmp bin/zipmerge bin/ziptool \
	         lib/libzip.so.5.6 lib/$(MACH64)/libzip.so.5.6; do \
 	$(ELFEDIT) -e "dyn:delete RUNPATH" -e "dyn:delete RPATH" \
 	  $(PROTOUSRDIR)/$$i ; done ) ;

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
# Remove any color coding from the test output.
COMPONENT_TEST_ARGS += COLOR=no
COMPONENT_TEST_ENV += PYTHONPATH=$(SOURCE_DIR_1)

COMPONENT_TEST_TRANSFORMS += '-e "s/  *[0-9][0-9]*\.[0-9][0-9] sec//" ' 
COMPONENT_TEST_TRANSFORMS += '-e "/^make/d" -e "/^Built/d" -e "/^Scanning dependencies/d" '

CBE_PACKAGES += runtime/python-313

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += compress/xz
REQUIRED_PACKAGES += compress/zstd
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
