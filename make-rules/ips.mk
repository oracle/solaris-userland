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
# Copyright (c) 2010, 2025, Oracle and/or its affiliates.
#

#
# Rules and Macros for generating an IPS package manifest and publishing an
# IPS package to a pkg depot.
#
# To use these rules, include $(WS_MAKE_RULES)/ips.mk in your Makefile
# and define an "install" target appropriate to building your component.
# Ex:
#
#	install:	$(BUILD_DIR)/build/$(MACH32)/.installed \
#	 		$(BUILD_DIR)/build/$(MACH64)/.installed
#
# This set of rules makes the "publish" target the default target for make(1)
#

PKGDEPEND =	/usr/bin/pkgdepend
PKGFMT =	/usr/bin/pkgfmt
PKGMANGLE =	$(WS_TOOLS)/userland-mangler

GENERATE_HISTORY= $(WS_TOOLS)/generate-history
HISTORY=	history

# pkgfmt has an odd behavior at present where -c means "check validity
# against any format" whereas -d means "diffs against latest format" and
# no arguments means "update to latest format".  Thus, 'pkgfmt -c' can
# run clean on a v1 manifest that actually needs to be updated.  So we
# use the explicit format version argument below.  If this behavior is
# changed, then the -f argument below can be dropped.
PKGFMT_CHECK_ARGS =	-c -fv2

WS_TRANSFORMS =	$(WS_TOP)/transforms

# Package headers should all pretty much follow the same format
METADATA_TEMPLATE =		$(WS_TOP)/transforms/manifest-metadata-template
COPYRIGHT_TEMPLATE =		$(WS_TOP)/transforms/copyright-template

# order is important
GENERATE_TRANSFORMS +=		$(WS_TOP)/transforms/generate-cleanup
MANIFEST_CLEANUP_TRANSFORM +=   $(WS_TOP)/transforms/manifest-check-cleanup

PKGMOGRIFY_TRANSFORMS_LIBTOOL_DROP = $(WS_TOP)/transforms/libtool-drop
PKGMOGRIFY_TRANSFORMS +=	$(PKGMOGRIFY_TRANSFORMS_LIBTOOL_DROP)

COMPARISON_TRANSFORMS +=	$(WS_TOP)/transforms/comparison-cleanup
COMPARISON_TRANSFORMS +=	$(PKGMOGRIFY_TRANSFORMS)

LICENSE_TRANSFORMS =		$(WS_TOP)/transforms/license-changes

# Some components contain the directory 'locale' but you don't want to
# assign to its subdirectories facets like facet.locale.nl_NL. This variable
# makes it easy to disable such transformations.
LOCALE_TRANSFORMS +=	$(WS_TOP)/transforms/locale

# order is important
PUBLISH_TRANSFORMS +=	$(LICENSE_TRANSFORMS)
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/variant-cleanup
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/autopyc
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/defaults
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/actuators
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/depends
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/devel
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/docs
PUBLISH_TRANSFORMS +=	$(LOCALE_TRANSFORMS)
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/python-3-soabi
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/python-3-no-32bit
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/ruby-tests
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/puppet
PUBLISH_TRANSFORMS +=	$(PKGMOGRIFY_TRANSFORMS)
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/incorporate
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/publish-cleanup
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/legacy
PUBLISH_TRANSFORMS +=	$(WS_TOP)/transforms/auto_fmri

define add-limiting-variable
PKG_VARS += $(1)
MANIFEST_LIMITING_VARS += -D $(1)="$(subst #,\#,$($(1)))"
endef

# Make all the limiting variables available to manifest processing
$(foreach var, $(filter SOLARIS_11_%_ONLY,$(.VARIABLES)), \
    $(eval $(call add-limiting-variable,$(var))))
$(foreach var, $(filter PY3_%_NAMING,$(.VARIABLES)), \
    $(eval $(call add-limiting-variable,$(var))))

# For items defined as variables or that may contain whitespace, add
# them to a list to be expanded into PKG_OPTIONS later.
PKG_VARS += ARC_CASE COMPONENT_BAID
PKG_VARS += BUILD_VERSION OS_RELEASE SOLARIS_VERSION PKG_SOLARIS_VERSION
PKG_VARS += CONSOLIDATION CONSOLIDATION_CHANGESET CONSOLIDATION_REPOSITORY_URL
PKG_VARS += COMPONENT_VERSION IPS_COMPONENT_VERSION HUMAN_VERSION
PKG_VARS += COMPONENT_ARCHIVE_URL COMPONENT_PROJECT_URL COMPONENT_NAME
PKG_VARS += HG_REPO HG_REV HG_URL
PKG_VARS += GIT_COMMIT_ID GIT_REPO
PKG_VARS += MACH MACH32 MACH64
PKG_VARS += PUBLISHER PUBLISHER_LOCALIZABLE BRANCHID

