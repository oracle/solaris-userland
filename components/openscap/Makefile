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
# Copyright (c) 2012, 2023, Oracle and/or its affiliates.
#

BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		openscap
COMPONENT_VERSION=	1.3.7
COMPONENT_PROJECT_URL=  http://www.open-scap.org
COMPONENT_DOWNLOAD_URL= https://github.com/OpenSCAP/openscap/releases/download
COMPONENT_ARCHIVE_HASH= \
    sha256:a74f5bfb420b748916d2f88941bb6e04cad4c67a4cafc78c96409cc15c54d1d3
COMPONENT_ARCHIVE_URL=  $(COMPONENT_DOWNLOAD_URL)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	15641

COMPONENT_BAID =		138753

BUILD_STYLE= cmake
CMAKE_MAKE_PROGRAM=$(GMAKE)

CFLAGS+=		-std=c99
CFLAGS+=		-DNDEBUG
CFLAGS+=		-D__$(MACH64)

PYTHON_VERSION =	3.7
PYTHON_VERSIONS=	$(PYTHON_VERSION)

# Compile only for single perl version
PERL_VERSIONS =		$(PERL_VERSION)

# Tests require xpath tool that is not available on Solaris.
TEST_TARGET = $(NO_TESTS)

# openscap is not adding cpython-37m string to shared libraries
PY3_CPYTHON_NAMING = \#

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_BINDIR.64 =	$(CONFIGURE_PREFIX)/bin
CPPFLAGS +=	-I$(USRINCDIR)/openldap
RAD_CLIENT_LIB_PATH =   /usr/lib/rad/client/c/$(MACH64)
PERL_LIB_PATH =  /usr/perl5/$(PERL_VERSION)/lib/$(PERL_ARCH)/CORE

LDFLAGS += -L$(RAD_CLIENT_LIB_PATH) -R$(RAD_CLIENT_LIB_PATH) -R$(PERL_LIB_PATH) \
    -lradclient -ladr -lips_client -lzonemgr_client

# XXX This shouldn't be necessary, but is; investigate why.
CFLAGS += -D_FILE_OFFSET_BITS=64

# Enable adiheap and adistack security extensions
ADIHEAP_MODE = $(ADIHEAP_ENABLE)
ADISTACK_MODE = $(ADISTACK_ENABLE)

# Need to do cloney, so that the schema files can get packaged.
COMPONENT_PRE_CONFIGURE_ACTION = \
    ($(CLONEY) $(SOURCE_DIR) $(@D))

COMPONENT_POST_INSTALL_ACTION = \
	$(RM) $(PROTO_DIR)/usr/share/openscap/cpe/* && \
	$(CP) files/cpe/* $(PROTO_DIR)/usr/share/openscap/cpe;

# Pre-compile python source code
COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON) -m compileall $(PROTO_DIR)/usr/lib;


# Needed to make "gmake test" work.
CPPFLAGS +=	-I$(SOURCE_DIR)/src/OVAL
CPPFLAGS +=	-I$(SOURCE_DIR)/src/OVAL/probes
CPPFLAGS +=	-I$(USRINCDIR)/pcre

CMAKE_OPTIONS += -DPCRE_INCLUDE_DIR=/usr/include/pcre
CMAKE_OPTIONS += -DPYTHON_SITE_PACKAGES_INSTALL_DIR=$(PYTHON_VENDOR_PACKAGES)

CMAKE_OPTIONS += -DPERL_EXECUTABLE=$(PERL)
CMAKE_OPTIONS += -DPYTHON_EXECUTABLE=$(PYTHON)
CMAKE_OPTIONS += -DENABLE_SCE=ON
CMAKE_OPTIONS += -DENABLE_PERL=ON
CMAKE_OPTIONS += -DENABLE_PYTHON3=ON

DOCS_DIR = $(PROTO_DIR)/usr/share/doc/openscap/

COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(DOCS_DIR); \
	$(CP) -r $(SOURCE_DIR)/docs/* $(DOCS_DIR);

PKG_MACROS +=   PERL_VERSION_NODOT=$(PERL_VERSION_NODOT)
PKG_MACROS +=   PERL_VERSION=$(PERL_VERSION)
PKG_MACROS +=   PERL_PKG=$(PERL_PKG)

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += developer/swig
#REQUIRED_PACKAGES += gnome/config/gconf
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += library/pcre
REQUIRED_PACKAGES += library/xmlsec
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += security/compliance/openscap
REQUIRED_PACKAGES += system/library/datalink
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/libgcrypt
REQUIRED_PACKAGES += system/library/smf
REQUIRED_PACKAGES += system/library/libv12n
REQUIRED_PACKAGES += system/management/rad
REQUIRED_PACKAGES += system/management/rad/client/rad-c
REQUIRED_PACKAGES += system/network/ldap/openldap
REQUIRED_PACKAGES += system/zones
REQUIRED_PACKAGES += web/curl
