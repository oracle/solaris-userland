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
# Copyright (c) 2025, Oracle and/or its affiliates.
#

use strict;
use feature 'say'; # handy way of appending newline at the end of string

# Hash array holding the results
# Key - dependency
# Value - list of components requiring the dependency
my %x;

# We match lines like
#     runtime/python-311:autoconf
# First part is the dependency name, second part is path of component which
# needs the dependency. The string is created in components/Makefile:
#  COMPONENT_HOOK='@echo $$(REQUIRED_PACKAGES:%="%:$$(subst $$(WS_TOP)/components/,,$$(COMPONENT_DIR))\\n")'
my $regex = qr{
	^        # Start matching at the beginning of a line
	\s*      # Skip any amount of spaces
	([^:]+)  # Any characters till first double colon is the dependency name
	:        # Then there is the double colon
	(\S+)    # Any non-space charaters are component path requiring the dependency
}x;

while (<>) {
	my ($dependency, $component) = $_ =~ /$regex/;
	next unless defined $component; # Skip further processing of this line if the regex didn't match
	push @{$x{$dependency}}, $component; # Perl way of saying 'treat the hash value as an array and push new member there'
}

# This block is executed when the script is about to be terminated
# We print the results here
END {
	my $maxlen = 6;
	for my $dependency (sort keys %x) {
		my @list = @{$x{$dependency}};
		if (scalar @list > $maxlen) {
			# Trim the list if it is too long
			my $append = "... (and ${\ scalar @list - $maxlen } more)";
			@list = @list[0..$maxlen-1];
			push @list, $append;
		}
		say "REQUIRED_PACKAGES += $dependency # ", join ' ', @list;
	}
}
