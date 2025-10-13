#!/usr/bin/bash
# Copyright (c) 2019, 2025, Oracle and/or its affiliates.
#
# Written to be compatible with Solaris 10.
testname=""

function usage
{
    # Display usage
    echo "
usage ${I##*/} -d directory -p PROTO_DIR
        [-X] [-b bind-port] [-r rndc-port]

Creates a simple named(8) configuration and tests some features.
Ideally this will be expanded over time.

Written for use by Userland's tested-and-compared feature.

Required Options:
    -d directory    Path where BIND files will be read/written.
    -p directory    Root of command path i.e. '/' or $PROTO_DIR

Optional options:
    -b bind-port    Port named will listen on for requests. [$bind_port_d]
    -k              Run keygen test on various ciphers.
    -r rndc_port    Port named will listen on for control [$rndc_port_d]
    -I              Include Internationalized Domain Name test
    -X              Debug
    -?              Display this usage
"
}

function newdir
{
    # Create a new directory if it does not already exist.
    # Exits shell on error.
    typeset directory=$1
    if [[ ! -d $directory ]]; then
	/usr/bin/mkdir -p $directory || ret=$?
	if [[ $ret -ne 0 ]]; then
	    e "Failed to create configuration directory: $directory: $ret"
	    exit $ret
	fi
    fi
}
function e
{
    # e is for error. print to FD2 (standard error).
    echo $@ >&2
}
function t
{
    # t is for title. Saves line to testname for use in result().
    testname=$@
    echo TEST: $@
}

function d
{
    # d is for display.
    echo $@
}

function result {
    # Display result of command, expected result and testname.
    # Thus parsing output for '^RESULT:' provides summary of results.
    if (( $1 != $2 )); then
	e "RESULT: $1 (UNEXPECTED): $testname"
    else
	e "RESULT: $1: $testname"
    fi
    d '====================================================================='
    return $1
}

function run
{
    # Display command, execute it and call result() with exit code.
    typeset -i ret
    typeset -i exp=0
    if [[ $1 == "-e" ]]; then
	exp=$2
	shift 2
    fi
    typeset cmd=$1
    shift
    d "RUNNING: $cmd $@"
    $cmd $@
    ret=$?
    result $ret $exp
    return $ret
}

# Main procedure.
typeset -r I=${0}	# Name of this script.
typeset -i ret=0	# Return code.
bind_port_d=5353	# Default DNS port to be used.
rndc_port_d=8953	# Default RNDC port to be used.
bind_port=$bind_port_d	# Configurable DNS port via -b option.
rndc_port=$rndc_port_d	# Configurable RNDC port via -r option.
typeset -i fail=0	# Tally of failures seen.
typeset -i t=0		# loop counter.

# Thou shall not use PATH.
grep=/usr/bin/grep
ldd=/usr/bin/ldd
mktemp=/usr/bin/mktemp
rm=/usr/bin/rm
sort=/usr/bin/sort

# Read command line arguments.
while getopts :b:d:kp:r:r:IX opt; do
    case $opt in
	(b) bind_port=$OPTARG;;
	(d) directory=$OPTARG;;
	(k) opt_k=$opt;;
	(p) PROTO=$OPTARG;;
	(r) rndc_port=$OPTARG;;
	(I) idn_test=$opt;;
	(X) set -xT;;
	(?) usage; exit 0;;
    esac
done
shift $((OPTIND - 1))	# Skip over option arguments

if [[ -z $directory || -z $PROTO ]]; then
    usage; exit 2
fi

# Create directories as needed.
newdir $directory
if [[ ! -f $runlog ]]; then
    dir=${runlog%/*}
    if [[ -n $dir && ! -d $dir ]]; then
	newdir $dir
    fi
fi

# Command locations, historically most admin commands were in /usr/sbin.
# But some have moved, and while packaging adds in static links that is
# deliberatly not the case for prototype area.
#
# Commands used with `run` that have a dash in there name are kwnow by
# the last part of there name, for example named-checkconf becomes ${checkconf}.

# Set command paths from provided PROTO.
SBIN=${PROTO%*/}/usr/sbin
BIN=${PROTO%*/}/usr/bin
commands="dig named named-checkconf rndc dnssec-keygen"

for command in $commands; do
    if [[ -x ${BIN}/${command} ]]; then # Most are in /usr/bin now
	eval ${command#*-}=${BIN}/${command}
    elif [[ -x ${SBIN}/${command} ]]; then # Some remain in /usr/sbin
	eval ${command#*-}=${SBIN}/${command}
    else
	e "$command missing!"
	(( fail++ ))
    fi
done
(( fail > 0 )) && exit $fail

# set LD_LIBRARY_PATH only when PROTO is not root, and not already set.
if [[ ${PROTO} != '/' && -z $LD_LIBRARY_PATH ]]; then
    if [[ -d ${PROTO}/usr/lib/dns ]]; then
	# Backward compatibility, same test script used for a previous release.
	export LD_LIBRARY_PATH_32=${PROTO}/usr/lib/dns
	[[ $(uname -p) = 'sparc' ]] && MACH64=sparcv9 || MACH64=amd64
	export LD_LIBRARY_PATH_64=${PROTO}/usr/lib/dns/${MACH64}
    else
	e "Warning: Library directory not found: ${PROTO}/usr/lib/dns"
    fi
else
    e "Notice: LD_LIBRARY_PATH not being overridden: $LD_LIBRARY_PATH"
fi

if tmp=$($mktemp); then
    t Checking linkage
    d "Running: $ldd ${named}"
    $ldd ${named} >$tmp
    result $? 0
    if $grep '(file not found)' $tmp; then
	e "linking error!  Abort!"
	rm $tmp
	exit 1
    else
	rm $tmp
    fi
else
    e "$mktemp failed! linking check skipped! $?"
fi

# Discover name servers and domain name from resolv.conf
resconf=/etc/resolv.conf
d "Reading domain and nameservers from $resconf."
servercount=0
while read cmd value rest; do
    case $cmd in
	(domain|search): :
		domain=$value	# Compatible with resolver, last one counts.
		;;
	(nameserver): :
		nameservers="${nameservers}${value}; "
		(( servercount+=1 ))
		;;
    esac
done < $resconf

# If servercount is less than three could query server for others, i.e.
# dig ns $domain.

# Check domain and nameservers read.
if [[ -z $domain ]]; then
    e "domain not set in $resconf"
    (( fail++ ))
fi
if [[ -z $nameservers ]]; then
    e "no nameservers found in $resconf"
    (( fail++ ))
fi
(( fail > 0 )) && exit $fail

d "REDACT: Using domain name : $domain"
d "REDACT: Using nameservers : $nameservers"

# Create named.conf file
named_conf=${directory:+$directory/}named.conf
echo "
acl \"loopback\" { 127.0.0.1; };
options {
	${directory:+directory \"${directory}\";} // working directory
	pid-file \"named.pid\";                   // pid file in working dir.
	forward only;
	forwarders { $nameservers };
	check-names master ignore;
//	allow-query { \"loopback\" };
};

logging {
	channel \"an_example_channel\" {
		file \"example.log\" versions 3 size 20m;
		print-time yes;
		print-category yes;
	};

	category \"default\" { \"an_example_channel\"; \"default_debug\"; };
};



// Be authoritative for example.com
zone \"example.com\" {
	type master;
	file \"example.com.zone\";
	allow-transfer { any; };
};

// All servers should master loopback zones
zone \"0.0.127.in-addr.arpa\" in {
	type master;
	file \"localhost.zone\";
};

" > ${named_conf}

server=$(uname -n).${domain}.
email='root'.${server}
# keep serial number simple.
serial=20
# Create localhost zone.
echo "
\$TTL 2D
0.0.127.IN-ADDR.ARPA.   IN      SOA     ${server} ${email} (
                                                ${serial} ; Serial
                                                3600       ; Refresh
                                                300        ; Retry
                                                3600000    ; Expire
                                                14400 )    ; Negative TTL
                        IN      NS      localhost.
1                       IN      PTR     localhost.
" > ${directory:+$directory/}localhost.zone
# Create example.com zone
echo "
\$TTL 2D
example.com. IN    SOA     ${server} ${email}  (
                                ${serial}      ; Serial
                                3600            ; Refresh
                                300             ; Retry
                                3600000         ; Expire
                                5m )            ; Negative TTL

                        IN      NS      ${server}

xxx			IN      A       192.168.0.1
			IN      TXT     \"text for xxx.example.com\"

ipv4			IN	A	192.168.4.1
ipv6			IN	AAAA	fd10:45df:879f:661d:0::1
ipboth			IN	TXT	\"Both IP address types\"
ipboth			IN	A	192.168.4.10
ipboth			IN	AAAA	fd10:45df:879f:661d:0::10

manny.sub.example.com.	IN      A       192.168.7.11
			IN	TXT	\"Manny has alias of jack.\"
jack.sub.example.com.	IN      CNAME   manny.sub.example.com.
mo.bar.example.com.	IN      A       192.168.5.17
dname.example.com.		IN      DNAME   sub.example.com.

" > ${directory:+$directory/}example.com.zone

if [[ -n $idn_test ]]; then
    # Punycode names created using python thus:
    # python3 -c 'print("casaè".encode("idna").decode("utf8"))'
    # python3 -c 'print("münchen".encode("idna").decode("utf8"))'
    echo "
; IDN testing
xn--mnchen-3ya		IN	A	192.168.20.1
xn--casa-8oa		IN	A	192.168.20.2
" >> ${directory:+$directory/}example.com.zone
fi

t "Verifying initial named.conf file."
run ${checkconf} -z ${named_conf} || ret=$?
if [[ $ret -ne 0 ]]; then
    e "Error: named-checkconf returned with non-zero exit code: $ret"
    exit $ret
fi

# Add key and control information to named.conf
#
# Originally ran rndc-confgen to generate a unique config and massaged
# it into named.conf.  But it is just as wise to write direct.
rndc_conf=${directory:+$directory/}rndc.conf
key_value='LydFuYW4OBuN26vWfyMnhQ=='
key_name='rndc-key'
echo "
key \"${key_name}\" {
      algorithm hmac-md5;
      secret \"${key_value}\";
};

