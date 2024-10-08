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
# Copyright (c) 2011, 2024, Oracle and/or its affiliates.
#
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME =	openssl
#
# When new version of OpenSSL comes in, you must update both COMPONENT_VERSION
# and IPS_COMPONENT_VERSION.
#
COMPONENT_VERSION =	1.0.2zj
#
# Version for IPS. It is easier to do it manually than convert the letter to a
# number while taking into account that there might be no letter at all.
#
IPS_COMPONENT_VERSION = 1.0.2.35
COMPONENT_PROJECT_URL=	https://www.openssl.org/
COMPONENT_SRC =		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:ea45fe8e64c922ac6ddcabff0cdb4acf636e08ea0b8f689ee0caee25a724d8cb
COMPONENT_ARCHIVE_URL =	$(COMPONENT_PROJECT_URL)source/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_BUGDB=	library/openssl
COMPONENT_ANITYA_ID=	17519

COMPONENT_BAID=		158763

# Clone the patch files to the patches-all dir.
# COPY_COMMON_FILES is there so that rsync is called as soon as
# the Makefile is parsed.
PATCH_DIR=patches-all
CLEAN_PATHS += $(PATCH_DIR)
COPY_COMMON_FILES:= $(shell rsync -ac ../common/patches/ patches/ $(PATCH_DIR))

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/configure.mk
include $(WS_MAKE_RULES)/ips.mk
include $(WS_MAKE_RULES)/lint-libraries.mk

PATH=$(SPRO_VROOT)/bin:/usr/bin:/usr/gnu/bin:/usr/perl5/bin
ifeq   ($(strip $(PARFAIT_BUILD)),yes)
PATH=$(PARFAIT_TOOLS):$(SPRO_VROOT)/bin:/usr/bin:/usr/perl5/bin
endif

# OpenSSL does not use autoconf but its own configure system.
CONFIGURE_SCRIPT = $(SOURCE_DIR)/Configure

# Ignore default CC_FOR_BUILD, CC, and CXX in CONFIGURE_ENV.
CONFIGURE_ENV += CC_FOR_BUILD=
CONFIGURE_ENV += CC=
CONFIGURE_ENV += CXX=

# This is to force OpenSSL's Configure script to use gmake for 'make links'.
# Otherwise it fails with:
#     mksh: Fatal error in reader: Unmatched `(' on line
CONFIGURE_ENV += MAKE="$(GMAKE)"

# Used in the configure options below.
PKCS11_LIB32 = /usr/lib/libpkcs11.so.1
PKCS11_LIB64 = /usr/lib/64/libpkcs11.so.1
ENGINESDIR_32 = /lib/openssl/engines
ENGINESDIR_64 = /lib/openssl/engines/64

CONFIGURE_OPTIONS =  -DSOLARIS_OPENSSL -DNO_WINDOWS_BRAINDEATH
CONFIGURE_OPTIONS += --openssldir=/etc/openssl
CONFIGURE_OPTIONS += --prefix=/usr
# We use OpenSSL install code for installing only manual pages and we do that
# for 32-bit version only.
CONFIGURE_OPTIONS += --install_prefix=$(PROTO_DIR)
CONFIGURE_OPTIONS += no-rc3
CONFIGURE_OPTIONS += no-rc5
CONFIGURE_OPTIONS += no-md2
CONFIGURE_OPTIONS += no-mdc2
CONFIGURE_OPTIONS += no-idea
CONFIGURE_OPTIONS += no-hw_4758_cca
CONFIGURE_OPTIONS += no-hw_aep
CONFIGURE_OPTIONS += no-hw_atalla
CONFIGURE_OPTIONS += no-hw_chil
CONFIGURE_OPTIONS += no-hw_gmp
CONFIGURE_OPTIONS += no-hw_ncipher
CONFIGURE_OPTIONS += no-hw_nuron
CONFIGURE_OPTIONS += no-hw_padlock
CONFIGURE_OPTIONS += no-hw_sureware
CONFIGURE_OPTIONS += no-hw_ubsec
CONFIGURE_OPTIONS += no-hw_cswift
CONFIGURE_OPTIONS += no-seed

# We don't ship GOST engine.
CONFIGURE_OPTIONS += no-gost

# Disable SSLv2 and SSLv3 protocols
CONFIGURE_OPTIONS += no-ssl2
CONFIGURE_OPTIONS += no-ssl3 no-ssl3-method

# We use both no-whirlpool and no-whrlpool since there is an inconsistency in
# the OpenSSL code and one needs both to build OpenSSL successfully with
# Whirlpool implementation removed.
CONFIGURE_OPTIONS += no-whirlpool
CONFIGURE_OPTIONS += no-whrlpool

# Some additional options needed for our engines.
CONFIGURE_OPTIONS += --pk11-libname=$(PKCS11_LIB$(BITS))
CONFIGURE_OPTIONS += --enginesdir=$(ENGINESDIR_$(BITS))

# We define our own compiler and linker option sets for Solaris. See Configure
# for more information.
CONFIGURE_OPTIONS32_i386 =	solaris-x86-cc-sunw
CONFIGURE_OPTIONS32_sparc =	solaris-sparcv9-cc-sunw
CONFIGURE_OPTIONS64_i386 =	solaris64-x86_64-cc-sunw
CONFIGURE_OPTIONS64_sparc =	solaris64-sparcv9-cc-sunw

