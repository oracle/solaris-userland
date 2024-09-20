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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#

BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		gsl
COMPONENT_VERSION=	2.8
COMPONENT_BAID=		170486
COMPONENT_ARCHIVE_HASH=	sha256:6a99eeed15632c6354895b1dd542ed5a855c0f15d9ad1326c6fe2b2c9e423190
COMPONENT_BUGDB=	library/libgsl
COMPONENT_ANITYA_ID=	1267

include $(WS_MAKE_RULES)/gnu-component.mk

# C11 extends complex
CFLAGS += -std=c11

# This component is using static libraries .a internally and these are not
# compatible with PIE building
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# NOTE:
# The libgsl package on Solaris is getting GSL CBLAS routines from
# libsunperf.so. Programs wishing to use this functionality should use the
# /usr/include/sunperf.h header file for the associated definitions and
# function prototypes and link against -lsunperf.
#
# To retain compatibility with libgsl on other platforms, and to require
# no changes to FOSS software being ported to Solaris, the libgsl package
# manifest will also include the /usr/include/gsl/gsl_cblas.h header file
# and provide links from /usr/lib/libgslcblas.so and
# /usr/lib/$(MACH64)/libgslcblas.so to their equivalent libsunperf.so
# library files.

# By default, tests in each GSL sub-directory are linked statically against
# a set of .la files. We don't deliver those in the GSL package, so we
# adjust all the tests to link against the dynamic GSL library instead.
COMPONENT_POST_UNPACK_ACTION += \
	(cd $(COMPONENT_SRC); \
	for f in `ls */Makefile.am` ; do \
	    $(GSED) -i -e \
		's|^test_LDADD.*$$|test_LDFLAGS = -L`pwd`/../.libs/ -R`pwd`/../.libs/\ntest_LDADD = -lgsl|' \
		$$f ; \
	done) ;

# Remove ../../cblas/libgslcblas.la from LDADD definition in
# .../doc/examples/Makefile.am
COMPONENT_POST_UNPACK_ACTION += \
	$(GSED) -i -e 's|^LDADD.*$$|LDADD = ../../libgsl.la|' \
		$(COMPONENT_SRC)/doc/examples/Makefile.am ;

# Recreate configure and top-level Makefile to pickup libsunperf changes.
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv)

LDFLAGS += $(CC_BITS)
LDFLAGS += $(studio_PIC)
LDFLAGS += $(studio_OPT)
LDFLAGS += $(LD_Z_TEXT)
LDFLAGS += $(LD_Z_DEFS)
LDFLAGS += $(LD_DEF_LIBS)

STUDIO_LIBS_PATH.32 =	$(USRLIBDIR)/studio
STUDIO_LIBS_PATH.64 =	$(USRLIBDIR)/studio/64

COMPONENT_POST_INSTALL_ACTION += \
   $(GSED) -i -e 's% -[RL]/usr/lib/$(MACH64)%%g;s% -[RL]/usr/lib%%g' $(PROTOUSRBINDIR)/gsl-config ; \
   $(MKDIR) $(PROTOUSRBINDIR64) ; $(MKDIR) $(PROTOUSRBINDIR)/$(MACH32) ; \
   $(RM) $(PROTOUSRBINDIR64)/gsl-config $(PROTOUSRBINDIR)/$(MACH32)/gsl-config ; \
   $(SYMLINK) ../gsl-config $(PROTOUSRBINDIR)/$(MACH32)/gsl-config ; \
   $(SYMLINK) ../gsl-config $(PROTOUSRBINDIR64)/gsl-config ;

# Get correct libgsl.so from the proto area.
TEST_LIBPATH.32 =	$(PROTOUSRLIBDIR)
TEST_LIBPATH.64 =	$(PROTOUSRLIBDIR64)
$(BUILD_DIR)/sparcv7/.tested $(BUILD_DIR)/sparcv7/.tested-and-compared: COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-sparcv7.master
$(BUILD_DIR)/sparcv9/.tested $(BUILD_DIR)/sparcv9/.tested-and-compared: COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-sparcv9.master
$(BUILD_DIR)/i86/.tested $(BUILD_DIR)/i86/.tested-and-compared: COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-i86.master
$(BUILD_DIR)/amd64/.tested $(BUILD_DIR)/amd64/.tested-and-compared: COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-amd64.master
COMPONENT_TEST_ARGS+= -k -i
COMPONENT_TEST_ENV +=	LD_LIBRARY_PATH=$(TEST_LIBPATH.$(BITS))
# Only the #'s of passed/failed tests are verified for change
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/TESTDONE:/p" ' \
	'-e "/TESTFAIL:/p" ' \
	'-e "/ TOTAL:/p" ' \
	'-e "/ PASS:/p" ' \
	'-e "/ SKIP:/p" ' \
	'-e "/ XFAIL:/p" ' \
	'-e "/ FAIL:/p" ' \
	'-e "/ XPASS:/p" ' \
	'-e "/ ERROR:/p" '

REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/sunperf
