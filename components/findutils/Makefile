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
# Copyright (c) 2012, 2026, Oracle and/or its affiliates.
#
COMPILER= gcc
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		findutils
COMPONENT_VERSION=	4.11.0
COMPONENT_ARCHIVE= $(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
	sha256:bfd19cb06cc71f3352d567e90284d8cdac02ac89774bbeadf0b533b0c11432fd
COMPONENT_ARCHIVE_URL=	https://ftp.gnu.org/gnu/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/gnu-findutils
COMPONENT_ANITYA_ID=	812

COMPONENT_BAID=	452132

include $(WS_MAKE_RULES)/gnu-component.mk

# Use Bash for updatedb so output write failures reach its existing checks.
COMPONENT_PREP_ACTION = \
	$(GSED) -i '1s@/bin/sh@/bin/bash@' \
	    $(SOURCE_DIR)/locate/updatedb.sh

CONFIGURE_PREFIX =	$(USRGNUDIR)

# Fixes coredump in the tests/test-localename test.
CONFIGURE_OPTIONS  +=	ac_cv_func_newlocale=no

# Disable the leaf optimisation feature, because the st_nlinks directory
# field is incorrect on ZFS file systems.
CONFIGURE_OPTIONS +=	--disable-leaf-optimisation

# Explicitly specify the preferred Python version to prevent
# possible unexpected future changes.
CONFIGURE_ENV += PYTHON="$(PYTHON.3.11)"

# Both architectures use the same observed test results.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Run all the tests even if there is a failure
COMPONENT_TEST_ARGS += -k
# The upstream harness prepends /usr/xpg4/bin after COMPONENT_TEST_ENV.
# Set PATH when launching shell tests, preserving just-built programs first.
COMPONENT_TEST_ARGS += \
	'SH_LOG_COMPILER=$(ENV) PATH=$(COMPONENT_TEST_DIR)/find:$(COMPONENT_TEST_DIR)/locate:$(COMPONENT_TEST_DIR)/xargs:$(GNUBIN):$(PATH) $(CONFIG_SHELL)'
COMPONENT_TEST_ENV +=	PATH="$(GNUBIN):$(PATH)"
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^PASS:/p" ' \
	'-e "/^FAIL:/p" ' \
	'-e "/^SKIP:/p" ' \
	'-e "/^\# /p" ' \

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
