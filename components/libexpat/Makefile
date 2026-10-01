#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libexpat
COMPONENT_VERSION=	2.8.5
COMPONENT_PROJECT_URL=	https://libexpat.github.io/
COMPONENT_SRC_NAME=	expat
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:952c03c33a6b337f12dae7a9b0f9dee86f867550d35c994d6bdaaddd37dc8454
COMPONENT_ARCHIVE_URL= \
    http://downloads.sourceforge.net/project/expat/expat/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libexpat
COMPONENT_ANITYA_ID=	770
COMPONENT_BAID=		443842

include $(WS_MAKE_RULES)/common.mk

CFLAGS += $(CPP_LARGEFILES)

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_TRANSFORMS = \
  '-n '\
  '-e "/^\#/p" '

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
