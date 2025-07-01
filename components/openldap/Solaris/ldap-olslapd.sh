#!/usr/bin/sh
# -*- mode: shell-script; sh-shell: ksh93 -*-
# Copyright (c) 2007, 2025, Oracle and/or its affiliates.
#
# DEBUG.  Set for example using setenv
#    svccfg -s network/ldap/server:openldap setenv -i DEBUG log
#    svcadm refresh network/ldap/server:openldap
# When done remove setting
#    svccfg -s network/ldap/server:openldap unsetenv -i DEBUG
#    svcadm refresh network/ldap/server:openldap
#
# Values used within this script, listed in usefulness order, are:
#
# - log	Log extra output, useful for first pass debugging.
# - server	Add `-d 1` to slapd start arguments.  Will be noisy,
#               use only while investigating startup issues.
# - config      Add `-d 1` to ldapservercfg command.
# - trace	Trace main body only, no functions.  Use rarely.
# - functions	Trace all functions.  Use rarely
#
if [[ $DEBUG =~ 'trace' ]]; then
    set -x
    PS4='$(date +%Y\ %b\ %e\ %H:%M:%S):${.sh.file}:$LINENO+ '
fi
if [[ $DEBUG =~ 'functions' ]]; then
    trace_funcs=trace_func
    PS4='$(date +%Y\ %b\ %e\ %H:%M:%S):${.sh.file}:$LINENO+ '
    function trace_func
    {
	# Turns on tracing of known functions.
	# Therefore needs to be executed once functions have been sourced!
	typeset -ft $(typeset +f)
    }
else
    trace_funcs='debug tracing functions off'
fi
if [[ $DEBUG =~ 'log' ]]; then
    DEBUG_LOG=true
fi
function debug
{
    # Only call logit if DEBUG_LOG set.
    if [[ -n $DEBUG_LOG ]]; then
	logit "debug: $@"
    fi
}
function logit
{
    # All output is directed to SMF log file, this simply adds the
    # date as per SMF standard; YYYY MMM dd hh:mm:ss.
    now=$(date '+%Y %b %e %H:%M:%S')
    echo "[ $now $IAM: $@ ]" >&2
}
function error
{
    logit "Error: $@"
}

source /lib/svc/share/smf_include.sh
SMF_PROPERTIES_COMPOSED='-c'

