#!/bin/nawk -f
# Copyright (c) 2022, 2025, Oracle and/or its affiliates.
#
# Adapted from COMPONENT_TEST_TRANFORMS in make-rules/shared-macros.mk
#
# This script's input is the output from the test suit.  Its task is
# to prepare it for comparison with previously captured output by
# cleansing of known differences and known issues.
#
# It cleanses by only outputing when p==1.  Therefore each test ahead
# of the reset test makes the decision to set p to zero and or what it
# wants to output in its place.
#
#
# `num` is used as replacement for each test number (see below).
BEGIN {num="#";}
# Remove everything before test execution, which starts with a count summary.
started==0 && /^[0-9]..[0-9]+$/ {started=1;p=1; print; next;}
started==0 {next;} # Don't output anything until count summary seen.
# Ignore some warnings
/^gmake: warning: jobserver unavailable:/ {next;}
/^make\[.* jobserver unavailable:/ {next;}
/^make: Warning: Ignoring DistributedMake -j option/ {next;}
# Replace pathnames with those passed in from command line.
dir && $0 ~ dir {gsub(dir,"$(@D)", $0);}
perl && $0 ~ perl {gsub(perl,"$(PERL)", $0);}
src && $0 ~ src {gsub(src,"$(SOURCE_DIR)", $0);}
#
# Each test outputs a heading line with format:
#   Status Number - Title [# Info]
#
# Status is either "ok" or "not ok".  Number is not necessarily
# constant between git revision sets.  Title is the name for the test.
# Some tests append info after title, for example to explain why a
# test was considered successful despite some issue (i.e. missing
# device), which needs to be cleansed for simple Userland comparison
# test.
#
# New result: Set `p` to output this and further lines unless another rule
# below unsets it.  Also replace test number with num and store test name.
/^ok [0-9]+ - / {p=1;$2=num;tst=$4}
/^not ok [0-9]+ - / {p=1;$3=num;tst=$5}
# Remove platform specific information given out by test 1.
/ok # - platform_output$/ {p=0; print; print "\# ELIDED",tst; next;}
# Ignore some IPV6 tests which vary depending on machine configuration.
/ - ip6_addr_link_local/ {p=0;print "# IGNORED",tst; next;}
/ - udp_multicast_join6/ {p=0;print "# IGNORED",tst; next;}
# Negated errno 128, Network is unreachable.
/ - tcp_connect6_link_local/ {p=0;print "# IGNORED",tst; next;}
# tty info explains it's skipped when tty device, remove info.
/ok # - tty / {print $1,num,$3,$4; next;}
# Remove the summary, as the ignored tests muddy the waters, and exit.
/^(FAIL|PASS): test\/run-tests/ {print "# run-tests summary ELIDED."; exit;}
# Output the line.
p==1 {print}
