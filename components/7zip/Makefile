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
BUILD_BITS =		64
COMPILER =		gcc
CTF_MODE =		off	# Has no effect
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		7-Zip
COMPONENT_VERSION=	24.09
COMPONENT_BAID=		187548
COMPONENT_SRC=		7z2409-src
COMPONENT_PROJECT_URL=	https://www.7-zip.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:49c05169f49572c1128453579af1632a952409ced028259381dac30726b6133a
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/a/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	368867

IPS_COMPONENT_VERSION=	24.7

BUILD_STYLE= justmake

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

# No tests. p7zip tests can be used eventually with 7-Zip binary.
test:	$(NO_TESTS)
system-test:	$(NO_TESTS)
COMPONENT_TEST_CMD = true

REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
