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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates.
#
# Prefer 32-bit as only "binary" delivered is a script with embedded paths.
BUILD_BITS= 32_and_64
# gcc will handle src/cpuinfo.
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME =	SDL2
COMPONENT_VERSION =	2.0.14
TPNO =			67122
COMPONENT_ARCHIVE_HASH=	sha256:d8215b571a581be1332d2106f8036fcb03d12a70bae01e20f424976d275432bc
COMPONENT_PROJECT_URL =	https://www.libsdl.org/
COMPONENT_ARCHIVE_URL = $(COMPONENT_PROJECT_URL)release/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=	library/sdl
COMPONENT_ANITYA_ID=	4777

# SDL do not supply target "check" but it offers testing utilities.
# These utils will be found in build/$(MACH64)-tstutils/ and
# should be moved/run on testing machine manually.
VARIANTS =      $(BUILD_DIR_64) $(BUILD_DIR_64)-tstutils

CONFIGURE_64 =  $(VARIANTS:%=%/.configured)
BUILD_64 =      $(VARIANTS:%=%/.built)

$(BUILD_DIR_64)-tstutils/%:	BITS=64
$(BUILD_DIR_64)-tstutils/.configured: $(BUILD_DIR_64)/.installed
$(BUILD_DIR_64)-tstutils/.configured: CONFIGURE_SCRIPT = $(SOURCE_DIR)/test/configure
$(BUILD_DIR_64)-tstutils/.configured: CONFIGURE_ENV += "SDL_CFLAGS=-D_REENTRANT -I$(PROTOUSRDIR)/include/SDL2" 
$(BUILD_DIR_64)-tstutils/.configured: CONFIGURE_ENV += "SDL_LIBS=-L$(PROTOUSRLIBDIR64) -R$(USRLIBDIR64) -lSDL2"

TEST_TARGET= $(SKIP_TEST)
include $(WS_MAKE_RULES)/common.mk

# libtool linking
CC += $(CC_BITS)

COMPONENT_PREP_ACTION += ( cd $(@D) ; $(CONFIG_SHELL) autogen.sh );

CONFIGURE_OPTIONS += --with-x
CONFIGURE_OPTIONS += --disable-pulseaudio
CONFIGURE_ENV += "LIBS=-lm  -lX11 -lXext -lXrandr -lXrender -lpthread -lposix4"

COMPONENT_POST_INSTALL_ACTION.32= \
  gsed -i -e 's@-L${libdir}@@g' -e '-R${libdir}@@g' $(PROTOUSRLIBDIR)/pkgconfig/sdl2.pc ; \
  gsed -i -e 's@-L${libdir}@@g' -e '-R${libdir}@@g' $(PROTOUSRBINDIR)/sdl2-config ; \
  $(SYMLINK) sdl2.pc $(PROTOUSRLIBDIR)/pkgconfig/sdl.pc ; \
  $(SYMLINK) sdl2-config $(PROTOUSRBINDIR)/sdl-config ;

$(BUILD_DIR_64)/.installed: COMPONENT_POST_INSTALL_ACTION.64= \
  $(SYMLINK) sdl2.pc $(PROTOUSRLIBDIR64)/pkgconfig/sdl.pc ; \
  $(SYMLINK) sdl2-config $(PROTOUSRBINDIR64)/sdl-config ;

publish: $(BUILD_DIR_64)-tstutils/.built

REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
