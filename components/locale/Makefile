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
# Copyright (c) 2018, 2019, Oracle and/or its affiliates. All rights reserved.
#
#

BUILD_BITS=		NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		locale
COMPONENT_VERSION=	28

# use solaris version for system locales instead of CLDR version
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_PROJECT_URL=	http://unicode.org/Public/cldr

COMPONENT_SRC=		core
COMPONENT_ARCHIVE=	core.zip
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH=	sha256:26f751ab1421192b2ae76c5fd2f83ad477d611c5711098f4fe0ec09c9602ff4d
UNPACK_ARGS=		-r $(COMPONENT_SRC)

COMPONENT_SRC_1=	tools
COMPONENT_ARCHIVE_1=	tools.zip
COMPONENT_ARCHIVE_URL_1=$(COMPONENT_PROJECT_URL)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE_1)
COMPONENT_ARCHIVE_HASH_1=sha256:dff1fe3ac255b556e5feb3fe2877f2935ce75f063a78ea0ac38f43f7da79138a
UNPACK_ARGS_1=		-r $(COMPONENT_SRC_1)

COMPONENT_SRC_2=	keyboards
COMPONENT_ARCHIVE_2=	keyboards.zip
COMPONENT_ARCHIVE_URL_2=$(COMPONENT_PROJECT_URL)/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE_2)
COMPONENT_ARCHIVE_HASH_2=sha256:cd9253e6fa1cb0b60f526e9892648144d34a7dd096c7cf21ce64e3c46b152d28
UNPACK_ARGS_2=		-r $(COMPONENT_SRC_2)

COMPONENT_BUGDB=	g11n/locale-data

TPNO_CLDR=		26725
TPNO_IEEE=		11202
TPNO_ISO=		11207
TPNO_UNICODE=		21647

BUILD_STYLE=		archive
TEST_TARGET=		$(NO_TESTS)
INSTALL_TARGET=		$(BUILD_DIR)/.installed

include $(WS_MAKE_RULES)/common.mk

PROTOLOCALE	= $(PROTOUSRLIBDIR)/locale
PROTOLOCALEDEFSRC	= $(PROTOUSRLIBDIR)/localedef/src

