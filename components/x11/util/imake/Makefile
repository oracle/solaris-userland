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
# Copyright (c) 2018, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64
COMPILER=		gcc
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		imake
COMPONENT_VERSION=	1.0.10
COMPONENT_ARCHIVE_HASH= \
    sha256:75decbcea8d7b354cf36adc9675e53c4790ee3de56a14bd87b42c8e8aad2ecf5
COMPONENT_BUGDB=        x11/builds
COMPONENT_ANITYA_ID=	1373
COMPONENT_BAID=		180593

COMPONENT_NAME_1=       xorg-cf-files
COMPONENT_VERSION_1=    1.0.8
COMPONENT_SRC_1=        $(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=    $(COMPONENT_SRC_1).tar.xz
COMPONENT_ARCHIVE_HASH_1= \
    sha256:7408955defcfab0f44d1bedd4ec0c20db61914917ad17bfc1f1c9bf56acc17b9
COMPONENT_ARCHIVE_URL_1= $(COMPONENT_ARCHIVE_URL:$(COMPONENT_ARCHIVE)=$(COMPONENT_ARCHIVE_1))
COMPONENT_ANITYA_ID_1=	374576
COMPONENT_BAID_1=	140603

TEST_TARGET = $(NO_TESTS)
SYSTEM_TEST_TARGET= $(SYSTEM_TEST_64)

include $(WS_MAKE_RULES)/x11-component.mk

IMAKE_CONFIGURE_OPTIONS += --enable-mkdirhier
IMAKE_CONFIGURE_OPTIONS += --disable-ccmakedep
IMAKE_CONFIGURE_OPTIONS += --disable-cleanlinks
IMAKE_CONFIGURE_OPTIONS += --disable-makeg
IMAKE_CONFIGURE_OPTIONS += --disable-mergelib
IMAKE_CONFIGURE_OPTIONS += --disable-mkhtmlindex
IMAKE_CONFIGURE_OPTIONS += --disable-revpath

# Prefer cpp from /usr/lib
IMAKE_CONFIGURE_OPTIONS += RAWCPP=/usr/lib/cpp

# Pass to both so Imake looks for config files where xorg.cf installs them
CONFIGURE_OPTIONS += --with-config-dir="$(USRLIBDIR)/X11/config"

$(BUILD_DIR_64)/.configured:   CONFIGURE_OPTIONS += $(IMAKE_CONFIGURE_OPTIONS)
$(BUILD_DIR_64)_1/.configured: CONFIGURE_OPTIONS += $(XORG_CF_CONFIGURE_OPTIONS)

$(BUILD_DIR_64)_1/.configured: SOURCE_DIR=$(SOURCE_DIR_1)
configure:	$(BUILD_DIR_64)_1/.configured
build:		$(BUILD_DIR_64)_1/.built
install:	$(BUILD_DIR_64)_1/.installed

REQUIRED_PACKAGES += x11/header/x11-protocols

# Since upstream has no tests, we just run xmkmf against a simple Imakefile
# to ensure it can generate the expected Makefile.  This is done as a system
# test since xmkmf doesn't have any way to override the path to use the proto
# area instead of the installed path.
COMPONENT_SYSTEM_TEST_DIR = $(@D)/system-test
COMPONENT_PRE_SYSTEM_TEST_ACTION += \
  $(RM) -rf $(COMPONENT_SYSTEM_TEST_DIR) ; \
  $(MKDIR) $(COMPONENT_SYSTEM_TEST_DIR) ;
COMPONENT_SYSTEM_TEST_ENV += 	PATH=$(USRBINDIR):$(dir $(CC))
COMPONENT_SYSTEM_TEST_CMD =	$(SHELL) $(COMPONENT_DIR)/test/run-test
COMPONENT_SYSTEM_TEST_ARGS =	$(COMPONENT_DIR)/test
COMPONENT_SYSTEM_TEST_TARGETS =	# none

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-e "s|$(COMPONENT_DIR)|\\$$(COMPONENT_DIR)|g"'
COMPONENT_TEST_TRANSFORMS += '-e "s|$(MACH64)|\\$$(MACH64)|g"'
COMPONENT_TEST_TRANSFORMS += '-e "s|\\bcc .*|\\$$(CC) ...|g"'
COMPONENT_TEST_TRANSFORMS += '-e "s|\\bmakedepend .*|makedepend ...|g"'
