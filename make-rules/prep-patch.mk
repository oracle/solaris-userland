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
# Copyright (c) 2010, 2019, Oracle and/or its affiliates. All rights reserved.
#

GPATCH =	/usr/bin/patch
PATCH_LEVEL ?=	1
GPATCH_BACKUP =	--backup --version-control=numbered
GPATCH_FLAGS =	--strip=$(PATCH_LEVEL) $(GPATCH_BACKUP)

#
# Rules for patching source that is downloaded and unpacked or pulled from
# a source repository.  Patches should be named
# patches/{patch-file-name}.patch{version} where {patch-file-name} is a
# meaningful name for the patch contents and {version} corresponds to the
# COMPONENT_NAME{version} of the source to be patched.  Typically, version
# would be something like "_1", "_2", ...  After all {version} patches have
# been applied, a final set of patches without a {version} suffix may be
# applied.
#
# PATCH_DIR can be overridden to move patches to a different location
# PATCH_PATTERN can be overridden to adjust the patch naming scheme that the
#     build recognizes.
# EXTRA_PATCHES{version} can be defined in the component Makefile to include
#     additional patches.
#

# We are interested in *.patch and *.patch_*
# *.patch is applied against $(COMPONENT_SRC)
# *.patch_blah is applied against $(COMPONENT_SRC_blah)
# Since the pattern is passed to find(1) command we merge the two options into
# *.patch*
PATCH_PATTERN ?=	*.patch*

PATCH_DIR ?=		patches
# patches specific to parfait builds.
ifeq   ($(strip $(PARFAIT_BUILD)),yes)
PARFAIT_PATCH_DIR =	parfait
endif

ALL_PATCHES =	$(shell find $(PATCH_DIR) $(PARFAIT_PATCH_DIR) -type f \
			 -name '$(PATCH_PATTERN)' 2>/dev/null | \
				LC_COLLATE=C sort)

# Patches for different source tarballs have _X filename extensions to
# match the _X extensions to the COMPONENT_* make variables.  Find these
# extensions, using $(sort) to uniq them to prevent multiple rules from
# getting generated.
PCH_SUFFIXES = $(sort $(patsubst .patch_%,%, $(filter-out .patch,$(suffix $(ALL_PATCHES)))))

define patch-variables

ifeq ($(1),_0)
PATCH_PATTERN$(1) ?=	%.patch
PATCHES$(1) = $(filter %.patch,$(ALL_PATCHES))
else
PATCH_PATTERN$(1) ?=	%.patch$(1)
PATCHES$(1) = $(filter %.patch$(1),$(ALL_PATCHES))
endif

ifneq ($(strip $(ADDITIONAL_PATCHES$(1))),)
PATCHES$(1) += $(ADDITIONAL_PATCHES$(1))
endif

ifneq ($$(PATCHES$(1)),)
PATCH_STAMPS$(1) += $$(PATCHES$(1):$(PATCH_DIR)/%=$$(SOURCE_DIR$(1))/.patched-%)
ifeq   ($(strip $(PARFAIT_BUILD)),yes)
PATCH_STAMPS$(1) += $$(PATCHES$(1):$(PARFAIT_PATCH_DIR)/%=$$(SOURCE_DIR$(1))/.patched-%)
endif 
endif
endef

define patch-rules
ifneq ($$(PATCHES$(1)),)
# We should unpack the source that we patch before we patch it.
$$(firstword $$(PATCH_STAMPS$(1))):	$$(UNPACK_STAMP$(1))

# This section makes the patch stamps depend on each other in the order that
# they are going to be applied. This insures that running 'gmake -j prep' does
# not have all the patches stepping on each other toes. That means if you have
# patches a, b, c, d. The lines should create the gmake recipes as
# b: a
# c: b
# d: c
ALLBUTFIRST$(1) = $$(filter-out $$(firstword $$(PATCH_STAMPS$(1))), $$(PATCH_STAMPS$(1)))
ALLBUTLAST$(1) = $$(filter-out $$(lastword $$(PATCH_STAMPS$(1))), $$(PATCH_STAMPS$(1)))
PAIRS$(1) = $$(join $$(ALLBUTFIRST$(1)),$$(addprefix :,$$(ALLBUTLAST$(1))))
$$(foreach pair,$$(PAIRS$(1)),$$(eval $$(pair)))

