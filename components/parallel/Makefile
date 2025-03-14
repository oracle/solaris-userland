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
# Copyright (c) 2012, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		parallel
COMPONENT_VERSION=	20241022
# A leading "0." is included to make it easier to upgrade the package, should
# the maintainers decide to go to a more standard version numbering system.
IPS_COMPONENT_VERSION=  0.2024.10.22
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
	sha256:6de22bf1c67f7f316670d21ed1a2a32f1214dfbd3e420939ba937925c0a57a12
COMPONENT_ANITYA_ID=	5448
COMPONENT_BAID=	185329	

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/gnu-component.mk

# Set PATH to find the correct pod2man, so that the man pages can be
# automatically generated
COMPONENT_BUILD_ENV += \
	PATH="$(USRBINDIR):$(GNUBIN):$(USRDIR)/perl5/$(PERL_VERSION)/bin"

# Adjust '#!/usr/bin/perl'
PERL_SCRIPTS = \
	$(PROTOUSRBINDIR)/niceload \
	$(PROTOUSRBINDIR)/parallel \
	$(PROTOUSRBINDIR)/sql

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/which
REQUIRED_PACKAGES += system/core-os
