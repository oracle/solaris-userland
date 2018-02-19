#!/usr/sbin/sh
#
# Copyright (c) 2016, Oracle and/or its affiliates. All rights reserved.
#

DISPLAY=":$1"
XAUTHORITY="/var/xauth/$1"
export XAUTHORITY DISPLAY
/usr/bin/xdg-screensaver lock
