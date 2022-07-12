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
# Copyright (c) 2015, 2022, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		upower
COMPONENT_VERSION=	0.99.19
COMPONENT_PROJECT_URL=	https://gitlab.freedesktop.org/upower/upower
COMPONENT_SRC=		$(COMPONENT_NAME)-v$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
	sha256:e5bda2f5837ee311f5b7b6ec9549b029c88f4958011c6a8f5550b54408ee06ae
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/-/archive/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/upower
COMPONENT_ANITYA_ID=	5056

COMPONENT_BAID=		126474
BUILD_STYLE=		meson

# Tests do not work on Solaris yet
TEST_TARGET= $(SKIP_TEST)

# There are crashes during the unit tests execution.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

# Assumes GNU tail is first in PATH
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# Assumes GNU msgfmt is first in PATH
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# XXX wants gudev for better backend support; alternatively, create solaris
# native backend as was done for openbsd/freebsd.
CONFIGURE_OPTIONS += --libexecdir="$(USRLIBDIR)"
CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += -Dgtk-doc=false
CONFIGURE_OPTIONS += -Dsystemdsystemunitdir='no'
CONFIGURE_OPTIONS += -Dudevrulesdir=''
CONFIGURE_OPTIONS += -Dudevhwdbdir=''

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/libdbus-glib
REQUIRED_PACKAGES += system/library/math
