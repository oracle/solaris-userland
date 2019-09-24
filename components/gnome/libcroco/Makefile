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
# Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS =		64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libcroco
COMPONENT_VERSION=	0.6.13
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Libcroco
COMPONENT_ARCHIVE_HASH=	\
    sha256:767ec234ae7aa684695b3a735548224888132e063f92db585759b422570621d4
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	11787

TPNO=			54082

include $(WS_MAKE_RULES)/gnome-component.mk

# Needed because of patch to configure.ac
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

# Actually, -Bsymbolic-functions; the option is misnamed -- Solaris linker
# doesn't support -Bsymbolic-functions currently.
CONFIGURE_OPTIONS += --disable-Bsymbolic
CONFIGURE_OPTIONS += --disable-static

COMPONENT_POST_INSTALL_ACTION.64 += \
	$(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libcroco-0.6.3lib \
		$(PROTO_DIR)/usr/share/man/man3lib/libcroco-0.6.3lib; \
	$(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/csslint-0.6.1 \
		$(PROTO_DIR)/usr/share/man/man1/csslint-0.6.1; \
	$(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/croco-0.6-config.1 \
		$(PROTO_DIR)/usr/share/man/man1/croco-0.6-config.1; 

# Needed to make tests work
COMPONENT_TEST_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_TRANSFORMS += '-e "/^removing tests/d"'
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/glib2
