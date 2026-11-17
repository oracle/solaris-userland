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
# Copyright (c) 2022, 2026, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		oracledb
COMPONENT_VERSION=	26.0.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:786397a6b37e94ebfa6c1c6cd026755eb8fccfd39e15bcb64cb5879491882aef
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=  https://oracle.github.io/python-oracledb
COMPONENT_BUGDB=	python-mod/oracledb
COMPONENT_ANITYA_ID=	248660
COMPONENT_BAID=		469089

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

# We do not run automated tests of this package because doing
# requires access to a captive Oracle database instance.
test:		$(NO_TESTS)

system-test:    $(NO_TESTS)

REQUIRED_PACKAGES += $(PYVS:%=library/python/typing-extensions-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/cryptography-%)
REQUIRED_PACKAGES += $(PYVS:%=library/python/typing-extensions-%)
REQUIRED_PACKAGES += $(PYVS:%=runtime/python-%)
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
