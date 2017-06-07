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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS=	64_and_32
COMPILER=	gcc

# Parallel build jobs are supported only if GNU make is used.
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

ifeq ($(MACH), sparc)
WAFOPTS = -j64
gcc_OPT= -O2
else
WAFOPTS = -j16
endif

# parfait seems to spin on us
export PARFAIT_BUILD=no

COMPONENT_NAME=		samba
COMPONENT_PROJECT_URL=	http://www.samba.org/
COMPONENT_BUGDB=	utility/samba
COMPONENT_ANITYA_ID=	4758

COMPONENT_VERSION=	4.9.3
TPNO=			47629
# Samba pre-releases are available on git only.
# if you want to build Samba from git uncomment next 4 lines
#GIT_REPO=		https://git.samba.org/samba.git
#GIT_COMMIT_ID=		samba-4.7.0rc4
#GIT_HASH=		sha256:6f210b7757b6b55ae0fafff0c21a1704cc1a7621d81462d630c162097959d47d
#COMPONENT_SRC_URL=	$(GIT_REPO)
# clone of git.samba.org takes a long
# if you want to build Samba from archive uncomment next 3 lines
COMPONENT_ARCHIVE_URL=	https://download.samba.org/pub/samba/stable/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH=	sha256:cf8fd8707e9ad7bce7832006aac5644155165745ba371170661b3004fa2135cf
COMPONENT_SRC_URL=	$(COMPONENT_ARCHIVE_URL)

include $(WS_MAKE_RULES)/common.mk

# Winbind only build is 32b.
WB_ONLY_CONF=		$(BUILD_DIR_32)/.configured
SAMBA_FULL_CONF=	$(BUILD_DIR_64)/.configured

$(BUILD_DIR_32)/%:	MACHLIBDIR=
$(BUILD_DIR_64)/%:	MACHLIBDIR=/$(MACH64)

# Uncomment the followin line to enable verbose and single-thread (readable) build.
#override WAFOPTS	=	-v -j1
WAF= ./buildtools/bin/waf

PKG_VARS += COMPONENT_SRC_URL
# Set the pkg... path to search files in ./Solaris/ dir (mainly the SMF manifests are there)
PKG_PROTO_DIRS += $(COMPONENT_DIR)

# pkg-config files
PKGCONFIG_AUX_DIR = $(BUILD_DIR)/lib$(MACHLIBDIR)/pkgconfig

LIBS +=		-lrt -lsec -lcrypt -lmd5 -lsocket -lnsl
# More libs needed by Samba (libavahi, libgamin, ...)
$(SAMBA_FULL_CONF): LIBS += -lsendfile -lavahi-common -lavahi-core

CPPFLAGS +=	$(CPP_LARGEFILES)
CPPFLAGS +=	$(CPP_XPG6MODE)

LDFLAGS +=	-m$(BITS)
LDFLAGS +=	-R/usr/lib/samba$(MACHLIBDIR)
LDFLAGS +=	-R/usr/lib/samba/private$(MACHLIBDIR)
LDFLAGS +=	$(LIBS)

CONFIGURE_OPTIONS =	--exec-prefix=/usr
CONFIGURE_OPTIONS +=	--bindir=/usr/lib/samba/bin
CONFIGURE_OPTIONS +=	--sbindir=/usr/lib/samba/sbin
CONFIGURE_OPTIONS +=	--libdir=/usr/lib/samba$(MACHLIBDIR)

CONFIGURE_OPTIONS +=	--with-privatelibdir=/usr/lib/samba/private$(MACHLIBDIR)
CONFIGURE_OPTIONS +=	--sysconfdir=/etc/samba
CONFIGURE_OPTIONS +=	--with-pammodulesdir=/usr/lib/samba/security$(MACHLIBDIR)
CONFIGURE_OPTIONS +=	--datarootdir=/usr/lib/samba
CONFIGURE_OPTIONS +=	--mandir=/usr/share/man
CONFIGURE_OPTIONS +=	--htmldir=/usr/share/samba/swat/help
CONFIGURE_OPTIONS +=	--includedir=/usr/include/samba
CONFIGURE_OPTIONS +=	--with-privatedir=/etc/samba/private
CONFIGURE_OPTIONS +=	--localstatedir=/var/samba
CONFIGURE_OPTIONS +=	--with-logfilebase=/var/samba/log
CONFIGURE_OPTIONS +=	--sharedstatedir=/var/samba/com
CONFIGURE_OPTIONS +=	--libexecdir=/usr/lib/samba
# Whenever getfacl is found HAVE_SOLARIS_UNIXWARE_ACLS is set and
# vfs_solarisacl is placed into the list of the static modules
CONFIGURE_OPTIONS +=	--with-static-modules=
$(SAMBA_FULL_CONF):	CONFIGURE_OPTIONS += \
	--with-shared-modules=vfs_worm,vfs_zfsacl,vfs_prealloc,vfs_cacheprime,vfs_commit,idmap_ldap,idmap_tdb2,idmap_rid,idmap_ad,idmap_hash,idmap_adex
