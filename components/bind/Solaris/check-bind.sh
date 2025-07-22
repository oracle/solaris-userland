#!/sbin/sh

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
# Copyright (c) 2025, Oracle and/or its affiliates.
#

# smf_method(7) start script for check-bind service.
#
function logit
{
    # All output is directed to SMF log file, this simply adds the
    # date as per SMF standard; YYYY MMM dd hh:mm:ss.
    now=$(date '+%Y %b %e %H:%M:%S')
    echo "[ $now $IAM: $@ ]"
}

. /lib/svc/share/smf_include.sh

IAM=${0##*/}

SVCPROP=/usr/bin/svcprop
CHECKCONF=/usr/bin/named-checkconf
DNS_SERVER_FMRI=svc:/network/dns/server:default
TMP=$(/usr/bin/mktemp)

configuration_file=/etc/named.conf

# Read configuration paths from dns/server
properties="chroot_dir configuration_file"

for prop in $properties
do
    value=`/usr/bin/svcprop -p options/${prop} ${DNS_SERVER_FMRI}`
    if [ -z "${value}" -o "${value}" = '""' ]; then
	# Could not find property or it has no value.
	continue
    fi

    case $prop in
	'chroot_dir')
	    chroot_dir=${value};
	    ;;
	'configuration_file')
	    configuration_file=${value};
	    ;;
    esac
done

# If chroot option is set, note zones(5) are preferred, then
# configuration file lives under chroot directory.
if [ "${chroot_dir}" != "" ]; then
    configuration_file=${chroot_dir}${configuration_file}
fi

if [ ! -f $configuration_file ]; then
    logit "Nothing to do, file does not exist: $configuration_file"
    exit $SMF_EXIT_OK
fi

logit "Performing check with ${CHECKCONF##*/} version $($CHECKCONF -v)"

# If there is an error in the configuration then named-checkconf will
# fail, so check for errors.
$CHECKCONF $configuration_file >$TMP 2>&1
if [ $? != 0 ]; then
    logit "Error detected in $configuration_file:"
    /usr/bin/cat $TMP; /usr/bin/rm $TMP
    echo "Errors prevent named(8) from starting up."
    echo "Modifications and corrections should be applied to the configuration."
    echo "Refer to named.conf(5) for further details."
    smf_method_exit $SMF_EXIT_DEGRADED "bind_config_error" \
 	 "check-bind(8s): errors need correcting"
    # Not Reached.
fi
# Check for unix controls, named-checkconf does not detect this one as
# it is already removed from 9.18.  But it may aid those coming from 9.16.
# Awk script appends mock deprecated message to original checkconf output.
$CHECKCONF -px $configuration_file 2>/dev/null |
    /usr/bin/nawk -v fn="$configuration_file" \
	-v msg=':*: controls unix is deprecated, replace with inet' \
	'/controls / {controls=1};
		   controls==1 && $1=="unix" {print fn msg;err=1};
		   /\};/{controls=0};
		   END{exit err}' >>$TMP
# check for deprecated messages in initial (possibly appended) output
/usr/bin/grep deprecated $TMP
if [ $? = 0  ]; then
    /usr/bin/rm $TMP
    logit "Deprecated feature detected in $configuration_file"
    echo "This may prevent the current or a future version of BIND from running."
    echo "Modifications and corrections should be applied to the configuration."
    echo "Refer to named.conf(5) for further details."
    smf_method_exit $SMF_EXIT_DEGRADED "bind_config_warning" \
	"check-bind(8s): deprecated feature detected"
    # Not Reached.
fi

/usr/bin/rm $TMP
exit $SMF_EXIT_OK
