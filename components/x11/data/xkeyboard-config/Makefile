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
# Copyright (c) 2018, 2024, Oracle and/or its affiliates.
#

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xkeyboard-config
COMPONENT_VERSION=	2.43
COMPONENT_PROJECT_URL=	https://www.freedesktop.org/wiki/Software/XKeyboardConfig/
COMPONENT_ARCHIVE_URL=	https://www.x.org/releases/individual/$(COMPONENT_CATEGORY)/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:c810f362c82a834ee89da81e34cd1452c99789339f46f6037f4b9e227dd06c01
COMPONENT_BUGDB=        x11/i18n
COMPONENT_ANITYA_ID=	5191

COMPONENT_BAID=		180588

BUILD_STYLE=		meson
PYTHON_VERSION=         3.11

PKG_PROTO_DIRS += $(SOURCE_DIR)/compat
PKG_PROTO_DIRS += $(SOURCE_DIR)

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_POST_UNPACK_ACTION += \
        $(GSED) -i -e 's?python3?python$(PYTHON_VERSION)?' \
                $(COMPONENT_SRC)/rules/generate-options-symbols.py; \

# Assumes xgettext is first in $PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += library/perl-5/xml-parser
REQUIRED_PACKAGES += text/gnu-gettext
