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

BUILD_BITS =            64
include ../../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mkfontscale
COMPONENT_VERSION=	1.1.3
COMPONENT_ARCHIVE_HASH= \
	sha256:1e98df69ee5f4542d711e140e1d93e2c3f2775407ccbb7849110d52b91782a6a
COMPONENT_BUGDB=        x11/xclients
COMPONENT_ANITYA_ID=	15043
TPNO=			49491

COMPONENT_NAME_1=       mkfontdir
COMPONENT_VERSION_1=    1.0.7
COMPONENT_ARCHIVE_HASH_1=       \
    sha256:56d52a482df130484e51fd066d1b6eda7c2c02ddbc91fe6e2be1b9c4e7306530
COMPONENT_ANITYA_ID_1=	15044
TPNO_1=			45768

COMPONENT_NAME_2=       bdftopcf
COMPONENT_VERSION_2=    1.1
COMPONENT_ARCHIVE_HASH_2=       \
    sha256:4b4df05fc53f1e98993638d6f7e178d95b31745c4568cee407e167491fd311a2
COMPONENT_ANITYA_ID_2=	15054
TPNO_2=			49492

COMPONENT_NAME_3=       font-util
COMPONENT_VERSION_3=    1.3.1
COMPONENT_ARCHIVE_HASH_3=       \
    sha256:aa7ebdb0715106dd255082f2310dbaa2cd7e225957c2a77d719720c7cc92b921
COMPONENT_ARCHIVE_URL_3= \
    $(COMPONENT_PROJECT_URL)/releases/individual/font/$(COMPONENT_ARCHIVE_3)
COMPONENT_ANITYA_ID_3=	15055
TPNO_3=			45770

# installalias is a Sun-created addition to this toolset
COMPONENT_NAME_4=	installalias
COMPONENT_ARCHIVE_SRC_4=none
COMPONENT_ANITYA_ID_4=	N/A

TEST_TARGET = $(NO_TESTS)

BUILD_TARGET = $(BUILD_$(MK_BITS))
INSTALL_TARGET = $(INSTALL_$(MK_BITS))

LIST = 1 2 3 4

define extra-target-rules
$(BUILD_DIR)/%_$(1)/.configured: SOURCE_DIR=$$(SOURCE_DIR_$(1))
endef

$(foreach n, $(LIST), \
    $(eval COMPONENT_SRC_$(n) = $(COMPONENT_NAME_$(n))-$(COMPONENT_VERSION_$(n))) \
    $(eval COMPONENT_ARCHIVE_$(n) ?= $(COMPONENT_SRC_$(n)).tar.bz2) \
    $(eval COMPONENT_ARCHIVE_URL_$(n) ?= $$(COMPONENT_ARCHIVE_URL:$$(COMPONENT_ARCHIVE)=$(COMPONENT_ARCHIVE_$(n)))) \
    $(eval BUILD_DIR_$(n) += $(BUILD_DIR_$(MK_BITS))_$(n)) \
    $(eval CONFIGURE_$(MK_BITS) += $(BUILD_DIR_$(n))/.configured) \
    $(eval BUILD_$(MK_BITS)_$(n) += $(BUILD_DIR_$(n))/.built) \
    $(eval BUILD_TARGET += $(BUILD_$(MK_BITS)_$(n))) \
    $(eval INSTALL_$(MK_BITS)_$(n) += $(BUILD_DIR_$(n))/.installed) \
    $(eval INSTALL_TARGET += $(INSTALL_$(MK_BITS)_$(n))) \
    $(eval $(call extra-target-rules,$(n))) \
)

undefine COMPONENT_ARCHIVE_URL_4

include $(WS_MAKE_RULES)/x11-component.mk

# Extra configure flag just for mkfontscale
$(BUILD_DIR_$(MK_BITS))/.configured:	CONFIGURE_OPTIONS += --with-bzip2

LIBXFONT_PATH=		/usr/lib/xorg/$(MACH64)
LIBXFONT_LDFLAGS=	-L$(LIBXFONT_PATH) -R$(LIBXFONT_PATH)

CONFIGURE_BUILD_ENV += MKFONTSCALE_LIBS="$(LIBXFONT_LDFLAGS)"
CONFIGURE_BUILD_ENV += BDFTOPCF_LIBS="$(LIBXFONT_LDFLAGS) -lXfont"

COMPONENT_INSTALL_ARGS += pkgconfigdir="$(DESTDIR)/usr/share/pkgconfig"

# No configure script for installalias, just build & install
SOURCE_DIR_4=	$(COMPONENT_DIR)/sun-src

$(BUILD_DIR_4)/.built: LDFLAGS += $(LIBXFONT_LDFLAGS)

$(BUILD_DIR_4)/.built:
	$(RM) -r $(@D) ; $(MKDIR) $(@D)
	cd $(@D); $(ENV) $(CONFIGURE_ENV) $(COMPONENT_BUILD_ENV) \
	    $(GMAKE) VPATH=$(SOURCE_DIR_4) -f $(SOURCE_DIR_4)/Makefile \
	    $(COMPONENT_BUILD_ARGS) build
	touch $@

$(BUILD_DIR_4)/.installed: $(BUILD_DIR_4)/.built
	$(MKDIR) $(PROTO_DIR)/usr/lib/X11
	$(INSTALL) -m 555 $(@D)/installalias $(PROTO_DIR)/usr/lib/X11
	touch $@

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += x11/header/x11-protocols
REQUIRED_PACKAGES += x11/library/libfontenc
REQUIRED_PACKAGES += x11/library/libxfont
