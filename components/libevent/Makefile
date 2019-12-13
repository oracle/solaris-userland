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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libevent
COMPONENT_VERSION=	2.1.11
COMPONENT_PROJECT_URL=	http://libevent.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)-stable
COMPONENT_ARCHIVE_HASH=	\
    sha256:d0c3b41baf7b8863a3dbae8be4277ea52f9a2698b3eff6d14991b8a60025cf16
COMPONENT_ARCHIVE_URL=	https://github.com/libevent/libevent/releases/download/release-$(COMPONENT_VERSION)-stable/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libevent
COMPONENT_ANITYA_ID=	1606

TPNO=			55621

TEST_TARGET= install $(TEST_32_and_64)
SYSTEM_TEST_TARGET= build $(SYSTEM_TEST_32_and_64)
include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION =  \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# The original manpage is in a format that the Solaris man command does not
# understand. Hence it has been manually converted.
#
# List of files from the original package that are not being delivered
#
# /usr/bin/event_rpcgen.py

CONFIGURE_OPTIONS	+= CFLAGS="$(CFLAGS)"
CONFIGURE_OPTIONS	+= --disable-static

# Libevent stores many of its header files in the build include directory. This
# adds the additional path for linter to process.
LINT_FLAGS += -I$(@D)/include

# 32 and 64 bits event-config.h headers need to be merged to the final one.
EVENTH=include/event2/event-config.h
$(INSTALL_64): COMPONENT_POST_INSTALL_ACTION += \
	-diff -D __$(MACH64) $(BUILD_DIR_32)/$(EVENTH) \
	  $(BUILD_DIR_64)/$(EVENTH) > $(PROTO_DIR)$(CONFIGURE_PREFIX)/$(EVENTH);

# Get correct libevent-2.0.so.5 from the proto area.
TEST_LIBPATH.32 =	$(PROTOUSRLIBDIR)
TEST_LIBPATH.64 =	$(PROTOUSRLIBDIR64)
COMPONENT_TEST_ENV +=	LD_LIBRARY_PATH=$(TEST_LIBPATH.$(BITS))
COMPONENT_TEST_TARGETS =	verify
COMPONENT_SYSTEM_TEST_TARGETS =	verify

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/TOTAL/p" ' \
	'-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/ERROR/p" '

REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/security/openssl/openssl-fips-140
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
