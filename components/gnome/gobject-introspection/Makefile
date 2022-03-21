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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#

# gobject-introspection must be built with gcc as gobject-introspection does
# not produce correct results when using Studio and the source code itself does
# not build successfully.
COMPILER =		gcc
BUILD_BITS =		64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gobject-introspection
COMPONENT_VERSION=	1.70.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GObjectIntrospection
COMPONENT_ARCHIVE_HASH= \
    sha256:902b4906e3102d17aa2fcb6dad1c19971c70f2a82a159ddc4a94df73a3cafc4a
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	1223

COMPONENT_BAID=		109048
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)


PYTHON_SCRIPTS += $(PROTOUSRBINDIR)/g-ir-scanner
PYTHON_SCRIPTS += $(PROTOUSRBINDIR)/g-ir-annotation-tool

CONFIGURE_OPTIONS += -Dcairo=enabled
CONFIGURE_OPTIONS += -Dpython=python3.7

PY3_CPYTHON_NAMING=\#

# Needed for "gmake test" to work successfully.
unexport SHELLOPTS
COMPONENT_TEST_ENV += GI_SCANNER_DISABLE_CACHE=""
COMPONENT_TEST_ENV += CC="$(CC)"
COMPONENT_TEST_ENV += CFLAGS="$(strip $(CFLAGS))"
COMPONENT_TEST_ENV += LDFLAGS="$(strip $(LDFLAGS))"
COMPONENT_TEST_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_POST_INSTALL_ACTION += \
        $(MV) $(PROTOUSRLIBDIR)/$(MACH64)/gobject-introspection $(PROTOUSRLIBDIR)/ ;

# Standard automake test framework results transform
COMPONENT_TEST_TRANSFORMS += '-e "s/       [0-9].[0-9][0-9]s//"'
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Skip:/p" ' \
        '-e "/Fail:/p" ' \
        '-e "/Pass:/p" ' \
        '-e "/Timeout:/p" ' \
        '-e "/Ok:/p" '
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Requires bison >= 3.0
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/iconv/iconv-core
REQUIRED_PACKAGES += system/library/math