# Options specific to regular build.
# They must not be specified as common, as they cannot be overridden.
$(BUILD_DIR)/$(MACH32)/.configured:	CONFIGURE_OPTIONS += threads
$(BUILD_DIR)/$(MACH64)/.configured:	CONFIGURE_OPTIONS += threads
$(BUILD_DIR)/$(MACH32)/.configured:	CONFIGURE_OPTIONS += shared
$(BUILD_DIR)/$(MACH64)/.configured:	CONFIGURE_OPTIONS += shared
$(BUILD_DIR)/$(MACH32)/.configured:	CONFIGURE_OPTIONS += shared
$(BUILD_DIR)/$(MACH64)/.configured:	CONFIGURE_OPTIONS += shared
$(BUILD_DIR)/$(MACH32)/.configured:	CONFIGURE_OPTIONS += \
	$(CONFIGURE_OPTIONS32_$(MACH))
$(BUILD_DIR)/$(MACH64)/.configured:	CONFIGURE_OPTIONS += \
	$(CONFIGURE_OPTIONS64_$(MACH))

# OpenSSL has its own configure system which must be run from the fully
# populated source code directory. However, the Userland configuration phase is
# run from the build directory. So, we must get the full source code into the
# build directory.
COMPONENT_PRE_CONFIGURE_ACTION = \
    ( $(CLONEY) $(SOURCE_DIR) $(BUILD_DIR)/$(MACH$(BITS)); )

# We deliver only one opensslconf.h file which must be suitable for both 32 and
# 64 bits. Depending on the configuration option, OpenSSL's Configure script
# creates opensslconf.h for either 32 or 64 bits. A patch makes the resulting
# header file usable on both architectures. The patch was generated against the
# opensslconf.h version from the 32 bit build.
COMPONENT_POST_CONFIGURE_ACTION = \
    ( [ $(BITS) -eq 32 ] && $(GPATCH) -p1 $(@D)/crypto/opensslconf.h \
      patches-post-config/opensslconf.patch; cd $(@D); $(MAKE) depend; )

# We do not ship our engines as patches since it would be more difficult to
# update the files which have been under continuous development. We rather copy
# the files to the right directories.
COMPONENT_PRE_BUILD_ACTION = \
    ( echo "Cloning engines..."; \
      $(LN) -fs $(COMPONENT_DIR)/../common/engines/pkcs11/*.[ch]	$(@D)/engines; )

configure:	$(CONFIGURE_32_and_64)

build:		$(BUILD_32_and_64)

# OpenSSL uses sections man[1357] by default so we must create the man
# directories we use for OpenSSL man pages in Solaris. Note that we patch the
# OpenSSL man page install script to use the correct directories.
MANDIR_SECTIONS =  $(PROTO_DIR)/usr/openssl/1.0.2/share/man/man1openssl
MANDIR_SECTIONS += $(PROTO_DIR)/usr/openssl/1.0.2/share/man/man3openssl
MANDIR_SECTIONS += $(PROTO_DIR)/usr/openssl/1.0.2/share/man/man5openssl
MANDIR_SECTIONS += $(PROTO_DIR)/usr/openssl/1.0.2/share/man/man7openssl

# We must create man page directories manually since we patched OpenSSL install
# code to install into manXopenssl instead of manX. Also, OpenSSL does not
# install into <dir>/$(MACH64) for 64-bit install so no such directory is
# created and Userland install code would fail when installing lint libraries.
COMPONENT_PRE_INSTALL_ACTION = ( $(MKDIR) $(MANDIR_SECTIONS); \
    $(MKDIR) $(PROTO_DIR)/usr/lib/$(MACH64); )

# Remove unnecessary RUNPATH/RPATH for libcrypto.so.1.0.0
COMPONENT_POST_INSTALL_ACTION.32 = \
    $(ELFEDIT) -e "dyn:delete RUNPATH" -e "dyn:delete RPATH" \
	$(BUILD_DIR_32)/libcrypto.so.1.0.0;
COMPONENT_POST_INSTALL_ACTION.64 = \
    $(ELFEDIT) -e "dyn:delete RUNPATH" -e "dyn:delete RPATH" \
	$(BUILD_DIR_64)/libcrypto.so.1.0.0;
COMPONENT_POST_INSTALL_ACTION += $(COMPONENT_POST_INSTALL_ACTION.$(BITS))

# The install_docs target will install man pages into $(PROTO_DIR)/$(MANDIR). We
# also add /usr/perl5/bin to PATH so that OpenSSL install code can locate the
# system pod2man. If not set, OpenSSL make would use an internal implementation
# from the tarball which would corrupt some man pages.
COMPONENT_INSTALL_ARGS += PATH=$(PATH) MANDIR=/usr/openssl/1.0.2/share/man

# manual pages. However, lint libraries depend on install stamps so we run
# install for 64 bit as well. Note that we must take built binary files from
# build directories, not from the proto area which contains whatever was
# installed first.
install:	$(INSTALL_32_and_64)

# Set modified lint flags for our lint library targets.
$(BUILD_DIR_32)/llib-lcrypto.ln: LINT_FLAGS=$(LFLAGS_32) -I$(PROTOUSRINCDIR)
$(BUILD_DIR_32)/llib-lssl.ln: LINT_FLAGS=$(LFLAGS_32) -I$(PROTOUSRINCDIR)
$(BUILD_DIR_64)/llib-lcrypto.ln: LINT_FLAGS=$(LFLAGS_64) -I$(PROTOUSRINCDIR)
$(BUILD_DIR_64)/llib-lssl.ln: LINT_FLAGS=$(LFLAGS_64) -I$(PROTOUSRINCDIR)

# There are also separate STC test suites 'openssl' and 'openssl-engine'
# for regression testing. These internal tests are unit tests only.
COMPONENT_TEST_TARGETS = test
test:		$(TEST_32_and_64)

system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)


REQUIRED_PACKAGES += developer/build/makedepend
REQUIRED_PACKAGES += network/rsync
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/linker
REQUIRED_PACKAGES += system/library/security/crypto
REQUIRED_PACKAGES += $(PERL_PKG)
