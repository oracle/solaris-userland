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

COMPONENT_NAME=		geocode-glib
COMPONENT_VERSION=	3.26.2
COMPONENT_ARCHIVE_HASH=	\
	sha256:01fe84cfa0be50c6e401147a2bc5e2f1574326e2293b55c69879be3e82030fd1
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	13123

TPNO=			62432
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS.32 += -Denable-introspection=false

COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
LDFLAGS +=  -Wl,-zgnu-version-script-compat

# get rid of the timestamps from the test results
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9]s//" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_COMPARE_CMD =  $(GDIFF) -uN --ignore-space-change --ignore-blanks-lines

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/json-glib
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library/math
