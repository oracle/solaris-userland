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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
COMPILER=	gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		qpdf
COMPONENT_VERSION=	8.2.1
GIT_REPO=	https://github.com/qpdf/qpdf
GIT_COMMIT_ID=	release-qpdf-$(COMPONENT_VERSION)
GIT_HASH=	sha256:16a74fd62323c548c6be8634776205ff2db4497d7779ed453018b7a6059c1ad3
TPNO=		47762

COMPONENT_PROJECT_URL=	http://qpdf.sourceforge.net/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_BUGDB=	utility/qpdf
COMPONENT_ANITYA_ID=	5542

COMPONENT_TEST_TARGET= $(TEST_64_and_32)
include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION += (cd $(@D); aclocal -I m4 ; autoheader ; libtoolize -f ; autoreconf -f )

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
	'-e "/PASSED/p" ' \
	'-e "/FAILED/p" ' \
	'-e "/Total tests:/p" ' \
	'-e "/Passes:/p" ' \
	'-e "/Failures:/p" ' \
	'-e "/Unexpected Passes:/p" ' \
	'-e "/Expected Failures:/p" ' \
	'-e "/Missing Tests:/p" ' \
	'-e "/Extra Tests:/p" '

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
