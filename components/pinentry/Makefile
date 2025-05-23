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
COMPILER= gcc
include ../../make-rules/shared-macros.mk

PATH = $(GNUBIN):$(USRBINDIR)

COMPONENT_NAME=		pinentry
COMPONENT_VERSION=	1.3.1
COMPONENT_PROJECT_URL=	https://www.gnupg.org/related_software/pinentry/
COMPONENT_ARCHIVE=     $(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:bc72ee27c7239007ab1896c3c2fae53b076e2c9bd2483dc2769a16902bce8c04
COMPONENT_ARCHIVE_URL=	https://gnupg.org/ftp/gcrypt/pinentry/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=      $(COMPONENT_ARCHIVE_URL).sig

COMPONENT_BUGDB=	utility/gnupg
COMPONENT_ANITYA_ID=	3643

COMPONENT_BAID=		329795

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk


CONFIGURE_OPTIONS  +=		--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS  +=		--infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS  +=		--enable-pinentry-curses
CONFIGURE_OPTIONS  +=		--enable-pinentry-fltk
CONFIGURE_OPTIONS  +=		--enable-pinentry-gnome3
CONFIGURE_OPTIONS  +=		--disable-pinentry-gtk2
CONFIGURE_OPTIONS  +=		--disable-pinentry-qt5
CONFIGURE_OPTIONS  +=		--enable-libsecret

# PSARC/2009/588 required delivery under /usr/lib instead of /usr/bin
CONFIGURE_BINDIR.64 = /usr/lib

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gcr-4
REQUIRED_PACKAGES += library/gnome/libsecret
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/security/libassuan
REQUIRED_PACKAGES += library/security/libgpg-error
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += x11/library/toolkit/fltk
