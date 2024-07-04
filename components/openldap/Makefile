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
# Copyright (c) 2011, 2024, Oracle and/or its affiliates.
#
# Build requirements, needed before inclusion of shared-macros.
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

# Component information, used for download and packaging.
# -------------------------------------------------------
# openLDAP version encoding within IPS, our rule is:
#   openLDAP <x>.<y>.<z>        =>   IPS <x>.<y>.<z>.0.<s>
# <s> is for Solaris specific modifications as necessary.
COMPONENT_NAME=		openldap
COMPONENT_VERSION=	2.6.8
HUMAN_VERSION=		$(COMPONENT_VERSION)
IPS_COMPONENT_VERSION=	$(COMPONENT_VERSION).0.0
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tgz
COMPONENT_PROJECT_URL=	http://www.openldap.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:48969323e94e3be3b03c6a132942dcba7ef8d545f2ad35401709019f696c3c4e
COMPONENT_ARCHIVE_URL=	\
    ftp://ftp.openldap.org/pub/OpenLDAP/openldap-release/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	service/openldap
# For check_anitya target, https://release-monitoring.org/project/2551
COMPONENT_ANITYA_ID=	2551
COMPONENT_BAID=		168741

#
# Cyrus-SASL is a requirement.
#
# A change to the version of Cyrus-SASL REQUIRES a change here in
# OpenLDAP so that both are built and delivered in the same build.  To
# accomplish this the Cyrus-SASL changes should be built and installed
# (locally seeded, meaning you'll need a private build environment)
# before OpenLDAP is built and tested.
#
# The following check is to assert that OpenLDAP is dependent on
# Cyrus-SASL which contains a similar build time dependency check.
# ASSERT_PREP_ACTION can be overwritten to skip this test, caution advised!
SASL_REQUIRED_VERSION= 2.1.28
LDAP_REQUIRE = \
	"depend type=require fmri=pkg:/system/library/security/libsasl2"
LDAP_SERVER_P5M = $(COMPONENT_DIR)/openldap-server.p5m
LDAP_CLIENT_P5M = $(COMPONENT_DIR)/openldap-client.p5m
ASSERT_PREP_ACTION = \
	echo 'Assert Cyrus-SASL version matches $(SASL_REQUIRED_VERSION)'; \
	if ! $(GNU_GREP) -q \
		'COMPONENT_VERSION=[[:space:]]$(SASL_REQUIRED_VERSION)' \
		$(WS_COMPONENTS)/cyrus-sasl/Makefile; \
	then \
		echo 'ERROR: Cyrus_SASL not at expected version!'; \
		echo 'OpenLDAP has built in checks that version must match!'; \
		exit 1; \
	fi; \
	echo 'Assert OpenLDAP requires Cyrus-SASL $(SASL_REQUIRED_VERSION)'; \
	if ! $(GNU_GREP) -q \
		$(LDAP_REQUIRE)@$(SASL_REQUIRED_VERSION) $(LDAP_SERVER_P5M); \
	then \
		echo 'ERROR: pkg file $(LDAP_SERVER_P5M)'; \
		echo 'Does not require libsasl2@$(SASL_REQUIRED_VERSION)!'; \
		exit 1; \
	fi; \
	if ! $(GNU_GREP) -q \
		$(LDAP_REQUIRE)@$(SASL_REQUIRED_VERSION) $(LDAP_CLIENT_P5M); \
	then \
		echo 'ERROR: pkg file $(LDAP_CLIENT_P5M)'; \
		echo 'Does not require libsasl2@$(SASL_REQUIRED_VERSION)!'; \
		exit 1; \
	fi;
COMPONENT_PREP_ACTION += $(ASSERT_PREP_ACTION)

#
# Studio Compiler options
#

