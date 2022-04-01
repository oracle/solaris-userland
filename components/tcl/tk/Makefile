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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		tk
COMPONENT_VERSION=	8.6.12
COMPONENT_MINOR_VERSION=	$(shell echo $(COMPONENT_VERSION) | $(GSED) -e 's/\([0-9]\+\)\.\([0-9]\+\)\.[0-9]\+/\1.\2/')
COMPONENT_PROJECT_URL=	https://www.tcl.tk/
COMPONENT_SRC=		$(COMPONENT_NAME)$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC)-src.tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:12395c1f3fcb6bed2938689f797ea3cdf41ed5cb6c4766eec8ac949560310630
COMPONENT_ARCHIVE_URL=	https://sourceforge.net/projects/tcl/files/Tcl/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)/download
COMPONENT_BUGDB=	library/libtk
COMPONENT_ANITYA_ID=	11426

COMPONENT_BAID=		120052

include $(WS_MAKE_RULES)/common.mk
include $(WS_MAKE_RULES)/test-x11.mk

COMPONENT_PREP_ACTION = \
	(cd $(@D)/unix ; autoreconf -fi)

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_SCRIPT = $(SOURCE_DIR)/unix/configure

CFLAGS.studio += -xstrconst $(XPG6MODE) $(studio_C99_ENABLE)

CC += $(CC_BITS)

CONFIGURE_OPTIONS +=		--enable-shared
CONFIGURE_OPTIONS +=		--enable-man-symlinks
CONFIGURE_OPTIONS +=		--enable-threads
CONFIGURE_OPTIONS +=		--with-tcl="$(COMPONENT_DIR)/../tcl/build/$(MACH$(BITS))"
# Prevents a '64-bit runpath in 32-bit binary' pkglint warning:
CONFIGURE_OPTIONS.32 +=		-x-libraries=/usr/lib
CONFIGURE_OPTIONS.64 +=		--enable-64bit
CONFIGURE_OPTIONS.sparc.64 +=	--enable-64bit-vis

COMPONENT_TEST_TARGETS =	test

COMPONENT_TEST_MASTER = \
	$(COMPONENT_TEST_RESULTS_DIR)/results.master

# There are some tests which are randomly failing. If we ignore those four we
# get consistent results. This should be investigated.
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	' -e "/^==== send-/d"' \
	' -e "/^==== select-/d"' \
	' -e "/^==== unixSelect-/d"' \
	' -e "/^==== textDisp-19.18/d"' \
	' -e "/^===.*FAILED$$/p"'

COMPONENT_POST_INSTALL_ACTION += \
	sed -f $(COMPONENT_DIR)/files/tksed.$(BITS) \
		$(PROTO_DIR)$(USRLIB.$(BITS))/tkConfig.sh > \
		$(PROTO_DIR)$(USRLIB.$(BITS))/tkConfig.sh.new; \
	$(MV) $(PROTO_DIR)$(USRLIB.$(BITS))/tkConfig.sh.new \
		$(PROTO_DIR)$(USRLIB.$(BITS))/tkConfig.sh; \
	$(CHMOD) 555 $(PROTO_DIR)$(USRLIB.$(BITS))/tkConfig.sh

# special targets due to tcl internals dependencies
../tcl/build/%/.built:
	(cd ../tcl ; $(GMAKE) build)

$(CONFIGURE_32):	../tcl/build/$(MACH32)/.built
$(CONFIGURE_64):	../tcl/build/$(MACH64)/.built

PKG_MACROS += COMPONENT_MINOR_VERSION=$(COMPONENT_MINOR_VERSION)

REQUIRED_PACKAGES += runtime/tcl-8
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxft
