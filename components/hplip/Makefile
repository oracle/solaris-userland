#
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
BUILD_BITS=	64
COMPILER=	gcc
# parallel build will not survive the build process atrocity 
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         hplip
COMPONENT_VERSION=      3.19.5
TPNO=			52183
COMPONENT_ARCHIVE_HASH= sha256:8f5ac056c1a778b78511588f427072078703d683dfe5af6214ba179e89b453e1
COMPONENT_ARCHIVE_URL=	https://downloads.sourceforge.net/project/$(COMPONENT_NAME)/$(COMPONENT_NAME)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://hplipopensource.com/hplip-web/index.html
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	1327

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Not Python 3.x ready due to configure errors
PYTHON_VERSION = 2.7

CONFIGURE_OPTIONS +=	--localedir=$(CONFIGURE_LOCALEDIR)
CONFIGURE_OPTIONS +=	--with-hpppddir=$(USRSHAREDIR)/cups/model/hplip
CONFIGURE_OPTIONS +=	--enable-new-hpcups
CONFIGURE_OPTIONS +=	--enable-cups-ppd-install
CONFIGURE_OPTIONS +=	--disable-gui-build
CONFIGURE_OPTIONS +=	PYTHON=$(PYTHON)
CONFIGURE_OPTIONS +=	am_cv_python_pythondir="$(PYTHON_VENDOR_PACKAGES)"
CONFIGURE_OPTIONS +=	am_cv_python_pyexecdir="$(PYTHON_VENDOR_PACKAGES)"
# bye, bye SANE backends
CONFIGURE_OPTIONS +=	--disable-scan-build

# Generate configuration scripts
COMPONENT_PREP_ACTION = (cd $(@D) ; \
    libtoolize --force ; \
    aclocal ; \
    automake --foreign --add-missing ; \
    autoconf )

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

# if you are doing anything affecting the python-scripts list you will face to:
#  "chicken/egg problem"
# so you need to run "gmake python-scripts" first then remove:
#  build/$(MACH64)/.installed  and  build/proto/$(MACH)/
# then run "gmake install" again to fix python scripts while install
# note: File python-scripts is committed in WS so you can see the changes by:
#  "hg st" then "hg diff python-scripts"
PYTHON_SCRIPTS = $(shell (while read f ; do echo $(PROTO_DIR)/$$f ; done ) < python-scripts )
python-scripts: install
	find $(PROTO_DIR) -type f |\
	 (while read f ; do head -1 $$f |\
	  /usr/xpg4/bin/grep '^\#!.*python' > /dev/null && echo $$f ;\
	 done) | sed -e 's@$(PROTO_DIR)/@@' | sort > $@

# remove the printer-controll python-modules using python-gobject
COMPONENT_POST_INSTALL_ACTION += \
	ggrep -rwl gobject --include=\*.py $(PROTO_DIR) \
	   | xargs $(RM) ;

# build .pyc's
COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON) -m compileall $(PROTO_DIR)/usr/share/hplip/ ;

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += library/libusb-1
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/management/snmp/net-snmp
