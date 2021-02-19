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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		meld
COMPONENT_VERSION=	3.20.1
COMPONENT_PROJECT_URL=	https://meldmerge.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:a54843bc4d6cb1d31d0a58aa725091622194d50c32ef67026b35c86dda3cb249
COMPONENT_ANITYA_ID=	5520

TPNO=			53163

# We just need to build one version.
PYTHON_VERSIONS =       3.7

BUILD_STYLE= setup.py
TEST_TARGET=	$(TEST_64)

# There are some test failures, the master test file is missing.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/gnome-component.mk

# Needed to find GNU xgettext.
PATH =			$(GNUBIN):$(USRBINDIR)

PYTHON_VERSION =	3.7
PKG_MACROS +=		PYVER="$(PYTHON_VERSION)" PYV="$(PYTHON_VERSION:3.%=3%)"

PYTHON_DATA =		/usr

# Don't build and package these, they need to be generated on install to
# reflect all the other packages installed on the machine too, not just meld
COMPONENT_SETUP_ARGS += --no-compile-schemas
COMPONENT_SETUP_ARGS += --no-update-icon-cache

COMPONENT_TEST_ENV =	PYTHONPATH=$(PROTO_DIR)/$(PYTHON_LIB)
COMPONENT_TEST_DIR =	$(COMPONENT_SRC)/test
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =

COMPONENT_TEST_TRANSFORMS += \
	'-e "s|\(in \).*\(seconds\).*|\1 x \2|"' \
	'-n ' \
	'-e "/^===/p" '

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

REQUIRED_PACKAGES += developer/intltool
REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/gtksourceview3
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/gnome/gnome-common
REQUIRED_PACKAGES += library/python/pycairo-37
REQUIRED_PACKAGES += library/python/pygobject-3-37
REQUIRED_PACKAGES += library/python/tkinter-37
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += text/gnu-gettext
