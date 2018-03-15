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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		meld
COMPONENT_VERSION=	3.17.2
COMPONENT_MINOR_VERSION= $(shell echo $(COMPONENT_VERSION) | $(GSED) -e 's/\([0-9]\+\)\.\([0-9]\+\)\.[0-9]\+/\1.\2/')
COMPONENT_PROJECT_URL=	http://meldmerge.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:3efb5cbdc6acd66fc2c2b45bcbfb7fba03e4775e7ce6172b2887bc6fa7b505ea
COMPONENT_ARCHIVE_URL=	https://download.gnome.org/sources/$(COMPONENT_NAME)/$(COMPONENT_MINOR_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	5520

TPNO=			36055

# We just need to build one version.
PYTHON_VERSIONS =       3.5

BUILD_STYLE= setup.py
TEST_TARGET=	$(TEST_64)

include $(WS_MAKE_RULES)/common.mk

# Needed to find GNU xgettext.
PATH =			$(GNUBIN):$(USRBINDIR)

PYTHON_VERSION =	3.5
PKG_MACROS +=		PYVER=$(PYTHON_VERSION)

PYTHON_DATA =		/usr

# Don't build and package these, they need to be generated on install to
# reflect all the other packages installed on the machine too, not just meld
COMPONENT_SETUP_ARGS += --no-compile-schemas
COMPONENT_SETUP_ARGS += --no-update-icon-cache

COMPONENT_TEST_DIR =    $(COMPONENT_SRC)/test
COMPONENT_TEST_ENV =	PYTHONPATH=$(PROTO_DIR)/$(PYTHON_LIB)
COMPONENT_TEST_CMD =    /usr/bin/py.test-$(PYTHON_VERSION)
COMPONENT_TEST_ARGS =

COMPONENT_TEST_TRANSFORMS += \
	'-e "s|\(in \).*\(seconds\).*|\1 x \2|"' \
	'-n ' \
	'-e "/^===/p" '

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

REQUIRED_PACKAGES += developer/intltool
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/gtksourceview3
REQUIRED_PACKAGES += library/gnome/gnome-common
REQUIRED_PACKAGES += library/python/pycairo-35
REQUIRED_PACKAGES += library/python/tkinter-35
REQUIRED_PACKAGES += runtime/python-35
REQUIRED_PACKAGES += text/gnu-gettext
