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
# Copyright (c) 2005, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= NO_ARCH

include ../../make-rules/shared-macros.mk

COMPONENT_NAME= 	timezone
HUMAN_VERSION=		2025a
# The last digit of COMPONENT_VERSION corresponds to the last letter of the
# upstream archive name. 'a' -> 1, 'b' -> 2, etc.
COMPONENT_VERSION=    	2025.1
COMPONENT_PROJECT_URL=	http://www.iana.org/time-zones
COMPONENT_ARCHIVE_URL=	https://data.iana.org/time-zones/releases/tzdata$(HUMAN_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH= sha256:4d5fcbc72c7c450ebfe0b659bd0f1c02fbf52fd7f517a9ea13fe71c21eb5f0d0
# The archive has no directory so create our own and unpack it there
UNPACK_ARGS=		--relocate-to $(SOURCE_DIR)

#COMPONENT_SRC_CODE=		$(COMPONENT_NAME)-doc-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_CODE=		tzcode$(HUMAN_VERSION).tar.gz
COMPONENT_ARCHIVE_URL_CODE= 	https://data.iana.org/time-zones/releases/$(COMPONENT_ARCHIVE_CODE)
COMPONENT_ARCHIVE_HASH_CODE=	sha256:119679d59f76481eb5e03d3d2a47d7870d592f3999549af189dbd31f2ebf5061
COMPONENT_SRC_CODE=		tzcode-$(COMPONENT_VERSION)
# The archive has no directory so create our own and unpack it there
UNPACK_ARGS_CODE=		--relocate-to $(SOURCE_DIR_CODE)

COMPONENT_BAID=		193763
COMPONENT_ANITYA_ID=	5021

# The timezone packages do not have normal FMRI version. This is because the
# package version is not locked by any incorporation (it is floating). This
# means that the latest timezone package can be installed on any SRU release.
OS_META_VERSION=	-$(PKG_SOLARIS_VERSION)
PKG_MACROS +=		OS_META_VERSION=$(OS_META_VERSION)

COMPILER=gcc

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
		cd $(SOURCE_DIR_CODE); \
		gmake CC=$(CC) VERSION_DEPS= zic; \
	); \
	( \
		cd $(SOURCE_DIR); \
		$(SOURCE_DIR_CODE)/zic -d $(PROTOUSRSHARELIBDIR)/zoneinfo $(TZFILES) \
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
