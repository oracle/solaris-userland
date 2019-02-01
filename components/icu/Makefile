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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		icu4c
COMPONENT_VERSION=	63_1
IPS_COMPONENT_VERSION=	63.1
HUMAN_VERSION=		$(COMPONENT_VERSION)-1
COMPONENT_PROJECT_URL=  http://site.icu-project.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC)-src.tgz
COMPONENT_ARCHIVE_HASH= \
	sha256:05c490b69454fce5860b7e8e2821231674af0a11d7ef2febea9a32512998cb9d
COMPONENT_ARCHIVE_URL=  http://download.icu-project.org/files/icu4c/$(IPS_COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/icu
COMPONENT_ANITYA_ID=	16134

TPNO=			46913

# set relocate_to option while unpacking the tar ball
UNPACK_ARGS= -r $(COMPONENT_SRC)

COMPONENT_BUILD_TARGETS = all

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_SCRIPT = $(SOURCE_DIR)/icu/source/runConfigureICU Solaris/GCC

CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += --with-data-packaging=library
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --disable-samples
CONFIGURE_OPTIONS += --disable-renaming

COMPILER = gcc

CFLAGS += -D__EXTENSIONS__ -DDECCHECK -D_XOPEN_SOURCE=600
CXXFLAGS += -D__EXTENSIONS__ -DDECCHECK -D_XOPEN_SOURCE=600 -std=c++11

include ../../make-rules/shared-targets.mk

PKG_PROTO_DIRS += $(WS_TOP)/components/icu59/build/prototype/$(MACH)

# Install icu59 dependency.
COMPONENT_POST_INSTALL_ACTION += (cd ../icu59 && $(GMAKE) install);

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^All tests OK:  testdata intltest iotest cintltst/p" ' \
	'-e "/^PASS: config selfcheck OK/p" '

REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
