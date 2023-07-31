#!/bin/nawk -f
# Copyright (c) 2023, Oracle and/or its affiliates.
#
# Adapted from COMPONENT_TEST_TRANFORMS in make-rules/shared-macros.mk
#
# This script's input is the output from the test suit.  Its task is
# to prepare it for comparison with previously captured output by
# cleansing of known differences and known issues.
#
# For comparision test print summary lines (those which begin >>>>>) and remove
# all time information.
#
/^>>>>>/ && $3=="Finished|Failed" {sub($2 " ","");sub(" after .*","");print;next;}
/^>>>>> [0-9][0-9]:/ {sub("[0-9][0-9]:[0-9][0-9]:[0-9][0-9] ","");print;next;}
/^>>>>> / {print;next;}


