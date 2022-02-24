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
# Copyright (c) 2014, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		jansson
COMPONENT_VERSION=	2.14
COMPONENT_PROJECT_URL=	http://www.digip.org/jansson
COMPONENT_SRC_URL=	https://github.com/akheron/jansson
COMPONENT_ARCHIVE_HASH=	\
    sha256:5798d010e41cf8d76b66236cfb2f2543c8d082181d16bc3085ab49538d4b9929
COMPONENT_ARCHIVE_URL=	$(COMPONENT_SRC_URL)/releases/download/v$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/jansson
COMPONENT_ANITYA_ID=	1417

COMPONENT_BAID=			111867
COMPONENT_BAID_1=		111936

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

LINT_FLAGS += -I$(PROTOUSRINCDIR)

CONFIGURE_OPTIONS += --includedir=$(USRINCDIR)/jansson

# The test/suites/api/check-exports uses nm and expects it to be the GNU kind.
COMPONENT_TEST_ENV += PATH=$(GNUBIN):$(PATH)

# 003-CVE-2016-4425.patch modifies jansson_config.h.in that will generate a new
# jansson_config.h in the build subdirectory. We need to rm the one in the
# original source so that it doesn't get in the way.
COMPONENT_PREP_ACTION += $(RM) $(@D)/src/jansson_config.h
