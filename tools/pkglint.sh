#!/bin/ksh
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
# Copyright (c) 2013, 2017, Oracle and/or its affiliates. All rights reserved.
#
IFS=

SLEEPTIME=60

LOCKDIR=WS_TOP_XXX/pkglint.lock

# Only one mkdir can succeed, others will fail as the directory already exists.
# This effectively creates a protected section which can be entered by one
# pkglint only at a time.
while ! mkdir "$LOCKDIR" ; do
	sleep $SLEEPTIME
done

/usr/bin/pkglint $*

pls=$?

rmdir "$LOCKDIR"
exit ${pls}