#
# CLDR build tools
#
CLASSPATH	= $(SOURCE_DIR_1)/tools/java/classes:$(SOURCE_DIR_1)/tools/java/libs/*
JAVA_ARGS	= -Xmx512m -DCLDR_DTD_CACHE=$(BUILD_DIR)/cache -DCLDR_DIR=$(BUILD_DIR)/core
JAVA_CMD	= $(JAVA_HOME)/bin/java -cp $(CLASSPATH) $(JAVA_ARGS)
GEN_DESCRIPTION	= $(JAVA_CMD) org.unicode.cldr.tool.LocaleDescription
GEN_POSIX	= $(JAVA_CMD) org.unicode.cldr.posix.GeneratePOSIX
GEN_CHARMAP	= $(JAVA_CMD) org.unicode.cldr.posix.GenerateCharmap

#
# static-locales are build from manually created posix sources
#
STATIC_LOCALES	= $(basename $(notdir $(wildcard $(COMPONENT_DIR)/*.src)))
STATIC_CHARMAPS	= $(firstword $(subst @, ,$(STATIC_LOCALES)))

#
# CLDR-locales are generated from CLDR data.
#
# Parameters for the generator is taken from locale.list and the build rules
# are auto generated. It makes it easy to edit the parameters while allowing
# run the rules in parallel.
#
-include $(BUILD_DIR)/locale.mk
$(BUILD_DIR)/locale.mk: $(COMPONENT_DIR)/locale.list $(COMPONENT_DIR)/Makefile
	$(MKDIR) $(BUILD_DIR)
	$(PERL) -anle 'next if /^#/ || ! /\S/; \
		print "CLDR_LOCALES+=$$F[0]"; \
		print "CLDR_CHARMAPS+=$$F[1]"; \
		print ""; \
		print "\$$(BUILD_DIR)/$$F[0]/posix.src: \$$(BUILD_DIR)/core/.prep \$$(BUILD_DIR)/.tools.prep"; \
		print "	\$$(GEN_POSIX) -o \$$@ -c \$$(basename $$F[1]) -m $$F[3]"; \
		print ""; \
		print "\$$(BUILD_DIR)/$$F[0]/.compiled: $$F[2] \$$(BUILD_DIR)/$$F[1]"; \
		print "";' <$< >$@

LOCALES = $(STATIC_LOCALES) $(CLDR_LOCALES)

build: $(LOCALES:%=$(BUILD_DIR)/%/.compiled) $(BUILD_DIR)/common/.compiled $(BUILD_DIR)/.ldesc

#
# build rules for non-CLDR locales
#
$(BUILD_DIR)/ja_JP.eucJP/.compiled:		ja_JP.eucJP.x ja_JP.eucJP.charmap
$(BUILD_DIR)/ja_JP.PCK/.compiled:		ja_JP.PCK.x ja_JP.PCK.charmap
$(BUILD_DIR)/ja_JP.UTF-8/.compiled:		UTF-8.x $(BUILD_DIR)/UTF-8.charmap
$(BUILD_DIR)/th_TH.TIS620/.compiled:		ISO8859.x th_TH.TIS620.charmap
$(BUILD_DIR)/zh_CN.GB18030/.compiled:		zh_CN.GB18030.x zh_CN.GB18030.charmap
$(BUILD_DIR)/zh_CN.GB18030@pinyin/.compiled:	zh_CN.GB18030.x zh_CN.GB18030.charmap
$(BUILD_DIR)/zh_CN.GB18030@radical/.compiled:	zh_CN.GB18030.x zh_CN.GB18030.charmap
$(BUILD_DIR)/zh_CN.GB18030@stroke/.compiled:	zh_CN.GB18030.x zh_CN.GB18030.charmap
$(BUILD_DIR)/zh_HK.BIG5HK/.compiled:		zh_HK.BIG5HK.x zh_HK.BIG5HK.charmap
$(BUILD_DIR)/zh_HK.BIG5HK@radical/.compiled:	zh_HK.BIG5HK.x zh_HK.BIG5HK.charmap
$(BUILD_DIR)/zh_HK.BIG5HK@stroke/.compiled:	zh_HK.BIG5HK.x zh_HK.BIG5HK.charmap
$(BUILD_DIR)/zh_TW.BIG5@zhuyin/.compiled:	zh_TW.BIG5.x zh_TW.BIG5.charmap
$(BUILD_DIR)/zh_TW.EUC@zhuyin/.compiled:	zh_TW.EUC.x zh_TW.EUC.charmap
$(BUILD_DIR)/zh_TW.UTF-8@zhuyin/.compiled:	UTF-8.x $(BUILD_DIR)/UTF-8.charmap

$(STATIC_LOCALES:%=$(BUILD_DIR)/%/posix.src): $(BUILD_DIR)/%/posix.src: $(COMPONENT_DIR)/%.src
	$(MKDIR) $(@D)
	$(CP) $< $@

#
# common build targets for all locales
#
$(BUILD_DIR)/%.charmap: $(BUILD_DIR)/core/.prep $(BUILD_DIR)/.tools.prep
	$(MKDIR) $(@D)
	(cd $(@D); $(GEN_CHARMAP) -c $(basename $(@F)))

$(LOCALES:%=$(BUILD_DIR)/%/.compiled): $(BUILD_DIR)/%/.compiled: $(BUILD_DIR)/common.list
	(cd $(@D); $(LOCALEDEF) -x $(abspath $(filter %.x,$^)) -f $(abspath $(filter %.charmap,$^)) -i posix.localedef $*)
	$(TOUCH) $@

$(BUILD_DIR)/common/.compiled: $(BUILD_DIR)/common.list $(BUILD_DIR)/UTF-8.charmap
	cd $(@D); for a in data.*.localedef; do \
		$(LOCALEDEF) -x ../../UTF-8.x -f ../UTF-8.charmap -i $$a $$(basename $$a .localedef); \
	done
	$(TOUCH) $@

#
# locale_description files are generated from CLDR data for all locales
# The files use UTF-8 regardless of the locale encoding.
#
$(BUILD_DIR)/.ldesc: $(COMPONENT_DIR)/locale.list $(BUILD_DIR)/core/.prep $(BUILD_DIR)/.tools.prep
	$(PERL) -anle 'next if /^#/ || /^\s*$$/; print "$$F[0]:$$F[3]"' <$< | LC_ALL=en_US.UTF-8 gxargs $(GEN_DESCRIPTION) $(BUILD_DIR)
	echo "ja_JP.PCK:ja_JP@platform=solaris \
		ja_JP.UTF-8:ja_JP@platform=solaris \
		ja_JP.eucJP:ja_JP@platform=solaris \
		th_TH.TIS620:th_TH@platform=solaris \
		zh_CN.GB18030:zh_Hans_CN@platform=solaris \
		zh_CN.GB18030@pinyin:zh_Hans_CN@platform=solaris \
		zh_CN.GB18030@radical:zh_Hans_CN@platform=solaris \
		zh_CN.GB18030@stroke:zh_Hans_CN@platform=solaris \
		zh_HK.BIG5HK:zh_Hant_HK@platform=solaris \
		zh_HK.BIG5HK@radical:zh_Hant_HK@platform=solaris \
		zh_HK.BIG5HK@stroke:zh_Hant_HK@platform=solaris \
		zh_TW.BIG5@zhuyin:zh_Hant_TW@platform=solaris \
		zh_TW.EUC@zhuyin:zh_Hant_TW@platform=solaris \
		zh_TW.UTF-8@zhuyin:zh_Hant_TW@platform=solaris" | LC_ALL=en_US.UTF-8 gxargs $(GEN_DESCRIPTION) $(BUILD_DIR)
	$(TOUCH) $@

#
# find common parts and share them between locales
#  (PSARC/2013/016 XPG7 I18N and C11/C++11 Uchar)
#
$(BUILD_DIR)/common.list: $(COMPONENT_DIR)/prepare_localedef.py $(LOCALES:%=$(BUILD_DIR)/%/posix.src)
	$(RM) -r $(BUILD_DIR)/include $(BUILD_DIR)/common
	$(MKDIR) $(BUILD_DIR)/include $(BUILD_DIR)/common
	$(CLONEY) $(COMPONENT_DIR)/include $(@D)/include
	$(PYTHON.2.7) $(COMPONENT_DIR)/prepare_localedef.py $(BUILD_DIR) $(LOCALES) >$@
	touch $@

$(BUILD_DIR)/.installed: $(LOCALES:%=$(BUILD_DIR)/%/.compiled) $(BUILD_DIR)/common/.compiled $(BUILD_DIR)/.ldesc
	cat $(BUILD_DIR)/common.list | while read fn lc misc; do \
		$(INSTALL) -D $(BUILD_DIR)/common/$$fn $(PROTOLOCALE)/common/$$lc/$$fn; \
	done
	echo -n $(LOCALES) | gxargs -I{} -d' ' $(INSTALL) -D $(BUILD_DIR)/{}/{} $(PROTOLOCALE)/{}/{}
	echo -n $(LOCALES) | gxargs -I{} -d' ' $(INSTALL) -D $(BUILD_DIR)/{}/locale_description $(PROTOLOCALE)/{}/locale_description
	echo -n $(LOCALES) | gxargs -I{} -d' ' $(INSTALL) -D $(BUILD_DIR)/{}/posix.localedef_full $(PROTOLOCALEDEFSRC)/locales/{}.src
	$(MKDIR) $(PROTOLOCALEDEFSRC)/charmaps $(PROTOLOCALEDEFSRC)/extensions
	$(CP) $(COMPONENT_DIR)/*.charmap $(BUILD_DIR)/*.charmap $(PROTOLOCALEDEFSRC)/charmaps/
	$(CP) $(COMPONENT_DIR)/*.x $(PROTOLOCALEDEFSRC)/extensions/
	$(TOUCH) $@


#
# prepare the build tools and build area
#
$(BUILD_DIR)/.tools.prep: $(SOURCE_DIR_1)/.patched
	$(ENV) JAVA_HOME=$(JAVA_HOME) $(ANT) -f $(SOURCE_DIR_1)/tools/java/build.xml jar
	$(TOUCH) $@

$(BUILD_DIR)/core/.prep: $(SOURCE_DIR)/.patched $(SOURCE_DIR_2)/.unpacked
	$(RM) -r $(@D)
	$(CLONEY) $(SOURCE_DIR) $(@D)
	$(CLONEY) $(SOURCE_DIR_2) $(@D)
	$(TOUCH) $@


# this package needs to have installed itself because
# it uses en_US.UTF-8 locale
REQUIRED_PACKAGES += system/locale

REQUIRED_PACKAGES += developer/build/ant
