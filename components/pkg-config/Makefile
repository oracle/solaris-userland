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
# Copyright (c) 2013, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		pkg-config
COMPONENT_VERSION=	0.29
COMPONENT_PROJECT_URL=	http://www.freedesktop.org/wiki/Software/pkg-config
COMPONENT_ARCHIVE_HASH= \
    sha256:c8507705d2a10c67f385d66ca2aae31e81770cc0734b4191eb8c489e864a006b
COMPONENT_ARCHIVE_URL=	http://pkgconfig.freedesktop.org/releases/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	3649

COMPONENT_BAID=		28660

SYSTEM_TEST_TARGET=	build $(SYSTEM_TEST_64)

include $(WS_MAKE_RULES)/common.mk

# otherwise our default PKG_CONFIG_PATH will change to the 64-bit libdir
CONFIGURE_LIBDIR.64 =   $(CONFIGURE_PREFIX)/lib

# Make sure that pkg-config removes our standard paths from --libs output
CONFIGURE_OPTIONS += --with-system-library-path=/lib/$(MACH64):/usr/lib/$(MACH64):/lib:/usr/lib

COMPONENT_TEST_DIR =		$(@D)/check
COMPONENT_TEST_ENV +=		PATH=$(GNUBIN):$(USRBINDIR)

COMPONENT_SYSTEM_TEST_DIR =	$(@D)/check
COMPONENT_SYSTEM_TEST_ENV +=	PATH=$(GNUBIN):$(USRBINDIR)
COMPONENT_SYSTEM_TEST_TARGETS =	TESTS_PKG_CONFIG=/usr/bin/pkg-config check

COMPONENT_TEST_TRANSFORMS += \
	'-e "/Entering directory/d"' \
	'-e "/Leaving directory/d"' \
	'-e "/^make/d"'

REQUIRED_PACKAGES += library/glib2
