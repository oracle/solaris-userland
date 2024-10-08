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
# Copyright (c) 2017, 2023, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		lohit
COMPONENT_VERSION=	20150325
COMPONENT_PROJECT_URL=	https://pagure.io/lohit
COMPONENT_ARCHIVE=
COMPONENT_ARCHIVE_SRC=  none
COMPONENT_SRC=

COMPONENT_NAME_0=	lohit-assamese-ttf
COMPONENT_VERSION_0=	2.5.3
COMPONENT_ARCHIVE_HASH_0=sha256:ce8e510f4e78527eb4c514bf49ed69389b983cd8c4990f0a7b9b9f43b6bef9ce
COMPONENT_ANITYA_ID_0=	17175

COMPONENT_NAME_1=	lohit-bengali-ttf
COMPONENT_VERSION_1=	2.5.3
COMPONENT_ARCHIVE_HASH_1=sha256:c5d8dc45b903175e7ab0047062acb1ee1ebae38ebea0f0b066fa6f1755fdbeaf
COMPONENT_ANITYA_ID_1=	17176

COMPONENT_NAME_2=	lohit-devanagari-ttf
COMPONENT_VERSION_2=	2.95.1
COMPONENT_ARCHIVE_HASH_2=sha256:36eb95eed406a9962035573b7334bbc0612761f538a74fe159f19f1b4232284f
COMPONENT_ANITYA_ID_2=	17177

COMPONENT_NAME_3=	lohit-gujarati-ttf
COMPONENT_VERSION_3=	2.92.2
COMPONENT_ARCHIVE_HASH_3=sha256:9775c4faa7a3acbc2aa3032340448dbe75169849a64402df7572fbef3d0c3523
COMPONENT_ANITYA_ID_3=	17178

COMPONENT_NAME_4=	lohit-kannada-ttf
COMPONENT_VERSION_4=	2.5.3
COMPONENT_ARCHIVE_HASH_4=sha256:f1a6b58a70720e03cce8f6772e8eb87dc12eff8fdf36173c88aef2157e592ef5
COMPONENT_ANITYA_ID_4=	17179

COMPONENT_NAME_5=	lohit-malayalam-ttf
COMPONENT_VERSION_5=	2.5.4
COMPONENT_ARCHIVE_HASH_5=sha256:8c230bbe4cee42d55caa3e548f52dc5f54bae42a35b8eefe575297bd23b2fde4
COMPONENT_ANITYA_ID_5=	17181

COMPONENT_NAME_6=	lohit-marathi-ttf
COMPONENT_VERSION_6=	2.94.0
COMPONENT_ARCHIVE_HASH_6=sha256:843ef521f68605e6a44e77138deb372f23ed7ac8c2822dca766ab9f58c623a79
COMPONENT_ANITYA_ID_6=	17180

COMPONENT_NAME_7=	lohit-nepali-ttf
COMPONENT_VERSION_7=	2.94.0
COMPONENT_ARCHIVE_HASH_7=sha256:27f446a8b1f9a8f34cb4503f2831ec4d2937d1d3f18d18500183f59b0309a630
COMPONENT_ANITYA_ID_7=	17182

COMPONENT_NAME_8=	lohit-odia-ttf
COMPONENT_VERSION_8=	2.91.0
COMPONENT_ARCHIVE_HASH_8=sha256:97260e6dcfce00a6a6517ba469371c4ca172aac41447611947b5cce4da4c3f96
COMPONENT_ANITYA_ID_8=	17183

COMPONENT_NAME_9=	lohit-punjabi-ttf
COMPONENT_VERSION_9=	2.5.3
COMPONENT_ARCHIVE_HASH_9=sha256:d14143d1cbb9d6a72385251875b5b903f95dfbfed9f69e93568f6ab6dfd557bd
COMPONENT_ANITYA_ID_9=	17184

COMPONENT_NAME_10=	lohit-tamil-ttf
COMPONENT_VERSION_10=	2.5.3
COMPONENT_ARCHIVE_HASH_10=sha256:8511a31880f5e00fa19e8c8b1029943a99d17c45b3b7c186a391d8cc8edaa915
COMPONENT_ANITYA_ID_10=	17185

COMPONENT_NAME_11=	lohit-tamil-classical-ttf
COMPONENT_VERSION_11=	2.5.3
COMPONENT_ARCHIVE_HASH_11=sha256:325ea1496bb2ae4f77552c268190251a5155717dccda64d497da4388d17c2432
COMPONENT_ANITYA_ID_11=	17186

COMPONENT_NAME_12=	lohit-telugu-ttf
COMPONENT_VERSION_12=	2.5.3
COMPONENT_ARCHIVE_HASH_12=sha256:ee5896d29b7c012d8d6f6a9c75dd63a897f1f66d7edffbb3847ae4a4b3ecf9e9
COMPONENT_ANITYA_ID_12=	17187

LIST = 0 1 2 3 4 5 6 7 8 9 10 11 12
$(foreach n, $(LIST), \
    $(eval COMPONENT_SRC_$(n) = $(COMPONENT_NAME_$(n))-$(COMPONENT_VERSION_$(n))) \
    $(eval COMPONENT_ARCHIVE_$(n) = $(COMPONENT_SRC_$(n)).tar.gz) \
    $(eval COMPONENT_ARCHIVE_URL_$(n) = https://releases.pagure.org/lohit/$(COMPONENT_ARCHIVE_$(n))) \
)

COMPONENT_BUGDB=	g11n/font
COMPONENT_BAID=		23766

BUILD_STYLE=		archive
TEST_TARGET=		$(NO_TESTS)

include $(WS_MAKE_RULES)/font.mk

COMPONENT_FONT_FILES=  		$(foreach n, $(LIST), $(COMPONENT_SRC_$n)/*.ttf)
COMPONENT_FONT_AVAIL_FILES=	$(foreach n, $(LIST), $(COMPONENT_SRC_$n)/*.conf)
COMPONENT_FONT_CONF_FILES=	*.conf
COMPONENT_FONT_DOC_FILES=	$(COMPONENT_SRC_0)/OFL.txt \
		$(foreach n, $(LIST), $(COMPONENT_SRC_$n)/ChangeLog.[^o]*)

COMPONENT_PREP_ACTION += \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_0)/ChangeLog.Assamese; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_1)/ChangeLog.Bengali; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_2)/ChangeLog.Devanagari; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_3)/ChangeLog.Gujarati; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_4)/ChangeLog.Kannada; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_5)/ChangeLog.Malayalam; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_6)/ChangeLog.Marathi; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_7)/ChangeLog.Nepali; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_8)/ChangeLog.Odia; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_9)/ChangeLog.Punjabi; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_10)/ChangeLog.Tamil; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_11)/ChangeLog.Tamil-Classical; \
	$(SYMLINK) ChangeLog $(COMPONENT_SRC_12)/ChangeLog.Telugu;

# Needed for license action in lohit.p5m
PKG_PROTO_DIRS += $(COMPONENT_SRC_0)
