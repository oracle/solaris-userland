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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates.
#

#
# This file sets up the default options and base requirements for GNOME
# components.
#
# Most cmake-based components require intltools.
include $(WS_MAKE_RULES)/intltool.mk

# Ensure correct version of libraries are linked to.
LDFLAGS += $(CC_BITS)

# This component uses cmake to generate Makefiles.
CMAKE = $(shell which cmake)
CMAKE_BUILD_TYPE ?= RelWithDebInfo

# Layout configuration.
CMAKE_PREFIX ?= $(USRDIR)

CMAKE_OPTIONS += -DCMAKE_CXX_COMPILER="$(CXX)"
CMAKE_OPTIONS += -DCMAKE_CXX_FLAGS="$(CXXFLAGS)"
CMAKE_OPTIONS += -DCMAKE_C_COMPILER="$(CC)"
CMAKE_OPTIONS += -DCMAKE_C_FLAGS="$(CFLAGS)"
CMAKE_OPTIONS += -DCMAKE_EXE_LINKER_FLAGS="$(LDFLAGS)"
CMAKE_OPTIONS += -DCMAKE_AR="/usr/bin/ar"

# Must start install paths with a leading '/' or files will be installed into
# wrong location!
ifeq ($(strip $(PREFERRED_BITS)),64)
CMAKE_BINDIR.32 ?=	$(CMAKE_PREFIX)/bin/$(MACH32)
CMAKE_SBINDIR.32 ?=	$(CMAKE_PREFIX)/sbin/$(MACH32)
CMAKE_EXECDIR.32 ?=	$(CMAKE_PREFIX)/lib/$(MACH32)
CMAKE_BINDIR.64 ?=	$(CMAKE_PREFIX)/bin
CMAKE_SBINDIR.64 ?=	$(CMAKE_PREFIX)/sbin
CMAKE_EXECDIR.64 ?=	$(CMAKE_PREFIX)/lib
else
CMAKE_BINDIR.32 ?=	$(CMAKE_PREFIX)/bin
CMAKE_SBINDIR.32 ?=	$(CMAKE_PREFIX)/sbin
CMAKE_EXECDIR.32 ?=	$(CMAKE_PREFIX)/lib
CMAKE_BINDIR.64 ?=	$(CMAKE_PREFIX)/bin/$(MACH64)
CMAKE_SBINDIR.64 ?=	$(CMAKE_PREFIX)/sbin/$(MACH64)
CMAKE_EXECDIR.64 ?=	$(CMAKE_PREFIX)/lib/$(MACH64)
endif

CMAKE_OPTIONS += -DCMAKE_MAKE_PROGRAM=$(GMAKE)

# Which variables to set to control installation location has changed over time
# for CMake, so cover all of the common ones.
CMAKE_OPTIONS += -DCMAKE_INSTALL_PREFIX="$(CMAKE_PREFIX)"
CMAKE_OPTIONS += -DCMAKE_MODULE_LINKER_FLAGS="$(LDFLAGS)"
CMAKE_OPTIONS += -DCMAKE_SHARED_LINKER_FLAGS="$(LDFLAGS)"
CMAKE_OPTIONS += -DGETTEXT_MSGFMT_EXECUTABLE="$(GNUBIN)/msgfmt"
CMAKE_OPTIONS += -DBIN_INSTALL_DIR="$(CMAKE_BINDIR.$(BITS))"
CMAKE_OPTIONS += -DEXEC_INSTALL_DIR="$(CMAKE_EXECDIR.$(BITS))"
CMAKE_OPTIONS += -DLIBEXEC_INSTALL_DIR="$(CMAKE_EXECDIR.$(BITS))"
CMAKE_OPTIONS += -DCMAKE_INSTALL_BINDIR="$(CMAKE_BINDIR.$(BITS))"
CMAKE_OPTIONS += -DCMAKE_INSTALL_LIBEXECDIR="$(CMAKE_EXECDIR.$(BITS))"

# Some components use LIB_INSTALL_DIR, as-is, others forcibly ignore it and set
# based on CMAKE_INSTALL_PREFIX.  Those usually instead offer a LIB_SUFFIX
# variable that we can generally use to accomplish the same result.  Setting
# them both shouldn't harm anything.
CMAKE_OPTIONS += -DLIB_INSTALL_DIR="$(USRLIB)"
CMAKE_OPTIONS += -DCMAKE_INSTALL_LIBDIR="$(USRLIB)"
CMAKE_OPTIONS.64 += -DLIB_SUFFIX="/$(MACH64)"

# Required to ensure expected defines are set; also, ensures project's
# optimisation level set appropriately.
CMAKE_OPTIONS += -DCMAKE_BUILD_TYPE=$(CMAKE_BUILD_TYPE)

CMAKE_OPTIONS += $(CMAKE_OPTIONS.$(BITS))

# Ensure cmake finds the matching 32/64-bit version of dependencies.
CONFIGURE_ENV += PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)"
COMPONENT_BUILD_ENV += PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)"

