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
# Copyright (c) 2024, 2025, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pypdf
COMPONENT_VERSION=	6.2.0
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_ARCHIVE_HASH= \
    sha256:46b4d8495d68ae9c818e7964853cd9984e6a04c19fe7112760195395992dce48
COMPONENT_PROJECT_URL=	https://github.com/py-pdf/pypdf
COMPONENT_BUGDB=	python-mod/pypdf
COMPONENT_ANITYA_ID=	7703
COMPONENT_BAID=		355610

# We need just a version pspdfutils is delivered with
PYTHON_VERSIONS= 3.13

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/pybuild.mk
include $(WS_MAKE_RULES)/ips.mk

PKG_MACROS += PYVER=$(PYTHON_VERSIONS)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)
