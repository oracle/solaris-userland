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
# Copyright (c) 2012, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =		64_and_32
CTF_MODE =		off	# Has no effect

# Parallel build jobs are supported only if GNU make is used.
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		sendmail
COMPONENT_VERSION=	8.18.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
IPS_COMPONENT_VERSION=	$(COMPONENT_VERSION)
HUMAN_VERSION=		$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=	https://ftp.sendmail.org/
COMPONENT_ARCHIVE=	$(COMPONENT_NAME).$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:cbf1f309c38e4806f7cf3ead24260f17d1fe8fb63256d13edb3cdd1a098f0770
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)$(COMPONENT_ARCHIVE)
# For check_anitya target, https://release-monitoring.org/project/4796
COMPONENT_ANITYA_ID=	4796

COMPONENT_BAID=		158337

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

BUILD_STYLE= justmake
INSTALL_TARGET=
include $(WS_MAKE_RULES)/common.mk

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Although we build 32_and_64, everything except libmilter just wants 64,
# which is why the macros just below only have values for 64.  libmilter
# is dealt with further below.
PKG_PROTO_DIRS += $(BUILD_DIR_64)
PKG_PROTO_DIRS += $(BUILD_DIR_64)/obj.SunOS.$(OS_RELEASE).$(ARCH)
PKG_PROTO_DIRS += $(COMPONENT_DIR)/files/man

# Userland default includes -mt which links with libthread which we don't need.
studio_MT =

# We set ARCH to match sendmail's configure-like script: on x86, it simply
# uses 'uname -m', but on sparc it shortens "sun4*" into "sun4".
ARCH	:=	$(shell uname -m)
ifeq ($(findstring sun4,$(ARCH)),sun4)
ARCH	=	sun4
endif
FILE_DIR=$(COMPONENT_DIR)/files
M4_ARG=-D_NO_MAKEINFO_
SM_BUILD_SUB_DIR=obj.SunOS.$(OS_RELEASE).$(ARCH)
SM_BUILD_DIR=$(@D)/$(SM_BUILD_SUB_DIR)

# libmilter is built 32- and 64-bit, but its Makefile installs into a common
# location, so we use the macro below in its manifest to distinguish between
# the different built objects.
PKG_MACROS += LIBMILTER_BUILD_DIR=$(SM_BUILD_SUB_DIR)

CLEAN_PATHS += $(FILE_DIR)/aux/mailq

# This appends "+Sun" to the version string, which we do for historical
# reasons.  If we did this via patch, then we would have to revise the patch
# with every new release, since the version string changes every time.
COMPONENT_PREP_ACTION =	$(GSED) -i -e 's/\(Version\[\] = "8\.[^"]*\)/\1+Sun/' \
    $(COMPONENT_SRC)/sendmail/version.c;

# For 5.11, we need to distinguish between different versions, so use
# OS_VERSION.  For other releases, SOLARIS_VERSION, which comes from
# OS_RELEASE, is sufficient.
ifeq ($(OS_RELEASE),5.11)
SOLARIS= 	$(shell echo $(OS_VERSION) | \
    $(GSED) -e 's/^/2/' -e 's/\.//' -e 's/$$/0/')
else
SOLARIS=	$(shell echo $(SOLARIS_VERSION) | \
    $(GSED) -e 's/\.//' -e 's/$$/00/')
endif
SM_DEFS=	-DSOLARIS=$(SOLARIS)
# libmilter and sendmail must come before include, so appending to the default
# value of LINT_FLAGS will not work; we must redefine it here.
SM_INCLUDES=	-I$(SM_BUILD_DIR)/libmilter -I$(SOURCE_DIR)/sendmail \
    -I$(SOURCE_DIR)/include -I$(SOURCE_DIR) -I.
LINT_FLAGS =	-nsvx $(SM_DEFS) $(SM_INCLUDES)
CCOPTS =	-erroff=E_STATEMENT_NOT_REACHED $(CC_BITS) -std=c89

