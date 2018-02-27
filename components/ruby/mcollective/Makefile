
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
include $(WS_MAKE_RULES)/shared-targets.mk
include $(WS_MAKE_RULES)/ruby.mk

RUBY_VERSION=       2.1
RUBY_LIB_VERSION=   2.1.0
RUBY_VERSIONS=      2.1.0
PATCH_EACH_ARCHIVE = 1

PKG_MACROS += PLUGIN_PATH=usr/share/mcollective/mcollective/

GIT_REPO=               https://github.com/puppetlabs/$(COMPONENT_NAME)
GIT_BRANCH=             2.11.4
GIT_COMMIT_ID=          04b7991
GIT_HASH=sha256:2bf8425a50023744e28f26efd64931d6383b216e9918e1df49276bc5477e4493
COMPONENT=              mcollective
COMPONENT_NAME=         marionette-collective
COMPONENT_VERSION=      $(GIT_BRANCH)
COMPONENT_PROJECT_URL=  $(GIT_REPO)
COMPONENT_SRC=          $(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.gz
COMPONENT_BUGDB=        utility/mcollective
COMPONENT_ANITYA_ID=    1956
TPNO=                   40664

COMPONENT_NAME_1=  mcollective-puppet-agent
GIT_REPO_1=        https://github.com/puppetlabs/$(COMPONENT_NAME_1)
GIT_COMMIT_ID_1=   4c916a4
GIT_HASH_1=sha256:97290649f32eaaf329770e912a0f12bf9a2da028e3e3a8503d2089f2a2f53bca
GIT_BRANCH_1=      1.13.0
COMPONENT_SRC_1=      $(COMPONENT_NAME_1)-$(GIT_BRANCH_1)
COMPONENT_ARCHIVE_1=  $(COMPONENT_SRC_1).tar.gz
PKG_PROTO_DIRS +=  $(COMPONENT_SRC_1)
TPNO_1=            35352

COMPONENT_NAME_2=  mcollective-package-agent
GIT_REPO_2=        https://github.com/puppetlabs/$(COMPONENT_NAME_2)
GIT_BRANCH_2=      4.5.0
GIT_COMMIT_ID_2=   7b5d911
GIT_HASH_2=sha256:eea5df8cf5a141389ffcd02682d52fd1f3ec4f0885703bb7009491877ea1884c
COMPONENT_SRC_2=      $(COMPONENT_NAME_2)-$(GIT_BRANCH_2)
COMPONENT_ARCHIVE_2=  $(COMPONENT_SRC_2).tar.gz
PKG_PROTO_DIRS +=  $(COMPONENT_SRC_2)
TPNO_2=            35353

# 75478ac81 previously referenced as v3.3.1 is actually 3.1.3+
COMPONENT_NAME_3=  mcollective-service-agent
GIT_BRANCH_3=      3.1.4
GIT_REPO_3=        https://github.com/puppetlabs/$(COMPONENT_NAME_3)
GIT_COMMIT_ID_3=   6068bd5
GIT_HASH_3=sha256:bbd886f46d9f4a9cc7c14110426f078c4ff07a8a4dd7d358e53c6221dbb8f860
COMPONENT_SRC_3=      $(COMPONENT_NAME_3)-$(GIT_BRANCH_3)
COMPONENT_ARCHIVE_3=  $(COMPONENT_SRC_3).tar.gz
PKG_PROTO_DIRS +=  $(COMPONENT_SRC_3)
TPNO_3=            35350

# Facter facts has no published version
COMPONENT_NAME_4=  mcollective-facter-facts
GIT_REPO_4=        https://github.com/puppetlabs/$(COMPONENT_NAME_4)
GIT_COMMIT_ID_4=   30adc0e
GIT_HASH_4=sha256:05a7d72c34bf18eb657f6e2ee23c67dfcc105c72e7339362c8f5c505f17ed696
PKG_PROTO_DIRS +=  $(COMPONENT_NAME_4)-$(GIT_COMMIT_ID_4)
TPNO_4=            26723

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/install.rb.mk
include $(WS_MAKE_RULES)/ips.mk

# --mandir option not supported by mcollective install.rb
INSTALL_RB_MANDIR_OPTION =

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(NO_TESTS)

system-test:    $(NO_TESTS)


REQUIRED_PACKAGES += runtime/ruby-21
REQUIRED_PACKAGES += system/core-os

#COMP_SUFFIXES from ips.mk
GENERATE=$(foreach suffix, $(COMP_SUFFIXES), \
		 (cd $(COMPONENT_SRC_$(suffix)) ; $(PKGSEND) generate . ) ; \
		 )
new-files:
	####
	# This is a convenience method for the package maintainer
	# it displays a list of files not found in both the delivered source
	# and package manifest. Output must be evaluated for correctness
	# The first command lists non-spec non-ext .rb and .ddl plugin files
	# The second lists all files installed by mycollective
	( \
	  ( \
		  ( $(GENERATE) ) | \
		    egrep '.rb$$|.ddl$$' | \
			$(GSED) -e '/spec\//d' \
			        -e '/ext\//d' \
			        -e 's|group=.*||' \
	                -e 's|^file \(.*\)|file \1 path=$$(PLUGIN_PATH)/\1|' \
		) | \
		$(CAT) *.p5m - | $(PKGFMT) -u | egrep 'PLUGIN_PATH' | \
		sort | uniq -c | \
	    $(GSED) -e '/ 2 /d' -e 's/   1 //' -e '/^file/!d' \
	; \
	    $(PKGSEND) generate $(PROTO_DIR) | \
		$(GSED) -e 's|group=.*||' -e s'|^file |file path=|' | \
		$(CAT) *.p5m - | $(PKGFMT) -u | \
		$(GSED) \
		  -e '/PLUGIN_PATH/d' \
		  -e '/path=ext\//d' \
		  -e '/path=\./d' \
		  -e '/!\//d' \
		  -e '/~[0-9]\+~$$/d' \
		  -e 's|$(VENDOR_RUBY)|$$(VENDOR_RUBY)|' | \
		sort | uniq -c | \
	    $(GSED) -e '/ 2 /d' -e 's/   1 //' -e '/^file/!d' \
	)
