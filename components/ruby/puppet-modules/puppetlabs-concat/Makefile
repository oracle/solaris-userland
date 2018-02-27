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
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
#

include ../../../../make-rules/shared-macros.mk

GIT_REPO= https://github.com/puppetlabs/puppetlabs-concat
GIT_BRANCH= 4.1.1
GIT_COMMIT_ID=  c95dc13
GIT_HASH=sha256:0a6f9c34bffcfe67eeca3d8baed54b8a8bb9dc936e28ff7911b8ee073b43c710

COMPONENT_NAME=		puppetlabs-concat
COMPONENT_VERSION=	$(GIT_BRANCH)
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_BUGDB=	utility/puppet
COMPONENT_ANITYA_ID=	13315

TPNO=			40668

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/puppetmodule.mk
include $(WS_MAKE_RULES)/ips.mk

MODULE_NAME =	concat

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
