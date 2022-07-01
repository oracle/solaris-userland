#!/bin/nawk -f
# Copyright (c) 2022, Oracle and/or its affiliates.
#
# Adapted from COMPONENT_TEST_TRANFORMS in make-rules/shared-macros.mk
#
# This script's input is the output from the test suit.  Its task is
# to prepare it for comparison with previously captured output by
# cleansing of known differences and known issues.
#
# Remove everything before test execution,
# which starts with a count summary.
# `num` used as replacement for test number which have no relevance.
BEGIN {num="#";}
started==0 && /^[0-9]..[0-9]+$/ {started=1;p=1; print; next;}
started==0 {next;} # Short cut
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
# Remove platform specific information given out by test 1.
/ok 1 - platform_output$/ {p=0; print; print "\# ELIDED"; next;}
# Ignore some IPV6 tests which vary depending on machine configuration.
/ - ip6_addr_link_local/ {p=0;print "# ignore ip6_addr_link_local!"; next;}
/ - udp_multicast_join6/ {p=0;print "# ignore udp_multicast_join6!"; next;}
# tty info explains it's skipped when tty device, remove info.
/ok [0-9]+ - tty / {print $1,num,$3,$4; next;}
# Remove the summary; exit.  As the IPv6 tests muddy the water.
/^(FAIL|PASS): test\/run-tests/ {print "# run-tests summary ELIDED."; exit;}
# Reset `p` to display this result and further results.
/^ok [0-9]+ - / {p=1;$2=num;}
/^not ok [0-9]+ - / {p=1;$3=num;}
p==1 {print}
