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
# Copyright (c) 2018, 2020, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER=	gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		qpdf
COMPONENT_VERSION=	9.1.1
TPNO=			60672
COMPONENT_PROJECT_URL=	http://qpdf.sourceforge.net/
#GIT_REPO=	https://github.com/qpdf/qpdf
# GitHub can also provide .zip files which is much faster variant
COMPONENT_SRC=	$(COMPONENT_NAME)-release-$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	release-$(COMPONENT_NAME)-$(COMPONENT_VERSION).zip
COMPONENT_ARCHIVE_HASH=	sha256:291d92d409ca135828a4f3ddf83acf07db90e989f4c1629f652fd918ae6988cd
COMPONENT_ARCHIVE_URL=	https://github.com/qpdf/qpdf/archive/$(COMPONENT_ARCHIVE)

COMPONENT_BUGDB=	utility/qpdf
COMPONENT_ANITYA_ID=	5542

COMPONENT_TEST_TARGET= $(TEST_64_and_32)

ifeq ($(MACH),i386)
# Disable tests since there are some regressions.
$(SKIP_TEST_AT_TOP_LEVEL)
endif

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION += (cd $(@D); $(CONFIG_SHELL) autogen.sh )

COMPONENT_PRE_CONFIGURE_ACTION += $(CLONEY) $(SOURCE_DIR) $(@D)

CONFIGURE_OPTIONS	+= --enable-shared
CONFIGURE_OPTIONS	+= --disable-static
CONFIGURE_OPTIONS	+= --disable-largefile

# It would be nice to align this perl-script with perl version but it breaks a build.
#PERL_SCRIPTS += $(PROTO_DIR)/usr/bin/fix-qdf

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/Failures:/p" ' \
	'-e "/Unexpected Passes:/p" ' \
	'-e "/Missing Tests:/p" '

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
