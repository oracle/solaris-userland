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
# Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            32_and_64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gtk3
COMPONENT_VERSION=	3.22.12
COMPONENT_PROJECT_URL=	http://www.gtk.org/
COMPONENT_SRC=		gtk+-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:84fae0cefb6a11ee2b4e86b8ac42fe46a3d30b4ad16661d5fc51e8ae03e2a98c
COMPONENT_ARCHIVE_URL=	https://download.gnome.org/sources/gtk+/3.22/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/gtk+
COMPONENT_ANITYA_ID=	10018

TPNO=			34749

ETCDIR.64="$(ETCDIR)/$(MACH64)"

include $(WS_MAKE_RULES)/gnome-component.mk

# Uses isinf, etc. only available in c99 and newer.  The GNU variant is chosen
# due to use of M_PI, etc. dropped in C99 and newer.
CFLAGS.gcc += -std=gnu11

# 32-bit gcc builds cause segfaults in gtk3; see bug 21393975.
gcc_OPT.i386.32 = -O2

CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
CONFIGURE_OPTIONS += --enable-cloudprint
# Required for other components.
CONFIGURE_OPTIONS += --enable-introspection
CONFIGURE_OPTIONS += --enable-libcanberra
# Generate man pages
CONFIGURE_OPTIONS += --enable-man
CONFIGURE_OPTIONS += --with-x
# disable colord for now till we get colord installed on build servers
# at which point we can delete this and add it in REQ PKGS
CONFIGURE_OPTIONS += --enable-colord=no

# Needed due to patch to configure.ac.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

# Make sure SMF manifests are valid
$(BUILD_DIR)/.validated-smf-manifests-$(MACH): $(BUILD_DIR)
	@for f in files/*.xml ; do \
	    (set -ex ; /usr/sbin/svccfg validate "$$f") ; \
	done
	$(TOUCH) $@

validate-smf:	$(BUILD_DIR)/.validated-smf-manifests-$(MACH)
build:		$(BUILD_DIR)/.validated-smf-manifests-$(MACH)

# Generate and install architecture-specific configuration files.
PROTOGTKDIR=		$(PROTO_DIR)$(USRLIB)/gtk-3.0/3.0.0
PROTOIMMCONF=		$(PROTOGTKDIR)/immodules.cache

COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTOGTKDIR); \
	LD_LIBRARY_PATH='$(PROTO_DIR)$(USRLIB)' \
	  $(PROTO_DIR)$(USRBIN)/gtk-query-immodules-3.0 \
	  $(PROTOGTKDIR)/immodules/*.so | \
	  $(GSED) -e 's%$(PROTO_DIR)%%' > $(PROTOIMMCONF) ;

# Standard automake test framework results transform
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL/p" ' \
        '-e "/SKIP/p" ' \
        '-e "/PASS/p" ' \
        '-e "/FAIL/p" '

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += data/docbook/docbook-dtds
REQUIRED_PACKAGES += data/docbook/docbook-style-dsssl
REQUIRED_PACKAGES += data/docbook/docbook-style-xsl
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/gnu-indent
REQUIRED_PACKAGES += library/desktop/at-spi2-atk
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/desktop/librest
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/desktop/xdg/libcanberra
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/json-glib
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += print/cups
REQUIRED_PACKAGES += runtime/perl-522
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += service/opengl/ogl-select
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libepoxy
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcomposite
REQUIRED_PACKAGES += x11/library/libxcursor
REQUIRED_PACKAGES += x11/library/libxdamage
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/library/libxrandr
REQUIRED_PACKAGES += x11/library/libxrender
