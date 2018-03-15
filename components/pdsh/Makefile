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

BUILD_BITS= 64
include ../../make-rules/shared-macros.mk
include $(WS_MAKE_RULES)/shared-targets.mk

PATH=$(GNUBIN):$(USRBINDIR)

COMPONENT_NAME=		pdsh
COMPONENT_VERSION=	2.33
COMPONENT_PROJECT_URL=	https://github.com/chaos/pdsh
COMPONENT_ARCHIVE=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:7368087429d6269f0a6313c406ef38c6a6a947bc003ca7368fc6481b139d942f
COMPONENT_ARCHIVE_URL=	https://github.com/chaos/$(COMPONENT_NAME)/releases/download/$(COMPONENT_NAME)-$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	13274

TPNO=			37401

include $(WS_MAKE_RULES)/common.mk

# Needed to make the tests work successfully.
COMPONENT_PRE_CONFIGURE_ACTION = ($(CLONEY) $(SOURCE_DIR) $(@D))

# Prevent libtool from embedding runpath (via -R) and other such annoyances.
COMPONENT_POST_CONFIGURE_ACTION += \
	(cd $(BUILD_DIR_$(BITS)) ; \
	$(GSED) -i \
	-e 's|hardcode_into_libs=yes|hardcode_into_libs=no|g' \
	-e 's|hardcode_libdir_flag_spec=.*|hardcode_libdir_flag_spec=""|g' \
	-e 's|need_relink=yes|need_relink=not_on_solaris|g' \
	libtool)

CONFIGURE_OPTIONS +=	--with-genders
CONFIGURE_OPTIONS +=	--with-readline
CONFIGURE_OPTIONS +=	--with-ssh
CONFIGURE_OPTIONS +=	--without-rsh

COMPONENT_TEST_ENV =	PATH="$(PROTOUSRSBINDIR):$(PATH)"
COMPONENT_TEST_DIR =	$(@D)/tests

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^===/p" ' \
	'-e "/TOTAL/p" ' \
	'-e "/XPASS/p" ' \
	'-e "/PASS/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/ERROR/p" ' \
	'-e "/XFAIL/p" ' \
	'-e "/FAIL/p" '

REQUIRED_PACKAGES += library/libgenders
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/readline
REQUIRED_PACKAGES += runtime/perl-522
REQUIRED_PACKAGES += system/library