# Include COMPONENT_BAID_* Makefile variables in PKG_VARS.
$(foreach macro, $(filter COMPONENT_BAID_%, $(.VARIABLES)), \
    $(eval PKG_VARS += $(macro)) \
)

# For items that need special definition, add them to PKG_MACROS.
# IPS_COMPONENT_VERSION suitable for use in regular expressions.
PKG_MACROS +=		IPS_COMPONENT_RE_VERSION=$(subst .,\\.,$(IPS_COMPONENT_VERSION))
# COMPONENT_VERSION suitable for use in regular expressions.
PKG_MACROS +=		COMPONENT_RE_VERSION=$(subst .,\\.,$(COMPONENT_VERSION))

PKG_MACROS +=		PYTHON_3.9_ONLY=\#
PKG_MACROS +=		PYTHON_3.11_ONLY=\#
PKG_MACROS +=		PYTHON_3.13_ONLY=\#

# Convenience macros for quoting in manifests; necessary because pkgfmt will
# drop literal quotes in attribute values if they do not contain whitespace
# since the action parsing in pkg will drop them during action stringification.
PKG_MACROS +=		SQ=\'
PKG_MACROS +=		DQ=\"
PKG_MACROS +=		Q=\"

PKG_OPTIONS +=		$(PKG_MACROS:%=-D %)

# 11.3 doesn't include CWD in pkgmogrify search path
PKG_OPTIONS +=		-I$(COMPONENT_DIR)

MANGLED_DIR =	$(BUILD_DIR)/mangled

# We use += below so anyone wishing to put other directories at the beginning
# of the list can do so, by setting PKG_PROTO_DIRS before including this file.
# So don't change += to = here or components that use this will break.
PKG_PROTO_DIRS += $(MANGLED_DIR) $(PROTO_DIR) $(@D) $(COMPONENT_DIR) $(COMPONENT_SRC) $(WS_LICENSES)

MANIFEST_BASE =		$(BUILD_DIR)/manifest-$(MACH)

ifeq ($(strip $(MACH)),i386)
FOREIGN_MACH = sparc
else
FOREIGN_MACH = i386
endif
CANONICAL_MANIFESTS = $(filter-out %.$(FOREIGN_MACH).p5m,$(wildcard *.p5m))
ifneq ($(wildcard $(HISTORY)),)
HISTORICAL_MANIFESTS = $(shell $(NAWK) -v FUNCTION=name -f $(GENERATE_HISTORY) < $(HISTORY))
endif

# Following section handles versioned component manifests
#
# NOPYTHON_MANIFESTS: Contains all manifests in the component directory which
#   doesn't end with the PYVER or GENFRAG strings.
# PY_MANIFESTS: Manifests with -PYVER string
# PYV_MANIFESTS: Manifests with -PYVER replaced with all actual versions of Python
# PYNV_MANIFESTS: Manifests from $(PY_MANIFESTS) with -PYVER string removed
#
# Other components (like perl, ruby and php) use the same mechanism,
# just the variable names are different.

# Look for manifests which need to be duplicated for each version of python.
ifeq ($(findstring -PYVER,$(CANONICAL_MANIFESTS)),-PYVER)
NOPYTHON_MANIFESTS = $(filter-out %GENFRAG.p5m,$(filter-out %-PYVER.p5m,$(CANONICAL_MANIFESTS)))
PY_MANIFESTS = $(filter %-PYVER.p5m,$(CANONICAL_MANIFESTS))
PYV_MANIFESTS = $(foreach v,$(shell echo $(PYTHON_VERSIONS) | tr -d .),\
              $(shell echo $(PY_MANIFESTS) | sed -e 's/-PYVER.p5m/-$(v).p5m/g'))
PYNV_MANIFESTS = $(shell echo $(PY_MANIFESTS) | sed -e 's/-PYVER//')
else
NOPYTHON_MANIFESTS = $(CANONICAL_MANIFESTS)
endif

# Look for manifests which need to be duplicated for each version of perl.
ifeq ($(findstring -PERLVER,$(NOPYTHON_MANIFESTS)),-PERLVER)
NOPERL_MANIFESTS = $(filter-out %GENFRAG.p5m,$(filter-out %-PERLVER.p5m,$(NOPYTHON_MANIFESTS)))
PERL_MANIFESTS = $(filter %-PERLVER.p5m,$(NOPYTHON_MANIFESTS))
PERLV_MANIFESTS = $(foreach v,$(shell echo $(PERL_VERSIONS) | tr -d .),\
                $(shell echo $(PERL_MANIFESTS) | sed -e 's/-PERLVER.p5m/-$(v).p5m/g'))
PERLNV_MANIFESTS = $(shell echo $(PERL_MANIFESTS) | sed -e 's/-PERLVER//')
else
NOPERL_MANIFESTS = $(NOPYTHON_MANIFESTS)
endif

