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
# Copyright (c) 2009, 2018, Oracle and/or its affiliates. All rights reserved.
#

# Handles fonts without any configure or build scripts, that just need to
# be installed and packaged with some additional metadata files.

# To use, you must set these VARIABLES in the calling Makefile:
#	COMPONENT_FONT_FILES = {list of files from source dir to install}
#	COMPONENT_FONT_DEST_DIR = {directory to install them under}
# You may also set COMPONENT_FONT_SRC_DIR if necessary to a subdirectory
# under the source tree containing the font files.

COMPONENT_BUGDB ?=	x11/fonts

BUILD_STYLE ?= archive
ifeq ($(strip $(BUILD_STYLE)),archive)
INSTALL_TARGET ?= $(INSTALL_$(MK_BITS))

include $(WS_MAKE_RULES)/common.mk

$(BUILD_DIR)/%/.installed: $(SOURCE_DIR)/.prep
	$(MKDIR) $(@D)
	$(COMPONENT_PRE_INSTALL_ACTION)
	-$(RM) -r $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)
	$(MKDIR) $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)
	(cd $(SOURCE_DIR)/$(COMPONENT_FONT_SRC_DIR) ; \
	    $(INSTALL) -m 0444 $(COMPONENT_FONT_FILES) \
		$(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR))
	$(MKFONTSCALE) $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)
	$(MKFONTDIR) $(PROTO_DIR)$(COMPONENT_FONT_DEST_DIR)
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

$(MANIFEST_BASE)-%.font-transforms: %.p5m
	$(PERL) $(WS_TOOLS)/generate_font_metadata.pl \
	    -p $(PROTO_DIR) -m $< > $@ || ( rm $@ ; exit 1 )

# Package containing fc-scan used in generate_font_metadata.pl
REQUIRED_PACKAGES	+= system/library/fontconfig
# Package containing $(MKFONTSCALE) & $(MKFONTDIR)
REQUIRED_PACKAGES	+= x11/font-utilities
