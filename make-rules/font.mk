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
# Copyright (c) 2009, 2023, Oracle and/or its affiliates.
#

# Handles fonts without any configure or build scripts, that just need to
# be installed and packaged with some additional metadata files.

# To use, you must set these VARIABLES in the calling Makefile:
#	COMPONENT_FONT_FILES = {list of files from source dir to install}
#	COMPONENT_FONT_DEST_DIR = {directory to install them under}
# You may also set COMPONENT_FONT_SRC_DIR if necessary to a subdirectory
# under the source tree containing the font files.

COMPONENT_BUGDB ?=	x11/fonts

COMPONENT_FONT_DEST_DIR ?=	$(USRSHARETTFONTSDIR)/$(COMPONENT_NAME)
COMPONENT_FONT_DOC_DEST_DIR ?=	$(USRSHAREDOCDIR)/ttf-$(COMPONENT_NAME)

PROTOETCFONTSDIR ?=	$(PROTOETCDIR)/fonts

BUILD_STYLE ?= archive
ifeq ($(strip $(BUILD_STYLE)),archive)
INSTALL_TARGET ?= $(INSTALL_$(MK_BITS))

include $(WS_MAKE_RULES)/common.mk

COMPONENT_FONT_BUILD_DIR ?=	$(SOURCE_DIR)/$(COMPONENT_FONT_SRC_DIR)
COMPONENT_FONT_DOC_BUILD_DIR ?=	$(SOURCE_DIR)/$(COMPONENT_FONT_DOC_SRC_DIR)
COMPONENT_FONT_CONF_BUILD_DIR ?= $(SOURCE_DIR)/$(COMPONENT_FONT_CONF_SRC_DIR)

COMPONENT_FONT_AVAIL_FILES ?=	$(COMPONENT_FONT_CONF_FILES)


$(BUILD_DIR)/%/.installed: $(SOURCE_DIR)/.prep
	$(MKDIR) $(@D)
	$(COMPONENT_PRE_INSTALL_ACTION)
	-$(RM) -r $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)
	$(MKDIR) $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)
	(cd $(COMPONENT_FONT_BUILD_DIR) ; \
	    $(INSTALL) -m 0444 $(COMPONENT_FONT_FILES) \
		$(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR))
	$(MKFONTSCALE) $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)
	$(MKFONTDIR) $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)
	@if [[ "$(COMPONENT_FONT_DOC_FILES)" ]] ; then \
	    set -x ; \
	    $(MKDIR) $(PROTO_DIR)$(COMPONENT_FONT_DOC_DEST_DIR) ; \
	    (cd $(COMPONENT_FONT_DOC_BUILD_DIR) ; \
		$(INSTALL) -m 0444 $(COMPONENT_FONT_DOC_FILES) \
		    $(PROTO_DIR)$(COMPONENT_FONT_DOC_DEST_DIR)) ; \
	fi
	@if [[ "$(COMPONENT_FONT_AVAIL_FILES)" ]] ; then \
	    set -x ; \
	    $(MKDIR) $(PROTOETCFONTSDIR)/conf.{d,avail} ; \
	    (cd $(COMPONENT_FONT_CONF_BUILD_DIR) ; \
		$(INSTALL) -m 0444 $(COMPONENT_FONT_AVAIL_FILES) \
		    $(PROTOETCFONTSDIR)/conf.avail/ ) ; \
	    (cd $(PROTOETCFONTSDIR)/conf.d ; $(RM) *.conf ; \
	 	$(SYMLINK) ../conf.avail/$(COMPONENT_FONT_CONF_FILES) . ) ; \
	fi
	$(COMPONENT_POST_INSTALL_ACTION)
	$(TOUCH) $@
endif

ifeq ($(strip $(BUILD_STYLE)),configure)
# We don't compress individual font files so that we get better compression
# at higher levels in ZFS & IPS, and so that we aren't constantly replacing
# font files in every build just because the timestamp in the compressed
# version changed.
CONFIGURE_OPTIONS += --without-compression
endif

# Add font metadata to packages to make it easier to search for fonts
$(MANIFEST_BASE)-%.mogrified: PUBLISH_TRANSFORMS += $(@:.mogrified=.font-transforms)

$(MANIFESTS:%.p5m=%.mogrified): font-transforms
font-transforms: $(MANIFESTS:%.p5m=%.font-transforms)

COMPONENT_FONT_METADATA_ARGS += -v COMPONENT_NAME=$(COMPONENT_NAME)

# The second perl command drops non-ASCII attributes, as per Bug 33439055
$(MANIFEST_BASE)-%.font-transforms: %.p5m
	$(PERL) $(WS_TOOLS)/generate_font_metadata.pl \
	    -p $(PROTO_DIR) -m $< $(COMPONENT_FONT_METADATA_ARGS) \
	    | $(PERL) -n -e 'print unless m{[^\x01-\x7f]+}' > $@ \
		|| ( rm $@ ; exit 1 )

# Package containing fc-scan used in generate_font_metadata.pl
REQUIRED_PACKAGES	+= system/library/fontconfig
# Package containing $(MKFONTSCALE) & $(MKFONTDIR)
REQUIRED_PACKAGES	+= x11/font-utilities
