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

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		rest
COMPONENT_VERSION=	0.8.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Librest
COMPONENT_ARCHIVE_HASH=	\
    sha256:0513aad38e5d3cedd4ae3c551634e3be1b9baaa79775e53b2dba9456f15b01c9
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	4194

COMPONENT_BAID=		84130

# Tests do not work on Solaris yet
TEST_TARGET= $(SKIP_TEST)

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS += --with-ca-certificates=/etc/certs/ca-certificates.crt
# Required for other components.
CONFIGURE_OPTIONS.32 += --disable-introspection
CONFIGURE_OPTIONS.64 += --enable-introspection

# Needed because of Makefile.am patches.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR) $(@D));
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libsoup
REQUIRED_PACKAGES += library/libxml2
