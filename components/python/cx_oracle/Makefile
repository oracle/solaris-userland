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
# Copyright (c) 2015, 2019, Oracle and/or its affiliates. All rights reserved.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		cx_Oracle
COMPONENT_VERSION=	7.1.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=		\
	sha256:54741e2df25e6f2ee80c623b7dc68377b07cc1c85eb33330fc8621796bb206e4
COMPONENT_ARCHIVE_URL=	https://github.com/oracle/python-cx_Oracle/archive/$(COMPONENT_VERSION).tar.gz
COMPONENT_PROJECT_URL=  https://oracle.github.io/python-cx_Oracle
COMPONENT_BUGDB=	python-mod/cx_oracle
COMPONENT_ANITYA_ID=	13233

#TPNO=                  NONE (included with Stack Approval rather than 3PLTA,
#                       for email trail of the approval please see
#                       /shared/sac/PSARC/2015/294/approvals)

PYTHON_VERSIONS=	$(PYTHON3_VERSIONS)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/setup.py.mk


ODPI312_BASE = $(WS_COMPONENTS)/odpi-312/build/prototype/$(MACH)
LD_OPTIONS += -L $(ODPI312_BASE)$(USRLIB.$(BITS))
CPPFLAGS += -I$(ODPI312_BASE)$(USRINCDIR)

# The dependency isn't installed, so add it manually since pkgdepend
# can't resolve them yet: 15708323
DEPENDED += $(WS_TOP)/components/odpi-312/build/manifest-$(MACH)-odpi-312.depend

# Temporary until dependencies are all on build machines
REQUIRED_PACKAGES += $(shell $(GSED) -n 's/REQUIRED_PACKAGES +=//p' ../../odpi-312/Makefile)
#end Delete



EXTRA_ENV =		ODPIC_INC_DIR=$(ODPI312_BASE)/usr/include/odpi-312
EXTRA_ENV +=		ODPIC_LIB_DIR=$(ODPI312_BASE)/usr/lib

COMPONENT_BUILD_ENV +=		$(EXTRA_ENV)
COMPONENT_PUBLISH_ENV +=	$(EXTRA_ENV)
COMPONENT_INSTALL_ENV +=	$(EXTRA_ENV)

# Grabbing the archive from github gives us something that's been archived
# underneath  python-$(COMPONENT_NAME)-$(COMPONENT_VERSION), so we need
# a post-unpack action to put it in the right spot.
COMPONENT_POST_UNPACK_ACTION = \
	$(MV) python-$(COMPONENT_NAME)-$(COMPONENT_VERSION) $(COMPONENT_NAME)-$(COMPONENT_VERSION)

# common targets

build:		$(BUILD_64)

install:	$(INSTALL_64)

# We do not run automated tests of this package because doing
# requires access to a captive Oracle database instance.
test:		$(NO_TESTS)

system-test:    $(NO_TESTS)

REQUIRED_PACKAGES += database/oracle/instantclient-122
REQUIRED_PACKAGES += developer/oracle/instantclient/sdk-122
REQUIRED_PACKAGES += database/oracle/instantclient-183
REQUIRED_PACKAGES += developer/oracle/instantclient/sdk-183
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += developer/oracle/odpi-312
