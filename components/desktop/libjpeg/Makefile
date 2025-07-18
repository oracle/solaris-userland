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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#

BUILD_BITS = 	64_and_32
COMPILER =	gcc

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME =	jpeg
COMPONENT_VERSION =	9.6
PROJECT_VERSION =	9f
COMPONENT_PROJECT_URL =	https://www.ijg.org/
COMPONENT_SRC =		jpeg-$(PROJECT_VERSION)
COMPONENT_ARCHIVE =	jpegsrc.v$(PROJECT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH =\
	sha256:04705c110cb2469caa79fb71fba3d7bf834914706e9641a4589485c1f832565b
COMPONENT_ARCHIVE_URL =	https://www.ijg.org/files/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB =	library/libjpeg

COMPONENT_BAID =	336344

include $(WS_MAKE_RULES)/common.mk

LDFLAGS +=		$(CC_BITS)

CONFIGURE_OPTIONS +=	--enable-shared

CONFIGURE_ENV += INSTALL="$(INSTALL) -D"

# Prevent libtool from embedding runpath (via -R).
COMPONENT_POST_CONFIGURE_ACTION += \
	$(GSED) -i -e 's/hardcode_into_libs=yes/hardcode_into_libs=no/' $(@D)/libtool; \
	$(GSED) -i -e 's/hardcode_libdir_flag_spec=.*/hardcode_libdir_flag_spec=""/' $(@D)/libtool;

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
