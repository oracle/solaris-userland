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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		liboauth
COMPONENT_VERSION=	1.0.3
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=  https://sourceforge.net/projects/liboauth
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:0df60157b052f0e774ade8a8bac59d6e8d4b464058cc55f9208d72e41156811f
COMPONENT_ARCHIVE_URL=  https://sourceforge.net/projects/$(COMPONENT_NAME)/files/$(COMPONENT_ARCHIVE)/download
COMPONENT_BUGDB=	library/liboauth
COMPONENT_ANITYA_ID=	1686

COMPONENT_BAID=		27849

include $(WS_MAKE_RULES)/common.mk

CFLAGS.studio += $(studio_FEATURES_EXTENSIONS)

CONFIGURE_OPTIONS += --disable-static
# Use NSS backend instead of OpenSSL backend due to GPL-licensed components
# that link against liboauth and thus would have to link against OpenSSL and
# cannot.
CONFIGURE_OPTIONS += --enable-nss
CONFIGURE_OPTIONS += --localstatedir="$(VARDIR)"
CONFIGURE_OPTIONS += --sysconfdir="$(ETCDIR)"
CONFIGURE_ENV += CFLAGS="$(CFLAGS)"
CONFIGURE_ENV += SED="$(GSED)"

# Required to use generate and use non-broken version of libtool macros.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '

REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += library/security/nss
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += web/curl
