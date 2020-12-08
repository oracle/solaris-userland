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
# Copyright (c) 2011, 2020, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_VERSION_SHORT = 1.1
COMPONENT_NAME =	openssl-$(COMPONENT_VERSION_SHORT)

# When new version of OpenSSL comes in, you must update both COMPONENT_VERSION
# and IPS_COMPONENT_VERSION.
COMPONENT_VERSION =	1.1.1i
# Version for IPS. It is easier to do it manually than convert the letter to a
# number while taking into account that there might be no letter at all.
IPS_COMPONENT_VERSION = 1.1.1.9
COMPONENT_PROJECT_URL=	http://www.openssl.org/
COMPONENT_SRC =		openssl-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:e8be6a35fe41d10603c3cc635e93289ed00bf34b79671a3a4de64fcee00d5242
COMPONENT_ARCHIVE_URL =	$(COMPONENT_PROJECT_URL)source/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/openssl
COMPONENT_ANITYA_ID=	2566

TPNO=			63663

# Clone the patch files to the patches-all dir.
# COPY_COMMON_FILES is there so that the copy is called as soon as
# the Makefile is parsed.
PATCH_DIR=patches-all
CLEAN_PATHS += $(PATCH_DIR)
COPY_COMMON_FILES:= $(shell rsync -ac patches/ $(PATCH_DIR) && \
	cp -p ../common/patches/043-x86_asm_illegal_subtraction.patch $(PATCH_DIR))

#include $(WS_MAKE_RULES)/prep.mk
#include $(WS_MAKE_RULES)/configure.mk
#include $(WS_MAKE_RULES)/ips.mk
#include $(WS_MAKE_RULES)/lint-libraries.mk
include $(WS_MAKE_RULES)/common.mk

# Avoid introducing files into existence by patching.
COMPONENT_PREP_ACTION= \
	if ! test -L $(SOURCE_DIR)/Configurations/12-solaris_oracle.conf; then \
	$(LN) -s ../../files/12-solaris_oracle.conf $(SOURCE_DIR)/Configurations; fi

PATH=$(SPRO_VROOT)/bin:/usr/bin:/usr/gnu/bin:/usr/perl5/bin
ifeq   ($(strip $(PARFAIT_BUILD)),yes)
PATH=$(PARFAIT_TOOLS):$(SPRO_VROOT)/bin:/usr/bin:/usr/perl5/bin
endif

# OpenSSL does not use autoconf but its own configure system.
CONFIGURE_SCRIPT = $(SOURCE_DIR)/Configure
CONFIG_SHELL=

# Ignore default CC_FOR_BUILD, CC, and CXX in CONFIGURE_ENV.
CONFIGURE_ENV += CC_FOR_BUILD=
CONFIGURE_ENV += CC=
CONFIGURE_ENV += CXX=

# Developer Studio 12.6 defaults to C11 standard which brings now unneeded
# dependency on libatomic on SPARC (on intel there is -Xa used).
ifeq ($(MACH), sparc)
CFLAGS += -std=c99
endif

# This is to force OpenSSL's Configure script to use gmake for 'make links'.
# Otherwise it fails with:
#     mksh: Fatal error in reader: Unmatched `(' on line
CONFIGURE_ENV += MAKE="$(GMAKE)"

CONFIGURE_OPTIONS = -DNO_WINDOWS_BRAINDEATH
CONFIGURE_OPTIONS += --openssldir=/etc/openssl/1.1
CONFIGURE_OPTIONS += --prefix=/usr/openssl/1.1
# disabled algorithms
CONFIGURE_OPTIONS += no-rc2
CONFIGURE_OPTIONS += no-rc4
CONFIGURE_OPTIONS += no-rc5
CONFIGURE_OPTIONS += no-md2
CONFIGURE_OPTIONS += no-md4
CONFIGURE_OPTIONS += no-mdc2
CONFIGURE_OPTIONS += no-idea
CONFIGURE_OPTIONS += no-whirlpool
CONFIGURE_OPTIONS += no-seed
# disabled engines
CONFIGURE_OPTIONS += no-afalgeng
CONFIGURE_OPTIONS += no-capieng
CONFIGURE_OPTIONS += no-hw-padlock

# We define our own compiler and linker option sets for Solaris.
# See Configurations/12-solaris_oracle.conf
CONFIGURE_OPTIONS32_i386 =	solaris-x86-cc-oracle
CONFIGURE_OPTIONS32_sparc =	solaris-sparcv7-cc-oracle
CONFIGURE_OPTIONS64_i386  =	solaris64-x86_64-cc-oracle
CONFIGURE_OPTIONS64_sparc =	solaris64-sparcv9-cc-oracle

# Options specific to regular build.
# They must not be specified as common, as they cannot be overridden.
$(BUILD_DIR)/$(MACH32)/.configured:	CONFIGURE_OPTIONS += \
	$(CONFIGURE_OPTIONS32_$(MACH))
$(BUILD_DIR)/$(MACH64)/.configured:	CONFIGURE_OPTIONS += \
	$(CONFIGURE_OPTIONS64_$(MACH))

