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
# Copyright (c) 2021, 2022, Oracle and/or its affiliates.
#

#
# Userland allows to compile multiple sources in a single component Makefile.
# This is done by defining multiple variables with a postfix; like
# COMPONENT_VERSION_XXX, COMPONENT_SRC_XXX, and so on. This file builds on top
# of this mechanism by making the variables with postfix "_OLD" compile with
# python 2.7. Regular variables (COMPONENT_VERSION, COMPONENT_SRC, ...) refer
# to stuff compiled by other runtime versions defined in PYTHON_VERSIONS.
#
# In order to make use of this, one has to:
#  a) include this file in python component's Makefile
#      (must be the last one included below ips.mk)
#  b) define the following variables:
#   COMPONENT_VERSION_OLD = ...
#   COMPONENT_SRC_OLD = ...
#   COMPONENT_ARCHIVE_OLD = ...
#   COMPONENT_ARCHIVE_HASH_OLD = ...
#   COMPONENT_ARCHIVE_URL_OLD = $(call pypi_url,OLD)
#

# Support for different component versions in 2.7 and 3.x variants.
ifneq ($(COMPONENT_VERSION_OLD),)

SOURCE_DIR_OLD = $(COMPONENT_DIR)/$(COMPONENT_SRC_OLD)
$(BUILD_DIR)/%-2.7/.built: SOURCE_DIR=$(SOURCE_DIR_OLD)
$(BUILD_DIR)/%-2.7/.installed: SOURCE_DIR=$(SOURCE_DIR_OLD)
$(BUILD_DIR)/%-2.7/.tested: SOURCE_DIR=$(SOURCE_DIR_OLD)
$(BUILD_DIR)/%-2.7/.tested-and-compared: SOURCE_DIR=$(SOURCE_DIR_OLD)
$(BUILD_DIR)/%-2.7/.system-tested: SOURCE_DIR=$(SOURCE_DIR_OLD)
$(BUILD_DIR)/%-2.7/.system-tested-and-compared: SOURCE_DIR=$(SOURCE_DIR_OLD)

$(MANIFEST_BASE)-%-27.mogrified: COMPONENT_ARCHIVE_URL=$(COMPONENT_ARCHIVE_URL_OLD)
$(MANIFEST_BASE)-%-27.mogrified: COMPONENT_VERSION=$(COMPONENT_VERSION_OLD)
$(MANIFEST_BASE)-%-27.mogrified: COMPONENT_BAID=$(COMPONENT_BAID_OLD)

$(MANIFEST_BASE)-%-27.mangled: COMPONENT_SRC=$(COMPONENT_SRC_OLD)
$(MANIFEST_BASE)-%-27.depend: COMPONENT_SRC=$(COMPONENT_SRC_OLD)
$(MANIFEST_BASE)-%-27.published: COMPONENT_SRC=$(COMPONENT_SRC_OLD)

# The following two variables can be used within manifests to
# distinguish files that are only available in a single version.
NEW_ONLY =
OLD_ONLY = \#
$(MANIFEST_BASE)-%-27.mogrified: NEW_ONLY = \#
$(MANIFEST_BASE)-%-27.mogrified: OLD_ONLY =

PKG_MACROS += OLD_ONLY="$(OLD_ONLY)"
PKG_MACROS += NEW_ONLY="$(NEW_ONLY)"

# Override .mogrified target to transform older component version
# in the meta manifest correctly.
META_MANIFEST = $(PYNV_MANIFESTS:%.p5m=$(MANIFEST_BASE)-%.p5m)
META_MOGRIFIED = $(META_MANIFEST:%.p5m=%.mogrified)

$(META_MOGRIFIED):	$(META_MANIFEST) $(BUILD_DIR)
	$(PKGMOGRIFY) $(PKG_OPTIONS) $< \
		$(PUBLISH_TRANSFORMS) | \
		sed -e '/^$$/d' -e '/^#.*$$/d' | uniq > $@-temp
	echo "<transform depend fmri=(.*)-27@(.*) \
		-> edit fmri @$(COMPONENT_VERSION) @$(COMPONENT_VERSION_OLD)>" | \
	$(PKGMOGRIFY) /dev/fd/0 $@-temp > $@
	$(RM) $@-temp

endif
