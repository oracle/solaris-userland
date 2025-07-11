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
# Copyright (c) 2017, 2025, Oracle and/or its affiliates.
#

BUILD_BITS= 		64_and_32
COMPILER=		gcc
CTF_MODE =		off	# Breaks config
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-autoar
COMPONENT_VERSION=	0.4.5
COMPONENT_PROJECT_URL=	https://developer.gnome.org/gnome-autoar/ 
COMPONENT_ARCHIVE_HASH= \
    sha256:838c5306fc38bfaa2f23abe24262f4bf15771e3303fb5dcb74f5b9c7a615dabe
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	15236

COMPONENT_BAID=		324760
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)


CONFIGURE_OPTIONS += -Dgtk_doc=true
CONFIGURE_OPTIONS += -Dtests=true
CONFIGURE_OPTIONS.32 += -Dvapi=false
CONFIGURE_OPTIONS.64 += -Dvapi=true

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# added because of the read-only directory required for the test
# without this gmake clobber will fail 
COMPONENT_POST_TEST_ACTION.64 += \
	$(CHMOD) 755 $(COMPONENT_SRC)/tests/files/extract/test-readonly-directory/output/arextract

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libarchive
