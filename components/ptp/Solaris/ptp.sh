#!/sbin/sh
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
# Copyright (c) 2013, 2018, Oracle and/or its affiliates. All rights reserved.
#

# Standard prolog
#
. /lib/svc/share/smf_include.sh
. /lib/svc/share/net_include.sh

EXECFILE="/usr/lib/inet/ptpd"

if [ -z $SMF_FMRI ]; then
        echo "SMF framework variables are not initialized."
        exit $SMF_EXIT_ERR_NOSMF
fi

#
# get_prop fmri propname
#
get_prop () {
	VALUE="`$SVCPROP -cp config/$1 $SMF_FMRI 2>/dev/null`"
	# Empty astring_list values show up as "" - do not return this.
	if [ "$VALUE" != "\"\"" ]; then
		echo $VALUE
	fi
}

errlog () {
	echo $1 >&2
}

#Do not refresh IGMP group
CMD_LINE_ARGS=" -j"

LISTEN_IFNAME="`get_prop listen_ifname`"
if [  -n "$LISTEN_IFNAME" ]; then
		CMD_LINE_ARGS="$CMD_LINE_ARGS -b $LISTEN_IFNAME"
fi

NODE_TYPE="`get_prop node_type`"
if [ -n "$NODE_TYPE" ]; then
	if [ "$NODE_TYPE" = "master" ]; then
		CMD_LINE_ARGS="$CMD_LINE_ARGS -W"
	elif [ "$NODE_TYPE" = "slave" ]; then
		CMD_LINE_ARGS="$CMD_LINE_ARGS -g"
	else
		errlog "node_type needs to be either slave or master. See ptp (1M). Exiting."
		exit $SMF_EXIT_ERR_CONFIG
	fi
else
	CMD_LINE_ARGS="$CMD_LINE_ARGS -g"
fi

USE_HW="`get_prop use_hw`"
if [ "$USE_HW" = "true" ];then
	CMD_LINE_ARGS="$CMD_LINE_ARGS -K"
fi

DOMAIN="`get_prop domain`"
if [ "$DOMAIN" -gt 0 -a "$DOMAIN" -lt 128 ]; then
	CMD_LINE_ARGS="$CMD_LINE_ARGS -i $DOMAIN"
fi

ANN_INTVL="`get_prop announce_interval`"
if [ "$ANN_INTVL" -gt 0 -a "$ANN_INTVL" -ne 2 ]; then
	CMD_LINE_ARGS="$CMD_LINE_ARGS -n $ANN_INTVL"
fi

SYNC_INTVL="`get_prop sync_interval`"
if [ "$SYNC_INTVL" -gt 0 -a "$SYNC_INTVL" -ne 1 ]; then
	CMD_LINE_ARGS="$CMD_LINE_ARGS -y $SYNC_INTVL"
fi

ENABLE_LOGGING="`get_prop enable_logging`"
LOGFILE="`get_prop logfile`"
if [ -n "$LOGFILE" -a "$ENABLE_LOGGING" = "true" ]; then
	CMD_LINE_ARGS="$CMD_LINE_ARGS -f $LOGFILE"
fi

DRIFTDIR="`get_prop drift_dir`"
if [ -n "$DRIFTDIR" = "true" ]; then
	CMD_LINE_ARGS="$CMD_LINE_ARGS -J $DRIFTDIR"
fi

LOGDEBUG="`get_prop send_debug_to_stderr`"
if [ "$LOGDEBUG" = "true" ]; then
	CMD_LINE_ARGS="$CMD_LINE_ARGS -S"
fi

DEBUGLEVEL="`get_prop debug_level`"
if [ "$DEBUGLEVEL" -gt 3 ]; then
	DEBUGLEVEL=3
fi
if [ "$DEBUGLEVEL" -lt 0 ]; then
	DEBUGLEVEL=0
fi
while [ "$DEBUGLEVEL" -gt 0 ]
do
	CMD_LINE_ARGS="$CMD_LINE_ARGS -B"
	DEBUGLEVEL=`expr $DEBUGLEVEL - 1`
done


OTHER_OPTIONS="`get_prop other_options`"
if [ -n "$OTHER_OPTIONS" ]; then
	CMD_LINE_ARGS="$CMD_LINE_ARGS $OTHER_OPTIONS"
fi

# Delay starting the daemon by the specified amount.
# If delay is conditional check the conditions. 
# We care if the configured interfaceis an aggr
# and we care if this is the first time running since boot.
DELAY=`get_prop startup_delay`
# If we have already run before since boot, there is no point in waiting now
# unless we are experiencing a problem. We delay for the first hour.
if [ -f /system/volatile/ptpd.boot ]; then
        BOOTTIME=`cat /system/volatile/ptpd.boot | tr -dc '[:digit:]'`
        NOW=`date "+%s"`
        SINCEBOOT=`expr 0$NOW - 0$BOOTTIME`
        if [ $SINCEBOOT -gt 3600 ]; then
                DELAY=0
        fi
else
        date "+%s" > /system/volatile/ptpd.boot
fi
AGGRDELAY=`get_prop delay_only_if_aggr`
if [ $AGGRDELAY = "true" -a $DELAY -gt 0 ]; then
	if [ -n $LISTEN_IFNAME ]; then
        	IFCLASS=`dladm show-link -p -o class $LISTEN_IFNAME 2>/dev/null`
		if [ "q$IFCLASS" != "qaggr" ]; then
			DELAY=0
		fi
	fi
fi
if [ $DELAY -gt 0 ]; then
	sleep $DELAY
fi

# start ptp daemon
$EXECFILE $CMD_LINE_ARGS
exit $SMF_EXIT_OK
