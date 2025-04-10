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
# Copyright (c) 2011, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		sed
COMPONENT_VERSION=	4.9
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:6e226b732e1cd739464ad6862bd1a1aba42d7982922da7a53519631d24975181
COMPONENT_BUGDB=	utility/gnu-sed
COMPONENT_ANITYA_ID=	4789
COMPONENT_BAID=		133534

SYSTEM_TEST_TARGET= configure $(SYSTEM_TEST_64)
include $(WS_MAKE_RULES)/gnu-component.mk

CONFIGURE_BINDIR.64= $(GNUBIN)

CONFIGURE_OPTIONS  +=		--infodir=$(CONFIGURE_INFODIR)

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/TOTAL/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/ERROR/p" '

# Modify test results for system-test
COMPONENT_PRE_SYSTEM_TEST_ACTION += \
	($(GSED) -i -e "s|../sed/sed|/usr/gnu/bin/sed|" \
                $(@D)/testsuite/version.good) ;
COMPONENT_PRE_SYSTEM_TEST_ACTION += \
	($(GSED) -i -e "s|../sed/sed|/usr/gnu/bin/sed|" \
                $(SOURCE_DIR)/testsuite/eval.good) ;
COMPONENT_PRE_SYSTEM_TEST_ACTION += \
	($(GSED) -i -e "s|../sed/sed|/usr/gnu/bin/sed|" \
                $(SOURCE_DIR)/testsuite/eval.sed) ;

COMPONENT_SYSTEM_TEST_ENV +=	SED=$(GNUBIN)/sed
COMPONENT_SYSTEM_TEST_ENV +=	PATH="$(GNUBIN):$(PATH)"
COMPONENT_SYSTEM_TEST_DIR =	$(@D)/testsuite
