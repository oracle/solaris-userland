curl is the component of the AI boot (iso) image where it is used for retrieving
of the archives from the WAN-Boot server. This is the reason why AI iso image
should be also tested when curl is updated.

The most harmless way to build the boot .iso image is to create virtual machine:

  $ vm install <your_workspace>/components/curl/

then read comments in components/curl/Solaris/dc_ai_x86.xml.patch how to modify
the distro_const(8) manifest (use gpatch then edit) to build boot image.

There is the example of the patch on the end of this file to be applied on Distro
Constructor manifest on machine then the distro_const(8) is run:
 # distro_const build -v /usr/share/distro_const/dc_ai_x86.xml

Also the /usr/share/distro_const/boot_archive_contents_x86.xml (contents of miniroot)
need to reflect changes like the library releases changes or a new dependences and so.
Whenever the library dependecies will change the boot_archive_contents_x86.xml need to
list these files needed otherwise the run time linker will not find it. This is because
the miniroot image is using only the "hand picked" files not the full packages.

Note: "nightly" publisher URL should be set accordingly to test case.
      i.e. if you have created virtual machine by the command:
        # vm install <your_curl_workspace>
      then you should let the depotd running and check the URL used by:
        # pkg publisher
      also the "solaris" publisher URL may need to be rectified dependind to trunk or
      release.

When the distro_const is finished there are .iso and .usb images in /rpool/dc/ai/media/.

To test of the .iso image you need an AI server and empty client to boot. See installadm(8)
for details how to create AI service from .iso and setup boot profiles.

--- /usr/share/distro_const/dc_ai_x86.xml	2017-01-12 16:07:40.688787058 +0000
+++ /usr/share/distro_const/dc_ai_x86.xml	2018-03-16 06:09:06.392870127 +0000
@@ -107,6 +107,7 @@
            Exclude documentation, man pages, header files and lint libraries
            for AI image
            -->
+           <facet set="false">facet.version-lock.web/curl</facet>
            <facet set="false">facet.devel</facet>
            <facet set="false">facet.doc</facet>
            <facet set="false">facet.doc.*</facet>
@@ -136,8 +137,11 @@
          </image>
       </destination>
       <source>
+        <publisher name="nightly">
+          <origin name="http://strax.us.oracle.com:12600/"/>
+        </publisher>
         <publisher name="solaris">
-          <origin name="http://pkg.oracle.com/solaris/release"/>
+          <origin name="http://ipkg.us.oracle.com/solaris11/dev/"/>
           <!--
             If mirrors for this publisher need to be set, specify them here.
           -->

Example of change of miniroot contents if libcurl release is changed:

--- /usr/share/distro_const/boot_archive_contents_x86.xml	2018-03-20 13:26:06.677249954 +0000
+++ /usr/share/distro_const/boot_archive_contents_x86.xml	2018-03-21 12:03:10.719303571 +0000
@@ -233,7 +240,7 @@
   <name>usr/lib/fm/libfmd_agent.so.1</name>
   <name>usr/lib/fm/libfmd_zfs.so.1</name>
   <name>usr/lib/libcurl.so.4</name>
-  <name>usr/lib/libcurl.so.4.4.0</name>
+  <name>usr/lib/libcurl.so.4.5.0</name>
   <name>usr/lib/libdiskmgt.so.1</name>
   <name>usr/lib/64/libdiskmgt.so.1</name>
   <name>usr/lib/libgss.so.1</name>
@@ -277,7 +284,7 @@
   <name>usr/lib/rad/client/c/amd64/libdlmgr1_client.so.1</name>
   <!-- Curl libraries  needed for /usr/sbin/dlmgmtd and AI -->
   <name>usr/lib/64/libcurl.so.4</name>
-  <name>usr/lib/64/libcurl.so.4.4.0</name>
+  <name>usr/lib/64/libcurl.so.4.5.0</name>
   <name>usr/lib/64/libgss.so.1</name>
   <name>usr/lib/64/libgssapi_krb5.so</name>
   <name>usr/lib/64/libgssapi_krb5.so.2</name>
