
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
# Copyright (c) 2016, 2024, Oracle and/or its affiliates.
#

COMPILER =      	gcc
BUILD_BITS =            32_and_64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		glib
COMPONENT_VERSION=	2.76.4
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GLib/
COMPONENT_ARCHIVE_HASH=	\
    sha256:5a5a191c96836e166a7771f7ea6ca2b0069c603c7da3cba1cd38d1694a395dda
COMPONENT_BUGDB=	gnome/glib
COMPONENT_ANITYA_ID=	10024

COMPONENT_BAID=		147282
BUILD_STYLE=		meson

# No need to build for older versions.
PYTHON_VERSION= 3.11

# sparc specific patch to workaround the problem with Fujitsu running
# Xorg AND VNC/XDMCP simultaneously
ifeq ($(MACH), sparc)
ADDITIONAL_PATCHES += patches/21-fdwalk-workaround.sparc
endif

include $(WS_MAKE_RULES)/gnome-component.mk

CFLAGS += $(CPP_XPG6MODE)
CFLAGS.gcc += -std=gnu11

# using the setting from shared-macros.mk results in 23665701
# overriding it here till we can get gdm rebuilt
gcc_STACK_ALIGN.i386.32 =

# The problem with not enough of FDs seems to show only during full build and
# only on sparc
# ninja: Entering directory `$WS/components/gnome/glib2/build/sparcv7'
# ninja: fatal: pipe: Too many open files
ENV := ulimit -n 16384; $(ENV)

# Assumes GNU msgfmt in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += -Druntime_libdir=$(USRLIBDIR)
CONFIGURE_OPTIONS += -Dcharsetalias_dir=$(USRLIBDIR)
CONFIGURE_OPTIONS += -Druntime_dir=$(VARDIR)/run
CONFIGURE_OPTIONS += -Dselinux=disabled
CONFIGURE_OPTIONS += -Dxattr=false
CONFIGURE_OPTIONS += -Dlibmount=disabled
CONFIGURE_OPTIONS += -Dbsymbolic_functions=false
CONFIGURE_OPTIONS += -Dman=true
CONFIGURE_OPTIONS += -Dfam=true

# Need to convert "#! /usr/bin/env python" to actual path for pkgdepend to work
PYTHON_SCRIPTS += $(PROTO_DIR)$(CONFIGURE_BINDIR.$(BITS))/gtester-report
PYTHON_SCRIPTS += $(PROTO_DIR)$(CONFIGURE_BINDIR.$(BITS))/gdbus-codegen
PYTHON_SCRIPTS += $(PROTO_DIR)$(CONFIGURE_BINDIR.$(BITS))/glib-genmarshal
PYTHON_SCRIPTS += $(PROTO_DIR)$(CONFIGURE_BINDIR.$(BITS))/glib-mkenums

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libgio-2.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libgio-2.0.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libglib-2.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libglib-2.0.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libgmodule-2.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libgmodule-2.0.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libgobject-2.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libgobject-2.0.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libgthread-2.0.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libgthread-2.0.3lib; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/gio-module-cache.xml \
                $(PROTO_DIR)/lib/svc/manifest/application/desktop-cache/gio-module-cache.xml; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/glib-compile-schemas.xml \
                $(PROTO_DIR)/lib/svc/manifest/application/desktop-cache/glib-compile-schemas.xml; \
        $(INSTALL) -D -m 0555 $(COMPONENT_DIR)/files/gio-module-cache.sh \
                $(PROTO_DIR)/lib/svc/method/gio-module-cache; \
        $(INSTALL) -D -m 0555 $(COMPONENT_DIR)/files/glib-compile-schemas.sh \
                $(PROTO_DIR)/lib/svc/method/glib-compile-schemas; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/gio-module-cache.8s \
                $(PROTO_DIR)/usr/share/man/man8s/application/desktop-cache/gio-module-cache.8s; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/glib-compile-schemas.8s \
                $(PROTO_DIR)/usr/share/man/man8s/application/desktop-cache/glib-compile-schemas.8s; \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/gnome-interfaces.7 \
                $(PROTO_DIR)/usr/share/man/man7/gnome-interfaces.7;

# get rid of the timestamps from the test results
COMPONENT_TEST_MASTER = \
	$(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master
COMPONENT_TEST_TRANSFORMS += \
        '-e "s/[0-9]* subtests passed//"'

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += data/docbook/docbook-dtds
REQUIRED_PACKAGES += data/docbook/docbook-style-xsl
REQUIRED_PACKAGES += data/sgml-common
REQUIRED_PACKAGES += data/xml-common
REQUIRED_PACKAGES += desktop/xdg/desktop-file-utils
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/file-monitor/gamin
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
