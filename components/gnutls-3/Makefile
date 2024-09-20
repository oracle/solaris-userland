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
# Copyright (c) 2010, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnutls
COMPONENT_VERSION=	3.8.4
COMPONENT_BAID=		163707
COMPONENT_ARCHIVE_HASH= sha256:2bea4e154794f3f00180fa2a5c51fe8b005ac7a31cd58bd44cdfa7f36ebc3a9b
COMPONENT_ARCHIVE_URL=	https://www.gnupg.org/ftp/gcrypt/gnutls/v3.8/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=  https://www.gnutls.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
#COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=	library/gnutls
COMPONENT_ANITYA_ID=	1221

# GnuTLS changed API where GRUB2 module "https" does not builds with new headers and lib
COMPONENT_NAME_1=		gnutls
COMPONENT_VERSION_1=		3.7.1
COMPONENT_BAID_1=		99031
COMPONENT_ARCHIVE_HASH_1=	sha256:3777d7963eca5e06eb315686163b7b3f5045e2baac5e54e038ace9835e5cac6f
COMPONENT_SRC_1=		$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=		$(COMPONENT_SRC_1).tar.xz
COMPONENT_ARCHIVE_URL_1=	https://www.gnupg.org/ftp/gcrypt/gnutls/v3.7/$(COMPONENT_ARCHIVE_1)
COMPONENT_SIG_URL_1=		$(COMPONENT_ARCHIVE_URL_1).sig

ifeq ($(MACH),i386)
BUILD_DIR_1=		$(BUILD_DIR)/$(COMPONENT_SRC_1)
CONFIGURE_32_and_64 +=	$(BUILD_DIR_1)/.configured
BUILD_32_and_64 +=	$(BUILD_DIR_1)/.built
INSTALL_32_and_64 +=	$(BUILD_DIR_1)/.installed
endif

include $(WS_MAKE_RULES)/common.mk

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-implicit-function-declaration

CFLAGS += -I$(USRINCDIR)/idn

COMPONENT_BUILD_TARGETS = all info
COMPONENT_PREP_ACTION += (cd $(@D); $(AUTORECONF_ENV) $(AUTORECONF) -fiv);

ifeq ($(MACH),i386)

COMPONENT_PREP_ACTION += (cd $(COMPONENT_SRC_1); $(AUTORECONF_ENV) $(AUTORECONF) -fiv);

$(BUILD_DIR_1)/.configured $(BUILD_DIR_1)/.built $(BUILD_DIR_1)/.installed: SOURCE_DIR= $(COMPONENT_DIR)/$(COMPONENT_SRC_1)
$(BUILD_DIR_1)/.configured: BITS=		64
$(BUILD_DIR_1)/.configured: CC_PIC_MODE = $(CC_PIC_DISABLE)
$(BUILD_DIR_1)/.configured: LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)
$(BUILD_DIR_1)/.configured: CONFIGURE_ENV +=	CFLAGS="$(CFLAGS.grub)"
$(BUILD_DIR_1)/.configured: CONFIGURE_OPTIONS += $(CONFIGURE_OPTIONS.grub)

MCS = mcs
STRIP = strip
GRUBWANBOOTDIR = $(PROTO_DIR)/usr/lib/grub/wanboot
$(BUILD_DIR_1)/.installed:	$(BUILD_DIR_1)/.built
	$(MKDIR) $(GRUBWANBOOTDIR)
	$(MKDIR) $(BUILD_DIR)/grub
	(cd $(BUILD_DIR_1)/lib/includes ; \
	  $(ENV) $(GMAKE) install-nobase_includeHEADERS DESTDIR=$(BUILD_DIR)/grub ; \
	  $(CP) gnutls/gnutls.h $(BUILD_DIR)/grub/usr/include/gnutls/ )
	(cd $(BUILD_DIR)/grub/usr/include ; $(MV) gnutls/ $(GRUBWANBOOTDIR))
	(cd $(BUILD_DIR_1)/lib/.libs ; \
	  $(MV) libgnutls.a $(GRUBWANBOOTDIR)/libgnutls.a ; \
	  $(STRIP) -x  $(GRUBWANBOOTDIR)/libgnutls.a ; \
	  $(MCS) -d $(GRUBWANBOOTDIR)/libgnutls.a ; \
	  $(AR) ts $(GRUBWANBOOTDIR)/libgnutls.a )
	$(TOUCH) $@

endif

# Some static libraries are delivered, avoid manifest cleanup.
MANIFEST_CLEANUP_TRANSFORM=

