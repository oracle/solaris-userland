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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#

include ../../../../make-rules/shared-macros.mk

GIT_REPO= https://github.com/puppetlabs/puppetlabs-ntp
GIT_COMMIT_ID= v11.0.0
GIT_HASH=sha256:c9d15f1ec0199b6620d10151645f94e66bad9dc10b14d122a656641e26828cd3

COMPONENT_NAME=		puppetlabs-ntp
COMPONENT_VERSION=	$(GIT_COMMIT_ID:v%=%)
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_BUGDB=	utility/puppet
COMPONENT_ANITYA_ID=	238622

COMPONENT_BAID=		335128

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/puppetmodule.mk
include $(WS_MAKE_RULES)/ips.mk

MODULE_NAME =	ntp

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(NO_TESTS)

# This is a convenience method for the package maintainer
new-files: install
	$(PKGSEND) generate $(PROTO_DIR)/usr/puppetlabs/puppet/modules/ | \
		$(GSED)  -e 's/\(file\).*path=/\1 path=/' | \
		$(CAT) *.p5m - | $(GNU_GREP) -h '^file' | sort | uniq -c | \
		$(GSED) -e '/ 2 /d' -e 's/   1 //'