controls {
      inet 127.0.0.1 port ${rndc_port}
              allow { 127.0.0.1; } keys { \"${key_name}\"; };
};
" >> ${named_conf}
# Write rndc.conf file with key and options.
echo "
key \"${key_name}\" {
        algorithm hmac-md5;
        secret \"${key_value}\";
};

options {
        default-key \"${key_name}\";
        default-server 127.0.0.1;
        default-port ${rndc_port};
};
" > ${rndc_conf}

t "Verifying configuration after key and controls added."
run ${checkconf} -z ${named_conf}

t "starting DNS server"
run ${named} -c ${named_conf} -p ${bind_port}

d "checking for pid file"
for (( t=0; t < 5; t++ )); do
    if [[ -f $directory/named.pid ]]; then
	pid=$(<$directory/named.pid)
	d "read named.pid"
	break
    else
	sleep 1
    fi
done
if [[ -z $pid ]]; then
    e 'failed to read named.pid'
    # carry on regardless
fi

t "Turning on tracing"
run ${rndc} -c ${rndc_conf} trace 3

t "Look-up IPv4 (A) record"
run ${dig} @0 -p ${bind_port} -t A ipboth.example.com.

t "Look-up IPv6 (AAAA) record"
run ${dig} @0 -p ${bind_port} -t AAAA ipboth.example.com.

