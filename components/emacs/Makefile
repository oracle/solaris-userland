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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#
# This code is built with gcc. See README.
#
# As Solaris always has a 64-bit kernel, and 64-bit emacs can handle larger
# files, we only build and deliver 64-bit binaries. 
#
COMPILER=	gcc
BUILD_BITS=	64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		emacs
COMPONENT_VERSION=	30.1
COMPONENT_ARCHIVE_HASH=	\
    sha256:54404782ea5de37e8fcc4391fa9d4a41359a4ba9689b541f6bc97dd1ac283f6c
COMPONENT_ANITYA_ID=	675

COMPONENT_BAID=		323231

INSTALL_TARGET=
# The upstream emacs distribution does not have tests to be run
# from this target.
TEST_TARGET= $(NO_TESTS)

# We build three different variants of emacs for our users.
VARIANTS =	nox x gtk

CONFIGURE_64 = $(VARIANTS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
BUILD_64 = $(VARIANTS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
INSTALL_64 = $(VARIANTS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)

include $(WS_MAKE_RULES)/gnu-component.mk

# If a patch is present that alters the configure.ac file, get the new
# configure generated during prep. Otherwise, comment this out.
COMPONENT_PREP_ACTION = (cd $(@D) ; aclocal -I m4; autoconf )

# emacs creates a directory in usr/lib/emacs/$(COMPONENT_VERSION) that
# contains the platform name. Although the name is platform dependent,
# the files inside it are the same on all platforms. By adding this
# to the pkgmogrify macros, we can write our manifests in a portable way.
EMACS_ULEV_PFX = $(MACH:sparc=sparc-sun)
EMACS_ULEVDIR =	 $(EMACS_ULEV_PFX:i386=x86_64-pc)-solaris$(SOLARIS_VERSION)
PKG_MACROS +=	EMACS_ULEVDIR=$(EMACS_ULEVDIR)

# Uncomment this for debugging only. It configures emacs to run from the
# local proto instead of from its final installed location. This is useful
# for initial bringup of new emacs versions, but can only be used up through
# the 'gmake build' stage.
#
#CONFIGURE_PREFIX =	$(PROTO_DIR)/usr

# Never use xmkmf to find X11 libraries from autoconf. They are all available
# from standard system locations, and we don't want the ld -L option that
# gets injected.
CONFIGURE_ENV +=	XMKMF="false" 

# configure options common to all variants of emacs that we want to build.
CONFIGURE_OPTIONS +=	--infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS +=	--datarootdir=$(CONFIGURE_PREFIX)/share
CONFIGURE_OPTIONS +=	--libexecdir=$(CONFIGURE_PREFIX)/lib
CONFIGURE_OPTIONS +=	--libdir=$(CONFIGURE_LIBDIR.32) 
CONFIGURE_OPTIONS +=	--with-gif=no
CONFIGURE_OPTIONS +=	--without-imagemagick
CONFIGURE_OPTIONS +=	--without-lcms2
CONFIGURE_OPTIONS +=	--disable-build-details
CONFIGURE_OPTIONS +=	--with-gameuser=no
CONFIGURE_OPTIONS +=	ac_cv_sys_long_file_names=yes
ifeq   ($(strip $(PARFAIT_BUILD)),yes)
CONFIGURE_OPTIONS +=	emacs_cv_prog_cc_o=no
endif

# Starting with Emacs 30.1, the Elisp native compiler is enabled by default,
# subject to the availability of libgccjit. This does not impact Solaris yet,
# because libgccjit is not present, but if libgccjit appears, the emacs build
# will try to use it. To prevent an unplanned or tested switch, explicitly
# disable it for now.
CONFIGURE_OPTIONS +=	--with-native-compilation=no

# The emacs INSTALL says
#
#	Emacs will autolaunch a D-Bus session bus, when the environment
#	variable DISPLAY is set, but no session bus is running.  This might be
#	inconvenient for Emacs when running as daemon or running via a remote
#	ssh connection.  In order to completely prevent the use of D-Bus,
#	configure Emacs with the options '--without-dbus --without-gconf
#	--without-gsettings'.
#
# dbus does not offer sufficient utility for Solaris to be worth the negative
# interactions with ssh, where the session blocks on exit due to dbus holding
# an open port. And, gsettings causes numerous startup errors of the form
#
#    (process:25309): GLib-GIO-CRITICAL **: file gsettingsschema.c:
#	line 416: assertion 'source != NULL' failed
# 
CONFIGURE_OPTIONS +=	--without-dbus --without-gconf --without-gsettings

ADIHEAP_MODE =	$(ADIHEAP_DISABLE)

# variant specific configure options
$(BUILD_DIR)/%-nox/.configured: CONFIGURE_OPTIONS += --without-all --without-x
$(BUILD_DIR)/%-x/.configured:    CONFIGURE_OPTIONS +=	--with-x-toolkit=lucid
$(BUILD_DIR)/%-gtk/.configured:  CONFIGURE_OPTIONS +=	--with-x-toolkit=gtk

# we need to build all variants, but only have to install one in order
# to get the common files shared by all. We use COMPONENT_POST_INSTALL_ACTION
# to remove unwanted files, copy the emacs binaries from the other tookit
# builds into place, and install the additional files we provide.
#
# Note that this tweaking is not required, as the proto need not match
# the packaging. However, doing it this way allows us to examine the proto
# as a finished and complete product, simplifies debugging emacs, and
# facilitates the use of 'gmake sample-manifest'.
PBIN=		$(PROTO_DIR)/usr/bin
PETC=		$(PROTO_DIR)/usr/share/emacs/$(COMPONENT_VERSION)/etc
PGBIN=		$(PROTO_DIR)/usr/gnu/bin
PGSHAREMAN1=	$(PROTO_DIR)/usr/gnu/share/man/man1
PSHAREMAN1=	$(PROTO_DIR)/usr/share/man/man1
PULEVDIR=	$(PROTO_DIR)/usr/lib/emacs/$(COMPONENT_VERSION)/$(EMACS_ULEVDIR)
PVAR=		$(PROTO_DIR)/var

# Remove things 'install' delivers to the proto that we don't want. Doing
# this keeps them from showing up in the generated manifest, and reduces
# the chance of missing one and accidentally packaging it:
#
#  -	The systemd support, which is only applicable to Linux.
#
#  -	The emacs executable from /usr/bin. We install the binaries
#	under their variant names (emacs-nox, etc). /usr/bin/emacs ends
#	up as an IPS mediated link.
#
#  -	The pdumper (.pdmp) files corresponding to the emacs executable.
#	These are also installed under their matching variant names.
#
COMPONENT_POST_INSTALL_ACTION += $(RM) -rf $(PROTO_DIR)/usr/lib/systemd
COMPONENT_POST_INSTALL_ACTION += $(RM) \
	$(PBIN)/emacs		$(PBIN)/emacs-* \
	$(PULEVDIR)/emacs.pdmp	$(PULEVDIR)/emacs-*.pdmp ;

# GTK binaries and pdmp files
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(BUILD_DIR)/$(MACH64)-gtk/src/emacs-$(COMPONENT_VERSION).1 \
		$(PBIN)/emacs-gtk ;
COMPONENT_POST_INSTALL_ACTION += \
	$(LN) $(PBIN)/emacs-gtk $(PBIN)/emacs-gtk-$(COMPONENT_VERSION) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(BUILD_DIR)/$(MACH64)-gtk/src/emacs-$(COMPONENT_VERSION).1.pdmp \
		$(PULEVDIR)/emacs-gtk.pdmp ;
COMPONENT_POST_INSTALL_ACTION += \
	$(LN) $(PULEVDIR)/emacs-gtk.pdmp \
		$(PULEVDIR)/emacs-gtk-$(COMPONENT_VERSION).pdmp ;

# Non-X11 binaries and pdmp files
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(BUILD_DIR)/$(MACH64)-nox/src/emacs-$(COMPONENT_VERSION).1 \
		$(PBIN)/emacs-nox ;
COMPONENT_POST_INSTALL_ACTION += \
	$(LN) $(PBIN)/emacs-nox $(PBIN)/emacs-nox-$(COMPONENT_VERSION) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(BUILD_DIR)/$(MACH64)-nox/src/emacs-$(COMPONENT_VERSION).1.pdmp \
		$(PULEVDIR)/emacs-nox.pdmp ;
COMPONENT_POST_INSTALL_ACTION += \
	$(LN) $(PULEVDIR)/emacs-nox.pdmp \
		$(PULEVDIR)/emacs-nox-$(COMPONENT_VERSION).pdmp ;

# X11 (Athena) binaries and pdmp files
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(BUILD_DIR)/$(MACH64)-x/src/emacs-$(COMPONENT_VERSION).1 \
		$(PBIN)/emacs-x ;
COMPONENT_POST_INSTALL_ACTION += \
	$(LN) $(PBIN)/emacs-x $(PBIN)/emacs-x-$(COMPONENT_VERSION) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(BUILD_DIR)/$(MACH64)-x/src/emacs-$(COMPONENT_VERSION).1.pdmp \
		$(PULEVDIR)/emacs-x.pdmp ;
COMPONENT_POST_INSTALL_ACTION += \
	$(LN) $(PULEVDIR)/emacs-x.pdmp \
		$(PULEVDIR)/emacs-x-$(COMPONENT_VERSION).pdmp ;

# ctags and etags go in /usr/gnu/bin instead of /usr/bin. At this time,
# etags could arguably go into /usr/bin, but we'd like to preserve the
# ability to replace the standard Solaris /usr/bin/ctags, along with
# both of the ones we're delivering, with Exuberant Ctags. Putting both
# emacs tags programs in /usr/gnu/bin helps that, and is a simpler story.
COMPONENT_POST_INSTALL_ACTION += $(MKDIR) $(PGBIN) ;
COMPONENT_POST_INSTALL_ACTION += $(MV) $(PBIN)/ctags $(PBIN)/etags $(PGBIN) ;

# We do not install the files under /var/games/emacs. The reason for
# this is that we do not install update-game-score as setuid, and
# therefore the game files are not usable. This the same decision made
# by Debian, among others.
COMPONENT_POST_INSTALL_ACTION += $(RM) -r $(PVAR) ;

# Provide manpages for the emacs variants, which are our creation, referring
# the reader to the main emacs(1) manpage.
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) augment/man/man1/emacs-gtk.1 $(PSHAREMAN1)/emacs-gtk.1 ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) augment/man/man1/emacs-nox.1 $(PSHAREMAN1)/emacs-nox.1 ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) augment/man/man1/emacs-x.1 $(PSHAREMAN1)/emacs-x.1 ;

