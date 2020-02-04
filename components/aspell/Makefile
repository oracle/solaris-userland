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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		aspell
COMPONENT_VERSION=	0.60.8
COMPONENT_PROJECT_URL=	http://aspell.net/
COMPONENT_ARCHIVE_HASH=	\
    sha256:f9b77e515334a751b2e60daab5db23499e26c9209f5e7b7443b05235ad0226f2
COMPONENT_ANITYA_ID=	120

COMPONENT_NAME_1=	aspell6-en
COMPONENT_VERSION_1=	2019.10.06-0
COMPONENT_SRC_1=	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1).tar.bz2
COMPONENT_ARCHIVE_HASH_1= \
    sha256:24334b4daac6890a679084f4089e1ce7edbe33c442ace776fa693d8e334f51fd
COMPONENT_ARCHIVE_URL_1= https://ftp.gnu.org/gnu/$(COMPONENT_NAME)/dict/en/$(COMPONENT_ARCHIVE_1)
COMPONENT_SIG_URL_1=	$(COMPONENT_ARCHIVE_URL_1).sig
SOURCE_DIR_1=		$(COMPONENT_DIR)/$(COMPONENT_SRC_1)
COMPONENT_ANITYA_ID_1=	7838

TPNO=			54796

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/gnu-component.mk

ASPELL_BIN_DIR.32 =	$(PROTOUSRBINDIR)/$(MACH32)
ASPELL_BIN_DIR.64 =	$(PROTOUSRBINDIR)
ASPELL_BIN_DIR =	$(ASPELL_BIN_DIR.$(BITS))

ASPELL_LIB_DIR.32 =	$(PROTOUSRLIBDIR)
ASPELL_LIB_DIR.64 =	$(PROTOUSRLIBDIR64)
ASPELL_LIB_DIR =	$(ASPELL_LIB_DIR.$(BITS))

# To avoid issue with incompatible hash function for dictionaries, see:
# http://aspell.net/0.61/man-html/Using-32_002dBit-Dictionaries-on-a-64_002dBit-System.html
CONFIGURE_OPTIONS += --enable-32-bit-hash-fun

# Needed to successfully find .../gen/mk-dirs_h.pl
COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR) $(@D));

# This is needed to get the two files below created; this is likely only 
# a problem of the current aspell version; for more details, see:
# https://github.com/GNUAspell/aspell/issues/591
COMPONENT_POST_CONFIGURE_ACTION += \
    (cd $(BUILD_DIR_$(BITS)); \
			$(GMAKE) gen/dirs.h; \
			$(GMAKE) gen/static_filters.src.cpp);

# Needed to configure, build and install the aspell English dictionary.
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(SOURCE_DIR_1) ; \
		PATH="$(ASPELL_BIN_DIR):$(PATH)" \
		./configure --vars \
		    ASPELL_FLAGS=--data-dir=$(ASPELL_LIB_DIR)/aspell-0.60 \
		    DESTDIR=$(PROTO_DIR));
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(SOURCE_DIR_1) ; \
		export LD_LIBRARY_PATH=$(ASPELL_LIB_DIR); \
		PATH="$(ASPELL_BIN_DIR):$(PATH)" \
		$(GMAKE) install);

CONFIGURE_ENV +=	LD_OPTIONS="$(LD_OPTIONS)"

CLEAN_PATHS +=		$(SOURCE_DIR_1)
PKG_PROTO_DIRS +=	$(SOURCE_DIR_1)

REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
