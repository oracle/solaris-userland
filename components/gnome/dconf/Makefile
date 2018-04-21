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
# Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =            64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		dconf
COMPONENT_VERSION=	0.26.0
COMPONENT_PROJECT_URL=	http://wiki.gnome.org/dconf
COMPONENT_ARCHIVE_HASH= \
	sha256:8683292eb31a3fae31e561f0a4220d8569b0f6d882e9958b68373f9043d658c9
COMPONENT_BUGDB=        gnome/gconf
COMPONENT_ANITYA_ID=	11683

TPNO=			34496

include $(WS_MAKE_RULES)/gnome-component.mk

studio_C99MODE=$(studio_C99_ENABLE)

# Uses gcc extensions for void returns.
CFLAGS.studio += $(studio_FEATURES_EXTENSIONS)

CONFIGURE_OPTIONS += --libexecdir=$(USRLIBDIR)
CONFIGURE_OPTIONS += --enable-gtk-doc

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/XFAIL:/p" '

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += developer/vala
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library/libdbus
