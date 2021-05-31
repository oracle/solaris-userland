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
# Copyright (c) 2021, Oracle and/or its affiliates.
#

COMPILER=   gcc
BUILD_BITS= 64
BUILD_ARCH= i386

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=     valgrind
COMPONENT_VERSION=  3.16.1
COMPONENT_SRC=      $(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=  $(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
  sha256:c3d088249edf27b16bcbc797fad9a8b6bb49f3ece6bbffedfb8f68e337d0d8ec
COMPONENT_ARCHIVE_URL= ftp://sourceware.org/pub/valgrind/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL= http://valgrind.org
COMPONENT_ANITYA_ID=  13639

TPNO=           62213

# There are some test differences related to different CPUs.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_TEST_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# Force use of GCC with given arch support
CC += $(CC_BITS) -std=gnu99
CXX += $(CC_BITS)

CFLAGS = -D__EXTENSIONS__
CXXFLAGS = -D__EXTENSIONS__

# manual pages have their own build target
COMPONENT_POST_BUILD_ACTION += \
  ( cd $(@D)/docs && $(ENV) $(GMAKE) man-pages )

# config.h is generated in the build directory while it is assumed to live in the source dir
COMPONENT_POST_CONFIGURE_ACTION += ( cp $(@D)/config.h $(SOURCE_DIR) )

COMPONENT_TEST_TARGETS = regtest
# check just overal test results
COMPONENT_TEST_TRANSFORMS += '-n -e "/^== /p"'

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
