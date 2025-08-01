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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#
BUILD_BITS =		64_and_32
CTF_MODE =		relaxed
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		pcre
COMPONENT_VERSION=	8.45
COMPONENT_ARCHIVE_HASH=	\
    sha256:4e6ce03e0336e8b4a3d6c2b70b1c5e18590a5673a98186da90d4f33c23defc09
COMPONENT_ARCHIVE_URL=	https://sourceforge.net/projects/pcre/files/pcre/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_PROJECT_URL=  http://pcre.org/
COMPONENT_BUGDB=	library/pcre
COMPONENT_ANITYA_ID=	2610

COMPONENT_BAID=		118087

TEST_TARGET= install $(TEST_32_and_64)
SYSTEM_TEST_TARGET= build $(SYSTEM_TEST_32_and_64)
include $(WS_MAKE_RULES)/common.mk

# pick up -xc99=all in CFLAGS
studio_C99MODE=        $(studio_C99_ENABLE)

# pick up -xlang=c99 in XPG5MODE
studio_cplusplus_C99MODE=	$(studio_cplusplus_C99_ENABLE)

# turn on largefile support
CFLAGS+=	$(CPP_LARGEFILES)

CFLAGS+=	$(XPG6MODE)

# Although -norunpath is set for CXXFLAGS, we need to put -norunpath 
# here, otherwise -norunpath doesn't get set when creating the shared 
# libraries (CC -G).
CXX+=	$(studio_NORUNPATH)

CXXFLAGS+=	$(CC_PIC)

# turn on support for large files
CXXFLAGS+=	$(CPP_LARGEFILES)

CXXFLAGS+=	$(XPG5MODE)
CXXFLAGS+=	-std=sun03 

LINT_FLAGS+=	$(CPP_LARGEFILES)

CONFIGURE_ENV+=	"CPP=$(CC) $(CPPFLAGS) $(CFLAGS) -E"
CONFIGURE_ENV+=	"CXXCPP=$(CXX) $(CPPFLAGS) $(CXXFLAGS) -E"
CONFIGURE_ENV+=	"CXXLDFLAGS=$(LDFLAGS)"
CONFIGURE_ENV+= "CXXLD=$(CXX) $(CXXFLAGS) $(LDFLAGS)"
CONFIGURE_ENV+= "INSTALL=$(INSTALL)"
CONFIGURE_ENV+= "MAKE=$(GMAKE)"

CONFIGURE_ENV.64+= "CXXLINKLIB=$(CXX) $(CCFLAGS) $(LDFLAGS)"
CONFIGURE_ENV.64+= "MACH64=$(MACH64)"

CONFIGURE_OPTIONS+=	--includedir=$(CONFIGURE_INCLUDEDIR)/pcre
CONFIGURE_OPTIONS+=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS+=	--disable-static
CONFIGURE_OPTIONS+=	--enable-cpp
CONFIGURE_OPTIONS+=	--enable-rebuild-chartables
CONFIGURE_OPTIONS+=	--enable-utf8
CONFIGURE_OPTIONS+=	--enable-unicode-properties
CONFIGURE_OPTIONS+=	--enable-newline-is-any
CONFIGURE_OPTIONS+=	--disable-stack-for-recursion
CONFIGURE_OPTIONS+=	--enable-pcregrep-libz
CONFIGURE_OPTIONS+=	--enable-pcregrep-libbz2
CONFIGURE_OPTIONS+=	--with-posix-malloc-threshold=20
CONFIGURE_OPTIONS+=	--with-link-size=4
CONFIGURE_OPTIONS+=	--with-match-limit=10000000
CONFIGURE_OPTIONS+=	--with-pic

CONFIGURE_OPTIONS.64+=	--libexecdir=$(CONFIGURE_PREFIX)/libexec/$(MACH64)

COMPONENT_BUILD_ENV+=	"LDFLAGS=$(LDFLAGS)"
COMPONENT_BUILD_ENV+=	"INSTALL=$(INSTALL)"
COMPONENT_BUILD_ENV+=	"MAKE=$(GMAKE)"

COMPONENT_BUILD_ARGS+=	-e

COMPONENT_INSTALL_ARGS+=	"INSTALL=$(INSTALL)"
COMPONENT_INSTALL_ARGS+=	"MAKE=$(GMAKE)"

# Master test results are the same for 32-bit and 64-bit, so override
# here, rather than create multiple identical master files.
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Get correct libpcre.so.0 from the build area.
TEST_LIBPATH.32 =	$(PROTOUSRLIBDIR)
TEST_LIBPATH.64 =	$(PROTOUSRLIBDIR64)
COMPONENT_TEST_ENV +=	LD_LIBRARY_PATH=$(TEST_LIBPATH.$(BITS))

COMPONENT_TEST_TRANSFORMS += \
	'-e "/Nothing to be done/d"' \
	'-e "/Leaving directory/d"' \
	'-e "/Entering directory/d"' \
	'-e "s|Testsuite summary for PCRE .*|Testsuite summary for PCRE|" '

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
