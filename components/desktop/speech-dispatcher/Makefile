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
# Copyright (c) 2017, 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=             64
COMPILER=               gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		speech-dispatcher
COMPONENT_VERSION=	0.8.8
COMPONENT_PROJECT_URL=	https://devel.freebsoft.org/speechd
COMPONENT_ARCHIVE_HASH= \
   sha256:3c2a89800d73403192b9d424a604f0e614c58db390428355a3b1c7c401986cf3
COMPONENT_ARCHIVE_URL=	\
    https://devel.freebsoft.org/pub/projects/speechd/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/accessibility
COMPONENT_ANITYA_ID=    13411

TPNO=			55314

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR) $(@D)) ;

CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --with-espeak
CONFIGURE_OPTIONS += --with-pulse

# Assumes GNU xgettext & msgfmt are first in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"

# Same version as Orca uses
PYTHON_VERSION = 3.5
PYV = "$(PYTHON_VERSION:3.%=3%)"
CONFIGURE_ENV += PYTHON="$(PYTHON)"
PKG_MACROS += PYVER="$(PYTHON_VERSION)" PYV="$(PYV)"

# Ensure Python modules are installed into vendor package directories.
CONFIGURE_ENV += am_cv_python_pythondir=$(PYTHON_VENDOR_PACKAGES)
CONFIGURE_ENV += am_cv_python_pyexecdir=$(PYTHON_VENDOR_PACKAGES)

PYTHON_SCRIPTS += $(PROTO_DIR)$(USRBINDIR)/spd-conf
PYTHON_SCRIPTS += $(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES)/speechd/_test.py

REQUIRED_PACKAGES += library/audio/pulseaudio
REQUIRED_PACKAGES += library/desktop/dotconf
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libsndfile
REQUIRED_PACKAGES += library/speech/espeak
REQUIRED_PACKAGES += runtime/python-$(PYV)