# Look for manifests which need to be duplicated for each version of ruby.
ifeq ($(findstring -RUBYVER,$(NOPERL_MANIFESTS)),-RUBYVER)
NORUBY_MANIFESTS = $(filter-out %GENFRAG.p5m,$(filter-out %-RUBYVER.p5m,$(NOPERL_MANIFESTS)))
RUBY_MANIFESTS = $(filter %-RUBYVER.p5m,$(NOPERL_MANIFESTS))
RUBYV_MANIFESTS = $(foreach v,$(shell echo $(RUBY_VERSIONS) | tr -d .),\
                $(shell echo $(RUBY_MANIFESTS) | sed -e 's/-RUBYVER.p5m/-$(v).p5m/g'))
RUBYNV_MANIFESTS = $(shell echo $(RUBY_MANIFESTS) | sed -e 's/-RUBYVER//')
else
NORUBY_MANIFESTS = $(NOPERL_MANIFESTS)
endif

# Look for manifests which need to be duplicated for each version of PHP.
ifeq ($(findstring -PHPVER,$(NORUBY_MANIFESTS)),-PHPVER)
NOPHP_MANIFESTS = $(filter-out %GENFRAG.p5m,$(filter-out %-PHPVER.p5m,$(NORUBY_MANIFESTS)))
PHP_MANIFESTS = $(filter %-PHPVER.p5m,$(NORUBY_MANIFESTS))
PHPV_MANIFESTS = $(foreach v,$(shell echo $(PHP_VERSIONS) | tr -d .),\
               $(shell echo $(PHP_MANIFESTS) | sed -e 's/-PHPVER.p5m/-$(v).p5m/g'))
PHPNV_MANIFESTS = $(shell echo $(PHP_MANIFESTS) | sed -e 's/-PHPVER//')
else
NOPHP_MANIFESTS = $(NORUBY_MANIFESTS)
endif

VERSIONED_MANIFESTS = \
	$(PYV_MANIFESTS) $(PYNV_MANIFESTS) \
	$(PERLV_MANIFESTS) $(PERLNV_MANIFESTS) \
	$(RUBYV_MANIFESTS) $(RUBYNV_MANIFESTS) \
	$(PHPV_MANIFESTS)  $(PHPNV_MANIFESTS) \
	$(NOPHP_MANIFESTS) $(HISTORICAL_MANIFESTS)

GENERATED =		$(MANIFEST_BASE)-generated
COMBINED =		$(MANIFEST_BASE)-combined
MANIFESTS =		$(VERSIONED_MANIFESTS:%=$(MANIFEST_BASE)-%)


DEPENDED=$(VERSIONED_MANIFESTS:%.p5m=$(MANIFEST_BASE)-%.depend)
RESOLVED=$(VERSIONED_MANIFESTS:%.p5m=$(MANIFEST_BASE)-%.depend.res)
PUBLISHED=$(RESOLVED:%.depend.res=%.published)
# List of manifests that are to be constructed during 'gmake manifest-check'
CHECKED=$(CANONICAL_MANIFESTS:%.p5m=$(MANIFEST_BASE)-%.constructed)
MANGLED=$(VERSIONED_MANIFESTS:%.p5m=$(MANIFEST_BASE)-%.mangled)

COPYRIGHT_FILE ?=	$(COMPONENT_NAME)-$(COMPONENT_VERSION).copyright
IPS_COMPONENT_VERSION ?=	$(COMPONENT_VERSION)

.DEFAULT:		publish

.SECONDARY:

# allow publishing to be overridden, such as when
# a package is for one architecture only.
PUBLISH_STAMP ?= $(BUILD_DIR)/.published-$(MACH)

$(MANIFEST_BASE)-%.constructed: install | $(PROTO_DIR)
	@env $(call prepare_env_args,\
	    GENERATE_TRANSFORMS PROTO_DIR PKG_HARDLINKS PKG_AUTO_HARDLINKS \
	    MANIFEST_BASE COMPONENT_DIR MANIFEST_CLEANUP_TRANSFORM \
	    MANIFEST_GENERATE GENERATE_PROTO_DIRS) $(MANIFEST_COMPARE) "$@" $(MANIFEST_UPDATE) $(PKG_OPTIONS)
	$(POST_CHECK_ACTION)

# Make manifest-check perform any action only in components built for the
# current architecture we run on
ifeq ($(strip $(BUILD_ARCH)),$(MACH))
manifest-check: install $(CHECKED)
else
manifest-check:
endif

manifest-update: MANIFEST_UPDATE=--update
manifest-update: manifest-check

publish:		build install manifest-check mangle $(PUBLISH_STAMP)

sample-manifest:	$(GENERATED).p5m

