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

COMPONENT_NAME=		tcsh
COMPONENT_VERSION=	6.24.13
COMPONENT_PROJECT_URL=	http://www.tcsh.org/
COMPONENT_ARCHIVE_HASH=	\
	sha256:1e927d52e9c85d162bf985f24d13c6ccede9beb880d86fec492ed15480a5c71a
COMPONENT_ARCHIVE_URL=	https://astron.com/pub/tcsh/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	4945
COMPONENT_BAID=	184607

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# force re-runs to be the same
COMPONENT_PRE_TEST_ACTION = \
    ($(RM) $(SOURCE_DIR)/tests/package.m4)

COMPONENT_PREP_ACTION = \
	(cd $(@D) ; autoconf )

LOCALEDIR=$(PROTO_DIR)/$(CONFIGURE_LOCALEDIR)

CONFIGURE_OPTIONS  +=		--localedir=$(CONFIGURE_LOCALEDIR)

COMPONENT_TEST_ENV += PATH=$(GNUBIN):$(USRBINDIR)

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/skipped/p" ' \
	'-e "/ok/p" ' \
	'-e "/FAILED/p" ' \
	'-e "/expected failure/p" ' \
	'-e "/Test results/p" ' \
	'-e "/successful/p" '

REQUIRED_PACKAGES += text/locale
