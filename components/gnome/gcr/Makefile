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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gcr
COMPONENT_VERSION=	3.38.0
COMPONENT_PROJECT_URL=	https://developer.gnome.org/gcr/
COMPONENT_ARCHIVE_HASH= \
	sha256:a64cc7b65757fc2cd16de1708d132a16d05cd1f62c6eba436d56fe45d4ba27e1
COMPONENT_BUGDB=        gnome/security
COMPONENT_ANITYA_ID=	11801

TPNO=			63946
BUILD_STYLE=            meson

# The unit tests failed to start.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU xgettext in PATH.
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)

# Uses GNU extension for void function returns.
CFLAGS.studio += $(studio_FEATURES_EXTENSIONS)

CONFIGURE_OPTIONS.32 += -Dintrospection=false
# Fix 64-bit builds.
CONFIGURE_OPTIONS += --libexecdir=$(USRLIBDIR)

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# get rid of the timestamps from the test results
COMPONENT_TEST_TRANSFORMS += '-e "s/[0-9].[0-9][0-9]s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK/p" ' \
        '-e "/ok/p" '

REQUIRED_PACKAGES += crypto/gnupg
REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/p11-kit
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/security/libgpg-error
REQUIRED_PACKAGES += system/library/security/libgcrypt
