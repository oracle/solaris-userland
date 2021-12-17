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
# Copyright (c) 2017, 2021, Oracle and/or its affiliates.
#

BUILD_BITS= 		64_and_32
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-autoar
COMPONENT_VERSION=	0.4.1
COMPONENT_PROJECT_URL=	https://developer.gnome.org/gnome-autoar/ 
COMPONENT_ARCHIVE_HASH= \
    sha256:646bd50ebad92d91c1be89097a15364156157442cac1471ded7ecb27d9a9150e
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	15236

COMPONENT_BAID=		112044
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS += -Dgtk_doc=true
CONFIGURE_OPTIONS += -Dtests=true
CONFIGURE_OPTIONS.32 += -Dvapi=false
CONFIGURE_OPTIONS.64 += -Dvapi=true

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9]*.[0-9][0-9]s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK/p" ' \
        '-e "/Fail/p" ' \
        '-e "/Pass/p" ' \
        '-e "/Ok/p" ' \
        '-e "/ok/p" '

# added because of the read-only directory required for the test
# without this gmake clobber will fail 
COMPONENT_POST_TEST_ACTION.64 += \
	$(CHMOD) 755 $(COMPONENT_SRC)/tests/files/extract/test-readonly-directory/output/arextract

REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libarchive