$(GENERATED).p5m:	install | $(PROTO_DIR)
	set -o pipefail; \
	$(MANIFEST_GENERATE) \
	    $(PKG_OPTIONS) \
	    $(PKG_HARDLINKS:%=--target %) \
	    $(PROTO_DIR) $(GENERATE_PROTO_DIRS) | \
	$(PKGMOGRIFY) $(PKG_OPTIONS) /dev/fd/0 $(GENERATE_TRANSFORMS) | \
		sed -e '/^$$/d' -e '/^#.*$$/d' | $(PKGFMT) | \
		cat $(METADATA_TEMPLATE) - >$@

# copy the canonical manifest(s) to the build tree
$(MANIFEST_BASE)-%.generate:	%.p5m canonical-manifests
	cat $(METADATA_TEMPLATE) $< >$@

# The text of a transform that will emit a dependency conditional on the
# presence of a particular version of a runtime, which will then draw in the
# runtime-version-specific version of the package we're operating on.  $(1) is
# the name of the runtime package, and $(2) is the version suffix.
mkgeneric = \
	echo "<transform set name=pkg.fmri value=(?:pkg:/)?(.+)-\#\#\#PYV\#\#\#@(.*)" \
		"-> emit depend nodrop=true type=conditional" \
		"predicate=$(1)-$(2) fmri=%<1>-$(2)@%<2>>" >> $@;

# Define and execute a macro that generates a rule to create a manifest for a
# python module specific to a particular version of the python runtime.
# Creates build/manifest-*-modulename-##.p5m file where ## is replaced with
# the version number.
define python-manifest-rule
$(MANIFEST_BASE)-%-$(2).mogrified: PKG_MACROS += PYTHON_$(1)_ONLY=

$(MANIFEST_BASE)-%-$(2).p5m: %-PYVER.p5m | $(BUILD_DIR)
	$(PKGFMT) $(PKGFMT_CHECK_ARGS) $(CANONICAL_MANIFESTS)
	$(PKGMOGRIFY) -D PYVER=$(1) -D MAYBE_PYVER_SPACE="$(1) " \
		-D MAYBE_SPACE_PYVER=" $(1)" $(MANIFEST_LIMITING_VARS) -D PYV=$(2) $$< > $$@
endef
$(foreach ver,$(PYTHON_VERSIONS),$(eval $(call python-manifest-rule,$(ver),$(shell echo $(ver) | tr -d .))))

# A rule to create a helper transform package for python, that will insert the
# appropriate conditional dependencies into a python library's
# runtime-version-generic package to pull in the version-specific bits when the
# corresponding version of python is on the system.
$(BUILD_DIR)/mkgeneric-python: $(WS_MAKE_RULES)/shared-macros.mk | $(BUILD_DIR)
	$(RM) $@
	$(foreach ver,$(shell echo $(filter 3.%, $(PYTHON_VERSIONS)) | tr -d .), \
		$(call mkgeneric,runtime/python,$(ver)))

# Build Python version-wrapping manifests from the generic version.
# Creates build/manifest-*-modulename.p5m file.
# Note that the mkgeneric transform uses the literal string "###PYV###"
# as the place-holder for the Python version (for mkgeneric-python) and
# the Perl version (for mkgeneric-perl below) and the Ruby version (for
# mkgeneric-ruby further below).  The authors did not anticipate that this
# mechanism would be extended beyond Python when they wrote it; something
# more generic like LANGVER might make more sense, but for now we are
# sticking with something known to work.
$(MANIFEST_BASE)-%.p5m: %-PYVER.p5m $(BUILD_DIR)/mkgeneric-python
	$(PKGFMT) $(PKGFMT_CHECK_ARGS) $(CANONICAL_MANIFESTS)
	$(PKGMOGRIFY) -D PYV=###PYV### -D MAYBE_PYVER_SPACE= \
		$(MANIFEST_LIMITING_VARS) \
		-D MAYBE_SPACE_PYVER= $(BUILD_DIR)/mkgeneric-python \
		$(WS_TOP)/transforms/mkgeneric $< > $@
	if [ -f $*-GENFRAG.p5m ]; then cat $*-GENFRAG.p5m >> $@; fi

# Define and execute a macro that generates a rule to create a manifest for a
# perl module specific to a particular version of the perl runtime.
# There are two parameters. Full version and version without dot. So it is
# called for example as
# $(call perl-manifest-rule,5.40,540)
define perl-manifest-rule
$(MANIFEST_BASE)-%-$(2).mogrified: PERL_VERSION=$(1)

$(MANIFEST_BASE)-%-$(2).p5m: %-PERLVER.p5m | $(BUILD_DIR)
	$(PKGFMT) $(PKGFMT_CHECK_ARGS) $$<
	$(PKGMOGRIFY) -D PERLVER=$(1) -D MAYBE_PERLVER_SPACE="$(1) " \
		-D MAYBE_SPACE_PERLVER=" $(1)" \
		-D PLV=$(2) \
		-D PERL_ARCH=$(PERL_ARCH) $$< > $$@