# Set DEBUG=yes in environment to make this a debug build.
ifeq ($(DEBUG), yes)
# Append to Studio optimization level (see ../../make-rules/shared-macros.mk)
# -xO4 with -g : best-effort symbolic information with full optimization.
studio_OPT.sparc.64 +=	-g
studio_OPT.sparc.32 +=	-g
studio_OPT.i386.32 +=	-g
studio_OPT.i386.64 +=	-g
endif
CFLAGS +=  $(studio_NORUNPATH)
# Preserve all function argument values on AMD64.
studio_OPT.i386.64 +=	-preserve_argvalues=complete
# 32bit slapd (not delivered in Solaris) has some alignment issues
# where it combines unaligned structures togther.
# Override the default userland setting in shared-macros.mk to have
# compiler handle interpretation of non-alignment instead of SIGBUS.
studio_ALIGN.sparc.32 =	-xmemalign=8i


#
# Prerequisites and preperatiion.
#

# Simple Document Format (SDF), to produce html documentation.
SDFVER=			sdf-2.001
SDFBLIB=		$(BUILD_DIR_32)/${SDFVER}/blib
COMPONENT_ARCHIVE_1= $(SDFVER).tar.gz
COMPONENT_ARCHIVE_HASH_1= \
    sha256:6f9bcdc884a9f450208c740e45effdfeb7e65c689f57b05d3c15208193a8a6ea
COMPONENT_ARCHIVE_URL_1= \
    ftp://ftp.eenet.ee/pub/cpan/authors/id/I/IA/IANC/$(COMPONENT_ARCHIVE_1)

include $(WS_MAKE_RULES)/common.mk

# Patches to configure.ac require configure script re-creation.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -vfi);

#
# Configuration settings, options and modes.
#
COMPONENT_PRE_CONFIGURE_ACTION += \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# SOURCE_DATE_EPOCH when set to any non-null value prevents build/mkversion
# from placing build machine information in deliverable files.
COMPONENT_BUILD_ENV += SOURCE_DATE_EPOCH=1
# LTCFLAGS is LibTool C FLAGS, see configure and build/ltmain.sh.
COMPONENT_BUILD_ENV += LTCFLAGS="-m$(BITS)"

ifeq ($(DEBUG), yes)
CFLAGS += -DLDAP_DEBUG
endif

# Threading debug, set THREAD_DEBUG=yes
ifeq ($(THREAD_DEBUG), yes)
CFLAGS += -DLDAP_THREAD_DEBUG
endif

# we need to enable large file support and build PIC for our shared libraries
CFLAGS += $(CPP_LARGEFILES) $(CC_PIC)

LINT_FLAGS += -Iinclude

CONFIGURE_ENV += "ac_cv_lib_net_main=no"
CONFIGURE_ENV += "ac_cv_lib_net_socket=no"
CONFIGURE_ENV += "ac_cv_lib_inet_socket=no"

CONFIGURE_OPTIONS	+= --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS	+= --libexecdir=$(USRLIB.$(BITS))
CONFIGURE_OPTIONS	+= --localstatedir=$(VARDIR)/openldap
CONFIGURE_OPTIONS	+= --includedir=$(USRINCDIR)
CONFIGURE_OPTIONS	+= --docdir=$(USRSHAREDOCDIR)
CONFIGURE_OPTIONS	+= --disable-static
CONFIGURE_OPTIONS	+= --enable-overlays
CONFIGURE_OPTIONS	+= --enable-dynamic
CONFIGURE_OPTIONS	+= --enable-modules
CONFIGURE_OPTIONS	+= --enable-crypt
CONFIGURE_OPTIONS	+= --enable-shared
CONFIGURE_OPTIONS	+= --enable-mdb
CONFIGURE_OPTIONS	+= --enable-null
CONFIGURE_OPTIONS	+= --enable-passwd
CONFIGURE_OPTIONS 	+= --enable-sock  # replacement for shell backend
CONFIGURE_OPTIONS	+= --enable-ldap
CONFIGURE_OPTIONS	+= --enable-meta
CONFIGURE_OPTIONS	+= --with-cyrus-sasl
CONFIGURE_OPTIONS	+= --with-threads
CONFIGURE_OPTIONS	+= --with-tls=openssl

# Append Configuration variables
CONFIGURE_OPTIONS	+= CPPFLAGS="$(CPPFLAGS)"
CONFIGURE_OPTIONS	+= CFLAGS="$(CFLAGS)"
LDFLAGS			+= $(LDFLAGS.$(BITS))
CONFIGURE_OPTIONS	+= LDFLAGS="$(LDFLAGS)"