$(WB_ONLY_CONF):	CONFIGURE_OPTIONS += \
	--with-shared-modules=idmap_ldap,idmap_tdb2,idmap_rid,idmap_ad,idmap_hash,idmap_adex
CONFIGURE_OPTIONS +=	--with-ads
CONFIGURE_OPTIONS +=	--with-winbind
CONFIGURE_OPTIONS +=	--with-ldap
CONFIGURE_OPTIONS +=	--with-system-mitkrb5
CONFIGURE_OPTIONS +=	--without-ad-dc

CONFIGURE_OPTIONS +=	--nocache
CONFIGURE_OPTIONS +=	--nopyo
CONFIGURE_OPTIONS +=	--disable-rpath
CONFIGURE_OPTIONS +=	--disable-gnutls
CONFIGURE_OPTIONS +=	--bundled-libraries=ALL

# PATH for 64-bit is already set in configure.mk
CONFIGURE_ENV.32 +=	PATH="$(PATH)"
CONFIGURE_ENV += 	CC="$(CC)"
CONFIGURE_ENV += 	CPP="$(CC) -E"
CONFIGURE_ENV += 	AWK=gawk
CONFIGURE_ENV += 	PERL=$(PERL)
CONFIGURE_ENV += 	PYTHONDIR="$(PYTHON_VENDOR_PACKAGES)"
CONFIGURE_ENV += 	PYTHONARCHDIR="$(PYTHON_VENDOR_PACKAGES)/samba"
CONFIGURE_ENV += 	LD="$(LD)"
CONFIGURE_ENV +=	CFLAGS="$(CFLAGS)"
CONFIGURE_ENV +=	CPPFLAGS="$(CPPFLAGS) -I$(PROTO_DIR)/usr/include -I$(COMPONENT_DIR)/Solaris/include"
CONFIGURE_ENV +=	LINKFLAGS="$(LDFLAGS) $(LD_B_DIRECT)"
CONFIGURE_ENV.64 +=	MACH64="$(MACH64)"
CONFIGURE_ENV +=	LD_EXEC_OPTIONS="$(LD_EXEC_OPTIONS)"
CONFIGURE_ENV +=	CUPS_CONFIG=$(USRBINDIR)/cups-config
CONFIGURE_ENV += 	INSTALL="$(INSTALL)"
CONFIGURE_ENV += 	PKG_CONFIG_PATH="$(PKGCONFIG_AUX_DIR):$(PKG_CONFIG_PATH)"

# cleanup unpacked archive
COMPONENT_PREP_ACTION += (cd $(@D) ; $(WAF) distclean $(WAFOPTS) );

# configure
COMPONENT_PRE_CONFIGURE_ACTION += \
   $(CLONEY) $(SOURCE_DIR) $(@D); \
   $(CP) $(COMPONENT_DIR)/Solaris/vfs_samfs.c $(@D)/source3/modules/vfs_samfs.c; \
   $(MKDIR) $(PKGCONFIG_AUX_DIR); \
   $(CP) $(COMPONENT_DIR)/Solaris/ldap.pc $(PKGCONFIG_AUX_DIR); \
   $(CP) $(COMPONENT_DIR)/Solaris/lber.pc $(PKGCONFIG_AUX_DIR); \
   $(CP) $(COMPONENT_DIR)/Solaris/openldap.pc $(PKGCONFIG_AUX_DIR);

$(SAMBA_FULL_CONF): COMPONENT_PRE_CONFIGURE_ACTION += sed -e \
    "s:@LIBDIR@:$(PROTO_DIR)/opt/SUNWsamfs/lib$(MACHLIBDIR):g;s:@INCLUDEDIR@:$(COMPONENT_DIR)/Solaris/include:g" \
    $(COMPONENT_DIR)/Solaris/samfs.pc > $(PKGCONFIG_AUX_DIR)/samfs.pc;

