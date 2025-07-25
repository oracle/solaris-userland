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
# Copyright (c) 2014, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64
CTF_MODE =		off	# Has no effect
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		Tk
# pkg does not like leading zeros, removed zero after dot.
COMPONENT_VERSION=	804.36
HUMAN_VERSION=		804.036
COMPONENT_SRC=		$(COMPONENT_NAME)-$(HUMAN_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_PROJECT_URL=	http://search.cpan.org/~srezic/Tk
COMPONENT_ARCHIVE_HASH=	\
    sha256:32aa7271a6bdfedc3330119b3825daddd0aa4b5c936f84ad74eabb932a200a5e
COMPONENT_ARCHIVE_URL=	http://search.cpan.org/CPAN/authors/id/S/SR/SREZIC/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	perl-mod/tk
COMPONENT_ANITYA_ID=	3471

COMPONENT_BAID=		111176

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/makemaker.mk
include $(WS_MAKE_RULES)/test-x11.mk

CLONEY = echo
COMPONENT_PRE_CONFIGURE_ACTION = $(CP) -rp $(SOURCE_DIR)/. $(@D)

# This component loves openwin.
CONFIGURE_OPTIONS += X11INC=/usr/X11/include
CONFIGURE_OPTIONS += X11LIB=/usr/X11/lib/64

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

COMPONENT_TEST_TARGETS =	test
COMPONENT_TEST_TRANSFORMS += '-n -e "/^Result:/p"'
COMPONENT_TEST_MASTER =         $(COMPONENT_TEST_RESULTS_DIR)/results.master

build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += runtime/tk-8
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxft
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
