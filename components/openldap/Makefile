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
# Copyright (c) 2011, 2020, Oracle and/or its affiliates.
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
COMPONENT_VERSION=	2.4.55
HUMAN_VERSION=		$(COMPONENT_VERSION)
IPS_COMPONENT_VERSION=	$(COMPONENT_VERSION).0.0
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tgz
COMPONENT_PROJECT_URL=	http://www.openldap.org/
COMPONENT_ARCHIVE_HASH=	\
	sha256:97357bd6ba8ff73d204c1f8208c5e6ab97d60c9e779f989057aa1229bbe98434
COMPONENT_ARCHIVE_URL=	\
	ftp://ftp.openldap.org/pub/OpenLDAP/openldap-release/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	service/openldap
# For check_anitya target, see 'gmake print-ANITYA_API_URL'
COMPONENT_ANITYA_ID=	2551

TPNO=			63657

# Set DEBUG=yes in environment to make this a debug build.
ifeq ($(DEBUG), yes)
# Override optimization setting from ../../make-rules/shared-macros.mk
studio_OPT= -g
# Define LDAP_DEBUG
CFLAGS += -DLDAP_DEBUG
endif
# Threading debug, set THREAD_DEBUG=yes
ifeq ($(THREAD_DEBUG), yes)
CFLAGS += -DLDAP_THREAD_DEBUG
endif

# SOURCE_DATE_EPOCH when set to any non-null value prevents mkversion
# from placing build machine information in deliverable files.
COMPONENT_BUILD_ENV += SOURCE_DATE_EPOCH=1

# Simple Document Format (SDF), to produce html documentation.
SDFVER=			sdf-2.001
SDFBLIB=		$(BUILD_DIR_32)/${SDFVER}/blib

COMPONENT_ARCHIVE_1= $(SDFVER).tar.gz
COMPONENT_ARCHIVE_HASH_1= \
    sha256:6f9bcdc884a9f450208c740e45effdfeb7e65c689f57b05d3c15208193a8a6ea
COMPONENT_ARCHIVE_URL_1= ftp://ftp.eenet.ee/pub/cpan/authors/id/I/IA/IANC/$(COMPONENT_ARCHIVE_1)

SMF_MANIFESTS= $(COMPONENT_DIR)/Solaris/ldap-olslapd.xml

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION += \
	($(CLONEY) $(SOURCE_DIR) $(@D))

#
# Configuration settings, options and modes.
#
# we need to enable large file support and build PIC for our shared libraries
CFLAGS += $(CPP_LARGEFILES) $(CC_PIC) $(studio_NORUNPATH)

LINT_FLAGS += -Iinclude

CONFIGURE_ENV += "ac_cv_lib_net_main=no"
CONFIGURE_ENV += "ac_cv_lib_net_socket=no"
CONFIGURE_ENV += "ac_cv_lib_inet_socket=no"

CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += --libexecdir=$(USRLIB.$(BITS))
CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)/openldap
CONFIGURE_OPTIONS += --includedir=$(USRINCDIR)/openldap
CONFIGURE_OPTIONS += --docdir=$(USRSHAREDOCDIR)
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-overlays
CONFIGURE_OPTIONS += --enable-dynamic
CONFIGURE_OPTIONS += --enable-modules
CONFIGURE_OPTIONS += --enable-crypt
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --disable-bdb
CONFIGURE_OPTIONS += --disable-hdb
CONFIGURE_OPTIONS += --enable-mdb
CONFIGURE_OPTIONS += --enable-null
CONFIGURE_OPTIONS += --enable-passwd
CONFIGURE_OPTIONS += --enable-shell
CONFIGURE_OPTIONS += --enable-ldap
CONFIGURE_OPTIONS += --enable-meta
CONFIGURE_OPTIONS += --with-cyrus-sasl
CONFIGURE_OPTIONS += --with-threads
CONFIGURE_OPTIONS += --with-tls=openssl

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

#
# Test using test-and-compare framework as per ../../doc/testing.txt
#
# Set LD_LIBRARY_PATH to load built libraries from PROTO directories.
COMPONENT_TEST_ENV += LD_LIBRARY_PATH="$(PROTOUSRLIBDIR):$(PROTOUSRLIBDIR64):"
# Have gmake (COMPONENT_TEST_CMD) use environment variables.
COMPONENT_TEST_ARGS += -e
# Collect only action summaries to snapshot file using grep.
COMPONENT_TEST_TRANSFORMER =	$(GNU_GREP)
COMPONENT_TEST_TRANSFORMS =	'">>>>>"'
COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master

#
# Cyrus-sasl is a requirement.
# OpenLDAP must be built with cyrus-sasl out of the gate instead of the
# installed copy.
#
CYRUS_SASL_ROOT = $(WS_COMPONENTS)/cyrus-sasl/build/prototype/$(MACH)
LDFLAGS.32 +="-L$(CYRUS_SASL_ROOT)$(USRLIBDIR)"
LDFLAGS.64 +="-L$(CYRUS_SASL_ROOT)$(USRLIBDIR64)"
LDFLAGS +=$(LDFLAGS.$(BITS))
CPPFLAGS +="-I$(CYRUS_SASL_ROOT)$(USRINCDIR)"
# make sure that we don't add the cyrus-sasl proto area to the RUNPATH
LD_UNSET.32="-R$(CYRUS_SASL_ROOT)$(USRLIBDIR)"
LD_UNSET.64="-R$(CYRUS_SASL_ROOT)$(USRLIBDIR.$(BITS))"
LD_UNSET += $(LD_UNSET.$(BITS))
COMPONENT_BUILD_ENV += LD_UNSET="$(LD_UNSET)"
COMPONENT_BUILD_ENV += LTCFLAGS="-m$(BITS)"
COMPONENT_INSTALL_ENV += LD_UNSET="$(LD_UNSET)"

# special targets due to dependency on cyrus-sasl
../cyrus-sasl/build/%/.installed:
	(cd ../cyrus-sasl && $(GMAKE) install)

$(CONFIGURE_32):       ../cyrus-sasl/build/$(MACH32)/.installed
$(CONFIGURE_64):       ../cyrus-sasl/build/$(MACH64)/.installed

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
COMPONENT_POST_INSTALL_ACTION.32 +=	\
	$(MKDIR) $(PROTO_DIR)/usr/share/doc/openldap/admin24; \
	sed -e 's:../images/::' \
	    $(BUILD_DIR_32)/doc/guide/admin/guide.html \
	    > $(PROTO_DIR)/usr/share/doc/openldap/admin24/guide.html; \
	$(FIND) $(BUILD_DIR_32)/doc/guide -name '*\.png' -o -name '*\.gif' | \
	    while read file; do \
		if grep -q "$${file\#\#*/}" \
		    $(PROTO_DIR)/usr/share/doc/openldap/admin24/guide.html; \
		then cp $$file $(PROTO_DIR)/usr/share/doc/openldap/admin24/.; \
		else echo "Image file not used: $${file\#$(WS_TOP)/}"; \
		fi; \
	    done;

# slapd is stripped by install, so copy non-stripped version to proto
# area before publish.
ifeq ($(DEBUG), yes)
COMPONENT_POST_INSTALL_ACTION.64 +=	\
	cp $(BUILD_DIR_64)/servers/slapd/.libs/slapd $(PROTO_DIR)/$(USRLIB)/slapd
endif

REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
$(SOLARIS_11_3_ONLY)REQUIRED_PACKAGES += system/library/security/libsasl
REQUIRED_PACKAGES += system/library/security/libsasl2
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += text/groff/groff-core