# Oracle HSM helper library
$(SAMBA_FULL_CONF): COMPONENT_PRE_CONFIGURE_ACTION += \
   $(MKDIR) $(PROTO_DIR)/opt/SUNWsamfs/lib$(MACHLIBDIR) ; \
   $(CC) -m$(BITS) -G $(CC_PIC_MODE) -hlibsam.so Solaris/libsam.c \
	-I$(COMPONENT_DIR)/Solaris/include \
	-o $(PROTO_DIR)/opt/SUNWsamfs/lib$(MACHLIBDIR)/libsam.so ;

CONFIGURE_SCRIPT= $(WAF) configure $(WAFOPTS)
CONFIG_SHELL=

# build
COMPONENT_BUILD_ENV += PATH="$(PATH)"
%/.built: GMAKE= $(WAF) build $(WAFOPTS)
$(SAMBA_FULL_CONF:.configured=.built): COMPONENT_BUILD_TARGETS=
$(WB_ONLY_CONF:.configured=.built): COMPONENT_BUILD_TARGETS= --targets=nss_winbind,pamwinbind

# install
PERL_SCRIPTS   += $(PROTO_DIR)/usr/lib/samba/bin/findsmb
PERL_SCRIPTS   += $(PROTO_DIR)/usr/lib/samba/bin/pidl
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/lib/samba/sbin/samba-gpupdate
PYTHON_SCRIPTS += \
 $(shell nawk -F \= \
  ' $$1 ~ /^file.*path/ && $$2 ~ /.*\.py$$/ {print "$(PROTO_DIR)/"$$2;} ' \
  $(COMPONENT_DIR)/samba.proto-objects)
COMPONENT_INSTALL_ENV += PATH="$(PATH)"
COMPONENT_INSTALL_ARGS = --destdir=$(PROTO_DIR)
%/.installed: GMAKE= $(WAF) install $(WAFOPTS)
$(SAMBA_FULL_CONF:.configured=.installed): COMPONENT_INSTALL_TARGETS=
$(SAMBA_FULL_CONF:.configured=.installed): COMPONENT_POST_INSTALL_ACTION += \
   $(MKDIR) $(PROTO_DIR)/etc/samba ; \
   sed -f $(COMPONENT_DIR)/Solaris/smbconf.sed \
     > $(PROTO_DIR)/etc/samba/smb.conf-example \
     $(BUILD_DIR_SMB)/examples/smb.conf.default ; \
   $(PYTHON) -m compileall $(PROTO_DIR)/$(PYTHON_VENDOR_PACKAGES)/ ;

# do not do waf install for winbind only - override the recipe
$(WB_ONLY_CONF:.configured=.installed): $(WB_ONLY_CONF:.configured=.built)
	/bin/sh -c "cd $(@D) ; \
	    $(INSTALL) -d $(PROTO_DIR)/usr/lib/samba$(MACHLIBDIR) ; \
	    $(INSTALL) -m 0555 -t $(PROTO_DIR)/usr/lib/samba$(MACHLIBDIR) bin/shared/!(pam_*).so* ; \
	    $(INSTALL) -d $(PROTO_DIR)/usr/lib/samba/security$(MACHLIBDIR) ; \
	    $(INSTALL) -m 0555 -t $(PROTO_DIR)/usr/lib/samba/security$(MACHLIBDIR) bin/shared/pam_*.so* ; \
	    $(INSTALL) -d $(PROTO_DIR)/usr/lib/samba/private$(MACHLIBDIR) ; \
	    $(INSTALL) -m 0555 -t $(PROTO_DIR)/usr/lib/samba/private$(MACHLIBDIR) bin/shared/private/*.so* \
	"
	$(TOUCH) $@

# no tests
test:		$(NO_TESTS)

system-test:    $(NO_TESTS)

REQUIRED_PACKAGES += library/file-monitor/gamin
REQUIRED_PACKAGES += library/jansson
REQUIRED_PACKAGES += library/libarchive
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/samba/libsmbclient
REQUIRED_PACKAGES += runtime/perl-522
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/security/crypto
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += system/network/avahi
REQUIRED_PACKAGES += system/network/ldap/openldap