# Link against the desired OpenSSL library.
CPPFLAGS		+= -I/usr/openssl/3/include
LDFLAGS.64		+= -L/usr/openssl/3/lib/64
LDFLAGS.32		+= -L/usr/openssl/3/lib

# After configure make announces that `depend` should be used.
COMPONENT_POST_CONFIGURE_ACTION += \
	(cd $(@D); $(MAKE) depend;)

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

# Install of slapd is stripped by OpenLDAP INSTALL_STRIP_PROGRAM; for
# debug build copy non-stripped version to proto area before publish.
ifeq ($(DEBUG), yes)
COMPONENT_POST_INSTALL_ACTION.64 +=	\
	cp $(BUILD_DIR_64)/servers/slapd/.libs/slapd \
		$(PROTO_DIR)/$(USRLIB)/slapd
endif

# Conversion of openldap-transition.org to ASCII.
# Creates copy in proto directory, as emacs creates in place, then removed.
# ORGABS makes argument to --eval fit into the 80 column guideline.
ORGABS =	org-ascii--box-string
ORGSRC =	openldap-transition.org
ORGSRCDIR =	$(COMPONENT_DIR)/Solaris
ORGPUBDIR = 	$(PROTO_DIR)$(USRSHAREDOCDIR)/release-notes
COMPONENT_POST_INSTALL_ACTION.64 +=	\
  $(MKDIR) $(PROTO_DIR)/$(USRSHAREDOCDIR)/release-notes; \
  $(CP) $(ORGSRCDIR)/$(ORGSRC) $(ORGPUBDIR); \
  /usr/bin/emacs $(ORGPUBDIR)/$(ORGSRC) -Q -batch \
    --eval '(require `ox-ascii)' \
    --eval '(advice-add `$(ORGABS) :override (defun my-$(ORGABS) (s info) s))' \
    --eval '(org-ascii-export-to-ascii)'; \
  $(RM) $(ORGPUBDIR)/$(ORGSRC); \
#
# Testing
# Uses test-and-compare framework as per ../../doc/testing.txt
#
# Set LD_LIBRARY_PATH to load built libraries from PROTO directories.
COMPONENT_TEST_ENV += LD_LIBRARY_PATH="$(PROTOUSRLIBDIR):$(PROTOUSRLIBDIR64):"
COMPONENT_TEST_ENV += PATH=$(GNUBIN):$(USRBINDIR)
# Run all test, don't exit if one fails; tests/scripts/all
COMPONENT_TEST_ENV += NOEXIT=true
# Our build servers can require a little more time on occasion.
# The default value in tests/scripts/defines.sh is 7 (version 2.6.5).
SLEEP1=12
COMPONENT_TEST_ENV += SLEEP1=$(SLEEP1)

# Have gmake (COMPONENT_TEST_CMD) use environment variables.
COMPONENT_TEST_ARGS += -e
# Collect only action summaries to snapshot file.  Awk script removes
# time strings.
COMPONENT_TEST_TRANSFORMER =	$(NAWK)
COMPONENT_TEST_TRANSFORMS =	-f $(COMPONENT_DIR)/Solaris/test-transform.awk
COMPONENT_TEST_MASTER =	\
	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# This is a handy test target for developer.  Please leave functional.
test-slapd-version test-version:
	-LD_LIBRARY_PATH=$(PROTO_DIR)$(CONFIGURE_LIBDIR.64) \
		$(PROTO_DIR)$(CONFIGURE_LIBDIR.64)/slapd -VVV; \

# useful for testing the nawk script without rerunning all the tests.
test-transform:
	@echo Running transform again with BITS=$(BITS)
	$(COMPONENT_TEST_TRANSFORMER) \
		$(COMPONENT_TEST_TRANSFORMS) $(COMPONENT_TEST_MASTER) > \
			$(COMPONENT_TEST_SNAPSHOT)
	$(COMPONENT_TEST_COMPARE_CMD) \
		$(COMPONENT_TEST_MASTER) $(COMPONENT_TEST_SNAPSHOT)

