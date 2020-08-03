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
# Copyright (c) 2016, 2020, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		dbus-glib
COMPONENT_VERSION=	0.110
COMPONENT_PROJECT_URL=	https://dbus.freedesktop.org
COMPONENT_ARCHIVE_HASH= \
    sha256:7ce4760cf66c69148f6bd6c92feaabb8812dee30846b24cd0f7395c436d7e825
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/releases/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/dbus
COMPONENT_ANITYA_ID=	1979

TPNO=			52291

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libdbus-glib-1.3lib \
                $(PROTO_DIR)/usr/share/man/man3lib/libdbus-glib-1.3lib ;

COMPONENT_TEST_ARGS += -k
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^PASS:/p" ' \
	'-e "/^FAIL:/p" ' \
	'-e "/^SKIP:/p" ' \
	'-e "/^\# /p" ' \

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Disable tests since there are some regressions.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS +=	--sysconfdir="$(ETCDIR)"
CONFIGURE_OPTIONS +=	--libexecdir="$(USRLIB)"
CONFIGURE_OPTIONS +=	--localstatedir="$(VARDIR)"
CONFIGURE_OPTIONS +=	--disable-static
CONFIGURE_OPTIONS += 	--enable-gtk-doc
CONFIGURE_OPTIONS += 	--enable-tests

# Needed for "gmake test" to work successfully.
unexport SHELLOPTS

REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/libdbus