COMPONENT_POST_INSTALL_ACTION += $(MKDIR) $(PGSHAREMAN1) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(COMPONENT_SRC)/doc/man/ctags.1 $(PGSHAREMAN1)/ctags.1 ;
COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(COMPONENT_SRC)/doc/man/etags.1 $(PGSHAREMAN1)/etags.1 ;

# Throw away usr/share/info/dir and usr/share/info/info.info. These files
# live at the topmost node of the Info hierarchy. Emacs builds them, as
# presumably do all GNU packages, but on Solaris, they are delivered by
# pkg:/text/texinfo.
COMPONENT_POST_INSTALL_ACTION += $(RM) \
	$(PROTO_DIR)/usr/share/info/dir \
	$(PROTO_DIR)/usr/share/info/info.info ;

# By default, emacs is configured to compress lisp files, manpages, and info
# files. The option to disable that (--without-compress-install) has no
# granularity --- it's all or nothing. For Solaris, we want to compress lisp
# sources, but not the others. It's simplest to let everything be compressed.
# and then explicitly decompress the manpages and info files.
COMPONENT_POST_INSTALL_ACTION += $(GUNZIP) \
	$(PROTO_DIR)/usr/share/info/*.gz \
	$(PROTO_DIR)/usr/share/man/man1/*.gz ;

# common targets
install:	$(BUILD_64) $(BUILD_DIR)/$(MACH64)-x/.installed 

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += editor/gnu-emacs
REQUIRED_PACKAGES += file/gnu-findutils
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/librsvg
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += image/library/libwebp
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/libsm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxcomposite
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxfixes
REQUIRED_PACKAGES += x11/library/libxi
REQUIRED_PACKAGES += x11/library/libxinerama
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/libxpm
REQUIRED_PACKAGES += x11/library/libxrandr
REQUIRED_PACKAGES += x11/library/libxrender
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
