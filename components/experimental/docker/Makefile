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

BUILD_BITS=		64
PUBLISH_STAMP=          # This version of docker can't be build with the version of go we have

include ../../../make-rules/shared-macros.mk
include $(WS_MAKE_RULES)/experimental-only.mk

COMPONENT_NAME=		docker
COMPONENT_VERSION=	1.10.3
COMPONENT_PROJECT_URL=	http://www.docker.com
COMPONENT_ARCHIVE_URL=	\
	https://github.com/docker/docker/archive/v$(COMPONENT_VERSION).tar.gz
COMPONENT_ANITYA_ID=	7513

COMPONENT_BUGDB=	utility/docker-engine

TPNO=			27475

BUILD_STYLE= justmake

SYSTEM_TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# Go variables for building
GO_PKG=			github.com/docker/docker
GO_VERSION=		1.7
GO_LANG_DIR=		/usr/lib/golang/$(GO_VERSION)
GO_CODE_DIR=		/usr/lib/gocode/$(GO_VERSION)
GO_PATH=		$(BUILD_DIR_64)/.gopath
GO_BUILD_DIR=		$(GO_PATH)/src/$(GO_PKG)
GO_BUILD_ENV=		\
	PATH=$(GO_LANG_DIR)/bin:$$PATH \
	GO_VERSION=$(GO_VERSION) \
	GOPATH=$(GO_CODE_DIR):$(GO_PATH):$(GO_BUILD_DIR)/vendor \
	DOCKER_GITCOMMIT=2fd4b1faa

# Git commit is needed to run the tests
COMPONENT_BUILD_ACTION=	\
	exit 0; (: This version of docker can not be build with the version of go we have); \
	set -e; \
	cd $(BUILD_DIR_64); \
	$(GO_BUILD_ENV) AUTO_GOPATH=1 ./hack/make.sh dynbinary

# Populate the proto area
PROTOSVCMANIFESTAPPDOCKERDIR=	$(PROTOSVCMANIFESTDIR)/application/docker

DOCKER_INSTALL_ACTIONS= \
	$(INSTALL) -c -m 0444 \
	    $(COMPONENT_DIR)/files/docker.xml \
	    $(PROTOSVCMANIFESTAPPDOCKERDIR)/docker.xml; \
	$(INSTALL) -c -m 0555 \
	    $(COMPONENT_DIR)/files/svc-docker \
	    $(PROTOSVCMETHODDIR)/svc-docker; \
	$(INSTALL) -c -m 0555 \
	    $(BUILD_DIR_64)/bundles/latest/dynbinary/docker \
	    $(PROTOUSRBINDIR)/docker; \
	$(INSTALL) -c -m 0555 \
	    $(COMPONENT_DIR)/files/docker-support \
	    $(PROTOUSRBINDIR)/docker-support

COMPONENT_INSTALL_ACTION= \
	exit 0; (: This version of docker can not be build with the version of go we have); \
	set -e; \
	$(MKDIR) \
	    $(PROTOUSRBINDIR) \
	    $(PROTOSVCMETHODDIR) \
	    $(PROTOSVCMANIFESTAPPDOCKERDIR); \
	$(DOCKER_INSTALL_ACTIONS);


# define variables needed to run tests
COMPONENT_TEST_DIR=		$(GO_BUILD_DIR)
COMPONENT_TEST_ENV_CMD=		$(SUDO) -n
COMPONENT_TEST_ENV=		$(GO_BUILD_ENV) AUTO_GOPATH=1 TESTFLAGS="-v"
COMPONENT_TEST_CMD=		$(SHELL) -c \
	"set -e; cd $(GO_BUILD_DIR); hack/make.sh test-unit"
COMPONENT_TEST_ARGS=
COMPONENT_TEST_TARGETS=

# Filter the noise in the test output:
# sample test output :
# ok      github.com/docker/docker/api    0.072s  coverage: 92.5% of statements
# === RUN   TestParseExec
# --- PASS: TestParseExec (0.00s)
#
# clean output:
# ok      github.com/docker/docker/api
# --- PASS: TestParseExec
COMPONENT_TEST_TRANSFORMS=     \
	'-n' \
	'-e "s/[[:blank:]][[:blank:]]*[0-9][0-9]*\.[0-9][0-9]*s//"' \
	'-e "s/coverage\://"' \
	'-e "s/[[:blank:]][[:blank:]]*[0-9][0-9]*\.[0-9][0-9]*\%[[:blank:]]*\
	[a-zA-Z]*[[:blank:]]*[a-zA-Z]*//"' \
	'-e "s/[[:blank:]][[:blank:]]*([0-9][0-9]*\.[0-9][0-9]*s)$$//"' \
	'-e "/^--- [A-Z][A-Z]*: /p"' \
	'-e "/^[a-zA-Z][a-zA-Z]*[[:blank:]][[:blank:]]*github.com\/docker\/docker\//p"'
#
# Check whether privilges are invoked.
#
COMPONENT_PRE_TEST_ACTION = $(COMPONENT_PRE_TEST_SUDO)

# variables needed for post-test actions
USER=	$(shell $(ID) -un)
GROUP=	$(shell $(ID) -gn)
COMPONENT_POST_TEST_ACTION=     \
        $(FIND) $(BUILD_DIR_64) \( \! -user $(USER) -o \! -group $(GROUP) \) \
            -exec $(SUDO) chown -h $(USER):$(GROUP) {} \+

PKG_PROTO_DIRS += $(COMPONENT_DIR)/files/man

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += developer/golang
REQUIRED_PACKAGES += library/golang/sys-17
REQUIRED_PACKAGES += network/firewall
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/zones
