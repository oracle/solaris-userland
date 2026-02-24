#!/usr/bin/sh
#
# Copyright (c) 2007, 2026, Oracle and/or its affiliates.
#

# smf_method(7) start/stop script required for server DNS

# Find the options directory property in the named.conf file.
# "options" directive should be near the beginning of named.conf,
# and "directory" property should be near top of "options".
# Immediate exit on any config file processing error.
# Unfortunately bind does not deliver a "getprop" type tool.
function named_dir
{
/usr/bin/python - ${1}<<'EOT'
import sys
try:
    conf = open(sys.argv[1], 'r').read()
    tokens = conf.split()
    depth = 0
    opti = tokens.index('options')
    tokens = tokens[opti+1:]
    for i in range(len(tokens)):
        t = tokens[i]
        if t == '{':
            depth += 1
        elif t.startswith('}'):
            depth -= 1
        if t == 'directory' and depth == 1:
            dir = tokens[i+1].split('"')[1]
            print(dir)
            sys.exit(0)
except Exception:
    pass
sys.exit(0)
EOT
}

. /lib/svc/share/smf_include.sh

result=${SMF_EXIT_OK}

# Read command line arguments
method="$1"		# %m
instance="$2" 		# %i

# Set defaults; SMF_FMRI should have been set, but just in case.
if [ -z "$SMF_FMRI" ]; then
    SMF_FMRI="svc:/network/dns/server:${instance}"
fi
server="/usr/sbin/named"
I=`/usr/bin/basename $0`

case "$method" in
'start')
    configuration_file=/etc/named.conf
    rndc_config_file=/etc/rndc.conf
    rndc_key_file=/etc/rndc.key
    rndc_cmd_opts="-a"
    cmdopts=""
    properties="debug_level ip_interfaces listen_on_port
	threads chroot_dir configuration_file server crypto_engine"
    obsolete="listener_threads"
    for prop in $properties $obsolete
    do
	value=`/usr/bin/svcprop -p options/${prop} ${SMF_FMRI}`
	if [ -z "${value}" -o "${value}" = '""' ]; then
	    # Could not find property or it has no value.
	    continue
	fi

	case $prop in
	'debug_level')
	    if [ ${value} -gt 0 ]; then
		cmdopts="${cmdopts} -d ${value}"
	    fi
	    ;;
	'ip_interfaces')
	    case ${value} in
		'IPv4')
		    cmdopts="${cmdopts} -4";;
		'IPv6')
		    cmdopts="${cmdopts} -6";;
		'all')
		    :	# Default is all, therefore ignore.
		    ;;
		*)
		    echo "$I: Unrecognised value in service instance property" >&2
		    echo "$I: options/${prop} : ${value}" >&2
		    ;;
	    esac
	    ;;
	'listen_on_port')
	    if [ ${value} -gt 0 ]; then
		cmdopts="${cmdopts} -p ${value}"
	    fi
	    ;;
	'threads')
	    if [ ${value} -gt 0 ]; then
		cmdopts="${cmdopts} -n ${value}"
	    fi
	    ;;
	'chroot_dir')
	    cmdopts="${cmdopts} -t ${value}"
	    chroot_dir=${value};
	    ;;
	'configuration_file')
	    cmdopts="${cmdopts} -c ${value}"
	    configuration_file=${value};
	    ;;
	'server')
	    set -- `echo ${value} | /usr/bin/sed -e  's/\\\\//g'`
	    server=$@
	    ;;
	'listener_threads')
	    if [ ${value} -gt 0 ]; then
		echo "$I: Obsolete property ignored:  BIND 9.20" >&2
		echo "$I: options/${prop} : ${value}" >&2
	    fi
	    ;;
	'crypto_engine')
	    # Use '' to specify an empty name.
	    cmdopts="${cmdopts} -E ${value}"
	    ;;
	esac
    done

    # If chroot option is set, note zones(5) are preferred, then
    # configuration file lives under chroot directory.
    if [ "${chroot_dir}" != "" ]; then
      configuration_file=${chroot_dir}${configuration_file}
      rndc_config_file=${chroot_dir}${rndc_config_file}
      rndc_key_file=${chroot_dir}${rndc_key_file}
      rndc_cmd_opts="${rndc_cmd_opts} -t ${chroot_dir}"
    fi

    # Check if the rndc config file exists.
    if [ ! -f ${rndc_config_file} ]; then
      # If not, check if the default rndc key file exists.
      if [ ! -f ${rndc_key_file} ]; then
        echo "$I: Creating default rndc key file: ${rndc_key_file}." >&2
        /usr/sbin/rndc-confgen ${rndc_cmd_opts}
        if [ $? -ne 0 ]; then
          echo "$I : Warning: rndc configuration failed! Use of 'rndc' to" \
		    "control 'named' may fail and 'named' may report further error" \
		    "messages to the system log. This is not fatal. For more" \
		    "information see rndc(8) and rndc-confgen(8)." >&2
        fi
      fi
    fi

    # Check configuration file exists.
    if [ ! -f ${configuration_file} ]; then
      msg="$I : Configuration file ${configuration_file} does not exist!"
      echo ${msg} >&2
      /usr/bin/logger -p daemon.error ${msg}
      # dns-server should be placed in maintenance state.
      result=${SMF_EXIT_ERR_CONFIG}
    fi

    # Verify writable directory specified in config file options.
    workdir=$(named_dir $configuration_file)
    if [ "${workdir}" != "" ]; then
            tmpdir=${chroot_dir}/${workdir}
    else
            tmpdir=${chroot_dir}
    fi
    if [ ! -w ${tmpdir} ]; then
        echo "Directory ${tmpdir} not writable by named." >&2
        echo "The options \"directory\" property may be missing or wrong." >&2
        smf_method_exit $SMF_EXIT_DEGRADED "bind_config_error" \
            "Directory ${tmpdir} not writable by named."
    fi

    if [ ${result} = ${SMF_EXIT_OK} ]; then
	echo "$I: Executing: ${server} ${cmdopts}"
	# Execute named(8) with relevant command line options.  Note
	# the server forks before reading named.conf(5) and so a
	# good exit code here does not mean the service is ready.
	${server} ${cmdopts}
	result=$?
	if [ $result -ne 0 ]; then
	  echo "$I : start failed! Check syslog for further information." >&2
        fi
    fi
    ;;
'stop')
	smf_kill_contract ${contract} TERM 1
	[ $? -ne 0 ] && exit 1
	;;
*)
	echo "Usage: $I [stop|start] <instance>" >&2
	exit 1
	;;
esac
exit ${result}
