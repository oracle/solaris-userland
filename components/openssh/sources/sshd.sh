#!/usr/sbin/sh
#
# Copyright (c) 2001, 2021, Oracle and/or its affiliates.
#

. /lib/svc/share/smf_include.sh

SSHDIR=/etc/ssh
KEYGEN="/usr/bin/ssh-keygen"
PIDFILE=$SMF_SYSVOL_FS/sshd.pid

# Generate host keys for each of the key types
# for which the host keys do not exist.
create_host_keys()
{
	$KEYGEN -A

	return $?
}

remove_host_keys()
{
	rm -f $SSHDIR/ssh_host_*_key*
}

#
# Makes sure, that /etc/ssh/sshd_config does not contain single line
# 'ListenAddress ::'. 
#
# This used to be part of default SunSSH sshd_config and instructed SunSSH
# to listen on all interfaces. For OpenSSH, the same line means listen on all
# IPv6 interfaces.
#
fix_listenaddress()
{
	fbackup="$SSHDIR/sshd_config.pre_listenaddress_fix"
	reason4change="#\n\
# Historically default sshd_config was shipped with 'ListenAddress ::',\n\
# which means 'listen on all interfaces' in SunSSH.\n\
# In OpenSSH this setting means 'listen on all IPv6 interfaces'.\n\
# To avoid loss of service after transitioning to OpenSSH, the following\n\
# line was commented out by the network/ssh service method script on\n\
#     $(date).\n\
# Original file was backed up to $fbackup\n\
#\n\
# "
	expl4log="Historically default sshd_config was shipped with \
'ListenAddress ::', which means 'listen on all interfaces' in SunSSH. \
In OpenSSH this setting means 'listen on all IPv6 interfaces'. \
For both SunSSH and OpenSSH the default behavior when no ListenAddress \
is specified is to listen on all interfaces (both IPv4 and IPv6)."
	msg_not_removed="Custom ListenAddress setting detected in \
$SSHDIR/sshd_config, the file will not be modified. Please, check your \
ListenAddress settings. $expl4log"
	msg_removed="Removing 'ListenAddress ::'. $expl4log Original file has \
been backed up to $fbackup"
	
	# only modify sshd_config, if ssh implementation is OpenSSH
	if [[ "$(ssh -V 2>&1)" == Sun_SSH_* ]]; then
		return 0;
	fi

	# comment '# IPv4 & IPv6' indicates an old default sshd_config
	grep -q '^# IPv4 & IPv6$' $SSHDIR/sshd_config || return 0;

	# backup
	cp $SSHDIR/sshd_config $fbackup

	# if 'ListenAddress ::' is the only ListenAddress line, comment it out
	listen_address=$(grep -i '^[ \t]*ListenAddress' $SSHDIR/sshd_config)
	if [[ "$listen_address" == 'ListenAddress ::' ]]; then
		echo $msg_removed
		awk_prog="/^ListenAddress ::$/ {printf(\"$reason4change\")}\
			  !/^# IPv4 & IPv6$/   {print}"
	elif [[ -z "$listen_address" ]]; then
		# no ListenAddress setting => OK, silently remove comment
		awk_prog="!/^# IPv4 & IPv6$/   {print}"
	else
		# send warning message both to log and console
		echo $msg_not_removed | smf_console
		awk_prog="!/^# IPv4 & IPv6$/   {print}"
	fi;

	sshd_config=$(nawk "$awk_prog" $SSHDIR/sshd_config)
	if [[ $? -ne 0 ]]; then
		echo "Update error! Check your ListenAddress settings."
		return 1;
	else
		# write the fixed content to the file
		echo "$sshd_config" > $SSHDIR/sshd_config
		return 0;
	fi

}

# This script is being used for two purposes: as part of an SMF
# start/stop/refresh method, and as a sysidconfig(1M)/sys-unconfig(1M)
# application.
#
# Both, the SMF methods and sysidconfig/sys-unconfig use different
# arguments..

case $1 in 
'unconfigure')
	# sysconfig unconfigure to remove the sshd host keys
	remove_host_keys
	;;

	# SMF arguments (start and restart [really "refresh"])

'start')
	#
	# When the service is started, create host keys in case they don't exist
	# and sysconfig/generate_hostkeys property is set (which is default).
	#
	ret1=0
	gen_key=$(smf_get_prop sysconfig/generate_hostkeys $SMF_FMRI)
	if [ $? -eq 0 -a "$gen_key" == "true" ]; then
		create_host_keys
		ret1=$?
	fi

	#
	# Make sure, that /etc/ssh/sshd_config does not contain single line
	# 'ListenAddress ::'.
	#
	fix_listenaddress
	ret2=$?

	/usr/lib/ssh/sshd

	#
	# Put the service into degraded mode in case some of previous
	# configuration tasks failed.
	# We do not let the service enter maintenance mode, since
	# we want to keep the system as much operating as feasible.
	#
	if [ $ret1 -ne 0 ]; then
		smf_method_exit $SMF_EXIT_DEGRADED "hostkey_configuration" \
		    "Failed to generate missing host keys."
	fi

	if [ $ret2 -ne 0 ]; then
		smf_method_exit $SMF_EXIT_DEGRADED "fix_listenaddress" \
		    "Failed to fix sshd_config ListenAddress directive."
	fi
	;;

'restart')
	if [ -f "$PIDFILE" ]; then
		/usr/bin/kill -HUP `/usr/bin/cat $PIDFILE`
	fi
	;;

*)
	echo "Usage: $0 { start | restart }"
	exit 1
	;;
esac	

exit $?
