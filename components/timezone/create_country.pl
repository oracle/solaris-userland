#!/usr/bin/perl -CSD
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
# Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
#


use utf8;
use strict;

# It seems that the file /usr/share/lib/zoneinfo/tab/country.tab must not
# contain any utf-8 characters. We have to transliterate any utf-8 characters
# into ascii range.

while (<>) {
	my $original_line = $_;

	# Transliterate any utf-8 characters we have met
	tr/Åôçé/Aoce/;

	# Remove any ascii characters to verify that there is no more utf-8
	my $non_ascii = s/[[:ascii:]]//gr;

	# If anything is left then print an error
	if (length $non_ascii > 0) {
		print STDERR "Error, there are some remaining characters: $non_ascii\n";
		print STDERR "Original line: $original_line";
		exit 1;
	}

	# Print output
	print;
}
