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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		gutenprint
COMPONENT_VERSION=	5.3.4
COMPONENT_PROJECT_URL=	http://gimp-print.sourceforge.net/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
 sha256:db44a701d2b8e6a8931c83cec06c91226be266d23e5c189d20a39dd175f2023b
COMPONENT_ARCHIVE_URL=	https://sourceforge.net/projects/gimp-print/files/gutenprint-5.3/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	1285

TPNO=		 	69504	

# Disable unit tests of gutenprint since they run extremely long (about a day).
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS +=	 --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS +=    --enable-escputil
CONFIGURE_OPTIONS +=    --without-gimp2
CONFIGURE_OPTIONS +=    --enable-cups-1_2-enhancements
CONFIGURE_OPTIONS +=    --enable-shared
CONFIGURE_OPTIONS +=    --disable-static-genppd
CONFIGURE_OPTIONS +=    --enable-simplified-cups-ppds
CONFIGURE_OPTIONS +=    --without-readline
CONFIGURE_OPTIONS +=    --disable-static

COMPONENT_BUILD_TARGETS = all

# Needed for "gmake test" to work successfully.  If SHELLOPTS is exported (as
# it is by the Userland Makefiles), then all shell options get exported to
# child invocations of bash, which results in test failures due to nounset and
# xtrace being set unexpectedly, and errors such as "$1: unbound variable" and
# diffs failing due to script tracing in output files.
unexport SHELLOPTS

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/ TOTAL:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/ SKIP:/p" ' \
        '-e "/ XFAIL:/p" ' \
        '-e "/ FAIL:/p" ' \
        '-e "/ ERROR:/p" '

REQUIRED_PACKAGES += library/desktop/gtk2
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libusb-1
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
