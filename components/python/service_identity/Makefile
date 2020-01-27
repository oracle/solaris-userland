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
# Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		service_identity
COMPONENT_VERSION=	18.1.0
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:a6f74383cff70990cdf16a04250e4ba5641c1a497c9d85ee027f43a2ffc5e2d3
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://service-identity.readthedocs.io/en/stable/
COMPONENT_BUGDB=	python-mod/service_identity
COMPONENT_ANITYA_ID=	7917

TPNO=			56529

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Meta package has to rename 3.4 variant to legacy
# as there was never a non legacy one
FIX_MANIFEST_LEGACY:
	echo "<transform depend fmri=(.*)service_identity-34 \
		-> edit fmri library/python legacy/library/python>" | \
	$(PKGMOGRIFY) /dev/fd/0 $(MANIFEST_BASE)-service_identity.mogrified \
		> $(MANIFEST_BASE)-service_identity.mogrified-fixed ;
	$(MV) $(MANIFEST_BASE)-service_identity.mogrified-fixed \
		$(MANIFEST_BASE)-service_identity.mogrified

$(MANIFEST_BASE)-service_identity.mangled: FIX_MANIFEST_LEGACY


ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(NO_TESTS)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)
