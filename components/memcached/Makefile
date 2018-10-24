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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		memcached
COMPONENT_VERSION=	1.5.11
COMPONENT_PROJECT_URL=	http://memcached.org/
COMPONENT_ARCHIVE_HASH=	\
sha256:697a91f8455865ca2625713c6ec56cb5f6b9541778f61d08bf34f0a131a2582a
COMPONENT_ARCHIVE_URL=	http://memcached.org/files/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	database/memcached
COMPONENT_ANITYA_ID=	1965

TPNO=			47491

include $(WS_MAKE_RULES)/common.mk

PATH=$(USRBINDIR):$(GNUBIN):$(USRDIR)/perl5/bin

studio_OPT = -xO5
studio_ALIGN.sparc.64 = -xmemalign=16i
CFLAGS += -D__ATTRIBUTE_DISABLED 
ASLR_MODE = $(ASLR_DISABLE)

CLONEY := echo
COMPONENT_PRE_CONFIGURE_ACTION = (cp -r $(SOURCE_DIR)/. $(@D));
# Create aclocal.m4 in advance otherwise automake may complain about the missing file.
COMPONENT_PRE_CONFIGURE_ACTION += (cd $(@D); aclocal)

# The configure script has to be executed from the build path otherwise $(srcdir) variable
# in the generated Makefile file is set to invalid value, i.e., $(SOURCE_DIR), and tests are broken.
CONFIGURE_SCRIPT = 	$(@D)/configure

# If we don't define this, configure will try to use umem, which in turn will
# cause BUILD_CACHE_TRUE to be set which will take us down a path such that
# do_cache_alloc and do_cache_free are undefined symbols at link time.
CONFIGURE_ENV +=	"ac_cv_header_umem_h=no"

CONFIGURE_BINDIR.64 =	$(CONFIGURE_PREFIX)/lib
CONFIGURE_OPTIONS.64 +=	--with-libevent=$(USRLIBDIR64)
# The below works around a bug in configure/configure.ac that sets
# an incorrect runpath.
# Setting ac_cv_libevent bypasses libevent checks in configure,
# including setting the runpath (-R), which is currently ok
# because libevent is in a default library directory.
CONFIGURE_OPTIONS.64 +=	"ac_cv_libevent_dir=/usr/lib/$(MACH64)"
CONFIGURE_OPTIONS +=	--enable-dtrace --disable-docs --disable-coverage
CONFIGURE_OPTIONS +=	--localstatedir=$(VARDIR)

# Fill the memcached version to the service description.
COMPONENT_POST_INSTALL_ACTION = ( \
	$(MKDIR) $(PROTOLIBDIR)/svc/manifest/application/database/; \
	$(CP) Solaris/memcached.xml $(PROTOLIBDIR)/svc/manifest/application/database/; \
	$(PERL) -i -pe 's/%%%VERSION%%%/$(COMPONENT_VERSION)/' \
		$(PROTOLIBDIR)/svc/manifest/application/database/memcached.xml)

COMPONENT_TEST_TARGETS=	test

# Just retain test result output that's useful.
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/^ok/p" ' \
	'-e "/ ok/p" ' \
	'-e "/^not ok/p" ' \
	'-e "/^All tests/p" ' \
	'-e "/^Result/p" '

REQUIRED_PACKAGES += library/libevent
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network