CONFIGURE_OPTIONS += MAKE=$(MAKE)
CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS += --mandir=$(USRSHAREDIR)/man
CONFIGURE_OPTIONS += --includedir=$(USRINCDIR)/
CONFIGURE_OPTIONS.32 += --libdir=$(USRLIBDIR)/
CONFIGURE_OPTIONS.64 += --libdir=$(USRLIBDIR64)/
CONFIGURE_OPTIONS.32 += --libexecdir=$(USRLIBDIR)/pkgconfig/
CONFIGURE_OPTIONS.64 += --libexecdir=$(USRLIBDIR64)/pkgconfig/
CONFIGURE_OPTIONS += --localedir=$(USRSHARELOCALEDIR)/
CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)
CONFIGURE_OPTIONS += --disable-guile
CONFIGURE_OPTIONS += --with-included-libtasn1
CONFIGURE_OPTIONS += --with-included-unistring
CONFIGURE_OPTIONS += --without-p11-kit
CONFIGURE_OPTIONS += --disable-openssl-compatibility
CONFIGURE_OPTIONS += --disable-tests
CONFIGURE_OPTIONS += --with-default-trust-store-file=/etc/certs/ca-certificates.crt
CONFIGURE_OPTIONS += --enable-hardware-acceleration

CFLAGS.grub += -D_BOOT
CFLAGS.grub += -g
CFLAGS.grub += -falign-jumps=1
CFLAGS.grub += -falign-loops=1
CFLAGS.grub += -falign-functions
CFLAGS.grub += -mno-mmx
CFLAGS.grub += -mno-sse
CFLAGS.grub += -mno-sse2
CFLAGS.grub += -mno-sse3
CFLAGS.grub += -mno-ssse3
CFLAGS.grub += -mno-sse4.1
CFLAGS.grub += -mno-sse4.2
CFLAGS.grub += -mno-sse4
CFLAGS.grub += -mno-avx
CFLAGS.grub += -mno-avx2
CFLAGS.grub += -mno-aes
CFLAGS.grub += -mno-pclmul
CFLAGS.grub += -mno-fsgsbase
CFLAGS.grub += -mno-rdrnd
CFLAGS.grub += -mno-f16c
CFLAGS.grub += -mno-fma
CFLAGS.grub += -mno-sse4a
CFLAGS.grub += -mno-fma4
CFLAGS.grub += -mno-xop
CFLAGS.grub += -mno-lwp
CFLAGS.grub += -mno-3dnow
CFLAGS.grub += -fno-dwarf2-cfi-asm
CFLAGS.grub += -fno-asynchronous-unwind-tables
CFLAGS.grub += -fno-common
CFLAGS.grub += -mcmodel=large
CFLAGS.grub += -mno-red-zone
CFLAGS.grub += -fno-stack-protector
CFLAGS.grub += -mno-stack-arg-probe
# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS.grub += -Wno-implicit-function-declaration

# set of the configure options as needed for grub

