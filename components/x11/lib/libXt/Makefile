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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32

include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		libXt
COMPONENT_VERSION=	1.3.1
COMPONENT_ARCHIVE_HASH= \
	sha256:e0a774b33324f4d4c05b199ea45050f87206586d81655f8bef4dba434d931288
COMPONENT_BUGDB=        x11/libraries
COMPONENT_ANITYA_ID=	1793
COMPONENT_BAID=		191061
COMPONENT_SIG_URL=

FIX_PC_FILES=xt.pc.in

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_PREP_ACTION +=(cd $(@D); $(AUTORECONF_ENV) autoreconf -fiv);

CONFIGURE_ENV += LIB_MAN_SUFFIX=3xt

CPPFLAGS += -DGETVALUES_BUG -DNO_ALLOCA

# the xinline option is here to fix bug 15508570, No Hands lib
# needs to interpose on these functions, and if they are inline
# then the loader can't find them.  It complains silently.
CFLAGS += \
        -xinline=no%_XtAppCreateShell,no%XtAppNextEvent,no%XtAppProcessEvent

# Add tests
COMPONENT_TEST_TRANSFORMS += '-e "s/      [0-9].[0-9][0-9] s//" '
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/OK:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ENV += libtool_install_magic='%%%MAGIC variable%%%'

REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/libsm
REQUIRED_PACKAGES += x11/library/libx11
