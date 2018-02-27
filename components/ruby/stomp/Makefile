
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
include ../../../make-rules/shared-macros.mk
include $(WS_MAKE_RULES)/ruby.mk

#
# Override the inherited RUBY values in shared-macros.mk to be
# a later release.
#
RUBY_VERSION=       2.1
RUBY_LIB_VERSION=   2.1.0
RUBY_VERSIONS=      2.1.0

GIT_REPO=               https://github.com/stompgem/stomp
GIT_BRANCH=             v1.4.4
GIT_COMMIT_ID=          1236aca
GIT_HASH=sha256:8e80208ec2300f138dfd9e92da02280643d046e22b529ce1d31dc905882cd34f

COMPONENT_NAME=         stomp
COMPONENT_VERSION=      $(GIT_BRANCH:v%=%)
COMPONENT_PROJECT_URL=  $(GIT_REPO)
COMPONENT_SRC=          $(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.gz
COMPONENT_BUGDB=        utility/ruby-stomp
COMPONENT_ANITYA_ID=    4499
TPNO=                   40666

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/gem.mk

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(NO_TESTS)

system-test:    $(NO_TESTS)


REQUIRED_PACKAGES += network/amqp/rabbitmq
REQUIRED_PACKAGES += runtime/ruby-21
REQUIRED_PACKAGES += system/core-os

new-files:
	####
	# This is a convenience method for the package maintainer
	# it displays a list of files not found in both the delivered source
	# and package manifest. Output must be evaluated for correctness
	# The first command lists non-spec non-ext .rb and .ddl plugin files
	# The second lists all files installed by mycollective
	( \
	    $(PKGSEND) generate $(PROTO_DIR) | \
		$(GSED) \
		  -e 's|group=.*||' -e s'|^file |file path=|' \
		  -e 's|$(VENDOR_GEM_DIR)|$$(VENDOR_GEM_DIR)|' \
		  -e 's|$(COMPONENT_NAME)-$(COMPONENT_VERSION)|$(COMPONENT_NAME)-$$(COMPONENT_VERSION)|' \
		  -e '/~[0-9]\+~$$/d' | \
		$(CAT) *.p5m - | $(PKGFMT) -u | \
		sort | uniq -c | \
	    $(GSED) -e '/ 2 /d' -e 's/   1 //' -e '/^file/!d' \
	)
