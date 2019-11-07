#! /bin/sh
#
# Copyright (c) 2001, 2019, Oracle and/or its affiliates. All rights reserved.
#

#
# Create messages file for zone_sun.tab, country.tab, continent.tab
#
AWK=/usr/bin/nawk
ECHO=/usr/bin/echo

ZONE_SUN_FILE="$1"
COUNTRY_FILE="$2"
CONTINENT_FILE="$3"

DOMAIN=SUNW_OST_ZONEINFO

$ECHO "msgid \"\""
$ECHO "msgstr \"Content-Type: text/plain; charset=utf-8\\\n\""

$ECHO "#"
$ECHO "# These files are located in components/timezone."
$ECHO "#"

$ECHO "#"
$ECHO "# continent.tab"
$ECHO "#"

# Get 2nd column of continent.tab file
$AWK -F'\t' \
	' 
	/^#/ { next }
	{ 
		if ($2 != "") {
			printf "msgid \"%s\"\n", $2 
			printf "msgstr \"\"\n"
		}
	}
	' < $CONTINENT_FILE

$ECHO "#"
$ECHO "# country.tab"
$ECHO "#"

# Get 2nd column of country.tab file
$AWK -F'\t' \
	' 
	/^#/ { next }
	{ 
		if ($2 != "") {
			printf "msgid \"%s\"\n", $2 
			printf "msgstr \"\"\n"
		}
	}
	' < $COUNTRY_FILE


$ECHO "#"
$ECHO "# zone.tab"
$ECHO "#"

# Get 5th column (if it exists) of zone_sun.tab file
$AWK -F'\t' \
	' 
	/^#/ { next }
	{ 
		if (NF > 4 && $5 != "") {
			printf "msgid \"%s\"\n", $5 
			printf "msgstr \"\"\n"
		}
	}
	' < $ZONE_SUN_FILE

