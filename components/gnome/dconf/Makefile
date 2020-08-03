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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		dconf
COMPONENT_VERSION=	0.34.0
COMPONENT_PROJECT_URL=	http://wiki.gnome.org/dconf
COMPONENT_ARCHIVE_HASH= \
	sha256:943a94ab16121de5580ceaed2605b87444d1bca1c6cd8beefb778bcb0aa2da52
COMPONENT_BUGDB=        gnome/gconf
COMPONENT_ANITYA_ID=	11683

TPNO=			53994
BUILD_STYLE=		meson

# Disable the unit tests since the test results are outdated.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnome-component.mk

COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
CONFIGURE_OPTIONS += -Dgtk_doc=true

# get rid of the timestamps from the test results
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK/p" ' \
        '-e "/ok/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library/libdbus