# Install the bits to proto directory instead to CMake PREFIX.
COMPONENT_INSTALL_ARGS += DESTDIR=$(PROTO_DIR)
COMPONENT_INSTALL_ARGS += $(COMPONENT_INSTALL_ARGS.$(BITS))

# Ensure valid configure options for 32/64 bit builds.
$(BUILD_DIR_32)/.configured:	BITS=32
$(BUILD_DIR_64)/.configured:	BITS=64

# CMake uses test as a default test target.
COMPONENT_TEST_TARGETS := test


### Makefile rules adopted from justmake.mk and configure.mk ###

# Run CMake configuration with the user and default options.
configure:  $(CONFIGURE_$(MK_BITS))
$(BUILD_DIR)/%/.configured:	$(SOURCE_DIR)/.prep
	($(RM) -rf $(@D) ; $(MKDIR) $(@D))
	$(COMPONENT_PRE_CONFIGURE_ACTION)
	(cd $(@D) ; $(ENV) $(CONFIGURE_ENV) $(CMAKE) \
		$(CMAKE_OPTIONS) $(COMPONENT_DIR)/$(COMPONENT_SRC)/)
	$(COMPONENT_POST_CONFIGURE_ACTION)
	$(TOUCH) $@

# CMake supports out-of-tree builds, no need for cloney.
$(BUILD_DIR)/%/.built:	$(BUILD_DIR)/%/.configured
	$(COMPONENT_PRE_BUILD_ACTION)
	(cd $(@D); $(ENV) $(COMPONENT_BUILD_ENV) \
		$(GMAKE) $(COMPONENT_BUILD_ARGS) $(COMPONENT_BUILD_TARGETS))
	$(COMPONENT_POST_BUILD_ACTION)
ifeq ($(strip $(PARFAIT_BUILD)),yes)
	-$(PARFAIT) $(@D)
endif
	$(TOUCH) $@

# The fully customizable install phase ...
$(BUILD_DIR)/%/.installed:	$(BUILD_DIR)/%/.built
	$(COMPONENT_PRE_INSTALL_ACTION)
	(cd $(@D) ; $(ENV) $(COMPONENT_INSTALL_ENV) $(GMAKE) \
			$(COMPONENT_INSTALL_ARGS) $(COMPONENT_INSTALL_TARGETS))
	$(COMPONENT_POST_INSTALL_ACTION)
	$(TOUCH) $@

# Copied the test rules from justmake.mk.
$(BUILD_DIR)/%/.tested-and-compared:    $(BUILD_DIR)/%/.built
	$(RM) -rf $(COMPONENT_TEST_BUILD_DIR)
	$(MKDIR) $(COMPONENT_TEST_BUILD_DIR)
	$(COMPONENT_PRE_TEST_ACTION)
	-(cd $(COMPONENT_TEST_DIR) ; \
		$(COMPONENT_TEST_ENV_CMD) $(COMPONENT_TEST_ENV) \
		$(COMPONENT_TEST_CMD) \
		$(COMPONENT_TEST_ARGS) $(COMPONENT_TEST_TARGETS)) \
		$(if $(findstring $(COMPONENT_TEST_OUTPUT),$(COMPONENT_TEST_ENV)$(COMPONENT_TEST_ARGS)),,&> $(COMPONENT_TEST_OUTPUT))
	$(COMPONENT_POST_TEST_ACTION)
	$(COMPONENT_TEST_CREATE_TRANSFORMS)
	$(COMPONENT_TEST_PERFORM_TRANSFORM)
	$(COMPONENT_TEST_COMPARE)
	$(COMPONENT_TEST_CLEANUP)
	$(TOUCH) $@

$(BUILD_DIR)/%/.tested:    $(BUILD_DIR)/%/.built
	$(COMPONENT_PRE_TEST_ACTION)
	(cd $(COMPONENT_TEST_DIR) ; \
		$(COMPONENT_TEST_ENV_CMD) $(COMPONENT_TEST_ENV) \
		$(COMPONENT_TEST_CMD) \
		$(COMPONENT_TEST_ARGS) $(COMPONENT_TEST_TARGETS))
	$(COMPONENT_POST_TEST_ACTION)
	$(COMPONENT_TEST_CLEANUP)
	$(TOUCH) $@


ifeq   ($(strip $(PARFAIT_BUILD)),yes)
parfait: build
else
parfait:
	$(MAKE) PARFAIT_BUILD=yes parfait
endif


REQUIRED_PACKAGES += developer/build/cmake
REQUIRED_PACKAGES += developer/build/pkg-config
REQUIRED_PACKAGES += developer/gnu-binutils
REQUIRED_PACKAGES += developer/intltool
REQUIRED_PACKAGES += library/gnome/gnome-common
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/linker
# Most cmake-based components expect GNU versions of these.
REQUIRED_PACKAGES += text/gawk
REQUIRED_PACKAGES += text/gnu-gettext
REQUIRED_PACKAGES += text/gnu-grep
REQUIRED_PACKAGES += text/gnu-sed
