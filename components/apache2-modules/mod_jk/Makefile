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
# Copyright (c) 2011, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mod_jk
COMPONENT_VERSION=	1.2.49
COMPONENT_PROJECT_URL=	https://tomcat.apache.org/connectors-doc/
COMPONENT_SRC_NAME=	tomcat-connectors
COMPONENT_SRC=		$(COMPONENT_SRC_NAME)-$(COMPONENT_VERSION)-src
COMPONENT_ARCHIVE_HASH=	\
    sha256:43cb0283c92878e9d4ef110631dbd2beb6b55713c127ce043190b2b308757e9c
COMPONENT_ARCHIVE_URL=	https://archive.apache.org/dist/tomcat/tomcat-connectors/jk/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	utility/apache
COMPONENT_ANITYA_ID=	13296

COMPONENT_BAID=		150483

CONFIGURE_DEFAULT_DIRS=no
MODULES_INSTALL=
include ../modules.mk

PATCH_LEVEL=0

CONFIGURE_SCRIPT = $(SOURCE_DIR)/native/configure
