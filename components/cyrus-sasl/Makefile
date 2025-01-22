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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#

BUILD_BITS= 64_and_32
# COMPILER was studio.  Some GNU features have crept in, e.g. format attribute.
COMPILER=		gcc

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		cyrus-sasl
# A change to COMPONENT_VERSION requires it to be seeded to build servers.
COMPONENT_VERSION=	2.1.28
COMPONENT_ARCHIVE_URL= \
	$(ARCHIVE_BASE)/cyrus-sasl-$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
ARCHIVE_BASE=	https://github.com/cyrusimap/cyrus-sasl/releases/download
COMPONENT_ARCHIVE_HASH=        \
	sha256:7ccfc6abd01ed67c1a0924b353e526f1b766b21f42d4562ee635a8ebfc5bb38c
COMPONENT_PROJECT_URL=	https://www.cyrusimap.org/sasl/
COMPONENT_ANITYA_ID=	13280

# Check DONOTUSE items when updating the version, these parts are
# removed before configuration as per our requirements.
DONOTUSE= $(SOURCE_DIR)/mac  $(SOURCE_DIR)/dlcompat-20010505

COMPONENT_BUGDB=	library/libsasl

COMPONENT_BAID=		143253

#
# OpenLDAP has a requirement on the version of Cyrus-SASL.
#
# A change to the version of Cyrus-SASL REQUIRES a change to OpenLDAP
# so that both are built and delivered in the same build.  To
# accomplish this the Cyrus-SASL changes should be built and installed
# (locally seeded, meaning you'll need a private build environment)
# before OpenLDAP is built and tested.
#
# The following check is to assert that OpenLDAP is dependent on
# Cyrus-SASL which contains a similar build time dependency check.
# ASSERT_PREP_ACTION can be overwritten to skip this test, caution advised!
LDAP_REQUIRE = \
	"depend type=require fmri=pkg:/system/library/security/libsasl2"
LDAP_SERVER_P5M = $(WS_COMPONENTS)/openldap/openldap-server.p5m
ASSERT_PREP_ACTION = \
	echo 'Assert openLDAP Makefile expects version $(COMPONENT_VERSION)';\
	if ! $(GNU_GREP) -q \
		'SASL_REQUIRED_VERSION=[[:space:]]$(COMPONENT_VERSION)' \
		$(WS_COMPONENTS)/openldap/Makefile; \
	then \
		echo 'ERROR: OpenLDAP not expecting this version!'; \
		echo 'OpenLDAP has built in checks that version must match!'; \
		exit 1; \
	fi; \
	echo 'Assert OpenLDAP requires Cyrus-SASL $(COMPONENT_VERSION)'; \
	if ! $(GNU_GREP) -q \
		$(LDAP_REQUIRE)@$(COMPONENT_VERSION) $(LDAP_SERVER_P5M); \
	then \
		echo 'ERROR: pkg file $(LDAP_SERVER_P5M)'; \
		echo 'Does not require libsasl2@$(COMPONENT_VERSION)!'; \
		exit 1; \
	fi;
COMPONENT_PREP_ACTION += $(ASSERT_PREP_ACTION)

COMPONENT_BUILD_ARGS +=	\
	CC_FOR_BUILD='$(CC) $(CONFIGURE_CPPFLAGS) $(CC_PIC_ENABLE)'

ifeq   ($(strip $(PARFAIT_BUILD)),yes)
PATH=$(PARFAIT_TOOLS):$(GNUBIN):$(SPRO_VROOT)/bin:$(USRBINDIR)
else
PATH=$(GNUBIN):$(SPRO_VROOT)/bin:$(USRBINDIR)
endif

SASL2.32 = $(USRLIBDIR)/sasl2
SASL2.64 = $(USRLIBDIR)/sasl2/$(MACH64)
SASL_CONFDIR = $(ETCDIR)/sasl2
PROTO_CONFDIR = $(PROTO_DIR)$(SASL_CONFDIR)

TESTS_DIR=$(PROTO_DIR)/tests
TESTS_32_DIR=$(TESTS_DIR)/$(MACH32)

