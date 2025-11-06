#!/sbin/sh
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
TMP=$(/usr/bin/mktemp ${IAM}.XXXXXX)
trap '/usr/bin/rm -f $TMP' EXIT

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
    exit $SMF_EXIT_OK
fi

logit "Performing check with ${CHECKCONF##*/} version $($CHECKCONF -v)"

# If there is an error in the configuration then named-checkconf will
# fail, so check for errors.
$CHECKCONF $configuration_file >$TMP 2>&1
if [ $? -ne 0 ]; then
    logit "Error detected in $configuration_file:"
    /usr/bin/cat $TMP
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
if [ $? -eq 0  ]; then
    logit "Deprecated feature detected in $configuration_file"
    echo "This may prevent the current or a future version of BIND from running."
    echo "Modifications and corrections should be applied to the configuration."
    echo "Refer to named.conf(5) for further details."
    smf_method_exit $SMF_EXIT_DEGRADED "bind_config_warning" \
	"check-bind(8s): deprecated feature detected"
    # Not Reached.
fi

exit $SMF_EXIT_OK
