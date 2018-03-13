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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

#
# This file sets up the standard, default options and base requirements for
# X11 components.
#
X11_COMPONENTS_DIR=		$(WS_COMPONENTS)/x11

COMPONENT_PROJECT_URL ?=	https://www.x.org
ifneq (,$(findstring $(X11_COMPONENTS_DIR), $(COMPONENT_DIR)))
COMPONENT_CATEGORY    ?=	\
	$(firstword $(subst /, ,$(COMPONENT_DIR:$(X11_COMPONENTS_DIR)/%=%)))
endif
COMPONENT_ARCHIVE     ?=	$(COMPONENT_SRC).tar.bz2
ifneq ($(strip $(COMPONENT_ARCHIVE_SRC)), none)
COMPONENT_ARCHIVE_URL ?=	https://www.x.org/releases/individual/$(COMPONENT_CATEGORY)/$(COMPONENT_ARCHIVE)
endif

PKGMOGRIFY_TRANSFORMS += $(WS_TOP)/transforms/X-incorporation

include $(WS_MAKE_RULES)/common.mk

TPNO ?=				39514

# X.Org packages use a common set of autoconf macros
UTIL_MACROS = $(WS_COMPONENTS)/x11/util/util-macros/build/prototype/$(MACH)
ACLOCAL_INCLUDES = -I$(UTIL_MACROS)/usr/share/aclocal
AUTORECONF_ENV = ACLOCAL="/usr/bin/aclocal $(ACLOCAL_INCLUDES)"
PKG_CONFIG_PATHS += $(UTIL_MACROS)/usr/share/pkgconfig
REQUIRED_PACKAGES += developer/build/autoconf/xorg-macros

# X.Org packages use a common set of sgml entities to build documentation
XORG_DOCS = $(WS_COMPONENTS)/x11/doc/build/prototype/$(MACH)
PKG_CONFIG_PATHS += $(XORG_DOCS)/usr/share/pkgconfig

# XORG_WITH_XMLTO check below makes sure we're using a version of that macro
# compatible with xmlto 0.0.27 & later, as provided in util-macros > 0.19.0
COMPONENT_PREP_ACTION += (cd $(@D) ; \
	if [[ -f configure.ac ]] ; then \
	    if grep -q XORG_WITH_XMLTO configure.ac ; then \
		if ! grep -q 'xmlto 0\.0\.27' configure ; then \
		    print '* Forcing autoreconf to apply xmlto macro fix' ; \
		    $(AUTORECONF_ENV) $(AUTORECONF) -fiv ; \
		fi ; \
	    fi ; \
	fi );

# Common documentation options for X.Org components
CONFIGURE_OPTIONS += --enable-specs
CONFIGURE_OPTIONS += --with-asciidoc
CONFIGURE_OPTIONS += --without-fop
CONFIGURE_OPTIONS += --with-xmlto

CONFIGURE_OPTIONS += --libexecdir="$(USRLIB)"
CONFIGURE_OPTIONS += --localstatedir="$(VARDIR)"

# Tell autoconf's AC_PATH_X that X includes & libraries are in default paths,
# instead of letting it check Imake, which reports the 64-bit library paths,
# causing mismatched RUNPATH entries to be included in 32-bit libraries.
CONFIGURE_OPTIONS += --x-includes=""
CONFIGURE_OPTIONS += --x-libraries=""

# Some components require an architecture-specific directory for their
# configuration, so these are specified per-bits.
ETCDIR.32 ?= $(ETCDIR)
ETCDIR.64 ?= $(ETCDIR)
CONFIGURE_OPTIONS += --sysconfdir="$(ETCDIR.$(BITS))"

CONFIGURE_ENV += INTLTOOL_PERL="$(PERL)"


# Special options for Xorg driver components
ifeq ($(strip $(COMPONENT_CATEGORY)),driver)
X11_SERVERLIBS_DIR	= $(USRLIBDIR)/xorg
X11_SERVERMODS_DIR	= $(USRLIBDIR)/xorg/modules

CONFIGURE_OPTIONS += --with-xorg-module-dir="$(X11_SERVERMODS_DIR)"