endef
$(foreach ver,$(PERL_VERSIONS),$(eval $(call perl-manifest-rule,$(ver),$(shell echo $(ver) | tr -d .))))

# A rule to create a helper transform package for perl, that will insert the
# appropriate conditional dependencies into a perl library's
# runtime-version-generic package to pull in the version-specific bits when the
# corresponding version of perl is on the system.
$(BUILD_DIR)/mkgeneric-perl: $(WS_MAKE_RULES)/shared-macros.mk | $(BUILD_DIR)
	$(RM) $@
	$(foreach ver,$(shell echo $(PERL_VERSIONS) | tr -d .), \
		$(call mkgeneric,runtime/perl,$(ver)))

# Build Perl version-wrapping manifests from the generic version.
# See the block comment above about why "###PYV###" is used here even
# though this is for Perl rather than Python.
$(MANIFEST_BASE)-%.p5m: %-PERLVER.p5m $(BUILD_DIR)/mkgeneric-perl
	$(PKGFMT) $(PKGFMT_CHECK_ARGS) $(CANONICAL_MANIFESTS)
	$(PKGMOGRIFY) -D PLV=###PYV### -D MAYBE_PERLVER_SPACE= \
		-D MAYBE_SPACE_PERLVER= $(BUILD_DIR)/mkgeneric-perl \
		$(WS_TOP)/transforms/mkgeneric $< > $@
	if [ -f $*-GENFRAG.p5m ]; then cat $*-GENFRAG.p5m >> $@; fi

# Define and execute a macro that generates a rule to create a manifest for a
# ruby module specific to a particular version of the ruby runtime.
# Creates build/manifest-*-modulename-##.p5m file where ## is replaced with
# the version number.
define ruby-manifest-rule
$(MANIFEST_BASE)-%-$(2).p5m: %-RUBYVER.p5m | $(BUILD_DIR)
	$(PKGFMT) $(PKGFMT_CHECK_ARGS) $(CANONICAL_MANIFESTS)
	$(PKGMOGRIFY) -D RUBY_VERSION=$(1) -D RUBY_LIB_VERSION=$(1).0 \
	    -D VENDOR_RUBY=usr/ruby/$(1)/lib/ruby/vendor_ruby/$(1).0 \
	    -D VENDOR_GEM_DIR=usr/ruby/$(1)/lib/ruby/vendor_ruby/gems/$(1).0 \
	    -D MAYBE_RUBYVER_SPACE="$(1) " -D MAYBE_SPACE_RUBYVER=" $(1)" \
	    -D RUBYV=$(2) $$< > $$@
endef
$(foreach ver,$(RUBY_VERSIONS),$(eval \
	$(call ruby-manifest-rule,$(ver),$(shell echo $(ver) | tr -d .))))

# A rule to create a helper transform package for ruby, that will insert the
# appropriate conditional dependencies into a ruby library's
# runtime-version-generic package to pull in the version-specific bits when the
# corresponding version of ruby is on the system.
$(BUILD_DIR)/mkgeneric-ruby: $(WS_MAKE_RULES)/shared-macros.mk | $(BUILD_DIR)
	$(RM) $@
	$(foreach ver,$(shell echo $(RUBY_VERSIONS) | tr -d .), \
		$(call mkgeneric,runtime/ruby,$(ver)))

# Build Ruby version-wrapping manifests from the generic version.
# See the block comment above about why "###PYV###" is used here even
# though this is for Ruby rather than Python.
$(MANIFEST_BASE)-%.p5m: %-RUBYVER.p5m $(BUILD_DIR)/mkgeneric-ruby
	$(PKGFMT) $(PKGFMT_CHECK_ARGS) $(CANONICAL_MANIFESTS)
	$(PKGMOGRIFY) -D RUBYV=###PYV### -D MAYBE_RUBYVER_SPACE= \
		-D MAYBE_SPACE_RUBYVER= $(BUILD_DIR)/mkgeneric-ruby \
		$(WS_TOP)/transforms/mkgeneric $< > $@
	if [ -f $*-GENFRAG.p5m ]; then cat $*-GENFRAG.p5m >> $@; fi

