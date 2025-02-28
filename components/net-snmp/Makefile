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
BUILD_BITS= 64_and_32

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1

include ../../make-rules/shared-macros.mk

PATH=$(GNUBIN):$(USRBINDIR)
COMPILER=gcc

COMPONENT_NAME=		net-snmp
COMPONENT_VERSION=	5.9.4
COMPONENT_PROJECT_URL=	http://www.net-snmp.org/
COMPONENT_ARCHIVE_HASH= \
    sha256:8b4de01391e74e3c7014beb43961a2d6d6fa03acc34280b9585f4930745b0544
COMPONENT_ARCHIVE_URL=	https://sourceforge.net/projects/net-snmp/files/net-snmp/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	service/net-snmp utility/net-snmp library/net-snmp
COMPONENT_ANITYA_ID=	2062

COMPONENT_BAID=		192942

BUILD_64 += $(BUILD_DIR_64)/.docs

include $(WS_MAKE_RULES)/common.mk

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-implicit-function-declaration -Wno-incompatible-pointer-types

PYTHON_VERSION = 3.9

studio_C99MODE= $(studio_C99_ENABLE)
CPPFLAGS += "-DFALSE_SHARING_ALIGN=64"

COMPONENT_PREP_ACTION += (cd $(@D) ; autoreconf -fiv);

CONFIGURE_ENV +=	PYTHONPROG=$(PYTHON.$(BITS))

CONFIGURE_OPTIONS  +=	--with-default-snmp-version=3
CONFIGURE_OPTIONS  +=	--with-sys-contact="root@localhost"
CONFIGURE_OPTIONS  +=	--with-sys-location=Unknown
CONFIGURE_OPTIONS  +=	--with-logfile=$(VARDIR)/log/snmpd.log
CONFIGURE_OPTIONS  +=	--with-persistent-directory=$(VARDIR)/net-snmp

CONFIGURE_OPTIONS  +=	--with-mibdirs=$(ETCDIR)/net-snmp/snmp/mibs
CONFIGURE_OPTIONS  +=	--datadir=$(ETCDIR)/net-snmp
CONFIGURE_OPTIONS  +=	--enable-agentx-dom-sock-only
CONFIGURE_OPTIONS  +=	--enable-ucd-snmp-compatibility
CONFIGURE_OPTIONS  +=	--enable-ipv6
CONFIGURE_OPTIONS  +=	--enable-mfd-rewrites

CONFIGURE_OPTIONS  +=	--with-openssl
CONFIGURE_OPTIONS  +=	--disable-des

CONFIGURE_OPTIONS  +=	--with-transports="UDP TCP UDPIPv6 TCPIPv6"

# Which MIB modules do we want to build
MIB_MODULES = host disman/event-mib ucd-snmp/diskio udp-mib tcp-mib if-mib
CONFIGURE_OPTIONS  +=	--with-mib-modules="$(MIB_MODULES)"

# Only build 64 bit Perl and Python support
CONFIGURE_OPTIONS.32  +=	--disable-embedded-perl
CONFIGURE_OPTIONS.32  +=	--without-perl-modules
PERL_ARGS =			DESTDIR=$(PROTO_DIR) INSTALLDIRS=vendor
CONFIGURE_OPTIONS.64  +=	PERLPROG="$(PERL)"
CONFIGURE_OPTIONS.64  +=	--with-perl-modules="$(PERL_ARGS)"
CONFIGURE_OPTIONS.64  +=	--disable-perl-cc-checks

# for the goofy definition of ARCH in the extra Makefiles
ARCH=32
ARCH=$(BITS:64=$(MACH64))

COMPONENT_PRE_CONFIGURE_ACTION += (echo "COMPONENT_PRE_CONFIGURE_ACTION - BITS=$(BITS)");
COMPONENT_PRE_CONFIGURE_ACTION.32 = \
	($(CLONEY) $(SOURCE_DIR) $(@D); $(CLONEY) $(COMPONENT_DIR)/sun $(@D)/sun);
COMPONENT_PRE_CONFIGURE_ACTION.64 = \
	($(CLONEY) $(SOURCE_DIR) $(@D); $(CLONEY) $(COMPONENT_DIR)/sun $(@D)/sun);
COMPONENT_PRE_CONFIGURE_ACTION += $(COMPONENT_PRE_CONFIGURE_ACTION.$(BITS))

# Make a copy of the python bits so we can build separate python 3.11 support
COMPONENT_PREP_ACTION += (cd $(@D) ; cp -rp python python3.11);

CCSMAKE_ARGS =	CC="$(CC)" CFGPREFIX=$(USRDIR) CFGLIB64=$(USRLIBDIR64)
CCSMAKE_ARGS +=	CFGLIB=$(USRLIBDIR) ARCH=$(ARCH) ROOT=$(PROTO_DIR)

COMPONENT_TEST_DIR =		$(BUILD_DIR)/$(MACH$(BITS))/testing/
COMPONENT_TEST_CMD =		$(KSH93)
COMPONENT_TEST_TARGETS =	./RUNTESTS
COMPONENT_TEST_TRANSFORMS += \
	'-e "s|\(simple-\).*|\1XXXXXX|g"' \
	'-e "s|\(output (\)\(.*\)|\2|g"'

COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-$(BITS).master