INSTALL_TARGET=
TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-incompatible-pointer-types

$(BUILD_DIR_64)/%:	CPPFLAGS += -I$(BUILD_DIR_64)/include
$(BUILD_DIR_32)/%:	CPPFLAGS += -I$(BUILD_DIR_32)/include

# Configuration options to be applied, default option in [brackets]
#
CONFIGURE_OPTIONS += --with-openssl

CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)

# enable experimental SASLdb authentication module
CONFIGURE_OPTIONS += --enable-auth-sasldb

# enable use of the saslauth daemon using state dir DIR
CONFIGURE_OPTIONS += --with-saslauthd=/var/run/saslauthd

# set the DB library to use berkeley.
CONFIGURE_OPTIONS += --with-dblib=berkeley

# choose specific GSSAPI implementation [auto]
CONFIGURE_OPTIONS += --with-gss_impl=mit

# explicitly: not using GNU ld
CONFIGURE_OPTIONS += --without-gnu-ld

# Set plugin directory location.
CONFIGURE_OPTIONS.32 += --with-plugindir=$(SASL2.32)
CONFIGURE_OPTIONS.64 += --with-plugindir=$(SASL2.64)

# Use doors for IPC communication.
CONFIGURE_OPTIONS += --with-ipctype=doors

# use LDAP (in DIR) for saslauthd [no]
CONFIGURE_OPTIONS += --with-ldap=$(USRDIR)

# compile sample code [yes]
CONFIGURE_OPTIONS += --enable-sample

# enable unsupported LOGIN authentication [no]
CONFIGURE_OPTIONS += --enable-login
# set the directory where config files will be found PLUGINDIR:SYSCONFDIR/sasl2
CONFIGURE_OPTIONS += --with-configdir=$(ETCDIR)/sasl2

CONFIGURE_OPTIONS += --enable-ldapdb

# Additional directories where pkg transform should look for delivered files.
PKG_PROTO_DIRS += $(SOURCE_DIR)/doc $(COMPONENT_DIR)/Solaris

$(BUILD_DIR_64)/%:	LINT_FLAGS += -I$(BUILD_DIR_64)/include

LINTINCDIR= $(SOURCE_DIR)/include/sasl

INCLIST= hmac-md5.h \
	md5.h \
	md5global.h \
	prop.h \
	sasl.h \
	saslplug.h \
	saslutil.h

# Make an include/sasl directory to make llib-lsasl2 match llib-lsasl2.ln
COMPONENT_PREP_ACTION += \
	$(MKDIR) $(LINTINCDIR) ; \
	( cd $(LINTINCDIR) && \
	    ( for i in $(INCLIST) ; do \
		test -f ../$$i && ln -s ../$$i $$i || \
			echo "Warning: $$i not found!" ; \
	    done ) \
	) ;

# Fix up manual page references, Solaris uses section 3SASL not 3.
# Modifies Header line and sasl manual page references within.
# libsasl2.p5m takes care of the file renames from .3 to .3sasl.
# Note, some additional manual pages delivered from Solaris/usr/share/man/man3
COMPONENT_PREP_ACTION +=  $(FIND) $(@D)/man -type f -exec \
		gsed --in-place \
			-e 's/\(^.TH ".*" \)\("3"\)/\1"3SASL"/'\
			-e 's/\(sasl[^(]*\)(3)/\1(3SASL)/g' \
			{} +;

# For automake (prep) and $(SOURCE_DIR)/configure (configure)
export CONFIG_SITE=$(WS_COMPONENTS)/$(COMPONENT_NAME)/Solaris/config.site

CFG_COMPILE=/usr/share/$(notdir $(AUTOMAKE))

# GNU Build System files have to be regenerated for automake 1.16.
COMPONENT_PREP_ACTION += (cd $(@D) && pwd && \
		$(AUTORECONF) --verbose --force --install --symlink --make \
		-I $(COMPONENT_DIR)/m4 \
		-I $(SOURCE_DIR)/config \
	    );

