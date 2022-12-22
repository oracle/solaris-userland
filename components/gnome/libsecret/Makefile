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
# Copyright (c) 2015, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libsecret
COMPONENT_VERSION=	0.20.5
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Libsecret
COMPONENT_ARCHIVE_HASH=	\
    sha256:3fb3ce340fcd7db54d87c893e69bfc2b1f6e4d4b279065ffe66dac9f0fd12b4d
COMPONENT_BUGDB=        gnome/security
COMPONENT_ANITYA_ID=	13150

COMPONENT_BAID=		131071
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk
include $(WS_MAKE_RULES)/test-x11.mk

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

# Assumes GNU ar in PATH
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# Assumes GNU gettext in PATH
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# Required so that configure can find and use 64-bit version of config program.
CONFIGURE_ENV.64 += ac_cv_path_LIBGCRYPT_CONFIG=$(USRBINDIR64)/libgcrypt-config

CONFIGURE_OPTIONS += -Dgtk_doc=false
# Required for other components.
CONFIGURE_OPTIONS.32 += -Dintrospection=false
CONFIGURE_OPTIONS.64 += -Dintrospection=true
# Required for other components.
CONFIGURE_OPTIONS.32 += -Dvapi=false
CONFIGURE_OPTIONS.64 += -Dvapi=true

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(BITS).master
COMPONENT_TEST_TRANSFORMS += '-e "s/[0-9]*[0-9].[0-9][0-9]s//" '
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/OK/p" ' \
	'-e "/FAIL /p" ' \
	'-e "/Summary /p" ' \
	'-e "/Ok:/p" ' \
	'-e "/Skipped:/p" ' \
	'-e "/Timeout:/p" ' \
	'-e "/Fail:/p" ' \
	'-e "/Pass:/p" '

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/perl-5/xml-parser
REQUIRED_PACKAGES += library/security/libgpg-error
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/library/security/libgcrypt
