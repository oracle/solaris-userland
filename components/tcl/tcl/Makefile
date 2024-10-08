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
# Copyright (c) 2011, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=          tcl
COMPONENT_VERSION=       8.6.13
COMPONENT_BAID=          147951
COMPONENT_ARCHIVE_HASH=  sha256:c61f0d6699e2bc7691f119b41963aaa8dc980f23532c4e937739832a5f4a6642
COMPONENT_MAJOR_VERSION= $(shell echo $(COMPONENT_VERSION) | $(GSED) -e 's/\([0-9]\+\)\.\([0-9]\+\)\.[0-9]\+/\1.\2/')
COMPONENT_PROJECT_URL=   https://www.tcl.tk/
COMPONENT_SRC=           $(COMPONENT_NAME)$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=       $(COMPONENT_NAME)-core$(COMPONENT_VERSION)-src.tar.gz
COMPONENT_ARCHIVE_URL=   http://prdownloads.sourceforge.net/tcl/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=         library/libtcl
COMPONENT_ANITYA_ID=     4941

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION = \
	(cd $(SOURCE_DIR)/unix ; autoreconf -fi; \
	 cd ../doc; \
            for i in *.n ; do manbase="$$(basename "$$i" .n)"; mv "$$i" "$${manbase}.1t"; done ; \
            for i in *.3 ; do manbase="$$(basename "$$i" .3)"; mv "$$i" "$${manbase}.3tcl"; done) 

COMPONENT_PRE_CONFIGURE_ACTION = \
        ($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_SCRIPT = $(SOURCE_DIR)/unix/configure

# LDFLAGS is embedded into the tclConfig.sh script.
LDFLAGS += $(CC_BITS)

CFLAGS.studio += -xstrconst $(XPG6MODE) $(studio_C99_ENABLE)

# 64-bit executables should also be delivered to relevant MACH subdirectory.
CONFIGURE_BINDIR.64= $(USRBINDIR64)
CONFIGURE_OPTIONS +=		--enable-shared
CONFIGURE_OPTIONS +=		--enable-man-symlinks
CONFIGURE_OPTIONS +=		--enable-threads
CONFIGURE_OPTIONS.64 +=		--enable-64bit
CONFIGURE_OPTIONS.sparc.64 +=	--enable-64bit-vis
COMPONENT_BUILD_ENV += LC_ALL=C.UTF-8
COMPONENT_INSTALL_ENV += LC_ALL=C.UTF-8

COMPONENT_TEST_ENV	+= "TZ=GMT LC_ALL=C.UTF-8"
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master
COMPONENT_TEST_TARGETS = test
# We skip until the beginning (append.test), read until a flaky text
# (httpold.test), resume with the next (if-old.test), then stop at end time.
COMPONENT_TEST_TRANSFORMER =    $(NAWK)
COMPONENT_TEST_TRANSFORMS =     "'/append.test/ {results = 1}; /httpold.test/ {results = 0}; /if-old.test/ {results = 1}; /Tests ended at/ {results = 0}; {if (results) print $0 } '"

LIB_SUFFIX := $(COMPONENT_MAJOR_VERSION)\\$$\{TCL_DBGX\}

COMPONENT_POST_INSTALL_ACTION += \
  perl -i -pe "s|(TCL_CC)=.*$$|\1='$(CC)'|;" -e "s|(TCL_SRC_DIR)=.*$$|\1=|;" \
	-e "s|(TCL_BUILD_LIB_SPEC)=.*$$|\1='-ltcl$(LIB_SUFFIX)'|;" \
	-e "s|(TCL_BUILD_STUB_LIB_SPEC)=.*$$|\1='-ltclstub$(LIB_SUFFIX)'|;" \
	-e "s|-lsunmath||g" $(PROTO_DIR)$(USRLIB.$(BITS))/tclConfig.sh;

COMPONENT_POST_INSTALL_ACTION.32 += \
  perl -i -pe "s|(TCL_BUILD_STUB_LIB_PATH)=.*$$|\1='/usr/lib/libtclstub$(LIB_SUFFIX).a'|;" \
	-e "s|-L/usr/lib\s||g" $(PROTO_DIR)$(USRLIB.$(BITS))/tclConfig.sh;

COMPONENT_POST_INSTALL_ACTION.64 += \
  perl -i -pe "s|(TCL_BUILD_STUB_LIB_PATH)=.*$$|\1='/usr/lib/64/libtclstub$(LIB_SUFFIX).a'|;" \
	-e "s|-L/usr/lib/amd64\s||g;" -e "s|-L/usr/lib/sparcv9\s||g" $(PROTO_DIR)$(USRLIB.$(BITS))/tclConfig.sh;

PKG_MACROS += COMPONENT_MAJOR_VERSION=$(COMPONENT_MAJOR_VERSION)

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
