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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

BUILD_BITS=          	64
# brltty-5.4/Headers/bitfield.h has a field with a zero-sized array that
# Studio 12.4 refuses to deal with.
COMPILER=		gcc
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		brltty
COMPONENT_VERSION=	6.4
COMPONENT_PROJECT_URL=	http://mielke.cc/brltty/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:bc7573b0d0ab865c36607945b64c209312405571788f3b409397726f6143eaa6
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/archive/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/accessibility
COMPONENT_ANITYA_ID=	220

COMPONENT_BAID=		124114

TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR) $(@D)) ;

# Needed because we patch configure.ac
COMPONENT_PRE_CONFIGURE_ACTION += (cd $(@D) ; ./autogen) ;

CC +=			$(CC_BITS)
CFLAGS += 		$(CC_PIC)
CPPFLAGS += 		-D_SYS_UCONTEXT_H # Workaround Bug Id 15558893

# Orca uses python 3.11, so we need to match
PYTHON_VERSION = 3.11
CONFIGURE_ENV += PYTHON="$(PYTHON)"
PKG_MACROS += PYVER="$(PYTHON_VERSION)"

# Assumes GNU gettext & msgfmt are first in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# Needed by call to setup.py for python module in build phase
# (copied from make-rules/setup.py.mk)
PYTHON_ENV +=	CC="$(CC)"
PYTHON_ENV +=	CFLAGS="$(CFLAGS)"
PYTHON_ENV +=	LDSHARED="$(CC) -shared"
COMPONENT_BUILD_ENV += $(PYTHON_ENV)
COMPONENT_INSTALL_ENV += $(PYTHON_ENV)
COMPONENT_TEST_ENV += $(PYTHON_ENV)
COMPONENT_SYSTEM_TEST_ENV += $(PYTHON_ENV)

# brltty's Makefile doesn't let us pass --install-lib to setup.py so we
# move it in the proto area manually
COMPONENT_POST_INSTALL_ACTION += \
    $(MV) $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/site-packages \
        $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages

CONFIGURE_OPTIONS +=	--enable-python-bindings
CONFIGURE_OPTIONS +=	--disable-java-bindings
CONFIGURE_OPTIONS +=	--disable-lisp-bindings
CONFIGURE_OPTIONS +=	--disable-ocaml-bindings
CONFIGURE_OPTIONS +=	--disable-tcl-bindings
CONFIGURE_OPTIONS +=	--disable-speech-support
CONFIGURE_OPTIONS +=	--disable-stripping
CONFIGURE_OPTIONS +=	--with-rgx-package=none
CONFIGURE_OPTIONS +=	--disable-polkit # requires SO_PEERCRED support
CONFIGURE_OPTIONS +=	--without-midi-package
CONFIGURE_OPTIONS +=	--without-writable-directory
CONFIGURE_OPTIONS +=	--with-gui-toolkit=Xaw
CONFIGURE_OPTIONS += 	--localstatedir="$(VARDIR)"
CONFIGURE_OPTIONS += 	--sysconfdir="$(ETCDIR)"
CONFIGURE_OPTIONS +=	CFLAGS="$(CFLAGS)"
CONFIGURE_OPTIONS +=	LD="/usr/bin/ld"
CONFIGURE_OPTIONS +=	CYTHON="/usr/bin/cython-$(PYTHON_VERSION)"

COMPONENT_INSTALL_ARGS +=	INSTALL_ROOT=$(PROTO_DIR)

REQUIRED_PACKAGES += library/desktop/at-spi2-core
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/python/cython-311
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxtst
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
REQUIRED_PACKAGES += library/liblouis
REQUIRED_PACKAGES += library/expat
