###############################################################################
#
# Copyright (c) 2007, 2018, Oracle and/or its affiliates. All rights reserved.
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the "Software"),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice (including the next
# paragraph) shall be included in all copies or substantial portions of the
# Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.
#
# Excerpts from Technical Product Training and Sustaining TOI docs for
#  future reference

Architecture and Implementation

   The open source TigerVNC release is built using the Xorg server sources
   to provide the X server portion of the sources for Xvnc.   This provides
   an Xvnc that includes the same features as Sun's Xorg, including Sun
   enhancements like IA Extension support & Xserver DTrace probes.

Source code access

   Our code:
	In X gates: open-src/xserver/xvnc

   Upstream:
	Original: http://www.tigervnc.com/
	Fedora patches: https://src.fedoraproject.org/rpms/tigervnc
	       		git://pkgs.fedoraproject.org/tigervnc.git

   1. Please provide a brief description of the feature and how it is used.

      VNC provides a remote desktop session viewing protocol (RFB protocol).
      RFB clients, better known as VNC viewers, are available for most
      platforms, in both open source and commercial flavors.   The x0vncserver
      program provides a VNC server that can capture the display from a
      running session on a normal X server.

      This project delivers Xvnc, an X server that displays to a Remote Frame
      Buffer (RFB) protocol client over the network, without requiring an
      existing X server session displayed on local video hardware.   It also
      delivers the TigerVNC vncviewer to connect to remote VNC servers, and
      several associated programs for managing these.

   2. Does this feature EOL any other feature or does it offer an alternative
      to another existing feature?

      The vncviewer provided by this project replaces the vncviewer script
      delivered by the Vino project (LSARC 2007/391) in several Nevada builds,
      but which was not yet included in any Solaris or SXDE release.

   3. Please list any dependencies on other features.

      None.

   4. Is the feature on or off by default? What considerations need to be
      taken before turning on/off?

      The Xvnc server is off by default.   Considerations before enabling are
      documented in the man page and the ARC case security questionairre.

   5. Is this a platform specific feature and if so which platform?
      Please provide any differences in behaviors or functionality of the
      feature if it is supported on the x86 platform.

      No.

   6. Please list the minimum system requirements.

      System running Solaris 10U5 or later.

   7. List the things (GUI, commands, packages, binaries, configuration files,
      etc.) that are introduced, removed, or have substantially changed by
      this feature or project.

      S10 package SUNWxvnc / S11 package pkg:/x11/server/xvnc :
	  /usr/bin/vncpasswd
	  /usr/bin/vncserver
	  /usr/bin/x0vncserver
	  /usr/bin/Xvnc

      S10 package SUNWvncviewer /
      S11 package pkg:/desktop/remote-desktop/tigervnc :
	  /usr/bin/vncviewer

   8. What major data structures have changed or have been added?

       N/A

   9. Please list any header file changes.

       N/A

  10. Are there known issues or bugs with this feature? If so, please provide
      bug Ids and any known workarounds.

      See 10006/X11/VNC in BugDB for known bugs.

  11. How would one recognize if the new feature is working or not working?
      (Note: The engineer will provide as much information as possible at
       this time.  For the latest information, please refer to the appropriate
       System Administration document.)

      Can a VNC client (such as vncviewer) connect to a VNC server (such as
      Xvnc) and see the desktop session in it?

      See full test case instructions below.

  12. Are there any diagnostic tools for this feature and what are they?

      Xvnc contains the same Xserver DTrace probes as the other Solaris
      X servers.    No other diagnostic tools are known at this time.

  13. Are there any unique conditions or constraints to Licensing,
      Localization, and Internationalization?

      None known.

  14. Please provide a pointer to the following:

          o ARC case:
		PSARC 2007/545: Xvnc (RealVNC 4.1.x)
		LSARC 2007/625: vncviewer (RealVNC 4.1.x)
		PSARC/2009/592: TigerVNC 1.0
		PSARC/2017/212: TigerVNC 1.7.1
		PSARC/2017/236: EOF of VNC web client

          o Project Plan:	N/A
          o Documentation Plan:	Man pages from open source release
          o Project Web Site:	http://www.tigervnc.com/

  15.  Please provide the BugDB Product/Category/Subcategory.

	      10006/X11/VNC

  16.  If available, please provide a pointer to the cookbook procedures
       for installation and configuration.

Updated from test case instructions in bugster bug id 6572087,
these are several common ways of configuring Xvnc to run:

1) Starting on demand from inetd, displaying graphical login screen:

  a) If using dtlogin (Solaris 10):

     # Enable XDMCP connections on dtlogin by removing "-udpport 0" from args
     # Warning: restart will kill all current dtlogin sessions!
	svccfg -s cde-login setprop 'dtlogin/args=""'
	svcadm refresh cde-login
	svcadm restart cde-login

     If using gdm (optional in Solaris 10, default in later releases):

     Enable XDMCP connections in gdm by editing /etc/gdm/custom.conf
     (GDM 2.30 & later) or /etc/X11/gdm/custom.conf (older GDM's) to
     contain:
	[xdmcp]
	Enable=true

     If it wasn't already there, then run "svcadm restart gdm" to activate.
     ( Warning: restart will kill all current gdm sessions!)

  b) For either dtlogin or gdm:

    # Add xvnc service to /etc/services if it isn't already there
    # (it was added in snv_99 but is not in any S10 update release)
	printf "vnc-server\t5900/tcp\t\t\t# VNC Server\n" >> /etc/services
    # Enable Xvnc inetd service:
	inetadm -e xvnc-inetd

    Connect from another machine with:
	vncviewer hostname:0
    and verify you see the login screen and can login to a desktop session.

2) Starting at system boot from display manager, displaying login screen:

   a) Add a display1 instance of x11-server service for configuration
      and configure it to run Xvnc:

	svccfg -s application/x11/x11-server add display1
	svccfg -s application/x11/x11-server:display1 addpg options application
	svccfg -s application/x11/x11-server:display1 addpropvalue options/server astring: "/usr/X11/bin/Xvnc"
	svccfg -s application/x11/x11-server:display1 addpropvalue options/server_args astring: '"SecurityTypes=None"'

  b) If using dtlogin (Solaris 10):
    # Configure dtlogin to start it
	mkdir -p /etc/dt/config
	cp /usr/dt/config/Xservers /etc/dt/config/Xservers
	echo "   :1   Local local_uid@none root /usr/X11/bin/Xserver :1" >> /etc/dt/config/Xservers
	pkill -HUP dtlogin

     If using gdm 2.30 or later (snv_130 or later):
        ck-seat-tool -a --display-type=Local  display=:1

  c) Connect from another machine with:
	vncviewer hostname:1
    and verify you see the login screen and can login to a desktop session.

3) Starting manually, displaying session of user who started it, requiring
VNC password (separate from Unix login password, not securely encoded on
disk or across the network, so don't use a valuable password):

	/usr/bin/vncserver -httpd

    From another machine, open a VNC client and connect to hostname:2

    (Assuming vncserver said it was starting on display :2 - if it listed
     another display number, change :2 to the display id.)

    Enter the password you provided to the vncserver script when it asked
    and verify you see a simple desktop session in the viewer.

    When done testing, kill the session with:

    	 vncserver -kill :2

    (again, substituting display value as necessary)

4) Login to a normal/local X desktop session, open a terminal window and
   run:
	x0vncserver --SecurityTypes=None

   Connect from another machine with:
	vncviewer hostname:0
   and verify you see and can control the existing session you ran
   x0vncserver in.
