Copyright (c) 2022, Oracle and/or its affiliates.

# BIND notes.

These notes are for engineering only.  They are not distributed with
the packaging but are available with the source code.

## BIND compatibility

BIND 9 configuration (named.conf) during a micro version update should
remain compatible.  And indeed for the most part between minor version
updates too; some features might no longer work but the keywords are
ignored.

BIND source has three major branches, Stable, Extended Support, and
development. As of BIND 9.13, the minor odd number is the Development
version which may receive new features at each micro version.  While
even numbered version remain stable, receiving only bug fixes and no
new features.

The three current branches are

- 9.16.x Extended Support Version.
- 9.18.x Stable version, including OpenSSL 3.0 support.
- 9.19.x Development version

## Packaging

- bind.p5m (pkg:/service/network/dns/bind)
- bindc.p5m (pkg:/network/dns/bind)

### bind.p5m - Server package

Provides BIND server (in.named), server specific tools, and SMF
features.

When the BIND server package is updated it logs a short note as the
full instructions are rather long.
The short note is located in ./Solaris/bind-notice.txt,
which following an update is also viewable
via `pkg history` command.
The source of the longer note is in ./Solaris/bind-transition.txt.

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
./Solaris/testing.ksh.

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

For example

1. Create tar ball of build and source directory.

	```
	$ cd $(hg root)/components/bind
	$ pwd
	/builds/user/workspace/components/bind
	$ tar zcf ~/test.tar.gz build bind-9.16.29
	$
	```

2. ON your test machine, create directory structure to mimic that of
   the build machine.

	```
	$ WS=/builds/user/workspace
	$ sudo mkdir -p $WS
	$ sudo chown user $WS
	$ mkdir -p $WS/components/bind
	```

3. Unpack tar ball from build machine

	```
	$ cd $WS/components/bind
	$ tar zxf ~/test.tar.gz
	```

4. Change to architecture directory, configure the interfaces.

	```
	$ cd build/amd64 || cd build/sparcv9
    $ sudo bin/tests/system/ifconfig.sh up
	```

5. Set PATH so that GNU utilities are used, and execute test.

	```
    $ PATH=/usr/gnu/bin:/usr/bin:/usr/sbin; export PATH
    $ gmake test
	```

The tests may take some hours to complete.  They write a summary
report to ./bin/tests/system/systests.output.  A helper script in
./Solaris/test-summarize.awk can help examine the summary report.

### Skipped tests

Some of tests require additional software to be installed, such as
`dnspython` and Perl modules `Net::DNS` and `Digest-HMAC`.

Currently a total of four tests are skipped which rely on options not
currently configured:

```
$ awk -v skipped=1 -f $WS/components/bind/Solaris/test-summarize.awk \
> ./bin/tests/system/systests.output
T:dlz:1:A
A:dlz:System test dlz
I:dlz:PORTRANGE:7100 - 7199
I:dlz:DLZ filesystem driver not supported
I:dlz:Prerequisites missing, skipping test.
R:dlz:SKIPPED

T:eddsa:1:A
A:eddsa:System test eddsa
I:eddsa:PORTRANGE:5300 - 5399
I:eddsa:This test requires support for EDDSA cryptography
I:eddsa:configure with --with-openssl, or --enable-native-pkcs11 --with-pkcs11
I:eddsa:This test requires support for EDDSA cryptography
I:eddsa:configure with --with-openssl, or --enable-native-pkcs11 --with-pkcs11
I:eddsa:Prerequisites missing, skipping test.
R:eddsa:SKIPPED

T:geoip2:1:A
A:geoip2:System test geoip2
I:geoip2:PORTRANGE:8300 - 8399
I:geoip2:This test requires GeoIP support.
I:geoip2:Prerequisites missing, skipping test.
R:geoip2:SKIPPED

T:nzd2nzf:1:A
A:nzd2nzf:System test nzd2nzf
I:nzd2nzf:PORTRANGE:10500 - 10599
I:nzd2nzf:This test requires LMDB support (--with-lmdb)
I:nzd2nzf:Prerequisites missing, skipping test.
R:nzd2nzf:SKIPPED


tests=104 skip=4 known=0 pass=100 issue=4

```
