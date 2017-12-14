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
# Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cx_Oracle
COMPONENT_VERSION=	6.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=		\
	sha256:80545fc7acbdda917dd2b1604c938141256bdfed3ad464a44586c9c2f09c3004
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=  https://oracle.github.io/python-cx_Oracle
COMPONENT_BUGDB=	python-mod/cx_oracle
COMPONENT_ANITYA_ID=	13233

#TPNO=                  NONE (included with Stack Approval rather than 3PLTA,
#                       for email trail of the approval please see
#                       /shared/sac/PSARC/2015/294/approvals)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/setup.py.mk

# common targets

build:		$(BUILD_32_and_64)

install:	$(INSTALL_32_and_64)

# We do not run automated tests of this package because doing
# requires access to a captive Oracle database instance.
test:		$(NO_TESTS)

system-test:    $(NO_TESTS)

REQUIRED_PACKAGES += database/oracle/instantclient-122
REQUIRED_PACKAGES += developer/oracle/instantclient/sdk-122
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += developer/oracle/odpi
