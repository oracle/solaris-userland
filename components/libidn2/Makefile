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
# Copyright (c) 2018, 2020, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER = gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libidn2
COMPONENT_VERSION=	2.3.0
TPNO=			57906
COMPONENT_ARCHIVE_HASH= \
    sha256:e1cb1db3d2e249a6a3eb6f0946777c2e892d5c5dc7bd91c74394fc3a01cab8b5
COMPONENT_ARCHIVE_URL=	https://ftp.gnu.org/gnu/libidn/libidn2-2.3.0.tar.gz
# libidn2 is continuation of libidn
COMPONENT_PROJECT_URL=	https://www.gnu.org/software/libidn/#libidn2
COMPONENT_BUGDB=	library/libidn
COMPONENT_ANITYA_ID=	5597

include $(WS_MAKE_RULES)/common.mk

# builtin alloca()
CFLAGS += -D__BUILTIN_VA_ARG_INCR

CONFIGURE_OPTIONS  +=		--includedir=$(USRINCDIR)/idn
CONFIGURE_OPTIONS  +=		--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS  +=		--infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS  +=		--enable-shared
CONFIGURE_OPTIONS  +=		--disable-static
CONFIGURE_OPTIONS  +=		--disable-rpath
CONFIGURE_OPTIONS  +=		--disable-valgrind-tests
CONFIGURE_OPTIONS  +=		--enable-nls
CONFIGURE_OPTIONS  +=		--with-libiconv-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-libintl-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-html-dir=$(CONFIGURE_PREFIX)/share/doc
CONFIGURE_OPTIONS  +=		--with-pic
CONFIGURE_OPTIONS  +=		--enable-gtk-doc-html --enable-gtk-doc-pdf

CONFIGURE_ENV +=	INSTALL="$(INSTALL)"

COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -f )

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS = -k -i
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/TOTAL:/p" ' \
	'-e "/PASS:/p" ' \
	'-e "/SKIP:/p" ' \
	'-e "/XFAIL:/p" ' \
	'-e "/FAIL:/p" ' \
	'-e "/XPASS:/p" ' \
	'-e "/passed/p" '

# only the requested pkg is system/library