# Get correct binaries from the proto area.
TEST_BINPATH.32 =       $(PROTOUSRBINDIR)/$(MACH32)
TEST_BINPATH.64 =       $(BUILD_DIR)/prototype/$(MACH64)$(USRBINDIR)
COMPONENT_TEST_ENV +=   PATH=$(TEST_BINPATH.$(BITS)):$(PATH)
# Get correct libraries from the proto area.
TEST_LIBPATH.32 =       $(PROTOUSRLIBDIR)
TEST_LIBPATH.64 =       $(BUILD_DIR)/prototype/$(MACH64)$(USRLIBDIR64)
COMPONENT_TEST_ENV +=   LD_LIBRARY_PATH=$(TEST_LIBPATH.$(BITS))

# Usually component installs both 32 and 64bit compilation into $(PROTO_DIR).
# Here we install 32bit compilation into $(PROTO_DIR) and 64 bit into
# $(BUILD_DIR)/prototype/$(MACH64). So we need to tell pkg to look for binaries
# also here.
PKG_PROTO_DIRS += $(BUILD_DIR)/prototype/$(MACH64)

# Now we need to tell where 'gmake manifest-check' looks for binaries.
# By default manifest-check takes binaries from build/prototype/$(uname -p). We
# need to add more sources (see doc/manifest-check.txt for description):
#
# Add documentation
GENERATE_PROTO_DIRS += build/$(MACH64)/docs^build/$$(MACH64)/docs
# Add demo files
GENERATE_PROTO_DIRS += sun/sdk/demo^sun/sdk/demo


COMPONENT_PRE_BUILD_ACTION += (echo "COMPONENT_PRE_BUILD_ACTION - BITS=$(BITS)");
COMPONENT_PRE_BUILD_ACTION += \
	(cd $(BUILD_DIR_$(BITS)); rm -rf python3.9; gcp -vr python python3.9); \
	(cd $(BUILD_DIR_$(BITS)); rm -rf python3.11; gcp -vr python python3.11);

COMPONENT_POST_BUILD_ACTION.64 += \
	(cd $(BUILD_DIR_64)/sun ; ls agent; $(CCSMAKE) -e $(CCSMAKE_ARGS));
COMPONENT_POST_BUILD_ACTION.32 += \
	(cd $(BUILD_DIR_32)/sun ; ls agent; $(CCSMAKE) -e $(CCSMAKE_ARGS));

COMPONENT_POST_BUILD_ACTION.64 += \
	(cd $(BUILD_DIR_64)/python ; find . -name \*.so | gxargs --verbose rm);
COMPONENT_POST_BUILD_ACTION.64 += \
	(cd $(BUILD_DIR_$(BITS))/python3.9 ; $(PYTHON.3.9) setup.py build --basedir=$(BUILD_DIR)/$(MACH64)); \
	(cd $(BUILD_DIR_$(BITS))/python3.11 ; $(PYTHON.3.11) setup.py build --basedir=$(BUILD_DIR)/$(MACH64));

COMPONENT_POST_BUILD_ACTION += (echo "COMPONENT_POST_BUILD_ACTION - BITS=$(BITS)");
COMPONENT_POST_BUILD_ACTION += $(COMPONENT_POST_BUILD_ACTION.$(BITS))

# Build sun agent and python modules
COMPONENT_POST_INSTALL_ACTION += \
	($(MKDIR) $(BUILD_DIR)/prototype/$(MACH64)/etc/net-snmp/snmp/mibs; \
	 cd $(BUILD_DIR)/$(MACH64)/sun ; ls agent; $(CCSMAKE) -e $(CCSMAKE_ARGS) install);

COMPONENT_POST_INSTALL_ACTION.64 = \
	(cd $(@D)/python3.9 ; env PYTHON=$(PYTHON.3.9.$(BITS)) \
	 $(PYTHON.3.9.$(BITS)) ./setup.py install \
		--root $(PROTO_DIR) \
		--install-lib=$(PYTHON.3.9.VENDOR_PACKAGES)); \
	(cd $(@D)/python3.11 ; env PYTHON=$(PYTHON.3.11.$(BITS)) \
	 $(PYTHON.3.11.$(BITS)) ./setup.py install \
		--root $(PROTO_DIR) \
		--install-lib=$(PYTHON.3.11.VENDOR_PACKAGES)) ;

COMPONENT_POST_INSTALL_ACTION += (echo "COMPONENT_POST_INSTALL_ACTION - BITS=$(BITS)");
COMPONENT_POST_INSTALL_ACTION += $(COMPONENT_POST_INSTALL_ACTION.$(BITS))


# build the docs
$(BUILD_DIR_64)/.docs:
	# We can not use srcdir=$(@D) because that path is platform specific
	# and would produce differently named html files on x86 and sparc.
	(cd $(@D) ; $(ENV) srcdir=../../$(COMPONENT_SRC) $(DOXYGEN) -u $(@D)/doxygen.conf ; \
	    $(ENV) srcdir=../../$(COMPONENT_SRC) $(DOXYGEN) $(@D)/doxygen.conf)
	$(TOUCH) $@

PKG_MACROS += PYVER=$(PYTHON_VERSION)


REQUIRED_PACKAGES += developer/build/make
REQUIRED_PACKAGES += developer/documentation-tool/doxygen
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/python-39
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/datalink
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libpcap
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/linker
REQUIRED_PACKAGES += system/management/snmp/net-snmp
REQUIRED_PACKAGES += system/network
