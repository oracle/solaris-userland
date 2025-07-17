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
# Copyright (c) 2021, 2025, Oracle and/or its affiliates.
#

# This Makefile contains wanboot specific rules.

include ../../../make-rules/shared-macros.mk

include ../openssl-3/Makefile.com

BUILD_ARCH=	sparc
BUILD_BITS=	64

include $(WS_MAKE_RULES)/common.mk

#
# Option -xF=%all instructs the compiler to place functions and data
# variables into separate section fragments. This enables the link editor
# to discard unused sections and files when linking the wanboot loader.
# This option is specific to the Studio compiler.
#
CFLAGS_WANBOOT="-m64 \
	-Qoption cg \
	-xregs=no%appl \
	-xO5 \
	-xstrconst \
	-xdepend \
	-xspace \
	-xannotate=no \
	-xF=%all \
	-xcheck=no%stkovf \
	-Xa \
	-M /usr/lib/ld/map.pagealign \
	-DNO_SYSLOG \
	-D_BOOT"

# Start with overriding the options.
CONFIGURE_OPTIONS = CFLAGS=$(CFLAGS_WANBOOT)
CONFIGURE_OPTIONS += CC=$(CC.studio.64)

BITS=64
# CONFIGURE_PREFIX will not work, so use it directly.
CONFIGURE_OPTIONS += --prefix=/usr/openssl/3/wanboot