typeset -r IAM=${0##*/}
typeset -r LDAPUSR=openldap
typeset -r LDAPGRP=openldap

# OpenLDAP commands
typeset -r SLAPD="/usr/lib/slapd"
typeset -r SLAPD_CMD="${SLAPD} -u ${LDAPUSR} -g ${LDAPGRP}"

# Files and directories
typeset -r CONF_FILE=/etc/openldap/slapd.conf
typeset -r CONF_DIR=/etc/openldap/slapd.d
typeset -r DATA_DIR=/var/openldap/openldap-data
typeset -r DATA_MDB=$DATA_DIR/data.mdb
typeset -r DATA_BDB=$DATA_DIR/id2entry.bdb
typeset -r VERSION_FILE=$DATA_DIR/sunw_version
typeset -r VERSION_DOC=/usr/share/doc/release-notes/openldap-transition.txt
# The default SECKEY is hardcoded as privilege `file_dac_read` is
# required to read it. That privilege is granted from the manifest
# (ldap-olslapd.xml) which starts this script, and hence we already
# had to hard-code it there.  Besides this script would need
# authorization `solaris.smf.read.identity` to read from
# svc:/system/identity:cert property `certificate/cert/private_key/uri`;
# all of which is far too much control for this purpose.
typeset -r SECKEY=/etc/certs/localhost/host.key

# ldapservercfg
typeset -r LDAPSERVERCFG="/usr/sbin/ldapservercfg"
typeset -r DO_LDAPSERVERCFG="pfexec ${LDAPSERVERCFG} -a openldap"
typeset -r LDAP_SMF_FMRI=svc:/network/ldap/server:openldap
typeset -r CERT_SMF_FMRI=svc:/network/ldap/identity:openldap

integer USE_CONF_DIR=0

# Variables used by read_config
typeset -A DIRECTORY	# Array of directory paths indexed by database type.
typeset TLS_MIN		# TLSProtocolMin value for verification.

function slapd_conf_configured
{
	# Verify that slapd.conf is configured for mdb database and not bdb.
	# returns:
	# 1   : when configured for mdb, or other database type.
	# 0   : Upon failure to read configuration file.
	# 255 : when configured for bdb
	#
	if ! read_config_file; then
		return 0
	fi
	# Check TLSProtocolMin value
	if [[ $TLS_MIN == +([0-9]) ]]; then
		logit "Warning: detected old TLSProtocolMin format in slapd.conf!"
	fi

	if [[ -n ${DIRECTORY[bdb]} ]]; then
		error 'slapd.conf configured for BerkeleyDB'
		return 255
	fi
	if [[ -n ${DIRECTORY[mdb]} ]]; then
		# slapd.conf is configured for mdb, check database exists
		if [[ -d ${DIRECTORY[mdb]} ]];then
			for file in "${DIRECTORY[mdb]}"/*.mdb; do
				if [[ -f $file ]]; then
					debug 'slapd.conf using mdb database' \
					      ${DIRECTORY[mdb]}
					return 1
				fi
			done
		fi
		debug 'slapd.conf using mdb, but missing database' \
		      ${DIRECTORY[mdb]}
		# One will be created by ldapservercfg.
		return 0
	else
		logit 'Notice: slapd.conf not configured for mdb.'
	fi
	# Server may be using some other DB such as shell.
	debug 'Will attempt to start server.'
	return 1
}

function check_ldap_configuration
{
	# Checks slapd.d directory first, as ldapservercfg(8) uses
	# slaptest(8) to create configuration there.  However,
	# slapd may have been configured manually (not by
	# ldapservercfg) and therefore maybe using an alternative
	# backend DB type, for example ldif, ldap, meta or mdb.
	#
	# Strategy:
	# If the configuration still includes BDB setup then it is an error.
	# If the configuration includes a slapd.d, then LDAP is already setup.
	# If slapd.conf is missing mdb, then it is a non-standard configuration.
	#
	# Returns:
	# 255 - Bad configuration (DB not supported)
	# 0   - no configuration
	# 1   - already configured

	integer db_type_code=0

	if [[ -d ${CONF_DIR} && -f ${CONF_DIR}/cn\=config.ldif ]] ; then
		# Looks like Server is configured using slapd.d
		# Check to see if it has old BDB configuration
		if [[ -f ${CONF_DIR}/cn\=config/*bdb.ldif ]] ; then
			error '$CONF_DIR configured for BerkeleyDB'
			db_type_code=255
		else
			USE_CONF_DIR=1
			db_type_code=1
		fi
	elif [[ -f ${CONF_FILE} ]] ; then
		slapd_conf_configured
		db_type_code=$?
	fi

	if (( $db_type_code == 1 )); then
		# slapd is configured.  Check version is compatible.
		version_check
		if (( $? == 255 )); then
			db_type_code=255
		fi
	fi
	return $db_type_code
}

function version_update
{
	# Overwrite version file with the current version.
	# Only use if you know what your doing.
	# Log what's happening to the SMF log.
	logit "Notice: writing SLAPD version to $VERSION_FILE"
	if [[ -f ${VERSION_FILE} ]]; then
		echo "Previous version found in file:"
		head ${VERSION_FILE} | cat -tn
	fi
	${SLAPD} -VV 2>${VERSION_FILE}
	if [[ -r ${VERSION_FILE} ]]; then
		echo "New version written to file:"
		head ${VERSION_FILE} | cat -tn
	else
		error "writing version file!"
	fi
}

function version_check
{
	# Check for installed version against database version.
	#
	# When no version file exists then call database_seed
	# and if suitable create version file. Otherwise report error.
	# Returns 255 for bad version, 0 on matched version and 1 for
	# an acceptable version.
	integer version_code=0
	typeset -r tmp_file=$(mktemp)

	# Write out current version file for comparison and parsing.
	${SLAPD} -VV 2>$tmp_file
	curvers=$(grep 'OpenLDAP: slapd' $tmp_file | cut -d" " -f4)

	if [[ -f $VERSION_FILE ]]; then
		# Compare current version string to saved version string.
		oldvers=$(grep 'OpenLDAP: slapd' $VERSION_FILE | cut -d" " -f4)
		if [[ "$curvers" == "$oldvers" ]]; then
			:
		elif [[ $oldvers == "2.6."@([4-9]) ]]; then
			logit "Notice: Compatible version $oldvers with $curvers"
			version_update
		else
			error "slapd version incompatible: $curvers v $oldvers"
			version_code=255
		fi
	else
		logit "Notice: no prior version recorded."
		db=$(database_seed)
		if [[ $db == "None" || $db == "ER!" ]]; then
			logit "Notice: no current database ($db)."
			version_update
		elif [[ $db == "MDB" ]]; then
			# Is current version a recognised version?
			case $curvers in
			    ("2.6."@([4-9]|10))
				logit "Notice: $db database compatible for " \
					$curvers
				version_update
				version_code=1
				;;
			    (*)
				version_code=255
				;;
			esac
		else
			version_code=255
		fi
	fi

	if (( $version_code == 255 )); then
		echo "DB in ${DATA_DIR} not created by installed slapd."
		echo "The version recorded in $VERSION_FILE"
		echo "differs from the slapd version installed now."
		echo "To ensure compatibility the previous version of OpenLDAP"
		echo "should be used to export the older DB to LDIF file"
		echo "and the new version should be used to import it."
		echo "For further information read the instructions in"
		echo "${VERSION_DOC}"
	fi
	rm $tmp_file
	return $version_code
}

function read_config_file
{
	# Reads values we are interested in from slapd.conf.
	# Returns 255 if configuration file not readable.
	# Otherwise returns 0.
	if [[ ! -r ${CONF_FILE} ]]; then
		error "unable to read ${CONF_FILE}"
		return 255
	fi
	cat $CONF_FILE | while read cmd value; do
		case $cmd in
		("#")
			# The file is mostly comments
			continue
			;;
		("TLSProtocolMin")
			# The format of this value changed after 2.4.30
			TLS_MIN=$value
			;;
		("database")
			# Database type, might be more than one.
			database_type=$value
			;;
		("directory")
			# store directory location and type.
			DIRECTORY[${database_type:-Err}]=$value
			;;
		(*)
			continue
			;;
		esac
	done
	# Sanity check
	if [[ ${DIRECTORY[Err]} ]]; then
		debug "Warning: " \
		      "directory statement without database type!" \
		      ${DIRECTORY[Err]}
	fi
	return 0
}


function database_seed
{
	# Very simple discovery based on configured database.
	# Solaris has only shipped two versions of OpenLDAP.
	# 2.4.30 provided BDB database.
	# 2.4.44 and newer use the MDB database as the default.
	typeset db="None"
	if [[ -d $DATA_DIR ]]; then
		if [[ -f $DATA_BDB ]]; then
			db="BDB"
		elif [[ -f $DATA_MDB ]]; then
			db="MDB"
		else
			# Is there anything in database directory?
			for file in $DATA_DIR/*; do
				if [[ $file == $VERSION_FILE ]]; then
					# May occur in testing, ignore.
					continue
				elif [[ -e $file ]]; then
					# If any other file exists, assume
					# it is a database.
					db="Undetermined"
					break
				fi
			done
		fi
	else
	    # Directory should exist as it is in packaging.
		error "database directory missing! $DATA_DIR"
		db="ER!"
	fi
	echo $db
}


function slapd_using_identity_TLS_cert
{
    # If $1 is present, then we just want to know if the configuration
    # is using SECKEY, don't need to check on its age.
    #
    # Returns 0 if slapd is using the system TLS certificate within its
    # configuration and it is newer than slapd.pid file.
    #
    # Except when $1 is set, the key checked can be overridden by setting
    # cred/privatekey property, otherwise it uses SECKEY.

    typeset -r pidf=/var/openldap/run/slapd.pid
    typeset identity chkey

    # Unless caller just wants to know if OpenLDAP is configured to
    # use system cert, no point in doing any further checks if slapd
    # is not started.
    if [[ -z $1 && ! -f $pidf ]]; then
	debug "slapd not running, identity:cert check not needed at this time."
	return 1
    fi

    if [[ -z $1 ]]; then
	chkey=$(smf_get_prop cred/privatekey $LDAP_SMF_FMRI)
	if [[ $? != 0 || $chkey == $SMF_UNCONFIGURED_VALUE ]]; then
	    debug "$0: Failed to read property cred/privatekey, using default"
	    chkey=''
	fi
    fi

    if [[ -z $chkey ]]; then
	identity='"Default (identity:cert)"'
	chkey=$SECKEY
    else
	identity='"cred/privatekey"'
    fi

    if [[ ! -f $chkey ]]; then
	logit "$identity key \"$chkey\" not found!"
	return 1
    fi

    logit "Checking if slapd is configured to use $identity key $chkey."

    typeset -r slapcat=/usr/sbin/slapcat
    typeset -r var=olcTLSCertificateKeyFile
    typeset -r key=$($slapcat -b cn=config -H ldap:///???\(${var}=\*\) |
			 /usr/bin/nawk "/${var}/ {print \$2; exit}")
    debug "$0: key=\"$key\""

    if [[ -n $1 ]]; then
	# Just want to know if slapd configuration is using system cert.
	if [[ $key == $SECKEY ]]; then
	    # Will need to keep privilege.
	    logit 'System TLS key is being used'
	    return 0
	else
	    logit 'System TLS key is not being used'
	    return 1
	fi
    fi

    if [[ $key != $chkey ]]; then
	logit "Using alternative key $key; restart not required."
	return 1
    fi
    if [[ $chkey -ot $pidf ]]; then
	    logit "$identity key older than $pidf; restart not required."
	return 1
    fi
    logit "$identity key is newer than $pidf; restart required."
    return 0
}

function enable_identity_watch
{
    # Enable identity:openldap if slapd is configured to use the system TLS
    # certificate and it is currently disabled.
    #
    # By default the service is disabled so that `svcs` does not report a
    # service to be online for a service that is not required.
    # if slapd is not configured to use the system TLS certificate it will
    # disable itself.
    typeset status=$(/usr/bin/svcs -Ho STA $CERT_SMF_FMRI)
    case $status in
	DIS*)
	    debug "$0: enabling service $CERT_SMF_FMRI"
	    /usr/sbin/svcadm enable -t $CERT_SMF_FMRI
	    ;;
	ON*|OFF)
	    # OFF (offline, likely waiting for this service.)
	    debug "$0: status \"$status\" for service $CERT_SMF_FMRI"
	    ;;
	*)
	    debug "$0: Unexpected status \"$status\" for $CERT_SMF_FMRI"
	    ;;
    esac
}

function privilege_drop
{
    # Reads current list of Extended policies from PID (first arg)
    # and removes any optional policies given as remaining arguments.
    # Displays resulting policies as a single comma separated line.
    typeset pid=$1
    # awk script to concatenate extended policies into one comma separated line.
    typeset script='/Extended policies/{e=1;next}
        e && $1 ~ /{/ {printf("%s%s",(c++?",":""),$1);next} e {exit}'
    typeset privs

    # Read any extended policies process has.
    privs=$(/usr/bin/ppriv $pid | /usr/bin/nawk "$script")
    if [[ -n $privs ]]; then
	# For each extended property passed as argument, remove it from list
	if (( ${#@} > 1 )); then
	    for priv in "${@:2}"; do
		privs=${privs/${priv}/}
		privs=${privs/,,/,}
	    done
	fi
	# Display the result, removing any trailing comma.
	print ${privs%,}
    fi
}

function disable_identity_watch
{
    # Disable identity:openldap if its status is ON or transitioning to ON.
    typeset status=$(/usr/bin/svcs -Ho STA $CERT_SMF_FMRI)
    case $status in
	ON*|OFF)
	    debug "$0: disabling service $CERT_SMF_FMRI"
	    /usr/sbin/svcadm disable -s -T 20 $CERT_SMF_FMRI
	    ;;
	DIS*)
	    debug "$0: status \"status\" for service $CERT_SMF_FMRI"
	    ;;
	*)
	    debug "$0: Unexpected status \"$status\" for $CERT_SMF_FMRI"
	    ;;
    esac
}

# Main
$trace_funcs

if ! smf_present; then
    echo "$0 is a managed service!" >&2
    exit $SMF_EXIT_ERR_NOSMF
fi

case "$1" in
    identity_start)
	# ldap/identity:openldap private start method.
	#
	# A transient service only enabled by ldap/server:openldap if slapd is
	# configured to use the systems TLS certificate.
	#
	# If the dependency identity:cert is restarted this service will be
	# restarted too (stopped and started).
	#
	# Thus at start test if slapd is configured to use the system TLS
	# certificate and if that was updated after slapd started.  If it was
	# updated then ask SMF to restart ldap/server:openldap.
	#
	if [[ $SMF_FMRI != $CERT_SMF_FMRI ]]; then
	    error "Method $1 reserved for $CERT_SMF_FMRI"
	    exit $SMF_EXIT_ERR_CONFIG
	fi
	if ! slapd_using_identity_TLS_cert; then
	    # Do not disable ourselves, leave status control to server:openldap.
	    exit $SMF_EXIT_OK
	fi
	logit Restarting $LDAP_SMF_FMRI
	# Also log to servers log file
	server_log=$(/usr/bin/svcs -L $LDAP_SMF_FMRI)
	if [[ -f $server_log ]]; then
	    logit "$CERT_SMF_FMRI restarting service as" \
		  "system identity certificate changed." 2>> $server_log
	fi
	/usr/sbin/svcadm restart -s $LDAP_SMF_FMRI
	exit $SMF_EXIT_OK
	;;
    start)
	# ldap/server:openldap start method.  Starts slapd if already
	# configured.  Otherwise runs ldapservercfg to configure
	# openldap server and start it.
	check_ldap_configuration
	configured=$?	# 0 = No. 1 = Yes. 255 = Er!
	if (( $configured == 255 )); then
	    error "Database is not compatible with installed slapd version"
	    exit $SMF_EXIT_ERR_CONFIG
	fi

	if [[ $configured == 0 && -x ${LDAPSERVERCFG} ]]; then
	    # Directory not configured, configure a sample configuration.
	    # ldapservercfg(8) will start the server.
	    version_update
	    if [[ $DEBUG =~ 'config' ]]; then
		ldapservercfg_dbg="-d 1"
	    fi
	    logit "Configuring an example LDAP server: " \
		  "${DO_LDAPSERVERCFG} ${ldapservercfg_dbg}"
	    ${DO_LDAPSERVERCFG} ${ldapservercfg_dbg}
	    err=$?
	    logit "LDAP server configuration finished."
	    if (( $err != 0 )); then
		error "ldapservercfg exited with $err"
		exit $SMF_EXIT_ERR_CONFIG
	    fi
	    if ! slapd_using_identity_TLS_cert $SECKEY; then
		logit "Restarting newly configured server to drop privilege"
		/usr/sbin/svcadm restart $SMF_FMRI
	    fi
	    enable_identity_watch
	    exit $SMF_EXIT_OK
	fi

	if (( $configured == 0 )) ; then
	    msg="slapd not configured and ${LDAPSERVERCONFIG} not executable!"
	    error $msg
	    exit $SMF_EXIT_ERR_CONFIG
	fi

	# urls are slapd(8) option -h listener options
	urls=`smf_get_prop config/urls`
	if [[ $? != 0 || $urls == $SMF_UNCONFIGURED_VALUE ]]; then
	    error 'Failed to read property config/urls'
	    exit $SMF_EXIT_ERR_CONFIG
	fi

	if (( $USE_CONF_DIR == 1 )) ; then
	    file_opt="-F ${CONF_DIR}"
	else
	    file_opt="-f ${CONF_FILE}"
	fi

	priv_cmd='' # Keep all privileges
	if slapd_using_identity_TLS_cert $SECKEY; then
	    enable_identity_watch
	else
	    # Not using identity:cert file, so Relinquish file_dac_read
	    # privilege.
	    privs=$(privilege_drop $$ "{file_dac_read}:${SECKEY}")
	    if [[ -n $privs ]]; then
		priv_cmd="/usr/bin/ppriv -f-X -r $privs -e"
	    else
		logit 'Warning: no extended policy privileges detected!' \
		      'ppriv reports privileges are:'
		/usr/bin/ppriv $$
		logit 'Continuing with those privileges.'
	    fi
	fi

	# This is intended only for debugging startup issues.
	if [[ $DEBUG =~ 'server' ]]; then
	    slapd_dbg="-d 1"
	fi
	logit "exec $priv_cmd $SLAPD_CMD $file_opt -h \"$urls\" $slapd_dbg"
	exec $priv_cmd $SLAPD_CMD $file_opt -h "$urls" $slapd_dbg 2>&1
	# Not reached.
	;;
    stop)
	# ldap:openldap stop method.
	msg='smf_kill_contract'
	if [[ -z $2 ]]; then
	    error "$msg: Missing contract ID!  Mismatch in manifest method: $1!"
	    exit $SMF_EXIT_ERR_FATAL
	fi
	debug "For method $1, running smf_kill_contract $2"

	if [[ $SMF_FMRI == $LDAP_SMF_FMRI ]]; then
	    disable_identity_watch
	fi

	if ! smf_kill_contract $2 TERM 1 30; then
	    err=$?
	    case $err in
		1) msg="$msg: bad contract ID $2"
		   ;;
		2) msg="$msg: timeout"
		   ;;
		*) msg="$msg: unexpected return value $err"
		   ;;
	    esac
	    # Failed to disable the service!
	    error $msg
	    exit $SMF_EXIT_ERR_FATAL
	fi
	exit $SMF_EXIT_OK
	;;
    *)
	echo "Usage: $0 {start|stop}" >&2
	exit $SMF_EXIT_ERR_FATAL
	;;
esac

# not reached
