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
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gom
COMPONENT_VERSION=	0.3.3
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Gom
COMPONENT_ARCHIVE_HASH=	\
	sha256:ac57e34b5fe273ed306efaeabb346712c264e341502913044a782cdf8c1036d8
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	13230

TPNO=			54071
BUILD_STYLE=		meson

# Disable tests since there are some regressions.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU xgettext in PATH.
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

CONFIGURE_OPTIONS += -Denable-gtk-doc=true
CONFIGURE_OPTIONS.32 += -Denable-introspection=false

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
# get rid of the timestamps from the test results
COMPONENT_TEST_TRANSFORMS += '-e "s/[0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9][0-9]//" '

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
