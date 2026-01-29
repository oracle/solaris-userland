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
# Copyright (c) 2015, 2026, Oracle and/or its affiliates.
#

COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		psutil
COMPONENT_VERSION=	7.2.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:f7583aec590485b43ca601dd9cea0dcd65bd7bb21d30ef4ddbf4ea6b5ed1bdd3
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	http://pypi.python.org/pypi/psutil/
COMPONENT_BUGDB=	python-mod/psutil
COMPONENT_ANITYA_ID=	3978
COMPONENT_BAID=		366988

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(NO_TESTS)


REQUIRED_PACKAGES += system/library
