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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS = 		64
BUILD_ARCH = 		sparc
CTF_MODE =		off	# Breaks config
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=         dsession
COMPONENT_VERSION=      #
COMPONENT_SRC=          sun-src
COMPONENT_ARCHIVE=	
COMPONENT_ARCHIVE_SRC=	none
COMPONENT_BUGDB=	x11/xclients
COMPONENT_ANITYA_ID=	N/A

# nothing to download ; just build & package
BUILD_STYLE= justmake
TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/x11-component.mk

COMPONENT_BUILD_ENV +=		LD="$(CC)"
COMPONENT_INSTALL_ENV += 	INSTALL="$(INSTALL)"
COMPONENT_INSTALL_ENV += 	PREFIX="$(USRDIR)"

REQUIRED_PACKAGES += diagnostic/scanpci
