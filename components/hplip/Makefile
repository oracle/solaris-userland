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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS=	32
COMPILER=	gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         hplip
COMPONENT_VERSION=      3.17.10
TPNO=			40319
COMPONENT_ARCHIVE_HASH= sha256:0f7344174672f63a98a22f3c109005b6eb89fe738b7d466316bf2c53d083476c
COMPONENT_ARCHIVE_URL=	https://downloads.sourceforge.net/project/$(COMPONENT_NAME)/$(COMPONENT_NAME)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://hplipopensource.com/hplip-web/index.html
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	1327

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS +=	--localedir=$(CONFIGURE_LOCALEDIR)
CONFIGURE_OPTIONS +=	--with-hpppddir=$(USRSHAREDIR)/cups/model/hplip
CONFIGURE_OPTIONS +=	--enable-fax-build
CONFIGURE_OPTIONS +=	--enable-new-hpcups
CONFIGURE_OPTIONS +=	--enable-hpcups-install
CONFIGURE_OPTIONS +=	--enable-cups-drv-install
CONFIGURE_OPTIONS +=	--enable-cups-ppd-install
CONFIGURE_OPTIONS +=	--disable-pp-build
CONFIGURE_OPTIONS +=	--disable-gui-build
CONFIGURE_OPTIONS +=	--disable-qt4
CONFIGURE_OPTIONS +=	PYTHON=$(PYTHON.$(PYTHON_VERSION))
CONFIGURE_OPTIONS +=	am_cv_python_pythondir="$(PYTHON_VENDOR_PACKAGES)"
CONFIGURE_OPTIONS +=	am_cv_python_pyexecdir="$(PYTHON_VENDOR_PACKAGES)"
# bye, bye SANE backends
CONFIGURE_OPTIONS +=	--disable-scan-build

LDFLAGS += $(LIBNSL)

COMPONENT_INSTALL_ARGS += -e

# Generate configuration scripts
COMPONENT_PREP_ACTION = (cd $(@D) ; \
   touch INSTALL NEWS README AUTHORS ChangeLog compile ; \
   PATH="/usr/gnu/bin:$(PATH)" aclocal --force ; \
   PATH="/usr/gnu/bin:$(PATH)" libtoolize --force ; \
   PATH="/usr/gnu/bin:$(PATH)" autoreconf -fi )

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

PYTHON_SCRIPTS += $(PROTO_DIR)/usr/lib/cups/backend/hpfax
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/lib/cups/filter/hpps
PYTHON_SCRIPTS += $(PROTO_DIR)/usr/lib/cups/filter/pstotiff
PYTHON_SCRIPTS += \
 $(shell nawk -F \= \
  ' $$1 ~ /^file.*path/ && $$2 ~ /.*\.py$$/ {print "$(PROTO_DIR)/"$$2;} ' \
  $(COMPONENT_DIR)/hplip.proto-objects)

# build .pyc's
COMPONENT_POST_INSTALL_ACTION += \
	$(PYTHON.$(PYTHON_VERSION)) -m compileall $(PROTO_DIR)/usr/share/hplip/

# empty test target
test:	$(NO_TESTS)

system-test:    $(NO_TESTS)

REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += library/libusb-1
REQUIRED_PACKAGES += library/print/cups-libs
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/management/snmp/net-snmp
