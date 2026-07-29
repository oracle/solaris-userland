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
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#
BUILD_BITS =		64
CTF_MODE =		off	# Has no effect
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		7-Zip
COMPONENT_VERSION=	26.02
COMPONENT_BAID=		413197
COMPONENT_SRC=		7z2602-src
COMPONENT_PROJECT_URL=	https://www.7-zip.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:cf967c98bca02a4b8b16375f441825a8e141362f14be1969bbec8e1ca0bff9dd
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/a/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	17875

# The p7zip archive supplies only its check scripts and archive corpus for
# testing 7zz.  It is not built or packaged, so it has no separate BAID.
COMPONENT_NAME_P7ZIP_TESTS=	p7zip
COMPONENT_VERSION_P7ZIP_TESTS=	16.02
COMPONENT_SRC_P7ZIP_TESTS= \
	$(COMPONENT_NAME_P7ZIP_TESTS)_$(COMPONENT_VERSION_P7ZIP_TESTS)
COMPONENT_ARCHIVE_P7ZIP_TESTS=	$(COMPONENT_SRC_P7ZIP_TESTS)_src_all.tar.bz2
COMPONENT_ARCHIVE_HASH_P7ZIP_TESTS= \
    sha256:5eb20ac0e2944f6cb9c2d51dd6c4518941c185347d4089ea89087ffdd6e2341f
COMPONENT_ARCHIVE_URL_P7ZIP_TESTS= \
    https://downloads.sourceforge.net/p7zip/$(COMPONENT_ARCHIVE_P7ZIP_TESTS)

IPS_COMPONENT_VERSION=	26.2

BUILD_STYLE= justmake
TEST_TARGET= $(TEST_64)

include $(WS_MAKE_RULES)/common.mk

UNPACK_ARGS += -r $(COMPONENT_SRC)

COMPONENT_BUILD_ARGS += -f ../../cmpl_gcc.mak

COMPONENT_BUILD_ACTION = \
        cd $(@D)/CPP/7zip/Bundles/Alone2; $(ENV) $(COMPONENT_BUILD_ENV) \
        $(GMAKE) $(COMPONENT_BUILD_ARGS) $(COMPONENT_BUILD_TARGETS)

PROTODOC=$(PROTOUSRSHAREDOCDIR)/7zip 
STRIP=strip

COMPONENT_INSTALL_ACTION = \
        $(MKDIR) $(PROTOUSRBINDIR) $(PROTOUSRSHAREMAN1DIR) $(PROTODOC) ; \
	$(INSTALL) $(@D)/CPP/7zip/Bundles/Alone2/b/g/7zz $(PROTOUSRBINDIR)/7zz ; \
	$(STRIP) $(PROTOUSRBINDIR)/7zz ; \
	$(INSTALL) -m 444  $(@D)/DOC/7zC.txt $(PROTODOC) ; \
	$(INSTALL) -m 444 $(@D)/DOC/7zFormat.txt $(PROTODOC) ; \
	$(INSTALL) -m 444 $(@D)/DOC/License.txt $(PROTODOC) ; \
	$(INSTALL) -m 444 $(@D)/DOC/Methods.txt $(PROTODOC) ; \
	$(INSTALL) -m 444 $(@D)/DOC/copying.txt $(PROTODOC) ; \
	$(INSTALL) -m 444 $(@D)/DOC/lzma.txt $(PROTODOC) ; \
	$(INSTALL) -m 444 $(@D)/DOC/readme.txt $(PROTODOC) ; \
	$(INSTALL) -m 444 $(@D)/DOC/src-history.txt $(PROTODOC) ; \
	$(INSTALL) -m 444 $(@D)/DOC/unRarLicense.txt $(PROTODOC) ; \
	$(INSTALL) -m 444 files/7zz.1 $(PROTOUSRSHAREMAN1DIR)/7zz.1 ;

COMPONENT_TEST_DIR= $(SOURCE_DIR_P7ZIP_TESTS)/check
COMPONENT_TEST_CMD= ./check.sh
COMPONENT_TEST_ENV += TZ=UTC
COMPONENT_TEST_ARGS= \
	$(@D)/CPP/7zip/Bundles/Alone2/b/g/7zz
COMPONENT_TEST_TARGETS=
COMPONENT_TEST_MASTER= $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-e "s/^REP=TMP_[0-9][0-9]*/REP=TMP_PID/" ' \
	'-e "s|^P7ZIP=.*|P7ZIP= 7zz|" ' \
	'-e "s/(x64)/(platform)/g" ' \
	'-e "s/(sparcv9)/(platform)/g" ' \
	'-e "s/Threads:[0-9][0-9]*/Threads:N/g" '

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
