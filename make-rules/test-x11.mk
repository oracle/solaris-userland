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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

# Functions to prepare environment for components which need X11 for their
# tests. The functions are written so that if there is existing $DISPLAY it
# will do nothing. That allows you to run 'gmake test' in your X
# observing/debugging the results. However if there is no DISPLAY available it
# will setup vncserver and run the tests inside.

# This component needs X11, so we run vnc session, run the tests inside and
# tear down vnc
COMPONENT_PRE_TEST_ACTION += \
	( \
		set -x; \
		: exit if we already have DISPLAY. This is useful for running the tests by hand; \
		[ -z "$$DISPLAY" ] || exit 0; \
		cd $(@D); \
		: ; \
		: We do not want to cripple user\'s home, instead create special directory for it; \
		: ; \
		mkdir -p myhome/.vnc; \
		: ; \
		: Simple xterm will do, do not run whole gnome; \
		: ; \
		echo xterm > myhome/.vnc/xstartup; \
		chmod +x myhome/.vnc/xstartup; \
		export HOME=$(@D)/myhome; \
		: ; \
		: Create passwd file. If you want to connect to the VNC do this:; \
		:  1 - disable COMPONENT_POST_TEST_ACTION; \
		:  2 - run the tests via "gmake test"; \
		:  3 - copy the amd64/myhome/.vnc/passwd to your machine; \
		:  4 - run vncviewer -passwd passwd ...; \
		: ; \
		/usr/bin/expect -f $(WS_TOOLS)/create_vncpasswd_file; \
		vncserver -SecurityTypes VncAuth; \
		: ; \
		: We need to pass the DISPLAY variable somehow to the tests. Do it via file.; \
		: ; \
		vncserver -list | tail -1 | awk '{ print $$1 }' > myhome/DISPLAY; \
	)

COMPONENT_POST_TEST_ACTION += \
	( \
		set -x; \
		: exit if we already have DISPLAY. This is useful for running the tests by hand; \
		[ -z "$$DISPLAY" ] || exit 0; \
		cd $(@D); \
		export HOME=$(@D)/myhome; \
		DISPLAY=$$(<myhome/DISPLAY); \
		vncserver -kill $$DISPLAY; \
		rm -rf myhome; \
	)


# We need to read in DISPLAY variable from file and at the same time use it in
# the env(1) command:
COMPONENT_TEST_ENV_CMD = \
	if [ -z "$$DISPLAY" ]; then \
		DISPLAY=$$(<$(@D)/myhome/DISPLAY); \
		HOME=$(@D)/myhome; \
	fi; \
	$(ENV)
COMPONENT_TEST_ENV += DISPLAY="$$DISPLAY"
COMPONENT_TEST_ENV += HOME="$$HOME"

REQUIRED_PACKAGES += shell/expect
REQUIRED_PACKAGES += x11/server/xvnc
