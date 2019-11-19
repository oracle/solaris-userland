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
# Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
#

# this facility allows to build up to two pkgs from one component using the
# EXCLUSION_CRITERIA - XPG4 grep regexp to sort heap objs to pkg/sub-pkg
#  or
# EXCLUSION_FILE - file listing the subset of objects of sub-pkg (the rest of the heap
#   objects will be placed into the (core) pkg)
# Note: if both "exclusion keys" are left undefined only the (core) pkg is created
#
# Heap is created from build/manifest-*-generated.p5m by "pkgmogrify" using
# the definition file named $(PKG_OBJ).gen (in PKG_OBJ is the name of the pkg-manifest
# of the main pkg the same as the base-name of .p5m-manifest).

PKGOBJ_BASE =	$(BUILD_DIR)/pkgobjs-$(MACH)
INSTALLED_OBJ =	$(PKGOBJ_BASE)-all
HEAP_OBJ =	$(PKGOBJ_BASE)-heap
TRASH_CAN_OBJ =	$(PKGOBJ_BASE)-trash-can
TRASH_CAN_IS_TESTED = $(BUILD_DIR)/.trash-can-is-tested
$(HEAP_OBJ):	$(GENERATED).p5m
	cat $(GENERATED).p5m | pkgfmt -u \
		| egrep -v 'path=mangled' \
		| tee $(INSTALLED_OBJ) \
		| $(PKGMOGRIFY) /dev/fd/0 $(PKG_OBJ).gen \
		| sed -e '/^$$/d' -e '/^#.*$$/d' | /usr/bin/pkgfmt -u | cat - >$@

# $(PKG_OPTIONS)

$(TRASH_CAN_OBJ): $(HEAP_OBJ)
	( gdiff -u $(INSTALLED_OBJ) $(HEAP_OBJ) \
	   | /usr/xpg4/bin/sed -n -e '/^@@ /,$$p' \
	   | /usr/xpg4/bin/egrep -e '^\+|^\-' > $@; \
	   exit 0; )

$(TRASH_CAN_IS_TESTED): $(TRASH_CAN_OBJ)
	if test -f $(COMPONENT_DIR)/trash-can.pkgobjs ; \
	   then gdiff -u $(TRASH_CAN_OBJ) $(COMPONENT_DIR)/trash-can.pkgobjs ; \
	   else exit 0 ; \
	fi
	touch $@

ifneq ($(strip $(EXCLUSION_FILE)),)
EXCLUSION_FILE_TARGET = $(PKGOBJ_BASE)-$(EXCLUSION_FILE)
endif

ifneq ($(strip $(SUBPKG_OBJ)),)
BSUBPKG_OBJ =	$(PKGOBJ_BASE)-$(SUBPKG_OBJ)
$(BSUBPKG_OBJ): $(TRASH_CAN_IS_TESTED)
ifneq ($(strip $(EXCLUSION_FILE)),)
	/usr/xpg4/bin/fgrep -f $(EXCLUSION_FILE_TARGET) $(HEAP_OBJ) >$@
else
	/usr/xpg4/bin/egrep -e '$(EXCLUSION_CRITERIA)' $(HEAP_OBJ) >$@
endif
	gdiff -u $(COMPONENT_DIR)/$(SUBPKG_OBJ).pkgobjs $@
endif

ifneq ($(strip $(PKG_OBJ)),)
METADATA_TEMPLATE =
BPKG_OBJ =	$(PKGOBJ_BASE)-$(PKG_OBJ)
$(BPKG_OBJ): $(TRASH_CAN_IS_TESTED)
ifeq ($(strip $(SUBPKG_OBJ)),)
	cat $(HEAP_OBJ) >$@
else
ifneq ($(strip $(EXCLUSION_FILE)),)
	/usr/xpg4/bin/fgrep -v -f $(EXCLUSION_FILE_TARGET) $(HEAP_OBJ) >$@
else
	/usr/xpg4/bin/egrep -v -e '$(EXCLUSION_CRITERIA)' $(HEAP_OBJ) >$@
endif
endif
	gdiff -u $(COMPONENT_DIR)/$(PKG_OBJ).pkgobjs $@
endif

ifneq ($(strip $(EXCLUSION_FILE)),)
$(BPKG_OBJ) $(BSUBPKG_OBJ): $(EXCLUSION_FILE_TARGET)
endif

$(CHECKED): $(BPKG_OBJ) $(BSUBPKG_OBJ)

