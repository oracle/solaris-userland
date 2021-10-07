#!/bin/ksh
#
# Copyright (c) 2009, 2021, Oracle and/or its affiliates.
#

. /lib/svc/share/smf_include.sh

SAMBA_CONFIG=/etc/samba/smb.conf
ARCH64=$(/usr/bin/isainfo -k)

NSS_STRICT_NOFORK=DISABLED
LD_PRELOAD_32=/usr/lib/samba/libwinbind_nss_hook.so.1
LD_PRELOAD_64=/usr/lib/samba/$ARCH64/libwinbind_nss_hook.so.1
export NSS_STRICT_NOFORK LD_PRELOAD_32 LD_PRELOAD_64

SWITCH_FMRI=svc:/system/name-service/switch
SVCCFG=/usr/sbin/svccfg
SED=/usr/xpg4/bin/sed

function get_prop {
	print -- "$($SVCCFG -s $SWITCH_FMRI listprop -o value $1)"
}

function get_nss_policy {
	typeset policy
	eval "policy=$(get_prop config/$1)"
	if [[ "$policy" == "" ]]; then
		eval "policy=$(get_prop config/default)"
	fi
	#
	# Remove winbind from policy with associated criteria if any.
	# It's part of anti-recursion mechanism that prevents hang.
	#
	print "$policy" | \
	    $SED -e 's/\<winbind\([ \t]\{1,\}\[[^]]*\]\)\{0,1\}[ \t]*//'
}

# Check if given service is working properly
function check_running {
	case "$SMF_FMRI" in
	svc:/network/winbind:*)
		# It takes some time before winbind starts to really work
		# This is infinite loop which will be killed after smf timeout
		while : ; do
			sleep 2
			PING=$(/usr/bin/wbinfo -P 2>&1)
			if [ $? -eq 0 ]; then
				break
			fi
			echo "$PING"
		done
		;;
	esac
	return 0
}

case "$1" in
start)
	if [ ! -f "$SAMBA_CONFIG" ]; then
		echo "Configuration file '$SAMBA_CONFIG' does not exist."
		exit 1
	fi

	_NO_WINBINDD_PASSWD_POLICY=$(get_nss_policy password)
	_NO_WINBINDD_GROUP_POLICY=$(get_nss_policy group)
	export _NO_WINBINDD_PASSWD_POLICY _NO_WINBINDD_GROUP_POLICY

	# Command to execute is found in second and further script arguments
	shift
	eval "$@  --option=logging=file"
	check_running
	;;
stop)
	# kill whole contract group

	# first send TERM signal and wait 30 seconds
	smf_kill_contract $2 TERM 1 30
	ret=$?
	[ $ret -eq 1 ] && exit 1

	# If there are still processes running, KILL them
	if [ $ret -eq 2 ] ; then
		smf_kill_contract $2 KILL 1
	fi
	;;
*)
	$CAT <<-EOT
		Usage:
		  $0 start <command to run>
		  $0 stop <contract number to kill>
	EOT
	exit 1
	;;
esac