# When revving the php interpreters you may wish to use those build versions
# for building extensions then use the function below.
# You'll also need to adjust phpize.mk
#PHP_EXTENSION_DIR_FUNC= $(shell $(PHP_TOP_DIR)/php$(subst .,,$(1))/build/prototype/$(MACH)/usr/php/$(1)/bin/php-config --extension-dir | cut -c2- )
PHP_EXTENSION_DIR_FUNC= $(shell env PATH=/usr/bin $(shell dirname $(PHP.$(1)))/php-config --extension-dir | cut -c2- )
# Define and execute a macro that generates a rule to create a manifest for a
# PHP module specific to a particular version of the PHP runtime.
define php-manifest-rule
$(MANIFEST_BASE)-%-$(shell echo $(1) | tr -d .).p5m: %-PHPVER.p5m | $(BUILD_DIR)
	$(PKGFMT) $(PKGFMT_CHECK_ARGS) $$<
	$(PKGMOGRIFY) -D PHPVER=$(1) -D MAYBE_PHPVER_SPACE="$(1) " \
		-D MAYBE_SPACE_PHPVER=" $(1)" \
		-D PHV=$(shell echo $(1) | tr -d .) \
		-D PHP_EXT_DIR=$(call PHP_EXTENSION_DIR_FUNC,$(1)) $$< > $$@
endef
$(foreach ver,$(PHP_VERSIONS),$(eval $(call php-manifest-rule,$(ver))))

# A rule to create a helper transform package for PHP, that will insert the
# appropriate conditional dependencies into a PHP extensions's
# runtime-version-generic package to pull in the version-specific bits when the
# corresponding version of PHP is on the system.
$(BUILD_DIR)/mkgeneric-php: $(WS_MAKE_RULES)/shared-macros.mk | $(BUILD_DIR)
	$(RM) $@
	$(foreach ver,$(shell echo $(PHP_VERSIONS) | tr -d .), \
		$(call mkgeneric,web/php,$(ver)))

# Build PHP version-wrapping manifests from the generic version.
# See the block comment above about why "###PYV###" is used here even
# though this is for PHP rather than Python.
$(MANIFEST_BASE)-%.p5m: %-PHPVER.p5m $(BUILD_DIR)/mkgeneric-php
	$(PKGFMT) $(PKGFMT_CHECK_ARGS) $(CANONICAL_MANIFESTS)
	$(PKGMOGRIFY) -D PHV=###PYV### -D MAYBE_PHPVER_SPACE= \
		-D MAYBE_SPACE_PHPVER= $(BUILD_DIR)/mkgeneric-php \
		$(WS_TOP)/transforms/mkgeneric $< > $@
	if [ -f $*-GENFRAG.p5m ]; then cat $*-GENFRAG.p5m >> $@; fi

# Rule to generate historical manifests from the $(HISTORY) file.
define history-manifest-rule
$(MANIFEST_BASE)-$(1): $(HISTORY) | $(BUILD_DIR)
	$(NAWK) -v TARGET=$(1) -v FUNCTION=manifest -f $(GENERATE_HISTORY) < \
	    $(HISTORY) > $$@
endef
$(foreach mfst,$(HISTORICAL_MANIFESTS),$(eval $(call history-manifest-rule,$(mfst))))

# mogrify non-parameterized manifests
$(MANIFEST_BASE)-%.mogrified:	%.p5m | $(BUILD_DIR)
	$(PKGFMT) $(PKGFMT_CHECK_ARGS) $<
	set -o pipefail; $(PKGMOGRIFY) $(PKG_OPTIONS) $< \
		$(PUBLISH_TRANSFORMS) | \
		sed -e '/^$$/d' -e '/^#.*$$/d' | uniq >$@

# mogrify parameterized manifests
$(MANIFEST_BASE)-%.mogrified:	$(MANIFEST_BASE)-%.p5m | $(BUILD_DIR)
	set -o pipefail; $(PKGMOGRIFY) $(PKG_OPTIONS) $< \
		$(PUBLISH_TRANSFORMS) | \
		sed -e '/^$$/d' -e '/^#.*$$/d' | uniq >$@

# This rule forces all manifest-related targets to wait until the install target
# finishes. While this is not strictly necessary (for example, .mogrified can
# run much sooner as it doesn't need the proto area to exist), it makes build
# logs much cleaner and predictable, preventing situations like mogrification
# running before configure.
$(CANONICAL_MANIFESTS): install

$(BUILD_DIR) $(MANGLED_DIR) $(PROTO_DIR):
	$(MKDIR) $@

# mangle the file contents
PKGMANGLE_OPTIONS = -D $(MANGLED_DIR) $(PKG_PROTO_DIRS:%=-d %)
$(MANIFEST_BASE)-%.mangled:	$(MANIFEST_BASE)-%.mogrified | $(MANGLED_DIR) $(PROTO_DIR)
	$(PKGMANGLE) $(PKGMANGLE_OPTIONS) -m $< >$@

ifneq ($(strip $(BUILD_ARCH)),$(MACH))
mangle: target-na
else
mangle: $(MANGLED)
endif