# The order of returned records keeps changing, so sort the output for these
# as only interested in confirming the expected records are present.
if tmp=$($mktemp); then
    t "Look-up known (ANY) records"
    d "Running: ${dig} @0 -p ${bind_port} -t ANY ipboth.example.com. |SORT"
    ${dig} @0 -p ${bind_port} -t ANY ipboth.example.com. > $tmp
    ret=$?
    $grep -v '^;' $tmp | $sort | $grep -v '^$'
    result $ret 0
    t "Request zone transfer (axfr)"
    d "Running: ${dig} @0 -p ${bind_port} -t axfr example.com. |SORT"
    ${dig} @0 -p ${bind_port} -t axfr example.com. > $tmp
    ret=$?
    $grep -v '^;' $tmp | $sort | $grep -v '^$'
    result $ret 0
    $rm $tmp
else
    e "$mktemp failed! tests skipped! $?"
fi

# Internationalized Domain Names test.
if [[ -n $idn_test ]]; then
    if [[ -n $LC_ALL ]]; then
	# shared-macros.mk sets LC_ALL=C which env(1) passes through.
	# If left that way then test 1 and 2 here fail.  So set it to
	# C.UTF8 as seen in prep-unpack.mk, and these tests work.
	saved_lc=$LC_ALL
	LC_ALL="C.UTF-8"
    fi
    t "IDN test 1/4: dig +idn casaè.example.com."
    run ${dig} @0 -p ${bind_port} -t A +idn "casaè.example.com."
    # An example without +idn option.
    t "IDN test 2/4: dig münchen.example.com."
    run ${dig} @0 -p ${bind_port} -t A münchen.example.com.
    t "IDN test 3/4: dig +idn xn--casa-8oa.example.com."
    run ${dig} @0 -p ${bind_port} -t A +idn xn--casa-8oa.example.com.
    t "IDN test 4/4: dig xn--mnchen-3ya.example.com."
    run ${dig} @0 -p ${bind_port} -t A xn--mnchen-3ya.example.com.
    if [[ -n $saved_lc ]]; then
	LC_ALL=$saved_lc
    fi
