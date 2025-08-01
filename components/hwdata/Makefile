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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         hwdata
COMPONENT_VERSION=      0.5.11
COMPONENT_ARCHIVE_SRC=	none

COMPONENT_BAID_PCI=	338731
COMPONENT_BAID_USB=	338732

BUILD_STYLE= archive
include $(WS_MAKE_RULES)/common.mk

# Since upstream only offers the latest snapshot for download, without
# any way to retrieve a specific version, we just keep the currently
# shipped versions of these two text files directly in the gate and
# simply check in new versions to update them.
#
# When it's time to update, you can use these rules to download with
# 'gmake -B pci.ids usb.ids'   After updating the data files, ensure
# that the header with version/date and license info is still being
# correctly extracted and copied into the generated license files,
# and run 'gmake test' to verify there are no invalid or control chars
# in the files.

download::
	@echo 'No downloads for this component'

ID_FILES = pci.ids usb.ids

COMPONENT_ARCHIVE_URL_pci.ids =	https://pci-ids.ucw.cz/v2.2/pci.ids
COMPONENT_ARCHIVE_URL_usb.ids =	https://usb-ids.gowdy.us/usb.ids
COMPONENT_ARCHIVE_URLS = $(foreach i,$(ID_FILES),$(COMPONENT_ARCHIVE_URL_$(i)))

# Copy source files to source dir for patching
CLEAN_PATHS += $(COMPONENT_SRC)
UNPACK_STAMP = $(SOURCE_DIR:%=%/.unpacked)

$(UNPACK_STAMP):
	$(RM) -r $(SOURCE_DIR)
	$(MKDIR) $(SOURCE_DIR)
	$(CP) -p $(ID_FILES) $(SOURCE_DIR)
	$(TOUCH) $@

unpack::        $(UNPACK_STAMP)

# Retrieve version from ids file
ID_VERSION_EXTRACT_COMMAND=$(GSED) -n -e '/Version:/ { s/^.*: //p' -e ' q }'

PKG_OPTIONS += -D COMPONENT_ARCHIVE_URLS='$(COMPONENT_ARCHIVE_URLS:%=value="%")'
PKG_MACROS += $(foreach i,$(ID_FILES),\
    COMPONENT_VERSION_$(i)='$(shell $(ID_VERSION_EXTRACT_COMMAND) $(i))')

# Since we have two separately licensed components we don't use the default
# license transform rules, but handle the license info metadata directly
LICENSE_TRANSFORMS =

$(ID_FILES):
	curl -s -o $@ $(COMPONENT_ARCHIVE_URL_$(@F))

$(ID_FILES:%=$(SOURCE_DIR)/%): $(SOURCE_DIR)/.prep

# License files for packaging are generated during the build
LICENSES = $(ID_FILES:%=%.license)
BUILT_LICENSES = $(LICENSES:%=$(BUILD_DIR)/%)

# Extract the header up to the first blank line
$(BUILD_DIR)/%.header: $(SOURCE_DIR)/%
	$(MKDIR) $(@D)
	$(GSED) -e '/^$$/ q' $< > $@

# Generate license files for each document by substituting in templates:
# __HEADER__ - read in contents of generated header file, then delete the
#		__HEADER__ line
$(BUILD_DIR)/%.license: $(BUILD_DIR)/%.header
	$(GSED) -e '/__HEADER__/ r $<' -e '/__HEADER__/ d' ids.license.tmpl > $@

install build: $(BUILT_LICENSES)

# Ensure there are no control characters/escape sequences or invalid UTF-8
# characters in the *.ids text files.
test: $(SOURCE_DIR)/.prep $(BUILD_DIR)
	@ export LC_ALL='en_US.UTF-8' ; \
	for f in $(ID_FILES) ; do \
		tr -cd '[:print:][:space:]' < $(SOURCE_DIR)/$$f \
		    > $(BUILD_DIR)/$$f.clean \
		&& diff -u $(SOURCE_DIR)/$$f $(BUILD_DIR)/$$f.clean ; \
		if (( $$? == 0 )) ; then \
			print $$f PASSED ; \
		else \
			print $$f FAILED ; \
		fi \
	done

system-test: $(SYSTEM_TESTS_NOT_IMPLEMENTED)
