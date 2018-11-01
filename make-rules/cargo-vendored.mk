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
# Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
#

CARGO = /usr/bin/cargo

VENDORED_SOURCES_NAME = $(COMPONENT_SRC)-vendored-sources
VENDORED_SOURCES = $(COMPONENT_DIR)/$(VENDORED_SOURCES_NAME)
VENDORED_CARGO_LOCK = $(COMPONENT_SRC)/Cargo.lock

COMPONENT_SRC_crates = $(VENDORED_SOURCES_NAME)
COMPONENT_ARCHIVE_crates = $(VENDORED_SOURCES_NAME).tar.bz2
COMPONENT_ARCHIVE_URL_crates = make://download-vendored-sources/$(COMPONENT_ARCHIVE_crates)

# Pre-build action which forces Cargo project to use vendored crates and
# avoids downloading them from internet.
VENDORED_SOURCES_ENFORCE = \
	cd $(BUILD_DIR); mkdir -p .cargo; \
	echo "[source.crates-io]" > .cargo/config; \
	echo "replace-with = \"vendored-sources\"" >> .cargo/config; \
	echo "[source.vendored-sources]" >> .cargo/config; \
	echo "directory = \"$(VENDORED_SOURCES)\"" >> .cargo/config;

# Downloads and creates unique archive with Rust crates needed for
# offline component build. Patching might be needed to alter an Rust
# crater version. Still in 'download' target and thus it cannot use
# patching from 'prep' which is next.
download-vendored-sources:
	$(RM) -r $(VENDORED_SOURCES); mkdir $(VENDORED_SOURCES)
	gtar xf $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE) -C $(VENDORED_SOURCES); \
	cd $(VENDORED_SOURCES)/$(COMPONENT_SRC); \
	  for i in `find $(COMPONENT_DIR)/patches -name '*.patch'` ; do gpatch -p1 < $$i; done
	cd $(VENDORED_SOURCES); \
	  CARGO_HOME=$(VENDORED_SOURCES)/.cargo $(CARGO) vendor -s $(VENDORED_CARGO_LOCK)
	$(MV) $(VENDORED_SOURCES)/vendor/* $(VENDORED_SOURCES)
	$(RM) -r $(VENDORED_SOURCES)/.cargo $(VENDORED_SOURCES)/$(COMPONENT_SRC) \
	  $(VENDORED_SOURCES)/vendor
	TZ=UTC gtar cjf $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE_crates) --sort=name \
	  --mtime='1970-01-01' --owner=root --group=root $(VENDORED_SOURCES_NAME)
	/usr/bin/sha256sum $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE_crates)

CLEAN_PATHS += $(COMPONENT_DIR)/$(VENDORED_SOURCES_NAME)
