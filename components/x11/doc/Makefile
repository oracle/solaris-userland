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
# Copyright (c) 2018, 2024, Oracle and/or its affiliates.
#

BUILD_BITS =		64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		xorg-docs
COMPONENT_CATEGORY=	doc
COMPONENT_VERSION=	1.7.3
COMPONENT_ARCHIVE_HASH= \
	sha256:28a2f2eeb5d9ff58b85961ff3ed7baaaf1ffa132e2a81f8b2bb97cb499bcddef
COMPONENT_ANITYA_ID=	5212
COMPONENT_BUGDB=	x11/doc
COMPONENT_BAID=		180590

COMPONENT_NAME_1=	xorg-sgml-doctools
COMPONENT_VERSION_1=	1.12.1
COMPONENT_SRC_1=	$(COMPONENT_NAME_1)-$(COMPONENT_VERSION_1)
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1).tar.xz
COMPONENT_ARCHIVE_URL_1= $(COMPONENT_ARCHIVE_URL:$(COMPONENT_ARCHIVE)=$(COMPONENT_ARCHIVE_1))
COMPONENT_ARCHIVE_HASH_1= \
	sha256:0a5d54c0706b4e89d5acd4d455db3745ab4ad26be627cce015b90ad403b56d6f
COMPONENT_ANITYA_ID_1=	5211
COMPONENT_BAID_1=	180591

TEST_TARGET = $(NO_TESTS)

COMPONENTS = $(COMPONENT_NAME) $(COMPONENT_NAME_1)
CONFIGURE_64 = $(COMPONENTS:%=$(BUILD_DIR)/$(MACH64)-%/.configured)
BUILD_64 = $(COMPONENTS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
INSTALL_64 = $(COMPONENTS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
$(BUILD_DIR)/$(MACH64)-$(COMPONENT_NAME_1)/%: SOURCE_DIR = $(SOURCE_DIR_1)

include $(WS_MAKE_RULES)/x11-component.mk

# Have to install the doc tools before configuring the docs
$(BUILD_DIR)/$(MACH64)-$(COMPONENT_NAME)/.configured: $(BUILD_DIR)/$(MACH64)-$(COMPONENT_NAME_1)/.installed

# Fix entity paths in DocBook files so that gnome-help can resolve them
COMPONENT_PREP_ACTION += \
	find $(@D) -name '*.xml' | xargs $(PERL) -i.orig -p -e \
	 's{SYSTEM ".*/X11/defs.ent"}{SYSTEM "/usr/share/sgml/X11/defs.ent"}' ;

CONFIGURE_OPTIONS += --docdir='$(USRSHAREDOCDIR)/X11'
CONFIGURE_OPTIONS += XORG_SGML_PATH='$(PROTO_DIR)/usr/share/sgml'

# Extra install work for xorg-sgml-doctools
COMPONENT_INSTALL_ARGS += pkgconfigdir="$(DESTDIR)/usr/share/pkgconfig"
COMPONENT_POST_INSTALL_ACTION_1 += \
	$(GSED) -e 's|sgmlrootdir=|sgmlrootdir=$(PROTO_DIR)|g' \
	    $(PROTO_DIR)/usr/share/pkgconfig/xorg-sgml-doctools.pc > \
	    $(PROTO_DIR)/usr/share/pkgconfig/xorg-sgml-doctools-uninstalled.pc ;
$(BUILD_DIR)/$(MACH64)-$(COMPONENT_NAME_1)/.installed: COMPONENT_POST_INSTALL_ACTION=$(COMPONENT_POST_INSTALL_ACTION_1)

# Extra install work for xorg-docs
COMPONENT_POST_INSTALL_ACTION += \
	$(PERL) -i -p -e 's|__distroname__|Oracle Solaris|g' \
	    $(PROTO_DIR)/usr/share/man/man7/*.7 ;

COMPONENT_POST_INSTALL_ACTION += \
	$(INSTALL) -m 0444 $(COMPONENT_DIR)/X11.7 \
	    $(PROTO_DIR)/usr/share/man/man7/ ;

# Avoid conflict with Solaris's standards.7 man page
COMPONENT_POST_INSTALL_ACTION += \
	$(MV) $(PROTO_DIR)/usr/share/man/man7/Standards.7 \
	    $(PROTO_DIR)/usr/share/man/man7/XStandards.7 ;