REQUIRED_PACKAGES_VALID =	$(BUILD_DIR)/.required_packages_valid
SKIP_REQUIRED_PACKAGES_CHECK ?=	$(REQUIRED_PACKAGES_VALID)
$(REQUIRED_PACKAGES_VALID):	$(MAKEFILE_PREREQ) | $(BUILD_DIR)
	@echo
	@echo Validating REQUIRED_PACKAGES:
	@echo
	@echo /usr/bin/pkg list -v $(REQUIRED_PACKAGES:%=/%)
	@if /usr/bin/pkg list -v $(REQUIRED_PACKAGES:%=/%); then \
		$(TOUCH) $@; \
	else \
		printf '!!!\n!!! ' >&2; \
		printf 'The REQUIRED_PACKAGES check failed.\n!!!\n!!! ' >&2; \
	        printf 'To skip it run:\n!!! ' >&2; \
		printf '  gmake SKIP_REQUIRED_PACKAGES_CHECK=\n!!!\n' 2>&1; \
		false; \
	fi

# generate dependencies
PKGDEPEND_GENERATE_OPTIONS = -m $(PKG_PROTO_DIRS:%=-d %)
$(MANIFEST_BASE)-%.depend:	$(MANIFEST_BASE)-%.mangled $(SKIP_REQUIRED_PACKAGES_CHECK) | $(PROTO_DIR)
	$(ENV) $(COMPONENT_PUBLISH_ENV) $(PKGDEPEND) generate \
	    $(PKGDEPEND_GENERATE_OPTIONS) $< >$@

# pkgdepend resolve builds a map of all installed packages by default.  This
# makes dependency resolution particularly slow.  We can dramatically improve
# performance here by creating a file with a list of packages that we know
# are needed, dramatically reducing the overhead involved in creating and
# searching this map.
#
# Generate a resolve.deps file from the dependencies in the Makefile and
# fragments that it uses.
RESOLVE_DEPS=$(BUILD_DIR)/resolve.deps

# Construct a list of packages which will be considered while looking for
# package dependencies (see pkgdepend(1) resolve -e).
$(RESOLVE_DEPS):	$(MAKEFILE_PREREQ) | $(BUILD_DIR)
	printf "%s\n" $(REQUIRED_PACKAGES:%=/%) | sort -u >$@

# resolve the dependencies all at once
$(RESOLVED) &:	$(DEPENDED) $(RESOLVE_DEPS)
	$(PKGDEPEND) resolve $(RESOLVE_DEPS:%=-e %) -m $(DEPENDED)
ifneq ($(strip $(POSTRESOLVE_TRANSFORMS)),)
	for manifest in $(RESOLVED) ; do \
		$(MV) $${manifest} $${manifest}.raw ; \
		$(PKGMOGRIFY) $${manifest}.raw $(POSTRESOLVE_TRANSFORMS) \
		    > $${manifest} ; \
	done
endif

#
# Generate a set of REQUIRED_PACKAGES based on what is needed to for pkgdepend
# to resolve properly.  Automatically append this to your Makefile for the truly
# lazy among us.  This is only a piece of the REQUIRED_PACKAGES puzzle.
# You must still include packages for tools you build and test with.
#
REQUIRED_PACKAGES::
	$(RM) $(RESOLVED)
	$(GMAKE) RESOLVE_DEPS= $(RESOLVED)
	@echo "# Auto-generated contents below.  Please manually verify and remove this comment" >>Makefile
	@set -o pipefail; $(PKGMOGRIFY) $(WS_TRANSFORMS)/$@ $(RESOLVED) | \
		$(GSED) -e '/^[\t ]*$$/d' -e '/^#/d' | sort -u >>Makefile
	@echo "*** Please edit your Makefile and verify the new content at the end ***"

# lint the manifests all at once
$(BUILD_DIR)/.linted-$(MACH):	$(RESOLVED)
	@echo "VALIDATING MANIFEST CONTENT: $(RESOLVED)"
	$(ENV) PROTO_PATH="$(PKG_PROTO_DIRS)"\
		SOLARIS_VERSION=$(SOLARIS_VERSION)\
		$(PKGLINTVAR) $(CANONICAL_REPO:%=-c $(WS_LINT_CACHE)) \
			-e $(WS_TOOLS)/python/ -f $(WS_TOOLS)/pkglintrc $(RESOLVED)
	$(TOUCH) $@

lintme: FRC
	@echo "VALIDATING MANIFEST CONTENT: $(RESOLVED)"
	$(ENV) PROTO_PATH="$(PKG_PROTO_DIRS)"\
		SOLARIS_VERSION=$(SOLARIS_VERSION)\
		$(PKGLINTVAR) $(CANONICAL_REPO:%=-c $(WS_LINT_CACHE)) \
			-e $(WS_TOOLS)/python/ -f $(WS_TOOLS)/pkglintrc $(RESOLVED)

FRC:


