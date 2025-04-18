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
# Copyright (c) 2017, 2024, Oracle and/or its affiliates.
#

BUILD_BITS=		64
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		dotconf
COMPONENT_VERSION=	1.4.1
COMPONENT_PROJECT_URL=	https://github.com/williamh/dotconf
COMPONENT_ARCHIVE=      v$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:5922c46cacf99b2ecc4853d28a2bda4a489292e73276e604bd9cba29dfca892d
COMPONENT_ARCHIVE_URL=	\
    $(COMPONENT_PROJECT_URL)/archive/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=    13410

COMPONENT_BAID=		163955

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# tarball doesn't include configure so need to generate it.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

CONFIGURE_OPTIONS +=    --disable-static

# Assumes GNU xgettext & msgfmt are first in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
