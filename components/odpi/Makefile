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
# Copyright (c) 2017, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
BUILD_STYLE=justmake

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		odpi
COMPONENT_VERSION=	2.4.2
#TPNO=			NONE (included with Stack Approval rather than 3PLTA,
#			for email trail of the approval please see
#			/shared/sac/PSARC/2017/232/approvals)

COMPONENT_ARCHIVE_HASH=	\
	sha256:b161a835829c2ea6e85be9e668a852cba0aa84c2f35d1e437d0c40bbd1588643
COMPONENT_ARCHIVE_URL=	https://github.com/oracle/odpi/archive/v$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=	https://github.com/oracle/odpi
COMPONENT_BUGDB=	library/odpi
COMPONENT_ANITYA_ID=	17139

# We do not run automated tests of this package because doing so
# requires access to a captive Oracle database instance.
TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk


COMPONENT_BUILD_ARGS +=	BITS=$(BITS)
COMPONENT_BUILD_ENV += CC="$(CC)"
COMPONENT_BUILD_ENV += CFLAGS="$(CFLAGS)"
COMPONENT_BUILD_ENV += LDFLAGS="$(LDFLAGS)"
COMPONENT_BUILD_ENV += MACH64="$(MACH64)"
COMPONENT_BUILD_ENV += PREFIX="$(PROTOUSRDIR)"
COMPONENT_BUILD_TARGETS += all

COMPONENT_PRE_INSTALL_ACTION +=	$(MKDIR) -p $(PROTOUSRINCDIR)/odpi ;
COMPONENT_PRE_INSTALL_ACTION +=	$(MKDIR) $(PROTOUSRLIBDIR) ;
COMPONENT_PRE_INSTALL_ACTION +=	$(MKDIR) $(PROTOUSRLIBDIR64) ;

COMPONENT_INSTALL_ARGS +=	BITS=$(BITS)
COMPONENT_INSTALL_ARGS +=	MACH64=$(MACH64)
COMPONENT_INSTALL_ARGS +=	PREFIX=$(PROTOUSRDIR)
COMPONENT_INSTALL_TARGET +=	install

include ../../make-rules/shared-targets.mk

install:	$(INSTALL_32_and_64)

REQUIRED_PACKAGES += database/oracle/instantclient-183
REQUIRED_PACKAGES += database/oracle/instantclient-122
REQUIRED_PACKAGES += database/oracle/instantclient-121

