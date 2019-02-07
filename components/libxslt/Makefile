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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libxslt
COMPONENT_VERSION=	1.1.33
COMPONENT_PROJECT_URL=	http://xmlsoft.org/XSLT/
COMPONENT_ARCHIVE_HASH=	\
    sha256:8e36605144409df979cab43d835002f63988f3dc94d5d3537c12796db90e38c8
COMPONENT_ARCHIVE_URL=	ftp://xmlsoft.org/libxslt/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/libxslt
COMPONENT_ANITYA_ID=	13301

TPNO=			49261

SYSTEM_TEST_TARGET= build $(SYSTEM_TEST_32_and_64)

include $(WS_MAKE_RULES)/common.mk

# The lint check requires the current version of libxml2 header files since
# function declarations might have changed between the system and gate version.
LINT_FLAGS +=	-I$(COMPONENT_DIR)/../libxml2/build/prototype/$(MACH)/$(USRINCDIR)/libxml2

CFLAGS +=	$(CPP_LARGEFILES)
LDFLAGS +=	$(LD_Z_DEFS) $(LD_Z_TEXT)

CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --with-pic
CONFIGURE_OPTIONS += --with-python=$(PYTHON.$(BITS))
CONFIGURE_OPTIONS += --without-crypto
CONFIGURE_OPTIONS += --with-html-dir=$(USRSHARELIBDIR)/xslt/doc
CONFIGURE_OPTIONS += --with-html-subdir=html
CONFIGURE_OPTIONS += PYTHON_VENDOR_PACKAGES=$(PYTHON_VENDOR_PACKAGES)

COMPONENT_PREP_ACTION = \
	(cd $(@D) ; cp ../mapfile.xslt libxslt/libxslt.syms ; \
		    $(RM) libxslt/xsltconfig.h libexslt/exsltconfig.h ) ;

# Automatically rebuild the libxml2 library if required.
COMPONENT_PREP_ACTION += \
  (if [ ! -e ../libxml2/build ]; then \
    echo "Build and install libxml2 dependency..."; \
    gmake -C ../libxml2/ install; \
   fi; \
   cd $(@D); autoreconf -fiv \
  )

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

# Rule out randomly sorted XSLT extensions list.
COMPONENT_TEST_TRANSFORMS += '-e "/http:\/\//d"'

# system-test should really use system version library
COMPONENT_PRE_SYSTEM_TEST_ACTION = ($(RM) $(@D)/libxslt/.libs/*)

COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON.2.7.32) -m compileall $(PROTOUSRLIBDIR)/python2.7/vendor-packages

REQUIRED_PACKAGES += data/xml-common
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
