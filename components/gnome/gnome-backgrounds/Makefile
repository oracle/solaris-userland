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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-backgrounds
COMPONENT_VERSION=	3.38.0
COMPONENT_ARCHIVE_HASH= \
	sha256:f7712a873a80c9a9fcf3952611effeb2d9aed23a3e8abfcda8afb15c427d1ee3
COMPONENT_BUGDB=        gnome/branding
COMPONENT_ANITYA_ID=	13125

TPNO=			65130
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU xgettext in PATH.
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += library/perl-5/xml-parser
