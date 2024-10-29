Copyright (c) 2009, 2024, Oracle and/or its affiliates.

# Build layout

OpenSSL build is run multiple times:
  - once regular dynamic
  - once for static bits to link with standalone wanboot binary

All builds apart from static libraries for wanboot are done for 32 and 64 bits.
OpenSSL for wanboot is only built on SPARC.

See also comments in all the Makefiles for more information.

## The wanboot build

There are some significant differences when building OpenSSL for wanboot.

Some additional CFLAGS are needed:
  - `-DNO_SYSLOG` - syslog is not available in stand-alone environment
  - `-D_BOOT` - guard for wanboot specific patches

There is also whole bunch of configuration options used to trim the resulting
static libraries down space and feature wise.

wanboot build is done only in 64-bit mode on SPARC.

### Linking with wanboot

When linking with wanboot please pay attention to following pitfalls.

Correct OpenSSL header files need to be included. This is done in
`$ON/usr/src/Makefile.openssl-wanboot`

Extreme caution needs to be employed, if wanboot grew in size because of the
changes!
Wanboot is a statically linked standalone binary and it is loaded on a fixed
address before execution. This address is defined in
`$ON/usr/src/psm/stand/boot/sparc/common/mapfile`:

```
	LOAD_SEGMENT text {
		FLAGS = READ EXECUTE;
		VADDR = 0x130000;
		ASSIGN_SECTION {
			TYPE = PROGBITS;
			FLAGS = ALLOC !WRITE;
		};
	};
```

The `VADDR` address **needs to be greater than** the size of wanboot binary + 0x4000

The reason for this is in how wanboot is loaded by OpenBoot Prom:
  1. user initiates boot from network - `boot net`
  2. OBP loads wanboot binary at address 0x4000
  3. OBP parses ELF header, reads virtual address where to load wanboot to
  4. OBP mem-copies `.text` section to this address
  5. OBP copies .data section behind .text
  6. OBP starts executing wanboot at entry address

If the given address is too small, OBP overwrites part of `.data` section with
instructions from `.text` section in step 4. resulting in `.data` section being corrupted.
Initialized variables get bogus values and failure is inevitable.
This is very hard to troubleshoot.


### Testing wanboot with new OpenSSL

With every upgrade of OpenSSL, it is necessary to make sure wanboot builds and
works well with the new bits.

Provided you have a freshly built ON and Userland (UL) workspace, you can link wanboot
with new OpenSSL wanboot bits as follows:

```
    # prepare to rebuild wanboot
    cd $ON/usr/src/psm/stand/boot/sparcv9/sun4

    # hack to force a rebuild (assuming non-DEBUG bits)
    touch $ON/data/build.sparc-nd/usr/src/psm/stand/boot/sparcv9/sun4/wanboot.o

    # build a wanboot binary
    build -iD dmake all OPENSSL_WANBOOT_BASEDIR=$UL/components/openssl/wanboot/build/prototype/sparc/usr/openssl/3/wanboot
```

wanboot should build without warning.

Next, rebuild and run the wanboot unit tests from the test/wanboot-test package.

Finally, the resulting wanboot binary shall be deployed on an install server and
wanbooting from this server shall be tested. Specifically, the wanboot loader
should be able to successfully download miniroot over TLS.
