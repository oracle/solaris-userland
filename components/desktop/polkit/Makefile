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
# Copyright (c) 2016, 2021, Oracle and/or its affiliates.
#

# parfait is a bit unhappy (24796481)
export PARFAIT_BUILD=no

BUILD_BITS =            64
# Also, all components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		polkit
COMPONENT_VERSION=	0.118
COMPONENT_PROJECT_URL=	http://www.freedesktop.org/wiki/Software/polkit/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
	sha256:bd1cc7cea8468e2978cb273fde94ee43a74e2737a4b6914708da6114ee7ed605
COMPONENT_ARCHIVE_URL=	http://www.freedesktop.org/software/polkit/releases/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sign
COMPONENT_BUGDB=	gnome/security
COMPONENT_ANITYA_ID=	3682
COMPONENT_SIG_URL=

TPNO=			68738

# Tests don't work on Solaris
TEST_TARGET = $(SKIP_TEST)

include $(WS_MAKE_RULES)/common.mk

# Regenerate configure after applying patches that modify configure.ac
COMPONENT_PREP_ACTION += ( cd $(@D); autoreconf -fiv);

# Need C99 or later to get fpclassify() & isfinite() in <math.h>
CFLAGS += -ggdb
CFLAGS.gcc += -std=gnu11
CFLAGS.studio += -std=c11 -xlang=c11

CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-gtk-doc
CONFIGURE_OPTIONS += --enable-man-pages
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += --with-authfw=pam
CONFIGURE_OPTIONS += --with-polkitd-user=_polkitd
CONFIGURE_OPTIONS += --with-os-type=solaris
CONFIGURE_OPTIONS += --disable-libsystemd-login
CONFIGURE_OPTIONS += --disable-libelogind
CONFIGURE_OPTIONS += --sysconfdir="$(ETCDIR)"

# Workaround the mozjs issue described in 24935318
LD_EXEC_OPTIONS.64 += -M $(WS_COMPONENTS)/desktop/polkit/mapfile
COMPONENT_BUILD_ENV.64 += LD_EXEC_OPTIONS="$(LD_EXEC_OPTIONS.64)"
COMPONENT_INSTALL_ENV.64 += LD_EXEC_OPTIONS="$(LD_EXEC_OPTIONS.64)"
ADIHEAP_MODE = $(ADIHEAP_DISABLE)
ADISTACK_MODE = $(ADISTACK_DISABLE)

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/polkit.xml \
                $(PROTO_DIR)/lib/svc/manifest/system/polkit.xml; \
        $(INSTALL) -D -m 0555 $(COMPONENT_DIR)/files/svc-polkit \
                $(PROTO_DIR)/lib/svc/method/svc-polkit; \

REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libmozjs-78
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/pam-core
