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
# Copyright (c) 2005, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME= 	timezone
HUMAN_VERSION=		2021c
# The last digit of COMPONENT_VERSION corresponds to the last letter of the
# upstream archive name. 'a' -> 1, 'b' -> 2, etc.
COMPONENT_VERSION=    	2021.3
COMPONENT_PROJECT_URL=	http://www.iana.org/time-zones
COMPONENT_ARCHIVE_URL=	https://data.iana.org/time-zones/releases/tzdata$(HUMAN_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH= sha256:b4f1d1c8cb11c3500276dac862d8c7e6f88c69b1e8ee4c5e9d1daad17fbe3542 

TPNO=			58586	
COMPONENT_ANITYA_ID=	5021

# The timezone packages do not have normal FMRI version. This is because the
# package version is not locked by any incorporation (it is floating). This
# means that the latest timezone package can be installed on any SRU release.
OS_META_VERSION=	-$(PKG_SOLARIS_VERSION)
PKG_MACROS +=		OS_META_VERSION=$(OS_META_VERSION)


# The archive has no directory so create our own and unpack it there
UNPACK_ARGS=		--relocate-to $(SOURCE_DIR)

# Include all files from the tarball into the package at
# usr/share/lib/zoneinfo/src prefix. Exceptions will be handled by generate
# rules
GENERATE_PROTO_DIRS += $(SOURCE_DIR)^usr/share/lib/zoneinfo/src

# Add COMPONENT_SRC variable to the p5m transforms so that we know we use
# README from timezone package and not from this component directory.
PKG_VARS += COMPONENT_SRC

# We are considering all files in the tarball to be included in the package.
# Having gnu patch create the backup files like *.~1~ would mess things up so
# don't do that
override GPATCH_BACKUP=--no-backup-if-mismatch

BUILD_STYLE= archive
include $(WS_MAKE_RULES)/common.mk

POFILE=zoneinfo.po

# "etcetera" must be listed before "backward" because it sets up links that
# "backward" needs.
TZFILES= africa antarctica asia australasia etcetera europe \
	 factory northamerica \
	 southamerica backward

ZONEINFO_TAB_DIR=$(PROTO_DIR)/usr/share/lib/zoneinfo/tab

build: $(SOURCE_DIR)/.prep $(BUILD_DIR)
	( \
		cd $(SOURCE_DIR); \
		/usr/sbin/zic -d $(PROTOUSRSHARELIBDIR)/zoneinfo $(TZFILES) \
	)

	$(MKDIR) -p $(ZONEINFO_TAB_DIR)
	# According to LSARC/2001/015 zone_sun.tab has additional column when
	# compared to zone.tab
	./create_zone_sun.pl $(SOURCE_DIR)/zone.tab > $(ZONEINFO_TAB_DIR)/zone_sun.tab

	# Remove utf-8 characters from country.tab
	./create_country.pl $(SOURCE_DIR)/iso3166.tab > $(ZONEINFO_TAB_DIR)/country.tab

	# Extract strings into translation template
	$(SHELL) ./do_pofile.sh \
		$(ZONEINFO_TAB_DIR)/zone_sun.tab \
		$(SOURCE_DIR)/iso3166.tab \
		$(COMPONENT_DIR)/continent.tab | \
		/usr/bin/msguniq > $(BUILD_DIR)/$(POFILE)

install: build

# The following workaround is used to bring up SPARC Desktop before Release From Trunk 
# and thereby fixes bug 29259680 but the original bugs will be seen on SPARC again 
# and this is tracked by a new bug 30894518.
ifeq ($(MACH), i386)
	$(RM) $(PROTOUSRSHAREDIR)/zoneinfo
	$(SYMLINK) ../..$(USRSHARELIBDIR)/zoneinfo $(PROTOUSRSHAREDIR)/zoneinfo
endif

# empty test target
test:	$(NO_TESTS)

system-test:    $(NO_TESTS)

PKG_AUTO_HARDLINKS=	1