# published
PKGSEND_PUBLISH_OPTIONS = -s $(PKG_REPO) publish --fmri-in-manifest
PKGSEND_PUBLISH_OPTIONS += --no-catalog
PKGSEND_PUBLISH_OPTIONS += $(PKG_PROTO_DIRS:%=-d %)
PKGSEND_PUBLISH_OPTIONS += -T \*.py

# PKGREPO_REMOVE_BEFORE_PUBLISH remove previously published versions of this package
# before publishing the new build
PKGREPO_REMOVE_BEFORE_PUBLISH ?= no

$(MANIFEST_BASE)-%.published:	$(MANIFEST_BASE)-%.depend.res $(BUILD_DIR)/.linted-$(MACH)
	$(call log-package-publish, $<)
ifeq ($(PKGREPO_REMOVE_BEFORE_PUBLISH),yes)
	-$(PKGREPO) -s $(PKG_REPO) remove \
			$(shell $(CAT) $< $(WS_TOP)/transforms/print-pkgs | \
				$(PKGMOGRIFY) $(PKG_OPTIONS) /dev/fd/0 | \
				sed -e '/^$$/d' -e '/^#.*$$/d' | sort -u)
endif
	$(PKGSEND) $(PKGSEND_PUBLISH_OPTIONS) $<
	$(PKGFMT) <$< >$@

$(BUILD_DIR)/.published-$(MACH):	$(PUBLISHED)
ifndef DISABLE_IPS_CATALOG_AND_INDEX_UPDATES
	$(PKGREPO) refresh -s $(PKG_REPO)
endif
	$(TOUCH) $@

print-package-names:	canonical-manifests
	@set -o pipefail; cat $(VERSIONED_MANIFESTS) $(WS_TOP)/transforms/print-pkgs | \
		$(PKGMOGRIFY) $(PKG_OPTIONS) /dev/fd/0 | \
 		sed -e '/^$$/d' -e '/^#.*$$/d' | sort -u

print-package-paths:	canonical-manifests
	@set -o pipefail; cat $(VERSIONED_MANIFESTS) $(WS_TOP)/transforms/print-paths | \
		$(PKGMOGRIFY) $(PKG_OPTIONS) /dev/fd/0 | \
 		sed -e '/^$$/d' -e '/^#.*$$/d' | sort -u


canonical-manifests:	$(CANONICAL_MANIFESTS) $(MAKEFILE_PREREQ) $(ALL_PATCHES) \
    $(HISTORY)
ifeq	($(strip $(CANONICAL_MANIFESTS)),)
	# If there were no canonical manifests in the workspace, nothing will
	# be published and we should fail.  A sample manifest can be generated
	# with
	#   $ gmake sample-manifest
	# Once created, it will need to be reviewed, edited, and added to the
	# workspace.
	$(error Missing canonical manifest(s))
endif

# Add component-specific variables and export to PKG_OPTIONS.
COMP_SUFFIXES = $(subst COMPONENT_NAME_,, \
		$(filter COMPONENT_NAME_%, $(.VARIABLES)))

# Component variables are expanded directly to PKG_OPTIONS instead of via
# PKG_MACROS since the values may contain whitespace.
mkdefine = -D $(1)="$(2)"

# Expand PKG_VARS into defines via PKG_OPTIONS.
$(foreach var, $(PKG_VARS), \
    $(eval PKG_OPTIONS += $(call mkdefine,$(var),$$($(var)))) \
)

# Expand any variables ending in component _$(suffix) via PKG_OPTIONS excluding
# variables known to always be irrelevant and COMPONENT_BAID_% variables as
# those have already been processed.
$(foreach suffix, $(COMP_SUFFIXES), \
    $(eval COMPONENT_RE_VERSION_$(suffix) ?= $(subst .,\\.,$$(COMPONENT_VERSION_$(suffix)))) \
    $(eval IPS_COMPONENT_VERSION_$(suffix) ?= $$(COMPONENT_VERSION_$(suffix))) \
    $(eval IPS_COMPONENT_RE_VERSION_$(suffix) ?= $(subst .,\\.,$$(IPS_COMPONENT_VERSION_$(suffix)))) \
    $(eval COMP_VARS=$(filter %_$(suffix), $(.VARIABLES))) \
    $(eval COMP_VARS=$(filter-out COMPONENT_POST_UNPACK_%, $(COMP_VARS))) \
    $(eval COMP_VARS=$(filter-out COMPONENT_BAID_%, $(COMP_VARS))) \
    $(eval COMP_VARS=$(filter-out UNPACK_ARGS_%, $(COMP_VARS))) \
    $(eval COMP_VARS=$(filter-out OS_SUB_VERS_2, $(COMP_VARS))) \
    $(foreach macro, $(COMP_VARS), \
        $(eval PKG_OPTIONS += $(call mkdefine,$(macro),$$($(macro)))) \
    ) \
)

include $(WS_MAKE_RULES)/pkg_install.mk
