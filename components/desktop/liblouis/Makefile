#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2016, 2026, Oracle and/or its affiliates.
#

BUILD_BITS= 		64

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		liblouis
COMPONENT_VERSION=	3.39.0
COMPONENT_PROJECT_URL=	https://liblouis.io/
COMPONENT_ARCHIVE_HASH= \
	sha256:629fa8cb0dfd9ad457c5bf47a42f0953b673e62c8ad6b1d03ddc4e2bd20008f1
COMPONENT_ARCHIVE_URL=	https://github.com/liblouis/liblouis/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/accessibility
COMPONENT_ANITYA_ID=	13112
COMPONENT_BAID=		434617

# Orca uses python 3.11, so we need to match
PYTHON_VERSION=		3.11
PKG_MACROS+=		PYVER="$(PYTHON_VERSION)"

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS +=    --enable-shared
CONFIGURE_OPTIONS +=    --disable-static
CONFIGURE_OPTIONS +=    --enable-ucs4

# While the main library is built with configure, the Python module is
# built and installed separately.
PYTHON_ENV +=	CC="$(CC)"
PYTHON_ENV +=	CFLAGS="$(CFLAGS)"
PYTHON_ENV +=	PYTHONPATH='$(@D)/python'
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR) $(@D)) ;
COMPONENT_POST_BUILD_ACTION += \
	(cd $(@D)/python ; \
	    $(ENV) $(COMPONENT_BUILD_ENV) $(PYTHON_ENV) \
		LD_LIBRARY_PATH_$(BITS)=$(@D)/liblouis/.libs/ \
	        $(PYTHON) -m build --wheel --no-isolation );
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(@D)/python ; \
	    $(ENV) $(COMPONENT_INSTALL_ENV) $(PYTHON_ENV) \
		LD_LIBRARY_PATH_$(BITS)=$(PROTO_DIR)$(USRLIB.$(BITS)) \
	        $(PYTHON) $(WS_TOOLS)/pyinstaller --root $(PROTO_DIR) \
		--install-lib $(PYTHON_LIB) --force dist );

# Standard automake test framework results transform
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL/p" ' \
        '-e "/SKIP/p" ' \
        '-e "/PASS/p" ' \
        '-e "/FAIL/p" ' \
        '-e "/ERROR/p" '

# additional transforms for brltty
COMPONENT_TEST_TRANSFORMS += \
        '-e "/^==*$$/p" ' \
        '-e "/expected/p" '

CBE_PACKAGES += developer/documentation-tool/help2man
CBE_PACKAGES += library/libyaml
CBE_PACKAGES += library/python/build-311
CBE_PACKAGES += library/python/installer-311
CBE_PACKAGES += library/python/setuptools-311
CBE_PACKAGES += library/python/wheel-311
CBE_PACKAGES += runtime/python-311

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += library/libyaml
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
