#!/usr/bin/perl

use strict;

my @result;
my $line;
my ($f_input, $f_output)=@ARGV;

sub sort_ignore_first_word {
	my ($str_a, $str_b) = @_;

	# Delete first word on copared strings
	$str_a =~ s/^\S+\s+//;
	$str_b =~ s/^\S+\s+//;

	# Compare the rest
	$str_a cmp $str_b;
}

open F, $f_input or die "Can't open $f_input for reading: $!\n";
# Read all lines until first beginning with '#' is found
push @result, $line while $line=<F> and not $line =~ m/^#/;
# Sort the already read portion of the file
@result=sort { sort_ignore_first_word($a, $b) } @result;
# add the first '#' line and read rest of the file
push @result, $line, <F>;
close F;

# Overwrite the file with sorted results
open F, ">$f_output" or die "Can't open $f_output for writing: $!\n";
print F @result;
close F;