# Check license against source files. This is what I provided in TPNO.
e = /usr/gnu/bin/echo
test-license:
	@$(MKDIR) -p $(BUILD_DIR)
	@( \
		$e -n '-------------------------------';\
		$e ' Top-level license --------------------------'; \
		$e ; \
		iconv -sct UTF-8 $(SOURCE_DIR)/LICENSE; $e; $e; \
		$e -n '-------------------------------'; \
		$e 'Copyright notices --------------------------'; \
		$e; \
		iconv -sct UTF-8 $(SOURCE_DIR)/COPYRIGHT; \
	)  > $(BUILD_DIR)/$(COMPONENT_NAME).license.new;
	@cmp $(COMPONENT_DIR)/$(COMPONENT_NAME).license \
	    $(BUILD_DIR)/$(COMPONENT_NAME).license.new >/dev/null && \
		$e "No changes detected to openldap.license file." || \
		( \
		$e 'WARNING: Built license differs:'; \
		$e -n 'diff $(COMPONENT_NAME).license '; \
		$e '$(subst $(COMPONENT_DIR)/,,$(BUILD_DIR))/$(COMPONENT_NAME).license.new'; \
		$e 'ACTION: Check $(COMPONENT_DIR)/$(COMPONENT_NAME).license'; \
		$e ' against TPNO:'; \
		$e '   /ws/bugdb-tools/bin/tpno --arn $(TPNO)';\
		)

#
# Simple Document Format (SDF), produce html documentation.
#

# SDF: Unpack, patch and Build; only needed once.
COMPONENT_PRE_BUILD_ACTION.32 += \
	(cd $(BUILD_DIR_32); \
		gzip -dc $(COMPONENT_DIR)/$(SDFVER).tar.gz | tar xopf -; \
		$(GPATCH) -p 3 < $(COMPONENT_DIR)/patches_1/sdf.patch; \
		cd $(SDFVER); $(PERL) Makefile.PL; \
		$(GMAKE))

# SDF: Build guide.html using SDF script.
COMPONENT_POST_BUILD_ACTION.32 += \
	(cd $(BUILD_DIR_32)/doc/guide/admin; \
	$(PERL) -I$(SDFBLIB)/lib $(SDFBLIB)/script/sdf -2html guide.sdf)

# SDF: Install the guide and associated files into PROTO_DIR to ease
# package generation.
doc_admin=	usr/share/doc/openldap/admin26
COMPONENT_POST_INSTALL_ACTION.32 +=	\
	$(MKDIR) $(PROTO_DIR)/$(doc_admin); \
	sed -e 's:../images/::' \
	    $(BUILD_DIR_32)/doc/guide/admin/guide.html \
	    > $(PROTO_DIR)/$(doc_admin)/guide.html; \
	$(FIND) $(BUILD_DIR_32)/doc/guide -name '*\.png' -o -name '*\.gif' | \
	    while read file; do \
		if grep -q "$${file\#\#*/}" \
		    $(PROTO_DIR)/$(doc_admin)/guide.html; \
		then cp $$file $(PROTO_DIR)/$(doc_admin)/.; \
		else echo "Image file not used: $${file\#$(WS_TOP)/}"; \
		fi; \
	    done;

# Fix /usr/lib paths in slapd.8 and lloadd (latter not delivered).
COMPONENT_POST_INSTALL_ACTION += \
	echo 'Fixing lib path in $(PROTO_DIR)/usr/share/man/man8/*'; \
	gsed --in-place -e 's:\(^.B /usr/lib/\)\([^/]*/\)\(.*\):\1\3:' \
		$(PROTO_DIR)/usr/share/man/man8/*; \
	grep '^.B /usr/lib/' $(PROTO_DIR)/usr/share/man/man8/*;

.PHONY: republish test-license test-slapd-version test-version test-transform

republish:
	$(GMAKE) publish PKGREPO_REMOVE_BEFORE_PUBLISH=yes


REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/security/libsasl2
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += text/groff/groff-core