# Remove some things we don't use and aren't in the BAID
COMPONENT_PREP_ACTION += $(RM) -r $(DONOTUSE);

INSTALL_32 +=	$(PROTOUSRLIBDIR)/libsasl.so.1
INSTALL_64 +=	$(PROTOUSRLIBDIR64)/libsasl.so.1

# common targets
install:	build $(INSTALL_32_and_64)

BUILTLIBSASL=lib/.libs/libsasl.so.1

COMPONENT_POST_BUILD_ACTION += \
    $(LD) -F libsasl2.so.3 $(LD_BITS) \
    -o $(BUILD_DIR_$(BITS))/$(BUILTLIBSASL) \
    -G -hlibsasl.so.1 $(LD_B_DIRECT) $(LD_Z_DEFS) -M$(COMPONENT_DIR)/mapfile ; \
    (cd $(BUILD_DIR_$(BITS))/sample; $(ENV) $(COMPONENT_BUILD_ENV) \
	$(MAKE) sample-client sample-server) ; \
    (cd $(BUILD_DIR_$(BITS))/utils; $(ENV) $(COMPONENT_BUILD_ENV) \
	$(MAKE) testsuite) ;

COMPONENT_POST_INSTALL_ACTION += \
        $(CP) $(BUILD_DIR_$(BITS))/utils/.libs/testsuite \
		$(PROTO_DIR)/$(SASL2.$(BITS))/testsuite ; \
        $(CP) $(BUILD_DIR_$(BITS))/sample/.libs/sample-server \
		$(PROTO_DIR)/$(SASL2.$(BITS))/sample-server ; \
        $(CP) $(BUILD_DIR_$(BITS))/sample/.libs/sample-client \
		$(PROTO_DIR)/$(SASL2.$(BITS))/sample-client ;

COMPONENT_POST_INSTALL_ACTION.32 += \
        $(MKDIR) $(TESTS_DIR) ; \
        $(MKDIR) $(TESTS_32_DIR) ; \
        $(CP) $(BUILD_DIR_32)/utils/.libs/testsuite $(TESTS_32_DIR) ; \
        $(CP) $(BUILD_DIR_32)/sample/.libs/sample-server $(TESTS_32_DIR) ; \
        $(CP) $(BUILD_DIR_32)/sample/.libs/sample-client $(TESTS_32_DIR) ;

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(MKDIR) $(TESTS_DIR) ; \
        $(CP) $(BUILD_DIR_64)/utils/.libs/testsuite $(TESTS_DIR) ; \
        $(CP) $(BUILD_DIR_64)/sample/.libs/sample-server $(TESTS_DIR) ; \
        $(CP) $(BUILD_DIR_64)/sample/.libs/sample-client $(TESTS_DIR) ;

$(PROTOUSRLIBDIR)/libsasl.so.1:	$(BUILD_DIR)/$(MACH32)/$(BUILTLIBSASL)
	$(CP) $< $@

$(PROTOUSRLIBDIR64)/libsasl.so.1:	$(BUILD_DIR)/$(MACH64)/$(BUILTLIBSASL)
	$(CP) $< $@

TARBALL_DIR=sasltest
CLEAN_PATHS += $(TARBALL_DIR)

test_tarball:	sasltest.tgz
TEST_SCRIPTS= setup_testsuite run_testsuite transform-results cleanup \
	setup-for-mit

sasltest.tgz:	install
	$(MKDIR) $(TARBALL_DIR)
	$(CHMOD) 0777 $(TARBALL_DIR)
	$(CP) -r $(TESTS_DIR)/* $(TARBALL_DIR)
	$(CP) $(COMPONENT_DIR)/test/* $(TARBALL_DIR)
	(cd $(TARBALL_DIR) && $(CHMOD) 0777 $(TEST_SCRIPTS))
	gtar czf sasltest.tgz $(TARBALL_DIR)

REQUIRED_PACKAGES += archiver/gnu-tar
REQUIRED_PACKAGES += database/berkeleydb-5
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/network/ldap/openldap
REQUIRED_PACKAGES += library/security/openssl-3
