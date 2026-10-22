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
# Copyright (c) 2015, 2026, Oracle and/or its affiliates.
#
COMPILER =		gcc
BUILD_BITS =		64_and_32
CTF_MODE =		off	# Adds unexplained dependency on libgpg-error
include ../../make-rules/shared-macros.mk

COMPONENT_NAME = libmicrohttpd
COMPONENT_VERSION = 1.0.10
# Use the GNU mirror with a certificate chain accepted by the build hosts.
COMPONENT_ARCHIVE_URL = \
    https://mirrors.kernel.org/gnu/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH = \
    sha256:04bfe8ef75db7d629a33de767599765cecadc56274a39822d5d081030d577685
COMPONENT_BUGDB=	library/libmicrohttpd
COMPONENT_ANITYA_ID=	1658

COMPONENT_BAID = 447935

include $(WS_MAKE_RULES)/gnu-component.mk

LINT_FLAGS += -I$(PROTOUSRINCDIR)

CPPFLAGS += $(CPP_LARGEFILES)

# ON libc stubs omit the Annex K interfaces; use POSIX gmtime_r instead.
CONFIGURE_ENV += ac_cv_have_decl_gmtime_s=no

# Upstream examples and tests use enum callbacks; Solaris retains int callbacks.
CFLAGS.gcc += -Wno-error=incompatible-pointer-types

CONFIGURE_OPTIONS += --includedir=$(USRINCDIR)/microhttpd
# Solaris retains 32-bit time_t for its 32-bit library ABI.
CONFIGURE_OPTIONS.32 += --disable-year2038
PKG_CONFIG_PATHS += $(PKG_CONFIG_PATHS.$(BITS))

COMPONENT_TEST_ENV +=	PATH="$(GNUBIN):$(PATH)"
COMPONENT_TEST_ENV +=	http_proxy=""
COMPONENT_TEST_ENV +=	https_proxy=""

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^\#/p" '


# Add the Solaris transport regression to the upstream test suite.
COMPONENT_PREP_ACTION += (cp $(COMPONENT_DIR)/test/test-solaris-stream.c $(@D)/src/microhttpd/);

# Regenerate the build system after adding the Solaris test target.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/security/libgcrypt
