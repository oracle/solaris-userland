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
BUILD_BITS= NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pylint
COMPONENT_VERSION=	2.3.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=		\
	sha256:723e3db49555abaf9bf79dc474c6b9e2935ad82230b10c1138a71ea41ac0fff1
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=  https://www.pylint.org/
COMPONENT_BUGDB=	utility/pylint
COMPONENT_ANITYA_ID=	5344

TPNO=			51781


COMPONENT_NAME_OLD=		$(COMPONENT_NAME)
COMPONENT_VERSION_OLD=	1.6.4
COMPONENT_SRC_OLD=		$(COMPONENT_NAME)-$(COMPONENT_VERSION_OLD)
COMPONENT_ARCHIVE_OLD=	$(COMPONENT_SRC_OLD).tar.gz
COMPONENT_ARCHIVE_HASH_OLD=	\
	sha256:ef901a34b62ed7a734370ba5b162d890231ba8822abe88c6dda1268e2575f5f1
COMPONENT_ARCHIVE_URL_OLD=	$(call pypi_url,OLD)

TPNO_OLD=		31351


# This component is delivered in two different versions because
# the newer one is no longer Python 2.7 compatible.

# This component is not Python 3.9 ready yet
PYTHON_VERSIONS = $(WITHOUT_PYTHON3.9)

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Disable the unit tests since the test results are outdated.
$(SKIP_TEST_AT_TOP_LEVEL)

# There are several pylint documentation files that setup.py isn't installing
# but are present in the pylint package on other distributions. Copy them into
# the proto area "manually", so they can be included in the package.
PDOC_PYLINT =		$(PROTOUSRSHAREDOCDIR)/pylint
PDOC_PYLINT_EXAMPLES =	$(PDOC_PYLINT)/examples

COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PDOC_PYLINT) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(COMPONENT_SRC)/README.rst $(PDOC_PYLINT) ;

COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(COMPONENT_SRC)/examples/custom.py $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(COMPONENT_SRC)/examples/custom_raw.py $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(COMPONENT_SRC)/elisp/pylint.el $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(COMPONENT_SRC)/examples/pylintrc_camelcase $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION += \
	$(CP) $(COMPONENT_SRC)/examples/pylintrc $(PDOC_PYLINT_EXAMPLES) ;
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) epylint epylint-$(PYTHON_VERSION)) ;
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) pylint pylint-$(PYTHON_VERSION)) ;
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) pyreverse pyreverse-$(PYTHON_VERSION)) ;
COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) symilar symilar-$(PYTHON_VERSION)) ;

COMPONENT_POST_INSTALL_ACTION += \
	($(PYTHON) -m py_compile $(PROTOUSRLIBDIR)/python$(PYTHON_VERSION)/vendor-packages/pylint/testutils.py) ;


# Convenience variables
TARGET_27 = $(BUILD_DIR)/$(MACH)-2.7/
SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)

# pylint-gui is no longer delivered in newer version
$(TARGET_27).installed: COMPONENT_POST_INSTALL_ACTION += \
	(cd $(PROTO_DIR)/usr/bin; $(MV) pylint-gui pylint-gui-$(PYTHON_VERSION)) ;

# Targets updated for older version build
$(TARGET_27).built: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).installed: SOURCE_DIR = $(SOURCE_DIR_OLD)

$(TARGET_27).tested-and-compared: COMPONENT_TEST_DIR = $(SOURCE_DIR_OLD)

$(MANIFEST_BASE)-pylint-27.mogrified: COMPONENT_VERSION = $(COMPONENT_VERSION_OLD)

# Manifest convenience variables.
$(MANIFEST_BASE)-pylint-27.mogrified: NEW_ONLY = \#
$(MANIFEST_BASE)-pylint-35.mogrified: OLD_ONLY = \#
$(MANIFEST_BASE)-pylint-37.mogrified: OLD_ONLY = \#

PKG_MACROS += OLD_ONLY="$(OLD_ONLY)"
PKG_MACROS += NEW_ONLY="$(NEW_ONLY)"

# Meta package must have versions of older runtimes fixed
FIX_MANIFEST_VERSIONS:
	echo "<transform depend fmri=(.*)pylint-27@(.*) \
		-> edit fmri $(COMPONENT_VERSION) $(COMPONENT_VERSION_OLD)>" | \
	$(PKGMOGRIFY) /dev/fd/0 $(MANIFEST_BASE)-pylint.mogrified \
		> $(MANIFEST_BASE)-pylint.mogrified-fixed ;
	$(MV) $(MANIFEST_BASE)-pylint.mogrified-fixed \
		$(MANIFEST_BASE)-pylint.mogrified

$(MANIFEST_BASE)-pylint.mangled: FIX_MANIFEST_VERSIONS


COMPONENT_TEST_DIR =	$(SOURCE_DIR)
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =
COMPONENT_TEST_TRANSFORMS += '-n -e "s/\(in \).*\(seconds\)/\1x \2/p"'

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_NO_ARCH)

install:	$(INSTALL_NO_ARCH)

test:		$(TEST_NO_ARCH)

system-test:	$(SYSTEM_TESTS_NOT_IMPLEMENTED)
