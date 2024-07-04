Copyright (c) 2022, 2024, Oracle and/or its affiliates.

# BIND notes.

These notes are for engineering only.  They are not distributed with
the packaging but are available with the source code and publicly
available on Github
https://github.com/oracle/solaris-userland/blob/master/components/bind/README.md

## BIND compatibility

BIND 9 configuration (named.conf) during a micro version update should
remain compatible.  And indeed for the most part between minor version
updates too; some features might no longer work but the keywords are
ignored.

BIND source has three major branches, Stable, Extended Support Version
(ESV), and development. As of BIND 9.13, the minor odd number is the
Development version which may receive new features at each micro
version.  While even numbered version remain stable, receiving only
bug fixes and no new features.

The three current branches are, from https://www.isc.org/download/ :

- 9.16.x EOL - April 2024
- 9.18.x Current-Stable, ESV, including OpenSSL 3.0 support.
- 9.19.x Development version

## Packaging

- bind.p5m (pkg:/service/network/dns/bind)
- bindc.p5m (pkg:/network/dns/bind)

### bind.p5m - Server package

Provides BIND server (in.named), server specific tools, and SMF
features.

When the BIND server package is updated, using pkg(1) command, it logs
a short note as the full instructions are rather long.  The short note
is located in ./Solaris/bind-notice.txt, which following an update is
also viewable via `pkg history` command.  The source of the longer
note is in ./Solaris/bind-transition.txt.

The short note is delivered as
usr/share/doc/release-notes/bind-update.txt, and includes attribute
*self@$(IPS\_COMPONENT\_VERSION)* causing it to be displayed when the
component version is incremented.

By specifying the version as IPS\_COMPONENT\_VERSION the
release-note will correctly be applied when BIND component is
updated, and COMPONENT\_VERSION is modified in Makefile.  As
updates do not have to be applied incrementally it is not possible
to use the version as a definitive comparison to the
compatibility.

### bindc.p5m - Client Package

Provides DNS tools, utilities, manual pages and libraries.


## Testing

### Makefile testing

`gmake test` runs a very simple set of tests by executing
./Solaris/testing.ksh.  This is really just to confirm the common
commands have built and linked correctly.

`gmake test-version` Runs `named -V` which shows its version number
and additional library, compiler, and configuration information.

### Full testing

To run the full testing provided by BIND the machine needs to be
configured with a dozen or so loop-back IP addresses in the 10.53.x.y
range.  A script is provided to configure those addresses but you
obviously need root access (or sufficient privileges) to add those.
It is possible therefore to run the test where you have root access,
either on your own build machine or a suitably configured machine
where you have re-created the build machines directory structure and
copied "build" and the source directory over.

Note that these tests will not run when executed by root.

For example

1. Create tar ball of build and source directory and copy to shared
   location as necessary.

	```
	$ cd $(hg root)/components/bind
	$ pwd
	/builds/user/workspace/components/bind
	$ gmake test-tar
	/usr/bin/tar zcf test.bind-9.18.27.i386.tar.gz build bind-9.18.27
	created test.bind-9.18.27.i386.tar.gz
	unpack into identical directory name on test machine:
	/builds/user/workspace/components/bind
	$ cp test.bind-*.tar.gz ~/.
	```

2. ON your test machine, create directory structure to mimic that of
   the build machine.

	```
	$ WS=/builds/user/workspace
	$ sudo mkdir -p $WS
	$ sudo chown $USER $WS
	$ mkdir -p $WS/components/bind
	```

3. Unpack tar ball from build machine

	```
	$ cd $WS/components/bind
	$ tar zxf ~/test.bind-*.`uname -p`.tar.gz
	```

4. Change to architecture directory, configure the interfaces.

	```
	$ cd build/amd64 || cd build/sparcv9
	$ cd bin/tests/system
	$ sudo ./ifconfig.sh up
	```

