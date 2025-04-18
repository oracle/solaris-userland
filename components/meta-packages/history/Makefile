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

include ../../../make-rules/shared-macros.mk

# $(WS_MAKE_RULES)/ips.mk really isn't set up to allow you to bypass all
# the automatic (and lengthy) manifest manipulation that it does, which we
# really don't need to do for these static, uninteresting packages.  So we just
# write a simple set of publication rules to get the packages into the repo.
COMPONENT_SRC=
COMPONENT_ARCHIVE_SRC=	none
include $(WS_MAKE_RULES)/prep.mk

COMPONENT_NAME=		"Package History"
COMPONENT_BUGDB=	gate-stuff/userland

GENERATE_HISTORY=	$(WS_TOOLS)/generate-history
HISTORY=		history
HISTORY+=		history.$(MACH)

MANIFEST_BASE =		$(BUILD_DIR)/manifest-$(MACH)

CANONICAL_MANIFESTS =	$(wildcard *.p5m)
# The funny ( cat || : ) construction is here because the nawk function exits
# before going through all $(HISTORY) lines and so cat receives SIGPIPE and
# exits with nonzero exit code. That would make gmake(1) stop with an error
# too. This is used further in this Makefile again.
HISTORICAL_MANIFESTS =	$(shell ( cat $(HISTORY) || : ) | $(NAWK) -v FUNCTION=name -f $(GENERATE_HISTORY) )
ARCH_MANIFESTS =	$(wildcard *.p5m.$(MACH))
GENERATED_ARCH_MANIFESTS =	$(ARCH_MANIFESTS:%.p5m.$(MACH)=%.p5m)
CANONICAL_MANIFESTS +=  $(GENERATED_ARCH_MANIFESTS)

MOGRIFIED =		$(CANONICAL_MANIFESTS:%.p5m=$(MANIFEST_BASE)-%.mogrified)
HISTOGRIFIED =		$(HISTORICAL_MANIFESTS:%.p5m=$(MANIFEST_BASE)-%.histogrified)
PUBLISHED =		$(CANONICAL_MANIFESTS:%.p5m=$(MANIFEST_BASE)-%.published)
PUBLISHED +=		$(HISTORICAL_MANIFESTS:%.p5m=$(MANIFEST_BASE)-%.histpublished)

# Rule to generate historical manifests from the $(HISTORY) file.
define history-manifest-rule
$(MANIFEST_BASE)-$(1): $(HISTORY) | $(BUILD_DIR)
	( cat $(HISTORY) || : ) | \
		$(NAWK) -v FUNCTION=manifest -v TARGET=$1 \
		-f $(GENERATE_HISTORY) > $$@
endef
$(foreach mfst,$(HISTORICAL_MANIFESTS),$(eval $(call history-manifest-rule,$(mfst))))

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

PKG_MACROS =		CONSOLIDATION=$(CONSOLIDATION)
PKG_MACROS +=		BUILD_VERSION=$(BUILD_VERSION)
PKG_MACROS +=		OS_RELEASE=$(OS_RELEASE)
PKG_MACROS +=		PKG_SOLARIS_VERSION=$(PKG_SOLARIS_VERSION)
PKG_MACROS +=		BRANCHID=$(BRANCHID)

PKG_OPTIONS +=		$(PKG_MACROS:%=-D %)

build install test system-test:
	@echo "nothing to be done for $@"

$(BUILD_DIR):
	$(MKDIR) $@

$(MANIFEST_BASE)-%.mogrified: %.p5m | $(BUILD_DIR)
	$(PKGMOGRIFY) $(PKG_OPTIONS) $< \
	              $(WS_TOP)/transforms/incorporate \
		      $(WS_TOP)/transforms/auto_fmri > $@

$(MANIFEST_BASE)-%.histogrified: $(MANIFEST_BASE)-%.p5m | $(BUILD_DIR)
	$(PKGMOGRIFY) $(PKG_OPTIONS) $< \
	              $(WS_TOP)/transforms/incorporate \
		      $(WS_TOP)/transforms/auto_fmri > $@

$(MANIFEST_BASE)-%.published: $(MANIFEST_BASE)-%.mogrified | $(BUILD_DIR)
	$(call log-package-publish, $<)
	$(PKGSEND) -s $(PKG_REPO) publish --fmri-in-manifest --no-catalog $<
	$(CP) $< $@

$(MANIFEST_BASE)-%.histpublished: $(MANIFEST_BASE)-%.histogrified | $(BUILD_DIR)
	$(call log-package-publish, $<)
	$(PKGSEND) -s $(PKG_REPO) publish --fmri-in-manifest --no-catalog $<
	$(CP) $< $@

$(BUILD_DIR)/.linted-$(MACH): $(MOGRIFIED) $(HISTOGRIFIED) | $(BUILD_DIR)
	$(ENV) SOLARIS_VERSION=$(SOLARIS_VERSION) \
		$(PKGLINTVAR) $(CANONICAL_REPO:%=-c $(WS_LINT_CACHE)) \
			-e $(WS_TOOLS)/python/ -f $(WS_TOOLS)/pkglintrc $(MOGRIFIED)
	$(TOUCH) $@

history-check:
	./historyfmt -d $(HISTORY)

$(BUILD_DIR)/.published-$(MACH):
	$(MAKE) -j $(COMPONENT_MAKE_JOBS) $(PUBLISHED) $(BUILD_DIR)/.linted-$(MACH)
ifndef DISABLE_IPS_CATALOG_AND_INDEX_UPDATES
	$(PKGREPO) refresh -s $(PKG_REPO)
endif
	$(TOUCH) $@

publish: history-check $(BUILD_DIR)/.published-$(MACH)

%.p5m: 	%.p5m.$(MACH)
	$(CP) $< $@
	
clobber clean::
	$(RM) -r $(BUILD_DIR) $(GENERATED_ARCH_MANIFESTS)

# This component is not suitable for generating a report
NO_PKG_REPORT = 1