COMPONENT_BUILD_ARGS += CC="$(CC)"
COMPONENT_BUILD_ARGS += CCOPTS="$(CCOPTS)"
COMPONENT_BUILD_ARGS += CCLINK="$(CC)"
COMPONENT_BUILD_ARGS += CC_PIC="$(CC_PIC)"
COMPONENT_BUILD_ARGS += LDOPTS="$(CC_BITS)"

# For a debug build: gmake clean build SENDMAILDEBUG=yes
ifeq ($(strip $(SENDMAILDEBUG)), yes)
COMPONENT_BUILD_ENV += studio_OPT=""
endif

# Sendmail looks for its build configuration in various per-OS config files
# in its devtools/Site sub-dir, with site.config.m4 being the fallback.  So
# create that file as part of the 'prep' phase with the configuration as we
# want it.
#
# Note that the blank line after `define name +=` is required and that
# "+=" causes an extra space to be added, which the sed script removes.
#
$(SOURCE_DIR)/.prep:	$(SOURCE_DIR)/devtools/Site/site.config.m4

define SITE_CONFIG_M4 :=
APPENDDEF(`conf_sendmail_ENVDEF', `-DSUN_EXTENSIONS')
APPENDDEF(`conf_sendmail_ENVDEF', `-DVENDOR_DEFAULT=VENDOR_SUN')
APPENDDEF(`conf_sendmail_ENVDEF', `-DSUN_INIT_DOMAIN')
APPENDDEF(`conf_sendmail_ENVDEF', `-DSUN_SIMPLIFIED_LDAP')
APPENDDEF(`conf_sendmail_ENVDEF', `-DTCPWRAPPERS')
APPENDDEF(`conf_sendmail_ENVDEF', `-DSTARTTLS')
APPENDDEF(`conf_sendmail_ENVDEF', `-DSASL=2')
APPENDDEF(`conf_sendmail_ENVDEF', `-D_FFR_LOCAL_DAEMON')
APPENDDEF(`conf_sendmail_ENVDEF', `-D_FFR_MAIL_MACRO')
APPENDDEF(`conf_sendmail_ENVDEF', `-DIPV6_FULL=0')
APPENDDEF(`conf_sendmail_LIBS', `-lsldap')
APPENDDEF(`conf_sendmail_LIBS', `-lwrap')
APPENDDEF(`conf_sendmail_LIBS', `-lumem')
APPENDDEF(`conf_sendmail_LIBS', `-lssl')
APPENDDEF(`conf_sendmail_LIBS', `-lcrypto')
APPENDDEF(`conf_sendmail_LIBS', `-lsasl2')
APPENDDEF(`confMAPDEF', `-DLDAPMAP')
APPENDDEF(`confLIBS', `-lldap -llber -lc')
endef

define SITE_CONFIG_M4 +=

endef

define SITE_CONFIG_M4 +=

define(`confENVDEF', `-DSOLARIS=$(SOLARIS) -DNETINET6')
define(`confDEPEND_TYPE', `Solaris')
define(`confMKDIR', `/usr/bin/mkdir')
define(`confMTCFLAGS', `$(CC_PIC)')
define(`sendmailTARGET_LINKS', `')
endef

ifeq ($(strip $(SENDMAILDEBUG)), yes)
define SITE_CONFIG_M4 +=

define(`confOPTIMIZE', `-g')
endef
endif

export SITE_CONFIG_M4

$(SOURCE_DIR)/devtools/Site/site.config.m4:	unpack
	$(file > $@,$(SITE_CONFIG_M4))
	$(GSED) --in-place -e 's/ $$//' $@

# mailq's Makefile doesn't grok the 32- and 64-bit build. We just want 64.
# So we clean before we build, and the last build (64) wins, which is what
# we want.
COMPONENT_POST_BUILD_ACTION = cd $(FILE_DIR)/aux ; \
    $(GMAKE) BITS=$(BITS) clean build;
COMPONENT_POST_BUILD_ACTION += cd $(@D)/doc/op ; \
    GROFF_NO_SGR=1 $(GMAKE) op.txt ; \
    $(GMAKE) op.pdf ;

COMPONENT_POST_INSTALL_ACTION += cd $(FILE_DIR)/aux ; $(GMAKE) install ;
COMPONENT_POST_INSTALL_ACTION += \
    $(CP) $(FILE_DIR)/cf/domain/solaris-generic.m4 $(@D)/cf/domain/ ;
COMPONENT_POST_INSTALL_ACTION += \
    $(CP) $(FILE_DIR)/cf/cf/sendmail.mc $(@D)/cf/cf/ ;
# Without the two $(CP)s below we would pick up the version of submit.cf
# from under $(COMPONENT_SRC), which is not what we want because it contains
# information (user, hostname, date, build path) from the upstream machine
# where the distro was created.  So we build our own version here, using
# $(M4_ARG), which suppresses the inclusion of all that information.
# Then we copy it to $(PROTO_DIR)/cf/cf instead of the more intuitive
# $(PROTOETCDIR)/mail/cf/cf to match the transform in the manifest that
# picks up everything under etc/mail/cf/ from cf/ instead.
COMPONENT_POST_INSTALL_ACTION += \
    cd $(@D)/cf/cf ; \
    $(RM) submit.cf ; \
    m4 $(M4_ARG) ../m4/cf.m4 submit.mc > submit.cf ; \
    $(CP) submit.cf $(PROTOETCDIR)/mail ; \
    $(MKDIR) $(PROTO_DIR)/cf/cf ; \
    $(CP) submit.cf $(PROTO_DIR)/cf/cf ; \
    m4 $(M4_ARG) ../m4/cf.m4 sendmail.mc > sendmail.cf ;
# Install "Sendmail Installation and Operation Guide"
COMPONENT_POST_INSTALL_ACTION +=	\
    $(MKDIR) -p $(PROTO_DIR)/usr/share/doc/op ; \
    $(CP) $(@D)/doc/op/op.txt $(PROTO_DIR)/usr/share/doc/op ; \
    $(CP) $(@D)/doc/op/op.pdf $(PROTO_DIR)/usr/share/doc/op ;

COMPONENT_TEST_ARGS += CC="$(CC)"
COMPONENT_TEST_ARGS += CCOPTS="$(CCOPTS)"
COMPONENT_TEST_ARGS += CCLINK="$(CC)"
COMPONENT_TEST_ARGS += CC_PIC="$(CC_PIC)"
COMPONENT_TEST_ARGS += LDOPTS="$(CC_BITS)"

COMPONENT_TEST_ENV +=	PATH=$(GNUBIN):$(USRBINDIR)

# The transforms below abstract out the 32- or 64-bit specific parts of
# the results, so we can use a common "all" master file.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

COMPONENT_TEST_TRANSFORMS += \
    '-e "s|^make.*: Entering directory.*$$|XXX_CC_XXX|g" ' \
    '-e "s|^make.*: Leaving directory.*$$|XXX_CC_XXX|g" ' \
    '-e "s|^make.*: Nothing to be.*$$|XXX_CC_XXX|g" ' \
    '-e "s|^$(CC).*$$|XXX_CC_XXX|g" ' \
    '-e "/^XXX_CC_XXX\\$$/d" ' \
    '-e "/^Configuration:.*$$/d" ' \
    '-e "/^Creating.*$$/d" ' \
    '-e "/^Including.*$$/d" ' \
    '-e "/^Making.*in.*$$/d" '

# This is a handy test target for developer.  Please leave functional.
.PHONY: test-version
test-version:
	LD_LIBRARY_PATH=$(PROTO_DIR)$(USRLIB) \
		$(PROTO_DIR)$(USRLIB)/sendmail -d0.1 -bt </dev/null

INSTALL_64=

# common targets
install:	$(INSTALL_32_and_64)

REQUIRED_PACKAGES += database/berkeleydb-5
REQUIRED_PACKAGES += library/libmilter
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/ldap
REQUIRED_PACKAGES += system/library/security/libsasl2
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += system/network/ldap/openldap