5. Set PATH so that GNU utilities are used, unset http\_proxy, and
   confirm required packages are installed.

	```
	$ PATH=/usr/gnu/bin:/usr/bin:/usr/sbin; export PATH
	$ unset http_proxy
	```

    Ensure required packages and GNU utilities are installed.  Version
    of gcc must match that used on build machine; check Makefile.  For
    example:

	```
	pkgs=library/python/dnspython
	grep '^CC = ' Makefile | read var sym cmd rest
	ver=${cmd#/usr/gcc/};ver=${ver%%/*}
	test -x $cmd || pkgs="$pkgs developer/gcc/gcc-c-$ver"
	test -x /usr/gnu/bin/make || pkgs="$pkgs developer/build/gnu-make"
	test -x /usr/bin/pytest || library/python/pytest
	test -x /usr/gnu/bin/tar || pkgs="$pkgs archiver/gnu-tar"
	test -x /usr/gnu/bin/sed || pkgs="$pkgs text/gnu-sed"
	test -x /usr/gnu/bin/find || pkgs=$pkgs file/gnu-findutils"
	test -x /usr/gnu/bin/grep || pkgs=$pkgs text/gnu-grep"
	sudo pkg install $pkgs
	```

6. Optionally obtain and install Perl modules

	Some tests require Perl modules `Net::DNS` and `Digest-HMAC`.
	Without these additional tests are skipped.

	Following assumes modules have been obtained and saved to ~/tmp.

	```
	LOC=/var/tmp/bindtest
	# PERL5LIB affects install location and @INC
	PERL5LIB=$LOC/perlmodules
	export PERL5LIB
	mkdir -p $PERL5LIB

	mark=$PWD
	# Install Digest-HMAC and Net::DNS perl module
	cd $LOC
	cp ~/tmp/Digest-HMAC-1.04.tar.gz .
	gtar zxf Digest-HMAC-1.04.tar.gz
	cd Digest-HMAC-1.04
	/usr/perl5/bin/perlgcc Makefile.PL LIB=$PERL5LIB PREFIX=$PERL5LIB
	/usr/sfw/bin/gmake MAKE=/usr/sfw/bin/gmake
	/usr/sfw/bin/gmake MAKE=/usr/sfw/bin/gmake test
	/usr/sfw/bin/gmake MAKE=/usr/sfw/bin/gmake install
	cd ..
	cp ~/tmp/Net-DNS-1.33.tar.gz .
	gtar zxf Net-DNS-1.33.tar.gz
	cd Net-DNS-1.33
	/usr/perl5/bin/perlgcc Makefile.PL LIB=$PERL5LIB PREFIX=$PERL5LIB
	/usr/sfw/bin/gmake MAKE=/usr/sfw/bin/gmake
	/usr/sfw/bin/gmake MAKE=/usr/sfw/bin/gmake test
	/usr/sfw/bin/gmake MAKE=/usr/sfw/bin/gmake install
	cd $mark
	```

7. Optionally run all tests, individual test, or a bunch of tests by
   naming them on the command line:

   ```
   $ /usr/bin/pytest
   ```

   or

   ```
   $ /usr/bin/pytest doth acl addzone
   ```

  See `/usr/bin/pytest -h` for additional options, such as `--last-failed`


*The tests may take some hours to complete.*

For further information regarding these tests refer to README in
bin/tests/system directory.

### Skipped tests

Some of tests require additional software to be installed, such as
`dnspython` and Perl modules `Net::DNS` and `Digest-HMAC`.

With those packages and modules installed (as per instructions above)
there are a dozen or so skipped tests at this time:

- wildcard/tests_wildcard.py:42: could not import 'hypothesis': No module named 'hypothesis'
- rpz/tests_sh_rpz_dnsrps.py:17: dnsrps disabled in the build
- rpzrecurse/tests_sh_rpzrecurse_dnsrps.py:17: dnsrps disabled in the build
- timeouts/tests_tcp_timeouts.py:215: CI_ENABLE_ALL_TESTS not set
- timeouts/tests_tcp_timeouts.py:249: CI_ENABLE_ALL_TESTS not set
- dnstap/tests_dnstap.py:37: Prerequisites missing.
- dnstap/tests_sh_dnstap.py:13: Prerequisites missing.
- doth/tests_sslyze.py:60: sslyze not found in PATH
- doth/tests_sslyze.py:64: sslyze not found in PATH
- enginepkcs11/tests_sh_enginepkcs11.py:13: Prerequisites missing.
- geoip2/tests_sh_geoip2.py:13: Prerequisites missing.
- keyfromlabel/tests_sh_keyfromlabel.py:13: Prerequisites missing.
- nzd2nzf/tests_sh_nzd2nzf.py:13: Prerequisites missing.

### Failed tests

On amd64 platform seeing `fetchlimit` test fail.