CONFIGURE_OPTIONS.grub += --enable-largefile
CONFIGURE_OPTIONS.grub += --disable-doc
CONFIGURE_OPTIONS.grub += --disable-tools
CONFIGURE_OPTIONS.grub += --disable-cxx
CONFIGURE_OPTIONS.grub += --enable-hardware-acceleration
CONFIGURE_OPTIONS.grub += --disable-padlock
CONFIGURE_OPTIONS.grub += --with-nettle-mini
CONFIGURE_OPTIONS.grub += --with-included-libtasn1
CONFIGURE_OPTIONS.grub += --disable-dtls-srtp-support
CONFIGURE_OPTIONS.grub += --disable-alpn-support
CONFIGURE_OPTIONS.grub += --disable-heartbeat_support
CONFIGURE_OPTIONS.grub += --disable-srp-authentication
CONFIGURE_OPTIONS.grub += --disable-psk-authentication
CONFIGURE_OPTIONS.grub += --enable-anon-authentication
CONFIGURE_OPTIONS.grub += --enable-dhe
CONFIGURE_OPTIONS.grub += --disable-openpgp-authentication
CONFIGURE_OPTIONS.grub += --disable-cryptodev
CONFIGURE_OPTIONS.grub += --disable-ocsp
CONFIGURE_OPTIONS.grub += --disable-session-tickets
CONFIGURE_OPTIONS.grub += --disable-openssl-compatibility
CONFIGURE_OPTIONS.grub += --disable-tests
CONFIGURE_OPTIONS.grub += --without-html-dir
CONFIGURE_OPTIONS.grub += --disable-gtk-doc
CONFIGURE_OPTIONS.grub += --disable-gtk-doc-html
CONFIGURE_OPTIONS.grub += --disable-gtk-doc-pdf
CONFIGURE_OPTIONS.grub += --disable-nls
CONFIGURE_OPTIONS.grub += --disable-rpath
CONFIGURE_OPTIONS.grub += --without-libiconv-prefix
CONFIGURE_OPTIONS.grub += --without-libintl-prefix
CONFIGURE_OPTIONS.grub += --without-librt-prefix
CONFIGURE_OPTIONS.grub += --without-libpthread-prefix
CONFIGURE_OPTIONS.grub += --without-libnsl-prefix
CONFIGURE_OPTIONS.grub += --disable-ld-version-script
CONFIGURE_OPTIONS.grub += --disable-valgrind-tests
CONFIGURE_OPTIONS.grub += --enable-static
CONFIGURE_OPTIONS.grub += --disable-shared
CONFIGURE_OPTIONS.grub += --without-pic
CONFIGURE_OPTIONS.grub += --disable-self-checks
CONFIGURE_OPTIONS.grub += --disable-fips140-mode
CONFIGURE_OPTIONS.grub += --without-idn
CONFIGURE_OPTIONS.grub += --disable-non-suiteb-curves
CONFIGURE_OPTIONS.grub += --disable-libdane
CONFIGURE_OPTIONS.grub += --without-unbound-root-key-file
CONFIGURE_OPTIONS.grub += --without-system-priority-file
CONFIGURE_OPTIONS.grub += --without-tpm
CONFIGURE_OPTIONS.grub += --disable-local-libopts
CONFIGURE_OPTIONS.grub += --disable-libopts-install
CONFIGURE_OPTIONS.grub += --without-regex_header
CONFIGURE_OPTIONS.grub += --without-libregex
CONFIGURE_OPTIONS.grub += --without-libregex_cflags
CONFIGURE_OPTIONS.grub += --without-libregex_libs
CONFIGURE_OPTIONS.grub += --disable-optional-args
CONFIGURE_OPTIONS.grub += --without-zlib
CONFIGURE_OPTIONS.grub += --without-default-trust-store-dir
CONFIGURE_OPTIONS.grub += --without-default-trust-store-file
CONFIGURE_OPTIONS.grub += --without-default-crl-file
CONFIGURE_OPTIONS.grub += --without-default-blacklist-file
CONFIGURE_OPTIONS.grub += --disable-guile
CONFIGURE_OPTIONS.grub += --without-guile-site-dir
CONFIGURE_OPTIONS.grub += --disable-crywrap

# For grub tell configure that we don't have lots of the
# standard unix environment.  This will cache these values, and set
# them to no.

