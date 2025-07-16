#!/bin/bash
#
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#

function fail()
{
	echo "ERROR:" $*
	exit 1
}

# Verify that the build has certain properties.
if (( $# != 5 )); then
	print "usage: $0 <build_dir> <cc_path> <arch> <pkg_manifest> <type>"
	exit 1
fi

BUILD_DIR="$1"
if [[ ! -d $BUILD_DIR ]]; then
	fail "$BUILD_DIR is not a directory"
fi

CC="$2"
if [[ ! -x ${CC} ]]; then
	fail "Not executable: ${CC}"
fi
echo "Using CC: ${CC}"

BITS="$3"

TYPE="$5"
LIB_SUFFIX="so"
if [[ $TYPE == "wanboot" ]]; then
	LIB_SUFFIX="a"
fi

PKG_MANIFEST_FILE="$4"

function disallowed_check()
{
	disallowed=(rc2 rc4 rc5 md2 md4 mdc2 idea whirlpool seed)
	cipher_regexp=$( echo ${disallowed_ciphers[*]} | \
	    tr '[a-z]' '[A-Z]' | sed 's/ /|/g' )

	echo "Checking libcrypto.$LIB_SUFFIX for symbols of disallowed ciphers"
	if elfdump $BUILD_DIR/libcrypto.$LIB_SUFFIX | \
	    egrep '($cipher_regexp)' >/dev/null; then
		fail "libcrypto contains disallowed ciphers"
	fi

	if [[ $TYPE == "wanboot" ]]; then
		return
	fi
	# Unfortunately the header files need to be delivered
	# even though # Configure was run with 'no-xxx' option. Several upstream
	# components that use OpenSSL still have #include directives for old
	# algorithms and won't build without those headers present.
	# So at least ensure they aren't in our lint libraries.
	for item in ${disallowed[*]} whrlpool; do
		header_file="${item}.h"
		echo "Checking header file $header_file in lint library files"
		if grep $( echo $header_file | sed 's/\./\\./' ) llib-*; then
			fail "Header file $header_file present in lint library files"
		fi
	done
}

function deprecated_check()
{
	# Check that the DECLARE_DEPRECATED macro works for one of the functions.
	tmpdir=$( mktemp -d /tmp/md5-deprecated-test.XXXXXX )
	if [[ -z $tmpdir ]]; then
		echo "cannot create temporary directory"
		exit 1
	fi
	cat << EOF > "$tmpdir/md5.c"
#include "openssl/md5.h"
int
main(void)
{
	MD5_CTX ctx;

	MD5_Init(&ctx);

	return (0);
}
EOF

	echo "Checking that compiler issues deprecated warning for obsolete ciphers"
	${CC} -I $BUILD_DIR/include -o "$tmpdir/md5.o" -c "$tmpdir/md5.c" 2>&1 | \
	    grep "warning:.*MD5_Init. is deprecated" >/dev/null
	ret=$?
	rm -rf "$tmpdir"
	if (( ret != 0 )); then
		fail "compiler should issue deprecated warning but did not"
	fi
}

function sx_check()
{
	typeset binary="$BUILD_DIR/apps/openssl"

	echo "Checking security extensions for $binary"
	cnt=$( elfdump -d $binary | \
	    egrep -c '(SUNW_SX_ASLR)|(SUNW_SX_NXSTACK)|(SUNW_SX_NXHEAP)' )
	if (( cnt != 3 )); then
		fail "Security extensions are not enabled for $binary"
	fi
}

#
# Check that libcrypto.so was built with thread support enabled.
# This is the default however it does not hurt to check.
#
function threads_check()
{
	typeset libcrypto="$BUILD_DIR/libcrypto.so"

	echo "Checking that $libcrypto was built with threading support"
	if [[ ! -r $libcrypto ]]; then
		fail "Not readable: $libcrypto"
	fi

	if ! nm "$libcrypto" | grep CRYPTO_THREAD >/dev/null; then
		fail "Missing CRYPTO_THREAD symbols"
	fi
}

function soname_check()
{
	for name in libcrypto.so libssl.so; do
		lib="$BUILD_DIR/$name"
		if ! elfdump -d "$lib" | grep SONAME >/dev/null; then
			fail "Missing SONAME in $lib"
		fi
	done
}

#
# wanboot specific checks
#
function wanboot_check()
{
	echo "Checking functions/symbols placed into separate sections"
	for libfile in $BUILD_DIR/$lib/*.a; do
		#
		# 'elfdump -c' displays section information for all
		# object files contained therein.
		#
		num=$( elfdump -c "$libfile" | grep 'text%' | wc -l )
		if (( num == 0 )); then
			fail "no text% sections in $libfile"
		fi
	done
}

# common checks
disallowed_check

if [[ $TYPE == "wanboot" ]]; then
	wanboot_check
else
	deprecated_check
	sx_check
	threads_check
	soname_check
fi
