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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#

BUILD_BITS=		64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
# Also, for now, all things built for C++11 require gcc.
COMPILER=gcc

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1

include ../../../make-rules/shared-macros.mk

# Despite its name, evolution-data-server is no longer just a backend for the
# Evolution Mail Client; it is also a backend for various bits of data that
# GNOME stores and various components now expect it to be present.

COMPONENT_NAME=		evolution-data-server
COMPONENT_VERSION=	3.50.3
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Apps/Evolution
COMPONENT_ARCHIVE_HASH= \
	sha256:225d70b6a40268f225c2ac428ee5eb52d5a6fda2602955d50a24970526fe2452
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	10935

COMPONENT_BAID=		157584

BUILD_STYLE= cmake

include $(WS_MAKE_RULES)/gnome-component.mk

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-incompatible-pointer-types

# __EXTENSIONS__ required for timezone, altzone variables.
CFLAGS += -D__EXTENSIONS__ -DHAVE_SUN_KRB5
CXXFLAGS += -std=c++11 -D__EXTENSIONS__ -DHAVE_SUN_KRB5
CPPFLAGS += -I/usr/include/kerberosv5/
CFLAGS += $(XPG6MODE)

# to find gnu xgettext
CMAKE_OPTIONS += -DGETTEXT_XGETTEXT_EXECUTABLE=/usr/gnu/bin/xgettext
CMAKE_OPTIONS += -DENABLE_GOOGLE_AUTH=OFF
CMAKE_OPTIONS += -DENABLE_OAUTH2=OFF
CMAKE_OPTIONS += -DENABLE_UOA=OFF
CMAKE_OPTIONS += -DENABLE_INTROSPECTION=ON
CMAKE_OPTIONS += -DOPEN_LDAP=OFF
CMAKE_OPTIONS += -DENABLE_VALA_BINDINGS=ON
CMAKE_OPTIONS += -DSYSCONF_INSTALL_DIR="/etc"
CMAKE_OPTIONS += -DENABLE_OAUTH2_WEBKITGTK=OFF
CMAKE_OPTIONS += -DENABLE_OAUTH2_WEBKITGTK4=OFF
# Avoid to generate documentation since it might crash on sparc (see bug 31473179).
CMAKE_OPTIONS += -DENABLE_GTK_DOC=OFF

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

PERL_SCRIPTS += $(PROTO_DIR)/usr/lib/evolution-data-server/csv2vcard

# for the tests
unexport SHELLOPTS

include $(WS_MAKE_RULES)/test-x11.mk

#
# to locate dbus-daemon
# NOTE: desktop must be running -> run
# vncserver
# and export DISPLAY
#
COMPONENT_TEST_ENV += PATH="$(PATH):/usr/lib"
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMER =    $(NAWK)
COMPONENT_TEST_TRANSFORMS = -F"'('" \
	"'/The following tests FAILED/ {results = 1}; /Errors while running CTest/ {results = 0}; {if (results) print \$$1}'"

REQUIRED_PACKAGES += database/berkeleydb-5
REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/gtk4
REQUIRED_PACKAGES += library/desktop/libgweather
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/desktop/xdg/libcanberra
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gnome-online-accounts
REQUIRED_PACKAGES += library/gnome/libsecret
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/json-glib
REQUIRED_PACKAGES += library/libical
REQUIRED_PACKAGES += library/libsoup-3
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/nspr
REQUIRED_PACKAGES += library/security/nss
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/perl-538
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/network/ldap/openldap
