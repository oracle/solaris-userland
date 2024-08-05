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
# Copyright (c) 2012, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		findutils
COMPONENT_VERSION=	4.10.0
COMPONENT_ARCHIVE= $(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:1387e0b67ff247d2abde998f90dfbf70c1491391a59ddfecb8ae698789f0a4f5
COMPONENT_ARCHIVE_URL=	http://ftp.gnu.org/gnu/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/gnu-findutils
COMPONENT_ANITYA_ID=	812

COMPONENT_BAID=	171208

include $(WS_MAKE_RULES)/gnu-component.mk

CONFIGURE_PREFIX =	$(USRGNUDIR)

# Fixes coredump in the tests/test-localename test.
CONFIGURE_OPTIONS  +=	ac_cv_func_newlocale=no

# Disable the leaf optimisation feature, because the st_nlinks directory
# field is incorrect on ZFS file systems.
CONFIGURE_OPTIONS +=	--disable-leaf-optimisation

# Explicitly specify the preferred Python version to prevent
# possible unexpected future changes.
CONFIGURE_ENV += PYTHON="$(PYTHON.3.11)"

# The test results differ for x86 and SPARC
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH$(BITS)).master

# Run all the tests even if there is a failure
COMPONENT_TEST_ARGS += -k
COMPONENT_TEST_ENV +=	PATH="$(GNUBIN):$(PATH)"
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^PASS:/p" ' \
	'-e "/^FAIL:/p" ' \
	'-e "/^SKIP:/p" ' \
	'-e "/^\# /p" ' \

# Needed for "gmake test" to work successfully.
# Otherwise we see errors such as:
# FAIL: exec-nogaps.old-O3, sh: SHELLOPTS: readonly variable
unexport SHELLOPTS


# test dependencies:
REQUIRED_PACKAGES += developer/versioning/git
REQUIRED_PACKAGES += runtime/python-311

REQUIRED_PACKAGES += system/library/math
