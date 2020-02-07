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
# Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
#

use strict;

my ( $file, $tempdir ) = @ARGV;

open F, $file or die "Can't open $file: $!\n";
my $buffer = join "", <F>;
close F;

# The regular expression says
# replace
#   s:<number>:<our temp dir>
# with
#   s:<number minus our temp size>:/temp
# The regular expression uses /e switch meaning that the replacement must be
# perl expression (here concatenation of three strings)
$buffer =~ s,
	# String to match
	s:
	(\d+)           # The number - $1
	:"
	($tempdir)      # our temp dir - $2
,
	# String to replace
	"s:".
	($1-length($2)+4).
	':"/tmp'
,xge;

open F, ">$file" or die "Can't open $file for writing: $!\n";
print F $buffer;
close F;
