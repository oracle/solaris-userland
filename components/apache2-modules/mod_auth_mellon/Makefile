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
# Copyright (c) 2019, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		mod_auth_mellon
COMPONENT_VERSION=	0.19.1
COMPONENT_PROJECT_URL=	https://github.com/latchset/mod_auth_mellon
COMPONENT_ARCHIVE_HASH=	\
    sha256:906919082a79ae6a747f8072158df417c8ba5ba9c97f3e0f77f5f95346d8c3e0
COMPONENT_ARCHIVE_URL=	\
    $(COMPONENT_PROJECT_URL)/archive/refs/tags/v$(COMPONENT_VERSION).tar.gz
COMPONENT_BUGDB=	utility/apache
COMPONENT_ANITYA_ID=	1997

COMPONENT_BAID=		354115

MODULES_INSTALL=
include ../modules.mk

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D)) && \
	(cd $(SOURCE_DIR); ./autogen.sh)

CONFIGURE_OPTIONS.APXS= --with-apxs2=$(APXS)
CONFIGURE_OPTIONS+=	--enable-diagnostics

REQUIRED_PACKAGES+=	library/lasso
REQUIRED_PACKAGES+=	library/glib2
REQUIRED_PACKAGES+=	system/core-os
REQUIRED_PACKAGES+=	system/library
REQUIRED_PACKAGES+=	library/security/openssl-3
REQUIRED_PACKAGES+=	web/curl
REQUIRED_PACKAGES+=	text/gnu-grep