#
# wanboot specific options
#
# The option list is derived from @disablables list in Configure (as of 2022/06).
# Basically I started with the complete list of no-* options and then removed
# those that prevented functional wanboot.
#
# The removed options were:
#
#   atexit - seems like harmless thing we want to have
#   no-stdio - for d2i_PKCS12_fp() etc.
#   no-sock - needed for SSL_set_fd() etc.
#   no-asm - needed for crypto performance
#   no-tls - need TLS
#   no-err - need error codes (also custom error codes for SUNWerr())
#   no-des - needed for PKCS#12 parsing
#   no-bulk - has disabled cascade for 'des'
#   no-dh - necessary for TLS session establishment (supported groups in Client Hello)
#   no-autoalginit - to populate algorithm tables
#   no-ec - because ECC is cool
#   no-ecdh - ditto
#   no-ecdsa - ditto
#   no-apps - do not build the programs
#   no-http - disable HTTP support
#   no-docs - do not install docs
#
# Also, the following were added:
#
#   no-ssl3 - for a good measure, actually per internal policy
#   no-tls1 - ditto
#   no-tls1_1 - ditto
#
CONFIGURE_OPTIONS += no-acvp-tests
CONFIGURE_OPTIONS += no-afalgeng
CONFIGURE_OPTIONS += no-apps
CONFIGURE_OPTIONS += no-argon2
CONFIGURE_OPTIONS += no-aria
CONFIGURE_OPTIONS += no-asan
CONFIGURE_OPTIONS += no-async
CONFIGURE_OPTIONS += no-autoerrinit
CONFIGURE_OPTIONS += no-autoload-config
CONFIGURE_OPTIONS += no-bf
CONFIGURE_OPTIONS += no-blake2
CONFIGURE_OPTIONS += no-brotli-dynamic
CONFIGURE_OPTIONS += no-brotli
CONFIGURE_OPTIONS += no-buildtest-c++
CONFIGURE_OPTIONS += no-cached-fetch
CONFIGURE_OPTIONS += no-camellia
CONFIGURE_OPTIONS += no-capieng
CONFIGURE_OPTIONS += no-cast
CONFIGURE_OPTIONS += no-cmac
CONFIGURE_OPTIONS += no-cmp
CONFIGURE_OPTIONS += no-cms
CONFIGURE_OPTIONS += no-comp
CONFIGURE_OPTIONS += no-crypto-mdebug
CONFIGURE_OPTIONS += no-ct
CONFIGURE_OPTIONS += no-default-thread-pool
CONFIGURE_OPTIONS += no-demos
CONFIGURE_OPTIONS += no-deprecated
CONFIGURE_OPTIONS += no-devcryptoeng
CONFIGURE_OPTIONS += no-dgram
CONFIGURE_OPTIONS += no-docs
CONFIGURE_OPTIONS += no-dsa
CONFIGURE_OPTIONS += no-dso
CONFIGURE_OPTIONS += no-dtls
CONFIGURE_OPTIONS += no-dynamic-engine
CONFIGURE_OPTIONS += no-ec_nistp_64_gcc_128
CONFIGURE_OPTIONS += no-ec2m
CONFIGURE_OPTIONS += no-ecx
CONFIGURE_OPTIONS += no-egd
CONFIGURE_OPTIONS += no-engine
CONFIGURE_OPTIONS += no-external-tests
CONFIGURE_OPTIONS += no-filenames
CONFIGURE_OPTIONS += no-fips-jitter
CONFIGURE_OPTIONS += no-fips-post
CONFIGURE_OPTIONS += no-fips
CONFIGURE_OPTIONS += no-fips-securitychecks
CONFIGURE_OPTIONS += no-fuzz-afl
CONFIGURE_OPTIONS += no-fuzz-libfuzzer
CONFIGURE_OPTIONS += no-gost
CONFIGURE_OPTIONS += no-h3demo
CONFIGURE_OPTIONS += no-hqinterop
CONFIGURE_OPTIONS += no-http
CONFIGURE_OPTIONS += no-chacha
CONFIGURE_OPTIONS += no-idea
CONFIGURE_OPTIONS += no-integrity-only-ciphers
CONFIGURE_OPTIONS += no-jitter
CONFIGURE_OPTIONS += no-ktls
CONFIGURE_OPTIONS += no-legacy
CONFIGURE_OPTIONS += no-loadereng
CONFIGURE_OPTIONS += no-makedepend
CONFIGURE_OPTIONS += no-md2
CONFIGURE_OPTIONS += no-md4
CONFIGURE_OPTIONS += no-mdc2
CONFIGURE_OPTIONS += no-ml-dsa
CONFIGURE_OPTIONS += no-ml-kem
CONFIGURE_OPTIONS += no-module
CONFIGURE_OPTIONS += no-msan
CONFIGURE_OPTIONS += no-multiblock
CONFIGURE_OPTIONS += no-nextprotoneg
CONFIGURE_OPTIONS += no-ocb
CONFIGURE_OPTIONS += no-ocsp
CONFIGURE_OPTIONS += no-padlockeng
CONFIGURE_OPTIONS += no-pic
CONFIGURE_OPTIONS += no-pie
CONFIGURE_OPTIONS += no-pinshared
CONFIGURE_OPTIONS += no-poly1305
CONFIGURE_OPTIONS += no-posix-io
CONFIGURE_OPTIONS += no-psk
CONFIGURE_OPTIONS += no-quic
CONFIGURE_OPTIONS += no-rc2
CONFIGURE_OPTIONS += no-rc4
CONFIGURE_OPTIONS += no-rc5
CONFIGURE_OPTIONS += no-rdrand
CONFIGURE_OPTIONS += no-rfc3779
CONFIGURE_OPTIONS += no-rmd160
CONFIGURE_OPTIONS += no-scrypt
CONFIGURE_OPTIONS += no-sctp
CONFIGURE_OPTIONS += no-secure-memory
CONFIGURE_OPTIONS += no-seed
CONFIGURE_OPTIONS += no-shared
CONFIGURE_OPTIONS += no-siphash
CONFIGURE_OPTIONS += no-siv
CONFIGURE_OPTIONS += no-slh-dsa
CONFIGURE_OPTIONS += no-sm2-precomp
CONFIGURE_OPTIONS += no-sm2
CONFIGURE_OPTIONS += no-sm3
CONFIGURE_OPTIONS += no-sm4
CONFIGURE_OPTIONS += no-srp
CONFIGURE_OPTIONS += no-srtp
CONFIGURE_OPTIONS += no-sse2
CONFIGURE_OPTIONS += no-ssl
CONFIGURE_OPTIONS += no-ssl-trace
CONFIGURE_OPTIONS += no-sslkeylog
CONFIGURE_OPTIONS += no-ssl3
CONFIGURE_OPTIONS += no-static-engine
CONFIGURE_OPTIONS += no-tests
CONFIGURE_OPTIONS += no-tfo
CONFIGURE_OPTIONS += no-thread-pool
CONFIGURE_OPTIONS += no-threads
CONFIGURE_OPTIONS += no-tls-deprecated-ec
CONFIGURE_OPTIONS += no-tls1
CONFIGURE_OPTIONS += no-tls1_1
CONFIGURE_OPTIONS += no-trace
CONFIGURE_OPTIONS += no-ts
CONFIGURE_OPTIONS += no-ubsan
CONFIGURE_OPTIONS += no-ui-console
CONFIGURE_OPTIONS += no-unit-test
CONFIGURE_OPTIONS += no-unstable-qlog
CONFIGURE_OPTIONS += no-uplink
CONFIGURE_OPTIONS += no-weak-ssl-ciphers
CONFIGURE_OPTIONS += no-whirlpool
CONFIGURE_OPTIONS += no-winstore
CONFIGURE_OPTIONS += no-zlib
CONFIGURE_OPTIONS += no-zlib-dynamic
CONFIGURE_OPTIONS += no-zstd-dynamic
CONFIGURE_OPTIONS += no-zstd

#
# Note: --openssldir is not specified as it is not currently needed to load configuration.
#       openssl.cnf is not part of the wanbootfs anyway. Also, no-autoload-config.
#
CONFIGURE_OPTIONS += solaris64-sparcv9-cc

BITS=64
CC=$(CC.studio.64)
COMPONENT_POST_BUILD_ACTION = \
    ../common/verify_build.sh $(@D) $(CC) $(BITS) openssl-3-wanboot-internal.sparc.p5m wanboot || exit 1;

# Tests reside in ON, see ../README.md
COMPONENT_TEST_TARGETS = test
system-test:	$(NO_TESTS)