# Replaces @symbol_visibilty@ in xorg-server.pc, since that fails when
# some drivers are compiled with a different compiler than the server
CFLAGS.studio += -xldscope=hidden
CFLAGS.gcc += -fvisibility=hidden

# All drivers need some headers from this package
REQUIRED_PACKAGES += x11/header/x11-protocols

# Resolve calls to functions in Xorg against the Xorg binary
XORG_EXTERNS_FLAG ?= -z parent=$(USRBINDIR)/Xorg
LD_SHARED_OPTIONS += $(XORG_EXTERNS_FLAG)
REQUIRED_PACKAGES += x11/server/xorg

# Many drivers fail to list -lc in their dependencies upstream, but not
# all shared objects need it, so add it, but discard if not useful.
LD_SHARED_OPTIONS += -zdiscard-unused=dependencies -lc

# Debug builds may leave references to pixman functions from inline function
# calls in headers that normally get optimized out in non-debug builds.
ifneq ($(filter -g,$(CFLAGS)),)
LD_SHARED_OPTIONS += -lpixman-1
REQUIRED_PACKAGES += library/graphics/pixman
endif

COMPONENT_BUILD_ENV +=	 LD_SHARED_OPTIONS="$(LD_SHARED_OPTIONS)"
COMPONENT_INSTALL_ENV += LD_SHARED_OPTIONS="$(LD_SHARED_OPTIONS)"
endif

# Special options for Xorg library components
ifeq ($(strip $(COMPONENT_CATEGORY)),lib)
CONFIGURE_OPTIONS += --enable-shared=yes --enable-static=no
endif


# Perl operations to perform on pkg-config *.pc files we build/install
# First, make warnings about missing files into fatal errors
PERL_MISSING_FILES_ERROR = -e 'BEGIN {$$SIG{__WARN__} = sub { die $$_[0] };}'
FIX_PC_OPS += $(PERL_MISSING_FILES_ERROR)
# Remove -L flags for libraries in the default library path (/usr/lib{/64})
FIX_PC_OPS += -e 's|-L\$$\{libdir}|| if "$(CONFIGURE_LIBDIR.$(BITS))" eq "$(USRLIB)";'
# Add -R flags for libraries in non-default library paths
FIX_PC_OPS += -e 's|-L\$$\{libdir}|-L\$$\{libdir} -R\$$\{libdir}|;'
# Remove duplicate -R flags if upstream already provided one
FIX_PC_OPS += -e 's|-R\$$\{libdir}( .*)? -R\$$\{libdir}|-R\$$\{libdir}$$1|g;'
# Allow modules to add their own operations
FIX_PC_OPS += $(COMPONENT_FIX_PC_FLAGS)

# Apply common changes to pkg-config *.pc files listed in $(FIX_PC_FILES)
ifneq ($(strip $(FIX_PC_FILES)),)
SOURCE_PC_FILES = $(FIX_PC_FILES:%=$(SOURCE_DIR)/%)
ORIG_PC_FILES = $(SOURCE_PC_FILES:%=%.orig)
FIXED_PC_TARGET = $(ORIG_PC_FILES)
fixed_pc: $(FIXED_PC_TARGET)

$(ORIG_PC_FILES): patch
	$(PERL) -i.orig -p $(FIX_PC_OPS) $(@:.orig=)

$(SOURCE_DIR)/.prep: $(ORIG_PC_FILES)
endif

# Override default man page sections until all X.Org modules are updated
# to use new xorg-macros with Solaris 11.4 man page section support
CONFIGURE_ENV += DRIVER_MAN_SUFFIX=4 FILE_MAN_SUFFIX=5
CONFIGURE_ENV += MISC_MAN_SUFFIX=7 ADMIN_MAN_SUFFIX=8

PKG_MACROS += X11PKGVERS=7.7

# X.Org ships many docs using the DocBook XML DTD's, stylesheets, and tools
REQUIRED_PACKAGES += data/docbook/docbook-dtds
REQUIRED_PACKAGES += data/docbook/docbook-style-dsssl
REQUIRED_PACKAGES += data/docbook/docbook-style-xsl
REQUIRED_PACKAGES += data/sgml-common
REQUIRED_PACKAGES += data/xml-common
REQUIRED_PACKAGES += developer/documentation-tool/xmlto
REQUIRED_PACKAGES += library/libxslt
