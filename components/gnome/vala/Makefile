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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#

BUILD_BITS = 32_and_64
COMPILER=gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		vala
COMPONENT_VERSION=	0.56.13
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/Vala
COMPONENT_ARCHIVE_HASH= \
	sha256:4988223036c7e1e4874c476d0de8bd9cbe500ee25ef19a76e560dc0b6d56ae07
COMPONENT_BUGDB=        gnome/dev-tools
COMPONENT_ANITYA_ID=	5065

COMPONENT_BAID=		151281

include $(WS_MAKE_RULES)/gnome-component.mk

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-incompatible-pointer-types

COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

# to regenerate Makefile.in after patching tests/Makefile.am
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

COMPONENT_TEST_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
       '-n ' \
       '-e "/TOTAL: /p" ' \
       '-e "/PASS: /p" ' \
       '-e "/SKIP: /p" ' \
       '-e "/FAIL: /p" ' \
       '-e "/ERROR: /p" ' \

REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += library/glib2