# Adding MAKEFILE_PREREQ because gmake seems to evaluate the need to patch
# before re-unpacking if the Makefile changed.  The various stamps are
# removed as part of the unpacking process, and it doesn't appear to
# re-evaluate the need for patching.  If we ever move the stamps to the build
# directory, we may not need the dependency any more.
ifeq ($(strip $$(SOURCE_DIR$(1))),)
$$(error SOURCE_DIR$(1) is empty, I can not apply these patches: $$(PATCHES$(1))$$(newline)Please define COMPONENT_SRC$(1) in the Makefile)
endif
$$(SOURCE_DIR$(1))/.patched-%:	$(PATCH_DIR)/% $(MAKEFILE_PREREQ)
	$(GPATCH) -d $$(@D) $$(GPATCH_FLAGS) < $$<
	$(TOUCH) $$(@)

$$(SOURCE_DIR$(1))/.patched-%:	$(PARFAIT_PATCH_DIR)/% $(MAKEFILE_PREREQ)
	$(GPATCH) -d $$(@D) $$(GPATCH_FLAGS) < $$<
	$(TOUCH) $$(@)

$$(SOURCE_DIR$(1))/.patched:	$$(PATCH_STAMPS$(1))
	$(TOUCH) $$(@)

patch::	$$(SOURCE_DIR$(1))/.patched

REQUIRED_PACKAGES += text/gnu-patch

endif
endef

# Evaluate the variable assignments immediately.
$(foreach suffix, $(PCH_SUFFIXES), $(eval $(call patch-variables,_$(suffix))))
$(eval $(call patch-variables,))	# this must be last so we don't drop *.patch_%.

# Put the rule evaluations in a variable for deferred evaluation.
define eval-patch-rules
$(foreach suffix, $(PCH_SUFFIXES), $(eval $(call patch-rules,_$(suffix))))
$(eval $(call patch-rules,))	# this must be last so we don't drop *.patch_%.
endef

# Developer convenience helper to regenerate patches against new baseline to
# reduce messages about hunks having fuzz or offsets when applying patches.
# New patches will be in new/ for inspection before moving to patches/.

regen-patches:
	$(MAKE) clean
	@ CUR_LIST="" ; \
	if [[ -z "$(ALL_PATCHES)" ]] ; then exit 0 ; fi ; \
	if [[ "$(SOURCE_DIR)" != "$(COMPONENT_DIR)" ]] ; then \
	    sd="$(SOURCE_DIR) $(foreach s,$(PCH_SUFFIXES),$(SOURCE_DIR_$(s)))" ; \
	else \
	    sd="$(foreach s,$(PCK_SUFFIXES),$(SOURCE_DIR_$(s)))" ; \
	fi ; \
	if [[ -z "$${sd// }" ]] ; then exit 0 ; fi ; \
        $(RM) -rf tmp-regen/ ; \
	$(MAKE) unpack ; \
	$(MKDIR) new tmp-regen/next ; \
	$(MV) $${sd} tmp-regen/next ; \
	for p in $(ALL_PATCHES) ; do \
	    print '=================' $$p ; \
	    $(RM) -rf tmp-regen/prev ; \
	    $(MV) tmp-regen/next tmp-regen/prev ; \
	    CUR_LIST+="$$p " ; \
	    $(MAKE) unpack patch ALL_PATCHES="$${CUR_LIST}" \
		GPATCH_BACKUP="--no-backup-if-mismatch" ; \
	    $(MKDIR) tmp-regen/next ; \
	    $(MV) $${sd} tmp-regen/next ;  \
	    $(RM) tmp-regen/*/*/.patched* $(COMPONENT_DIR)/.patched* ; \
	    : Copy the old comments/prefix out of the existing patch: ; \
	    gawk '/^--- /	{exit} \
		  /^diff -/	{exit} \
				{print}' $$p > "new/$${p#$(PATCH_DIR)/}" ; \
	    LC_COLLATE=C git diff --no-color --no-index \
		tmp-regen/prev tmp-regen/next \
		| $(GSED) -E -e 's% (a|b)/tmp-regen/(prev|next)/[^/]*/% \1/%g' \
		| grep -v '^Common subdirectories:' \
		| grep -v '^Only in ' \
		>> "new/$${p#$(PATCH_DIR)/}" ; \
	done
	$(RM) -rf tmp-regen/
	$(MAKE) clean

REQUIRED_PACKAGES += developer/versioning/git
REQUIRED_PACKAGES += text/gawk
