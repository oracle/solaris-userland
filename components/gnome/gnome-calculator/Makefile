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
# Copyright (c) 2015, 2023, Oracle and/or its affiliates.
#

BUILD_BITS =            64
COMPILER =              gcc

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-calculator
COMPONENT_VERSION=	41.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Calculator
COMPONENT_ARCHIVE_HASH= \
        sha256:a66dc04bd8587e76d67375a6aefa79553b569c9bdf78ebdc2817f1c0ade3dc99
COMPONENT_BUGDB=        gnome/applications
COMPONENT_ANITYA_ID=	13126

COMPONENT_BAID=		110559
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU msgfmt in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += -Dvala-version=0.54.2

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/gtksourceview
REQUIRED_PACKAGES += library/desktop/libhandy
REQUIRED_PACKAGES += library/desktop/libgee 
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/mpc
REQUIRED_PACKAGES += library/mpfr
REQUIRED_PACKAGES += system/library/math