# The 'multilib' Configure parameter only works if the directory
# is present in the file system - see Configurations/unix-Makefile.tmpl.
# Therefore for the initial delivery (until openssl-11 is installed on
# official build machines) this needs to change the pkgconfig files
# so they contain valid library path ending with the 64 path component.
COMPONENT_POST_BUILD_ACTION.64 += \
	echo "Replacing pkg-config files for 64-bit build.." && \
	$(GSED) -i 's|^libdir=$${exec_prefix}/lib$$|libdir=$${exec_prefix}/lib/64|' $(@D)/libssl.pc && \
	$(GSED) -i 's|^libdir=$${exec_prefix}/lib$$|libdir=$${exec_prefix}/lib/64|' $(@D)/libcrypto.pc && \
	$(GSED) -i 's|^libdir=$${exec_prefix}/lib$$|libdir=$${exec_prefix}/lib/64|' $(@D)/openssl.pc || exit 1;

# Alsways be super careful when appending to POST/PRE actions.
# We need to make sure that if any sub-action fails, the whole recipe fails,
# hence explicit exit is added to each append.
COMPONENT_POST_BUILD_ACTION += files/verify_build.sh $(@D) $(CC) $(BITS) || exit 1;

# OpenSSL has its own configure system which must be run from the fully
# populated source code directory. However, the Userland configuration phase is
# run from the build directory. So, we must get the full source code into the
# build directory.
COMPONENT_PRE_CONFIGURE_ACTION = \
    $(CLONEY) $(SOURCE_DIR) $(BUILD_DIR)/$(MACH$(BITS)) && \
    echo $(PROTO_DIR); echo "RunPath"; echo $(BITS); echo $(WS_MAKE_RULES);

#
# The test 'test_ca' is removed because it depends on directories not present
# in the build directory.
#
COMPONENT_POST_CONFIGURE_ACTION = \
      echo "Patching Makefile..." && \
      $(GPATCH) -p0 $(@D)/Makefile patches-post-config/Makefile.patch && \
      echo "Removing test_ca test" && \
      $(RM) $(SOURCE_DIR)/test/recipes/*-test_ca.t $(@D)/test/recipes/*-test_ca.t

configure:	$(CONFIGURE_32_and_64)

build:		$(BUILD_32_and_64)

# We add /usr/perl5/bin to PATH so that OpenSSL install code can locate the
# system pod2man. If not set, OpenSSL make would use an internal implementation
# from the tarball which would corrupt some man pages.
#
# The MANSUFFIX needs to be complemented by patches/002-man_page_suffix.patch
COMPONENT_INSTALL_ARGS += PATH=$(PATH) MANSUFFIX=openssl

# We could run OpenSSL install code for 32 bits only to process header files and
# manual pages. However, lint libraries depend on install stamps so we run
# install for 64 bit as well. Note that we must take built binary files from
# build directories, not from the proto area which contains whatever was
# installed first.
install:	$(INSTALL_32_and_64)

# Lint targets expect that PROTOUSRLIBDIR{,64} directories exist.
# Since everything is installed into distinct directory trees, these
# need to be created explicitly. These actions are probably temporary -
# once 1.1 will start deliver to the usual directories, these can be removed.
COMPONENT_PRE_INSTALL_ACTION += (\
	echo "Ensuring library directories exist in the proto area"; \
	test -d $(PROTOUSRLIBDIR) || $(MKDIR) $(PROTOUSRLIBDIR); \
	test -d $(PROTOUSRLIBDIR64) || $(MKDIR) $(PROTOUSRLIBDIR64);)

# We need to modify the default lint flags to include patched opensslconf.h from
# the build directory. If we do not do that, lint will fail.
LFLAGS_32 := -I$(BUILD_DIR_32)/include -L$(BUILD_DIR_32) $(LINT_FLAGS)
LFLAGS_64 := -I$(BUILD_DIR_64)/include -L$(BUILD_DIR_64) $(LINT_FLAGS)

# Set modified lint flags for our lint library targets.
$(BUILD_DIR_32)/llib-lcrypto.ln: LINT_FLAGS=$(LFLAGS_32) -I$(PROTOUSRINCDIR)
$(BUILD_DIR_32)/llib-lssl.ln: LINT_FLAGS=$(LFLAGS_32) -I$(PROTOUSRINCDIR)
$(BUILD_DIR_64)/llib-lcrypto.ln: LINT_FLAGS=$(LFLAGS_64) -I$(PROTOUSRINCDIR)
$(BUILD_DIR_64)/llib-lssl.ln: LINT_FLAGS=$(LFLAGS_64) -I$(PROTOUSRINCDIR)

#
# There is also separate STC test suite 'openssl'
# for regression testing. These internal tests are unit tests only.
#
COMPONENT_TEST_TARGETS = test
test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)


REQUIRED_PACKAGES += developer/build/makedepend
# Perl is needed for Configure, tests and the distributed CA.pl script.
REQUIRED_PACKAGES += runtime/perl-$(PERL_VERSION_NODOT)
REQUIRED_PACKAGES += system/core-os