fi

t "looking up host known to have DNAME"
run ${dig} @0 -p ${bind_port} -t a jack.dname.example.com.

t "Requesting status, output to $directory/rndc_status"
run ${rndc} -c ${rndc_conf} status > $directory/rndc_status

t "Requesting dump of server's caches and zones"
run ${rndc} -c ${rndc_conf} dumpdb -all

t "Requesting BIND to stop"
run ${rndc} -c ${rndc_conf} stop

# Wait for upto five seconds for server to shutdown.
if [[ -n $pid && -f $directory/named.pid ]]; then
    for (( t=0; t < 5; t++ )); do
	if [[ -f $directory/named.pid ]]; then
	    sleep 1 # Give it a second to shutdown...
	else
	    break
	fi
    done
fi

d "REDACT: $directory/named.pid counter $t"

t "Requesting status - should fail as server has stopped."
run -e 1 ${rndc} -c ${rndc_conf} status

# Make sure named has exited.
if [[ -n $pid && -f $directory/named.pid ]]; then
    sleep 1 # Give it a second to die...
    if [[ -f $directory/named.pid ]]; then
	e "Warning: named still running, sending SIGTERM to $pid"
	ps -lp $pid | $grep named && kill $pid
    fi
fi

# basic dnssec-keygen test
# Create temporary directory to avoid collisions with other users and to
# clean up afterward.
if [[ -n $opt_k ]]; then
    if ! tmp=$($mktemp -d); then
	ret=$?
	e "Error: failed to create temporary directory for dnsssec-keygen tests"
    else
	# Following algorithums taken from the dnssec-keygen(8) manual page
	imps="RSASHA1 NSEC3RSASHA1 RSASHA256 RSASHA512 ECDSAP256SHA256"
	imps="$imps ECDSAP384SHA384 ED25519 ED448"
	# tests expected to pass (OpenSSL 3)
	for i in $imps; do
	    t "keygen $i"
	    run ${keygen} -K $tmp -q -a $i -n ZONE -fk secure.example
	done
	$rm -rf $tmp
    fi
fi

exit $ret
