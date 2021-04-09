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
# Copyright (c) 2018, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER=	gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		qpdf
COMPONENT_VERSION=	10.3.1
TPNO=			68642
COMPONENT_PROJECT_URL=	http://qpdf.sourceforge.net/
#GIT_REPO=	https://github.com/qpdf/qpdf
# GitHub can also provide .zip files which is much faster variant
COMPONENT_SRC=	$(COMPONENT_NAME)-release-$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	release-$(COMPONENT_NAME)-$(COMPONENT_VERSION).zip
COMPONENT_ARCHIVE_HASH=	sha256:466ab5e4002150ec549363bff428465909ef5c5a38be9d2239d5cf5919aa1b90
COMPONENT_ARCHIVE_URL=	https://github.com/qpdf/qpdf/archive/$(COMPONENT_ARCHIVE)

COMPONENT_BUGDB=	utility/qpdf
COMPONENT_ANITYA_ID=	5542

COMPONENT_TEST_TARGET= $(TEST_64_and_32)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION += (cd $(@D); $(CONFIG_SHELL) autogen.sh )

COMPONENT_PRE_CONFIGURE_ACTION += $(CLONEY) $(SOURCE_DIR) $(@D)

CONFIGURE_OPTIONS	+= --enable-shared
CONFIGURE_OPTIONS	+= --disable-static
CONFIGURE_OPTIONS	+= --disable-largefile
#The openssl implementation is making use of deprecated APIs
CONFIGURE_OPTIONS       += --disable-crypto-openssl

# It would be nice to align this perl-script with perl version but it breaks a build.
#PERL_SCRIPTS += $(PROTO_DIR)/usr/bin/fix-qdf

# Note that filter-tokens test fails on 32-bit x86 architecture, see bug 32344732 for details.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH)-$(BITS).master
COMPONENT_TEST_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/Total tests:/p" ' \
	'-e "/Passes:/p" ' \
	'-e "/Failures:/p" ' \
	'-e "/Tests:/p" '

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