CONFIGURE_OPTIONS.grub += ac_cv_func___fsetlocking=no
CONFIGURE_OPTIONS.grub += ac_cv_func___register_atfork=no
CONFIGURE_OPTIONS.grub += ac_cv_func___secure_getenv=no
CONFIGURE_OPTIONS.grub += ac_cv_func__fseeki64=no
CONFIGURE_OPTIONS.grub += ac_cv_func__ftelli64=no
CONFIGURE_OPTIONS.grub += ac_cv_func__ftime=no
CONFIGURE_OPTIONS.grub += ac_cv_func_alarm=no
CONFIGURE_OPTIONS.grub += ac_cv_func_argpusage=no
CONFIGURE_OPTIONS.grub += ac_cv_func_canonicalize_file_name=no
CONFIGURE_OPTIONS.grub += ac_cv_func_chmod=no
CONFIGURE_OPTIONS.grub += ac_cv_func_clock_gettime=no
CONFIGURE_OPTIONS.grub += ac_cv_func_clock_settime=no
CONFIGURE_OPTIONS.grub += ac_cv_func_daemon=no
CONFIGURE_OPTIONS.grub += ac_cv_func_dup2=no
CONFIGURE_OPTIONS.grub += ac_cv_func_epoll_create=no
CONFIGURE_OPTIONS.grub += ac_cv_func_explicit_memset=no
CONFIGURE_OPTIONS.grub += ac_cv_func_memset_s=no
CONFIGURE_OPTIONS.grub += ac_cv_func_explicit_bzero=no
CONFIGURE_OPTIONS.grub += ac_cv_func_fchmod=no
CONFIGURE_OPTIONS.grub += ac_cv_func_flockfile=no
CONFIGURE_OPTIONS.grub += ac_cv_func_fmemopen=no
CONFIGURE_OPTIONS.grub += ac_cv_func_fork=no
CONFIGURE_OPTIONS.grub += ac_cv_func_fstat=no
CONFIGURE_OPTIONS.grub += ac_cv_func_ftello=no
CONFIGURE_OPTIONS.grub += ac_cv_func_funlockfile=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getdelim=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getegid=no
CONFIGURE_OPTIONS.grub += ac_cv_func_geteuid=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getgid=no
CONFIGURE_OPTIONS.grub += ac_cv_func_gethostbyname=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getline=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getpagesize=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getpass=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getpid=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getpwuid_r=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getrusage=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getservbyname=no
CONFIGURE_OPTIONS.grub += ac_cv_func_getuid=no
CONFIGURE_OPTIONS.grub += ac_cv_func_iconv=no
CONFIGURE_OPTIONS.grub += am_cv_func_iconv=no
CONFIGURE_OPTIONS.grub += ac_cv_func_inet_ntop=no
CONFIGURE_OPTIONS.grub += ac_cv_func_inet_pton=no
CONFIGURE_OPTIONS.grub += ac_cv_func_issetugid=no
CONFIGURE_OPTIONS.grub += ac_cv_func_kqueue=no
CONFIGURE_OPTIONS.grub += ac_cv_func_localtime=no
CONFIGURE_OPTIONS.grub += ac_cv_func_localtime_r=no
CONFIGURE_OPTIONS.grub += ac_cv_func_mbrtowc=no
CONFIGURE_OPTIONS.grub += ac_cv_func_memmem=no
CONFIGURE_OPTIONS.grub += gl_cv_func_memmem_works_always=no
CONFIGURE_OPTIONS.grub += ac_cv_func_mmap=no
CONFIGURE_OPTIONS.grub += ac_cv_func_mprotect=no
CONFIGURE_OPTIONS.grub += ac_cv_func_munmap=no
CONFIGURE_OPTIONS.grub += ac_cv_func_nanosleep=no
CONFIGURE_OPTIONS.grub += ac_cv_func_pthread_atfork=no
CONFIGURE_OPTIONS.grub += ac_cv_func_pthread_mutex_lock=no
CONFIGURE_OPTIONS.grub += ac_cv_func_putenv=no
CONFIGURE_OPTIONS.grub += ac_cv_func_regcomp=no
CONFIGURE_OPTIONS.grub += ac_cv_func_scandir=no
CONFIGURE_OPTIONS.grub += ac_cv_func_scm_gc_malloc_pointerless=no
CONFIGURE_OPTIONS.grub += ac_cv_func_secure_getenv=no
CONFIGURE_OPTIONS.grub += ac_cv_func_select=no
CONFIGURE_OPTIONS.grub += ac_cv_func_setdtablesize=no
CONFIGURE_OPTIONS.grub += ac_cv_func_setenv=no
CONFIGURE_OPTIONS.grub += ac_cv_func_shutdown=no
CONFIGURE_OPTIONS.grub += ac_cv_func_socket=no
CONFIGURE_OPTIONS.grub += ac_cv_func_stat=no
CONFIGURE_OPTIONS.grub += ac_cv_func_strerror_r=no
CONFIGURE_OPTIONS.grub += ac_cv_func_strpbrk=no
CONFIGURE_OPTIONS.grub += ac_cv_func_strsignal=no
CONFIGURE_OPTIONS.grub += ac_cv_func_strtok_r=no
CONFIGURE_OPTIONS.grub += ac_cv_func_strverscmp=no
CONFIGURE_OPTIONS.grub += ac_cv_func_tcgetattr=no
CONFIGURE_OPTIONS.grub += ac_cv_func_tcsetattr=no
CONFIGURE_OPTIONS.grub += ac_cv_func_tsearch=no
CONFIGURE_OPTIONS.grub += ac_cv_func_uname=no
CONFIGURE_OPTIONS.grub += ac_cv_func_unsetenv=no
CONFIGURE_OPTIONS.grub += ac_cv_func_vasprintf=no
CONFIGURE_OPTIONS.grub += ac_cv_func_vfork=no
CONFIGURE_OPTIONS.grub += ac_cv_func_wcslen=no
CONFIGURE_OPTIONS.grub += ac_cv_func_wcsnlen=no
CONFIGURE_OPTIONS.grub += ac_cv_func_wctomb=no
CONFIGURE_OPTIONS.grub += ac_cv_libiconv=no
CONFIGURE_OPTIONS.grub += ac_cv_libnsl=no
CONFIGURE_OPTIONS.grub += ac_cv_libpthread=no
CONFIGURE_OPTIONS.grub += ac_cv_librt=no
CONFIGURE_OPTIONS.grub += gl_cv_func_localtime_r_inline=no

include ../../make-rules/shared-targets.mk

PKG_MACROS += COMPONENT_VERSION=$(COMPONENT_VERSION)

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master
# test-memset_explicit fails on sparcv7
$(BUILD_DIR)/sparcv7/.tested-and-compared: COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-sparcv7.master

COMPONENT_TEST_TRANSFORMS += \
	'-n -e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/TOTAL/p" ' \
	'-e "/ERROR/p" '

REQUIRED_PACKAGES += compress/zstd
REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/libidn2
REQUIRED_PACKAGES += library/security/nettle
REQUIRED_PACKAGES += library/security/trousers
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
