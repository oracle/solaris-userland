#!/usr/bin/perl

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





use strict;

# From LSARC/2001/015
#
# 9.2.  zone_sun.tab
# 
#      This file lists the ISO 3166 2-letter country code or a code representing
#      a group of countries, the coordinates of the city, the Olson timezone 
#      name, the Sun preferred timezone name if one exists or a dash ('-') if 
#      a Sun preferred timezone name does not exist, and comments.  The comments 
#      are present if and only if the country has multiple rows.  The comments 
#      strings are used during timezone selection time to further identify a 
#      timezone if there are multiple timezones for a particular country.  
#      This file is based on the zone.tab file, which is part of the Elsie 
#      source distribution.

# The difference against IANA zone.tab is additional column inserted between
# third and fourth one. Sun preferred timezone name. So here we take zone.tab
# (from command line) and insert that column

# Second difference is that the file has to be sorted alphabetically otherwise
# the text-installer crashes upon startup


my %preferred_name = (
	'America/Adak'                   => 'US/Aleutian',
	'America/Anchorage'              => 'US/Alaska',
	'America/Argentina/Buenos_Aires' => 'America/Buenos_Aires',
	'America/Argentina/Catamarca'    => 'America/Catamarca',
	'America/Argentina/Cordoba'      => 'America/Cordoba',
	'America/Argentina/Jujuy'        => 'America/Jujuy',
	'America/Argentina/Mendoza'      => 'America/Mendoza',
	'America/Edmonton'               => 'Canada/Mountain',
	'America/Halifax'                => 'Canada/Atlantic',
	'America/Indiana/Indianapolis'   => 'US/East-Indiana',
	'America/Los_Angeles'            => 'US/Pacific',
	'America/Manaus'                 => 'Brazil/West',
	'America/Mazatlan'               => 'Mexico/BajaSur',
	'America/Mexico_City'            => 'Mexico/General',
	'America/New_York'               => 'US/Eastern',
	'America/Noronha'                => 'Brazil/DeNoronha',
	'America/Regina'                 => 'Canada/East-Saskatchewan',
	'America/Rio_Branco'             => 'Brazil/Acre',
	'America/Santiago'               => 'Chile/Continental',
	'America/Sao_Paulo'              => 'Brazil/East',
	'America/St_Johns'               => 'Canada/Newfoundland',
	'America/Tijuana'                => 'Mexico/BajaNorte',
	'America/Toronto'                => 'Canada/Eastern',
	'America/Vancouver'              => 'Canada/Pacific',
	'America/Whitehorse'             => 'Canada/Yukon',
	'America/Winnipeg'               => 'Canada/Central',
	'Asia/Macau'                     => 'Asia/Macao',
	'Australia/Adelaide'             => 'Australia/South',
	'Australia/Brisbane'             => 'Australia/Queensland',
	'Australia/Broken_Hill'          => 'Australia/Yancowinna',
	'Australia/Darwin'               => 'Australia/North',
	'Australia/Hobart'               => 'Australia/Tasmania',
	'Australia/Lord_Howe'            => 'Australia/LHI',
	'Australia/Melbourne'            => 'Australia/Victoria',
	'Australia/Perth'                => 'Australia/West',
	'Australia/Sydney'               => 'Australia/NSW',
	'Pacific/Easter'                 => 'Chile/EasterIsland',
	'Pacific/Honolulu'               => 'US/Hawaii',
	'Pacific/Pago_Pago'              => 'US/Samoa',
);

# An array holding the output so that it can be sorted
my @output;

while (<>) {
	if ( /^(#|$)/ ) {
		# Just copy comments and empty lines to stdout
		# The comments contain license so that is important
		print;
		next;
	}
	chomp;        # Strip newline

	my @F = split /\t/;                    # Slit by tab into an array

	# This is the structure we have to create:
	# code - coordinates - timezone name - sun preferred name - comments
	@F = (
		@F[0..2],                      # Take first three columns
		$preferred_name{$F[2]} // '-', # Insert preferred mapping or '-'
		@F[3 .. $#F]                   # Append rest of the columns
	);

	# The original IANA file does not necessarily have last column - the
	# comments. But our version always had the field even if empty. I
	# don't know if it's necessary, but it was always like that. So I'll
	# add the empty column if it's missing just to be sure.
	push @F, '' if scalar @F < 5;

	push @output, join "\t", @F;           # Store the lines into an array
}

# Join the array with newlines and print
print join ("\n", sort @output) . "\n";
