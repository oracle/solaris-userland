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

.PHONY: void
void:
	@echo "Must specify target: prep, build, install, publish, test, etc."
	@echo "See $(WS_TOP)/doc/makefile-targets.txt for more info."

PATH=/usr/bin:/usr/gnu/bin
DEFAULT_CONFIG_FILE ?= /etc/userland

# $(1) - variable name
# $(2) - default value
# Produces 'VARIABLE?=default'
#
# Read configuration from DEFAULT_CONFIG_FILE providing default when the config
# file is not found. Config file has the variables prefixed by DEFAULT_ so if
# you want to configure CANONICAL_REPO the line in DEFAULT_CONFIG_FILE should
# be:
# DEFAULT_CANONICAL_REPO=http://.....
define read-config
	$(eval $(1)?=$(shell bash -c '[ -r "$(DEFAULT_CONFIG_FILE)" ] && . "$(DEFAULT_CONFIG_FILE)"; echo $${DEFAULT_$(1):-$(2)}'))
endef

# The location of an internal mirror of community source archives that we build
# in this gate.  This mirror has been seeded to include "custom" source archives
# for a few components where the communities either no longer provide matching
# source archives or we have changes that aren't reflected in their archives or
# anywhere else.
$(call read-config,INTERNAL_ARCHIVE_MIRROR,http://userland.us.oracle.com/source-archives)

# The location of an external mirror of community source archives that we build
# in this gate.  The external mirror is a replica of the internal mirror.
EXTERNAL_ARCHIVE_MIRROR =

# Default to looking for source archives on the internal mirror and the external
# mirror before we hammer on the community source archive repositories.
export DOWNLOAD_SEARCH_PATH +=	$(INTERNAL_ARCHIVE_MIRROR)
ifneq   ($(strip $(EXTERNAL_ARCHIVE_MIRROR)),)
export DOWNLOAD_SEARCH_PATH +=	$(EXTERNAL_ARCHIVE_MIRROR)
endif

# The workspace starts at the parent of the make-rules directory,
# unless someone already supplied the top.
ifeq ($(origin WS_TOP), undefined)
export WS_TOP := $(realpath $(dir $(realpath $(dir $(filter \
			%/make-rules/shared-macros.mk,$(MAKEFILE_LIST))))))
endif

WS_MACH =	$(WS_TOP)/$(MACH)
WS_LOGS =	$(WS_MACH)/logs
WS_HOME =	$(WS_MACH)/home
WS_REPO =	$(WS_MACH)/repo
WS_EXPERIMENTAL_REPO =	$(WS_MACH)/repo.experimental
WS_TOOLS =	$(WS_TOP)/tools
WS_MAKE_RULES =	$(WS_TOP)/make-rules
WS_COMPONENTS =	$(WS_TOP)/components
WS_LICENSES =	$(WS_TOP)/licenses
WS_INCORPORATIONS =	$(WS_TOP)/incorporations
WS_LINT_CACHE =	$(WS_MACH)/pkglint-cache

# This can be overridden to avoid rebuilding when you touch a Makefile
MAKEFILE_PREREQ =	Makefile

# some things don't build properly in non-C locales,
# so lets stay there
export LC_ALL=C

# Some things look for files under $HOME, such as git looking for ~/.gitconfig
# which can have unexpected results.  Use our minimal $HOME instead.
export HOME=$(WS_HOME)

SHELL=	/bin/bash
ID=	/usr/bin/id
# We want "nightly" as our publisher, to match other consolidations and
# facilitate migrations. G11N wants $(CONSOLIDATION)-localizable for the
# localizable publisher.
CONSOLIDATION ?=	userland
PUBLISHER ?=	nightly
PUBLISHER_LOCALIZABLE ?=	$(CONSOLIDATION)-localizable

# Defines $(space) as a single blank space, so we can use it to convert
# space-separated paths to colon-separated paths in variables with
# $(subst $(space),:,$(strip $(SPATHS)))
empty :=
quot  := "
bkslash  := \$(empty)
space := $(empty) $(empty)
define newline


endef

# Change \ -> \\
define prepare_env_args_slash
$(subst $(bkslash),$(bkslash)$(bkslash),$(1))
endef

# Change $ -> \$
define prepare_env_args_dollar
$(subst $$,$(bkslash)$$,$(call prepare_env_args_slash,$(1)))
endef

# Change " -> \"
define prepare_env_args_quote
$(subst $(quot),$(bkslash)$(quot),$(call prepare_env_args_dollar,$(1)))
endef

# Change \n -> "$'\n'"
define prepare_env_args_newline
$(subst $(newline),$(quot)$$'$(bkslash)n'$(quot),$(call prepare_env_args_quote,$(1)))
endef


# Modify all the arguments to a form directly passable to the env(1) command.
# The arguments are encapsulated in double quotes and several characters are
# replaced as follows:
#         \ -> \\
#         " -> \"
#         $ -> \$
# <newline> -> "$'\n'"
#
# It is intended to be used as
#     env $(call prepare_env_args,VAR1 VAR2) process
# and process will get VAR1 and VAR2 in it's environment.
define prepare_env_args
$(foreach env,$(1),"$(env)=$(call prepare_env_args_newline,$($(env)))")
endef

PUBLISH_LOG = $(BUILD_DIR)/packages.$(MACH).log
define log-package-publish
    $(CAT) $(1) $(WS_TOP)/transforms/print-published-pkgs | \
	    $(PKGMOGRIFY) $(PKG_OPTIONS) /dev/fd/0 | \
	    sed -e '/^$$/d' -e '/^#.*$$/d' >> $(PUBLISH_LOG)
endef

ROOT =			/

# The changset and external source repo used in building the packages.
CONSOLIDATION_CHANGESET=	\
	$(shell hg --config ui.report_untrusted=False identify -i)

CONSOLIDATION_REPOSITORY_URL=https://github.com/oracle/solaris-userland.git

# Native OS version
OS_RELEASE :=		$(shell uname -r)
SOLARIS_VERSION =	$(OS_RELEASE:5.%=2.%)
OS_SUB_VERS_1 :=	$(shell uname -v)
OS_SUB_VERS_2 =		$(subst ., ,$(OS_SUB_VERS_1))
OS_SUB_VERS_MINOR =	$(word 1, $(OS_SUB_VERS_2))
OS_SUB_VERS_MICRO =	$(word 2, $(OS_SUB_VERS_2))
OS_VERSION ?=		$(OS_SUB_VERS_MINOR).$(OS_SUB_VERS_MICRO)

# Define limiting variables. These allow you to write single makefile or p5m
# manifest which can be used on multiple solaris releases even though their
# contents differs
ifeq ($(OS_VERSION),11.5)
SOLARIS_11_3_ONLY =\#
SOLARIS_11_4_ONLY =\#
SOLARIS_11_5_ONLY =
SOLARIS_11_3_4_ONLY =\#
SOLARIS_11_4_5_ONLY =
endif

ifeq ($(OS_VERSION),11.4)
SOLARIS_11_3_ONLY =\#
SOLARIS_11_4_ONLY =
SOLARIS_11_5_ONLY =\#
SOLARIS_11_3_4_ONLY =
SOLARIS_11_4_5_ONLY =
endif

ifeq ($(OS_VERSION),11.3)
SOLARIS_11_3_ONLY =
SOLARIS_11_4_ONLY =\#
SOLARIS_11_5_ONLY =\#
SOLARIS_11_3_4_ONLY =
SOLARIS_11_4_5_ONLY =\#
endif

ifeq ($(strip $(SOLARIS_11_3_ONLY)$(SOLARIS_11_4_ONLY)$(SOLARIS_11_5_ONLY)),)
$(error Unknown OS version "$(OS_VERSION)"; set OS_VERSION to "11.3" or "11.4" or "11.5")
endif

include $(WS_MAKE_RULES)/ips-buildinfo.mk

COMPILER ?=		studio

# The values of BITS changes during the build process for components that
# are built 32-bit and 64-bit.  This macro makes it possible to determine
# which components are only built 64-bit and allow other make-rules files
# to adjust accordingly.  Possible values are: '32', '64', '32_and_64',
# '64_and_32', and 'NO_ARCH' (the orderings specify build preference).
BUILD_BITS ?=$(BITS)
ifeq ($(strip $(BUILD_BITS)),64)
BITS ?=			64
else
BITS ?=			32
endif

# Based on BUILD_BITS, determine which binaries are preferred for a build.
# This macro is for the convenience of other make-rules files and should not be
# overridden by developers.
ifeq ($(strip $(BUILD_BITS)),64)
PREFERRED_BITS=64
endif
ifeq ($(strip $(BUILD_BITS)),64_and_32)
PREFERRED_BITS=64
endif
PREFERRED_BITS ?= 32

# Map target build to macro/variable naming conventions.  This macro is for the
# convenience of other make-rules files and should not be overridden by
# developers.
ifeq ($(BUILD_BITS),64_and_32)
MK_BITS=32_and_64
else
MK_BITS=$(strip $(BUILD_BITS))
endif

# Do not assume a default build style for compatibility with older component
# Makefiles.  If explicitly set, common.mk will automatically include relevant
# make-rules files.  Possible values are: 'ant', 'archive', 'attpackagemake',
# 'cmake', 'configure', 'gnu-component', 'justmake', 'pkg', and 'setup.py'. See
# corresponding file in make-rules for details.
# BUILD_STYLE=

USERLAND_COMPONENTS = $(WS_TOOLS)/userland-components
MANIFEST_GENERATE = $(WS_TOOLS)/manifest-generate
MANIFEST_COMPARE = $(WS_TOOLS)/manifest-check

CLONEY =	$(WS_TOOLS)/cloney

CONFIG_SHELL =	/bin/bash

PKG_REPO =	file:$(WS_REPO)
PKG_EXPERIMENTAL_REPO =	file:$(WS_EXPERIMENTAL_REPO)

COMPONENT_SRC_NAME =	$(COMPONENT_NAME)
# Assume a component is categorized as a utility by default.
COMPONENT_BUGDB=	utility/$(COMPONENT_NAME)

COMPONENT_DIR :=	$(shell pwd)
SOURCE_DIR =	$(COMPONENT_DIR)/$(COMPONENT_SRC)
BUILD_DIR =	$(COMPONENT_DIR)/build
PROTO_DIR =	$(BUILD_DIR)/prototype/$(MACH)

ETCDIR =	/etc
USRDIR =	/usr
USRGNUDIR =	$(USRDIR)/gnu
BINDIR =	/bin
SBINDIR =	/sbin
LIBDIR =	/lib
VARDIR =	/var
USRBINDIR =	$(USRDIR)/bin
USRBINDIR64 =	$(USRDIR)/bin/$(MACH64)
USRSBINDIR =	$(USRDIR)/sbin
USRLIBDIR =	$(USRDIR)/lib
USRSHAREDIR =	$(USRDIR)/share
USRINCDIR =	$(USRDIR)/include
USRSHARELOCALEDIR =	$(USRSHAREDIR)/locale
USRSHAREMANDIR =	$(USRSHAREDIR)/man
USRSHAREDOCDIR =	$(USRSHAREDIR)/doc
USRSHAREFONTSDIR =	$(USRSHAREDIR)/fonts
USRSHARETTFONTSDIR =	$(USRSHAREFONTSDIR)/TrueType
USRSHARELIBDIR =	$(USRSHAREDIR)/lib
USRSHAREMAN1DIR =	$(USRSHAREMANDIR)/man1
USRSHAREMAN1MDIR =	$(USRSHAREMANDIR)/man1m
USRSHAREMAN3DIR =	$(USRSHAREMANDIR)/man3
USRSHAREMAN4DIR =	$(USRSHAREMANDIR)/man4
USRSHAREMAN5DIR =	$(USRSHAREMANDIR)/man5
USRSHAREMAN8DIR =	$(USRSHAREMANDIR)/man8
USRLIBDIR64 =	$(USRDIR)/lib/$(MACH64)
PROTOBINDIR =	$(PROTO_DIR)$(BINDIR)
PROTOETCDIR =	$(PROTO_DIR)$(ETCDIR)
PROTOETCSECDIR = $(PROTO_DIR)$(ETCDIR)/security
PROTOUSRDIR =	$(PROTO_DIR)$(USRDIR)
PROTOLIBDIR =	$(PROTO_DIR)$(LIBDIR)
PROTOSVCMANIFESTDIR =	$(PROTOLIBDIR)/svc/manifest
PROTOSVCMETHODDIR =	$(PROTOLIBDIR)/svc/method
PROTOUSRBINDIR =	$(PROTO_DIR)$(USRBINDIR)
PROTOUSRBINDIR64 =	$(PROTO_DIR)$(USRBINDIR64)
PROTOUSRSBINDIR =	$(PROTO_DIR)$(USRSBINDIR)
PROTOUSRLIBDIR =	$(PROTO_DIR)$(USRLIBDIR)
PROTOUSRLIBDIR64 =	$(PROTO_DIR)$(USRLIBDIR64)
PROTOPKGCONFIGDIR = 	$(PROTOUSRLIBDIR)/pkgconfig
PROTOPKGCONFIGDIR64 =	$(PROTOUSRLIBDIR64)/pkgconfig
PROTOUSRINCDIR =	$(PROTO_DIR)$(USRINCDIR)
PROTOUSRSHAREDIR =	$(PROTO_DIR)$(USRSHAREDIR)
PROTOUSRSHARELIBDIR =	$(PROTO_DIR)$(USRSHARELIBDIR)
PROTOUSRSHAREDOCDIR =	$(PROTO_DIR)$(USRSHAREDOCDIR)
PROTOUSRSHAREINFODIR =	$(PROTOUSRSHAREDIR)/info
PROTOUSRSHAREMANDIR =	$(PROTO_DIR)$(USRSHAREMANDIR)
PROTOUSRSHAREMAN1DIR =	$(PROTO_DIR)$(USRSHAREMAN1DIR)
PROTOUSRSHAREMAN1MDIR =	$(PROTO_DIR)$(USRSHAREMAN1MDIR)
PROTOUSRSHAREMAN3DIR =	$(PROTO_DIR)$(USRSHAREMAN3DIR)
PROTOUSRSHAREMAN4DIR =	$(PROTO_DIR)$(USRSHAREMAN4DIR)
PROTOUSRSHAREMAN5DIR =	$(PROTO_DIR)$(USRSHAREMAN5DIR)
PROTOUSRSHAREMAN8DIR =	$(PROTO_DIR)$(USRSHAREMAN8DIR)
PROTOUSRSHARELOCALEDIR =	$(PROTO_DIR)$(USRSHARELOCALEDIR)

GNUBIN =	$(USRGNUDIR)/bin
GNULIB =	$(USRGNUDIR)/lib
GNULIB64 =	$(USRGNUDIR)/lib/$(MACH64)
GNUSHARE =	$(USRGNUDIR)/share
GNUSHAREMAN =	$(USRGNUDIR)/share/man
GNUSHAREMAN1 =	$(USRGNUDIR)/share/man/man1
PROTOGNUBIN =	$(PROTO_DIR)$(GNUBIN)
PROTOGNUSHARE =	$(PROTO_DIR)$(GNUSHARE)
PROTOGNUSHAREMAN =	$(PROTO_DIR)$(GNUSHAREMAN)
PROTOGNUSHAREMAN1 =	$(PROTO_DIR)$(GNUSHAREMAN1)

# work around _TIME, _DATE, embedded date chatter in component builds
# to use, set TIME_CONSTANT in the component Makefile and add $(CONSTANT_TIME)
# to the appropriate {CONFIGURE|BUILD|INSTALL}_ENV
CONSTANT_TIME =		LD_PRELOAD_32=$(WS_TOOLS)/time-$(MACH32).so
CONSTANT_TIME +=	LD_PRELOAD_64=$(WS_TOOLS)/time-$(MACH64).so
CONSTANT_TIME +=	TIME_CONSTANT=$(TIME_CONSTANT)

# set MACH from uname -p to either sparc or i386
MACH :=		$(shell uname -p)
# Override this to limit builds and publication to a single architecture.
BUILD_ARCH ?=	$(MACH)

# set MACH32 from MACH to either sparcv7 or i86
MACH32_1 =	$(MACH:sparc=sparcv7)
MACH32 =	$(MACH32_1:i386=i86)

# set MACH64 from MACH to either sparcv9 or amd64
MACH64_1 =	$(MACH:sparc=sparcv9)
MACH64 =	$(MACH64_1:i386=amd64)

CONFIGURE_NO_ARCH =	$(BUILD_DIR_NO_ARCH)/.configured
CONFIGURE_32 =		$(BUILD_DIR_32)/.configured
CONFIGURE_64 =		$(BUILD_DIR_64)/.configured
CONFIGURE_32_and_64 =	$(CONFIGURE_32) $(CONFIGURE_64)

BUILD_DIR_NO_ARCH =	$(BUILD_DIR)/$(MACH)
BUILD_DIR_32 =		$(BUILD_DIR)/$(MACH32)
BUILD_DIR_64 =		$(BUILD_DIR)/$(MACH64)

BUILD_NO_ARCH =		$(BUILD_DIR_NO_ARCH)/.built
BUILD_32 =		$(BUILD_DIR_32)/.built
BUILD_64 =		$(BUILD_DIR_64)/.built
BUILD_32_and_64 =	$(BUILD_32) $(BUILD_64)
# NO_ARCH uses BITS=32 because some path setting macros use $(BITS)
$(BUILD_DIR_NO_ARCH)/.built:	BITS=32
$(BUILD_DIR_32)/.built:		BITS=32
$(BUILD_DIR_64)/.built:		BITS=64

# COMPONENT_MAKE_JOBS contains the maximal number of build
# jobs per component. The default value is equal to the
# number of physical cores. The maximal system load is
# limited by the number of virtual processors.
ifneq ($(wildcard /usr/sbin/psrinfo),)

PSRINFO=/usr/sbin/psrinfo
COMPONENT_MAKE_JOBS ?= $(shell $(PSRINFO) -t | grep -c core)
SYSTEM_MAX_LOAD := $(shell $(PSRINFO) | wc -l)

# If the number of physical cores cannot be determined from
# 'psrinfo -t' output, we use the number of virtual processors
# (hardware threads) as a workaround.
ifeq ($(COMPONENT_MAKE_JOBS),0)
COMPONENT_MAKE_JOBS := $(SYSTEM_MAX_LOAD)
endif

endif

# If the memory is almost exhausted, then refuse to execute parallel build jobs.
ifneq ($(wildcard /usr/bin/kstat2),)
ifneq ($(wildcard /usr/bin/pagesize),)

KSTAT2 := /usr/bin/kstat2
PAGE_SIZE := $(shell /usr/bin/pagesize)

TOTAL_MEMORY_PAGES := $(shell $(KSTAT2) -p kstat:/vm/usage/memory:mem_total | cut -f 2)
FREE_MEMORY_PAGES := $(shell $(KSTAT2) -p kstat:/pages/unix/system_pages:freemem | cut -f 2)
ZFS_MEMORY_PAGES := $(shell $(KSTAT2) -p kstat:/vm/usage/memory:mem_zfs | cut -f 2)
AVAILABLE_MEMORY_PAGES := $(shell echo $$(($(FREE_MEMORY_PAGES)+$(ZFS_MEMORY_PAGES))))
AVAILABLE_MEMORY_PERCENTAGE := $(shell echo $$((100*$(AVAILABLE_MEMORY_PAGES)/$(TOTAL_MEMORY_PAGES))))

# If there is less than 20 % of available memory, then we set COMPONENT_MAKE_JOBS to 1.
ifeq ($(shell expr $(AVAILABLE_MEMORY_PERCENTAGE) \<= 20),1)
COMPONENT_MAKE_JOBS := 1
endif

endif
endif

# If the number of jobs is greater than 1, then we need to set
# GNU make parameters. If GMAKE variable is used for other
# command (e.g., build.sh), COMPONENT_MAKE_JOBS must be empty or set to 1.
ifneq ($(filter-out 1,$(COMPONENT_MAKE_JOBS)),)

ifeq ($(SYSTEM_MAX_LOAD),)
SYSTEM_MAX_LOAD := $(COMPONENT_MAKE_JOBS)
endif

COMPONENT_BUILD_ARGS += -j $(COMPONENT_MAKE_JOBS) -l $(SYSTEM_MAX_LOAD)
endif

INSTALL_NO_ARCH =	$(BUILD_DIR_NO_ARCH)/.installed
INSTALL_32 =		$(BUILD_DIR_32)/.installed
INSTALL_64 =		$(BUILD_DIR_64)/.installed
INSTALL_32_and_64 =	$(INSTALL_32) $(INSTALL_64)
$(BUILD_DIR_NO_ARCH)/.installed:  BITS=32
$(BUILD_DIR_32)/.installed:       BITS=32
$(BUILD_DIR_64)/.installed:       BITS=64

# set the default target for installation of the component
COMPONENT_INSTALL_TARGETS =	install

# set the default build test results directory
COMPONENT_TEST_BUILD_DIR =	$(BUILD_DIR)/test/$(MACH$(BITS))

# set the default master test results directory
COMPONENT_TEST_RESULTS_DIR =	$(COMPONENT_DIR)/test
COMPONENT_SYSTEM_TEST_RESULTS_DIR =	$(COMPONENT_DIR)/test

# set the default master test results file
COMPONENT_TEST_MASTER =		$(COMPONENT_TEST_RESULTS_DIR)/results-$(BITS).master

# set the default test results output file
COMPONENT_TEST_OUTPUT =		$(COMPONENT_TEST_BUILD_DIR)/test-$(BITS)-results

# set the default test results comparison diffs file
COMPONENT_TEST_DIFFS =		$(COMPONENT_TEST_BUILD_DIR)/test-$(BITS)-diffs

# set the default test snapshot file
COMPONENT_TEST_SNAPSHOT =	$(COMPONENT_TEST_BUILD_DIR)/results-$(BITS).snapshot

# Normally $(GSED) is simplest, but some results files need more power.
COMPONENT_TEST_TRANSFORMER =	$(GSED)

# The set of default transforms to be applied to the test results to try
# to normalize them.
COMPONENT_TEST_TRANSFORMS = \
	'-e "s|$(@D)|\\$$(@D)|g" ' \
	'-e "s|$(PERL)|\\$$(PERL)|g" ' \
	'-e "s|$(SOURCE_DIR)|\\$$(SOURCE_DIR)|g" ' \
	'-e "/^gmake: warning: jobserver unavailable:/d" ' \
	'-e "/^make\[.* jobserver unavailable:/d" ' \
	'-e "/^make: Warning: Ignoring DistributedMake -j option/d" '

# set the default commands used to generate the file containing the set
# of transforms to be applied to the test results to try to normalize them.
COMPONENT_TEST_CREATE_TRANSFORMS = \
	@if [ -e $(COMPONENT_TEST_MASTER) ]; \
	then \
		print "\#!/bin/sh" > $(COMPONENT_TEST_TRANSFORM_CMD); \
		print '$(COMPONENT_TEST_TRANSFORMER) ' \
			$(COMPONENT_TEST_TRANSFORMS) \
			' \\' >> $(COMPONENT_TEST_TRANSFORM_CMD); \
		print '$(COMPONENT_TEST_OUTPUT) \\' \
			>> $(COMPONENT_TEST_TRANSFORM_CMD); \
		print '> $(COMPONENT_TEST_SNAPSHOT)' \
			>> $(COMPONENT_TEST_TRANSFORM_CMD); \
	else \
		print 'Cannot find $(COMPONENT_TEST_MASTER)'; \
		exit 2; \
	fi

# set the default command for performing any test result munging
COMPONENT_TEST_TRANSFORM_CMD =	$(COMPONENT_TEST_BUILD_DIR)/transform-$(BITS)-results

# set the default operation to run to perform test result normalization
COMPONENT_TEST_PERFORM_TRANSFORM = \
	@if [ -e $(COMPONENT_TEST_MASTER) ]; \
	then \
		$(SHELL) $(COMPONENT_TEST_TRANSFORM_CMD); \
	else \
		print 'Cannot find $(COMPONENT_TEST_MASTER)'; \
		exit 2; \
	fi

# set the default command used to compare the master results with the snapshot
COMPONENT_TEST_COMPARE_CMD =	$(GDIFF) -uN

# set the default way that master and snapshot test results are compared
COMPONENT_TEST_COMPARE = \
	@if [ -e $(COMPONENT_TEST_MASTER) ]; \
	then \
		$(COMPONENT_TEST_COMPARE_CMD) \
			$(COMPONENT_TEST_MASTER) $(COMPONENT_TEST_SNAPSHOT) \
			> $(COMPONENT_TEST_DIFFS); \
		print "Test results in $(COMPONENT_TEST_OUTPUT)"; \
		if [ -s $(COMPONENT_TEST_DIFFS) ]; \
		then \
			print "Differences found."; \
			$(CAT) $(COMPONENT_TEST_DIFFS); \
			exit 2; \
		else \
			print "No differences found."; \
		fi \
	else \
		print 'Cannot find $(COMPONENT_TEST_MASTER)'; \
		exit 2; \
	fi

# set the default env command to use for test of the component
COMPONENT_TEST_ENV_CMD =        $(ENV)
COMPONENT_SYSTEM_TEST_ENV_CMD =	$(ENV)

# set the default command to use for test of the component
COMPONENT_TEST_CMD =		$(GMAKE)
COMPONENT_SYSTEM_TEST_CMD =	$(GMAKE)

# set the default target for test of the component
COMPONENT_TEST_TARGETS =	check
COMPONENT_SYSTEM_TEST_TARGETS =	check

# set the default directory for test of the component
COMPONENT_TEST_DIR =		$(@D)
COMPONENT_SYSTEM_TEST_DIR =	$(@D)

#
# For tests requiring privilege, check if we can elevate privilege without
# prompting. If we can't, tell the user what to do and fail.
#
COMPONENT_PRE_TEST_SUDO = \
	@$(SUDO) -n /bin/true 2>/dev/null || ( \
	echo "Test run requires privilege." >&2; \
	echo "Run '$(SUDO) /bin/true' and then re-run tests" >&2; \
	exit 1 )

# determine the type of tests we want to run.
ifeq ($(strip $(wildcard $(COMPONENT_SYSTEM_TEST_RESULTS_DIR)/results-*.master)),)
SYSTEM_TEST_NO_ARCH =		$(BUILD_DIR_NO_ARCH)/.system-tested
SYSTEM_TEST_32 =		$(BUILD_DIR_32)/.system-tested
SYSTEM_TEST_64 =		$(BUILD_DIR_64)/.system-tested
else
SYSTEM_TEST_NO_ARCH =		$(BUILD_DIR_NO_ARCH)/.system-tested-and-compared
SYSTEM_TEST_32 =		$(BUILD_DIR_32)/.system-tested-and-compared
SYSTEM_TEST_64 =		$(BUILD_DIR_64)/.system-tested-and-compared
endif
SYSTEM_TEST_32_and_64 =	$(SYSTEM_TEST_32) $(SYSTEM_TEST_64)
ifeq ($(strip $(wildcard $(COMPONENT_TEST_RESULTS_DIR)/results-*.master)),)
TEST_NO_ARCH ?=		$(BUILD_DIR_NO_ARCH)/.tested
TEST_32 ?=		$(BUILD_DIR_32)/.tested
TEST_64 ?=		$(BUILD_DIR_64)/.tested
else
TEST_NO_ARCH ?=		$(BUILD_DIR_NO_ARCH)/.tested-and-compared
TEST_32 ?=		$(BUILD_DIR_32)/.tested-and-compared
TEST_64 ?=		$(BUILD_DIR_64)/.tested-and-compared
endif
TEST_32_and_64 ?=	$(TEST_32) $(TEST_64)

# When running tests at the top level, skip those tests,
# by redefining the above TEST_* targets,
# when a component Makefile includes $(SKIP_TEST_AT_TOP_LEVEL).

define SKIP_TEST_AT_TOP_LEVEL_HELPER
ifeq ($$(TOP_LEVEL_TEST),yes)
TEST_32 = $$(SKIP_TEST)
TEST_64 = $$(SKIP_TEST)
TEST_32_and_64 = $$(SKIP_TEST)
TEST_NO_ARCH = $$(SKIP_TEST)
TEST_TARGET = $$(NO_TESTS)
endif
endef

define SKIP_TEST_AT_TOP_LEVEL
$(eval $(call SKIP_TEST_AT_TOP_LEVEL_HELPER))
endef

$(BUILD_DIR_NO_ARCH)/.system-tested:			BITS=32
$(BUILD_DIR_32)/.system-tested:				BITS=32
$(BUILD_DIR_64)/.system-tested:				BITS=64
$(BUILD_DIR_NO_ARCH)/.system-tested-and-compared:	BITS=32
$(BUILD_DIR_32)/.system-tested-and-compared:		BITS=32
$(BUILD_DIR_64)/.system-tested-and-compared:		BITS=64
$(BUILD_DIR_NO_ARCH)/.tested:				BITS=32
$(BUILD_DIR_32)/.tested:				BITS=32
$(BUILD_DIR_64)/.tested:				BITS=64
$(BUILD_DIR_NO_ARCH)/.tested-and-compared:		BITS=32
$(BUILD_DIR_32)/.tested-and-compared:			BITS=32
$(BUILD_DIR_64)/.tested-and-compared:			BITS=64

$(BUILD_DIR_NO_ARCH)/.system-tested:			$(BUILD_DIR_32)
$(BUILD_DIR_32)/.system-tested:				$(BUILD_DIR_32)
$(BUILD_DIR_64)/.system-tested:				$(BUILD_DIR_64)
$(BUILD_DIR_NO_ARCH)/.system-tested-and-compared:	$(BUILD_DIR_32)
$(BUILD_DIR_32)/.system-tested-and-compared:		$(BUILD_DIR_32)
$(BUILD_DIR_64)/.system-tested-and-compared:		$(BUILD_DIR_64)

$(BUILD_DIR_32) $(BUILD_DIR_64):
	$(MKDIR) $(@)

# BUILD_TOOLS is the root of all tools not normally installed on the system.
BUILD_TOOLS ?=	/opt

SPRO_ROOT ?=	$(BUILD_TOOLS)
SPRO_VROOT ?=	$(SPRO_ROOT)/developerstudio12.6

PARFAIT_VER ?=	parfait-tools-4.0
PARFAIT_ROOT =	$(BUILD_TOOLS)/parfait
PARFAIT_VROOT=	$(PARFAIT_ROOT)/$(PARFAIT_VER)
PARFAIT_TOOLS=	$(WS_TOOLS)/$(MACH)/parfait
PARFAIT= $(PARFAIT_VROOT)/bin/parfait
export PARFAIT_NATIVESUNCC=$(SPRO_VROOT)/bin/cc
export PARFAIT_NATIVESUNCXX=$(SPRO_VROOT)/bin/CC
export PARFAIT_NATIVEGCC=$(GCC_ROOT)/bin/gcc
export PARFAIT_NATIVEGXX=$(GCC_ROOT)/bin/g++

ONBLD_ROOT ?=	$(BUILD_TOOLS)/onbld
ONBLD_BIN ?=	$(ONBLD_ROOT)/bin

GCC_ROOT ?=	/usr/gcc/15

CC.studio.32 =	$(SPRO_VROOT)/bin/cc
CXX.studio.32 =	$(SPRO_VROOT)/bin/CC


CC.studio.64 =	$(SPRO_VROOT)/bin/cc
CXX.studio.64 =	$(SPRO_VROOT)/bin/CC

CC.gcc.32 =	$(GCC_ROOT)/bin/gcc
CXX.gcc.32 =	$(GCC_ROOT)/bin/g++

CC.gcc.64 =	$(GCC_ROOT)/bin/gcc
CXX.gcc.64 =	$(GCC_ROOT)/bin/g++

lint.32 =	$(SPRO_VROOT)/bin/lint -m32
lint.64 =	$(SPRO_VROOT)/bin/lint -m64

LINT =		$(lint.$(BITS))

LD =		/usr/bin/ld

ifeq   ($(strip $(PARFAIT_BUILD)),yes)
CC.studio.32 =	$(PARFAIT_TOOLS)/cc
CXX.studio.32 =	$(PARFAIT_TOOLS)/CC
CC.studio.64 =	$(PARFAIT_TOOLS)/cc
CXX.studio.64 =	$(PARFAIT_TOOLS)/CC
CC.gcc.32 =	$(PARFAIT_TOOLS)/gcc
CXX.gcc.32 =	$(PARFAIT_TOOLS)/g++
CC.gcc.64 =	$(PARFAIT_TOOLS)/gcc
CXX.gcc.64 =	$(PARFAIT_TOOLS)/g++
LD =		$(PARFAIT_TOOLS)/ld
endif

CC =		$(CC.$(COMPILER).$(BITS))
CXX =		$(CXX.$(COMPILER).$(BITS))

RUBY_VERSION =	3.3
RUBY_PUPPET_VERSION = 3.3

# The default version should go last.
RUBY_VERSIONS = 3.3
RUBY.3.3 =	/usr/ruby/3.3/bin/ruby
RUBY =		$(RUBY.$(RUBY_VERSION))

# Transform Ruby scripts to call the supported
# version-specific ruby; used in multiple *.mk files
RUBY_SCRIPT_FIX_FUNC = \
    $(GNU_GREP) -Rl '^\#! */usr/bin/env ruby' | \
        /usr/bin/xargs -I\{\} $(GSED) -i -e \
        '1s%^\#! */usr/bin/env ruby%\#!/usr/ruby/$(RUBY_VERSION)/bin/ruby%' \
        \{\}

USRBIN.32 =	/usr/bin
USRBIN.64 =	/usr/bin/$(MACH64)
USRBIN =	$(USRBIN.$(BITS))

USRLIB.32 =	$(USRLIBDIR)
USRLIB.64 =	$(USRLIBDIR64)
USRLIB =	$(USRLIB.$(BITS))

# The default version should go last.
PYTHON_VERSION =	3.13
PYTHON_VERSIONS =	3.11 3.13

PYTHON.3.11 =	/usr/bin/python3.11
PYTHON.3.13 =	/usr/bin/python3.13
PYTHON ?=	$(PYTHON.$(PYTHON_VERSION))

PYTHON.3.11.VENDOR_PACKAGES =  /usr/lib/python3.11/vendor-packages
PYTHON.3.13.VENDOR_PACKAGES =  /usr/lib/python3.13/vendor-packages

PYTHON_VENDOR_PACKAGES = $(PYTHON.$(PYTHON_VERSION).VENDOR_PACKAGES)

# The default is site-packages, but that directory belongs to the end-user.
# Modules which are shipped by the OS but not with the core Python distribution
# belong in vendor-packages.
PYTHON_LIB ?= $(PYTHON_VENDOR_PACKAGES)
PYTHON_DATA ?= $(PYTHON_VENDOR_PACKAGES)

# Convenience variable for builds without newer runtimes.
WITHOUT_PYTHON3.13 = 3.11

# If the component has python scripts then the first line should probably
# point at the userland default build python so as not to be influenced
# by the ips python mediator.
# In the component's Makefile define PYTHON_SCRIPTS with a list of files
# to be edited.

# Edit the leading #!/usr/bin/python line in python scripts to use the
# BUILD's $(PYTHON). The source file must be recompiled after that, as
# the corresponding .pyc file is outdated now.
PYTHON_SCRIPT_SHEBANG_FIX_FUNC = \
	$(GSED) -i \
		-e '1s@/usr/bin/python$$@$(PYTHON)@' \
		-e '1s@/usr/bin/python[23]$$@$(PYTHON)@' \
		-e '1s@/usr/bin/python\ @$(PYTHON) @' \
		-e '1s@/usr/bin/env\ $(PYTHON)@$(PYTHON)@' \
		-e '1s@/usr/bin/env\ python[23]@$(PYTHON)@' \
		-e '1s@/usr/bin/env\ python@$(PYTHON)@' $(1); \
	$(PYTHON) -m compileall $(1);

# PYTHON_SCRIPTS is a list of files from the calling Makefile.
PYTHON_SCRIPTS_PROCESS= \
	$(foreach s,$(PYTHON_SCRIPTS), \
	        $(call PYTHON_SCRIPT_SHEBANG_FIX_FUNC,$(s)))

# Finally if PYTHON_SCRIPTS is defined in a Makefile then process them here.
# If multiple installs in the component then clear
# COMPONENT_POST_INSTALL_ACTION =
# and re-add $(PYTHON_SCRIPTS_PROCESS)
COMPONENT_POST_INSTALL_ACTION += $(PYTHON_SCRIPTS_PROCESS)

# PYTHON3_SOABI variable defines the naming scheme
# of python3 extension libraries:
#   cpython - lib.cpython-311.so (default)
#   abi3 - lib.abi3.so
#   bare - lib.so
PYTHON3_SOABI ?= cpython
ifeq ($(PYTHON3_SOABI),cpython)
PY3_CPYTHON_NAMING=
PY3_ABI3_NAMING=\#
else ifeq ($(PYTHON3_SOABI),abi3)
PY3_CPYTHON_NAMING=\#
PY3_ABI3_NAMING=
else ifeq ($(PYTHON3_SOABI),bare)
PY3_CPYTHON_NAMING=\#
PY3_ABI3_NAMING=\#
else
$(error "Invalid python naming scheme '$(PYTHON3_SOABI)' selected!")
endif

JAVA8_HOME =	/usr/jdk/instances/jdk1.8.0
JAVA_HOME = $(JAVA8_HOME)

# This is the default BUILD version of perl
# Not necessarily the system's default version, i.e. /usr/bin/perl
PERL_VERSION ?= 5.38
PERL_VERSION_NODOT = $(subst .,,$(PERL_VERSION))

# Used for versionless perl packages.  Processed by ips.mk to stamp out
# multiple packages for each version of perl listed here.  Used by
# perl_modules/* but also used for those components that deliver a perl
# package like graphviz and openscap.
# When updating this line do not forget to update also
# perl_modules/generate/common.transform
PERL_VERSIONS = 5.38

PERL.5.38 =     /usr/perl5/5.38/bin/perl

define test-perl-availability
TEST_PERL_PATH=$$(PERL.$(1))
ifeq ($$(strip $$(TEST_PERL_PATH)),)
$$(error variable PERL.$(1) is not defined)
endif
endef

$(foreach p,$(PERL_VERSIONS),$(eval $(call test-perl-availability,$(p))))

# Use these in a component's Makefile for building and packaging with the
# BUILD's default perl and the package it comes from.
PERL =          $(PERL.$(PERL_VERSION))
PERL_PKG =	$(PERL_VERSION:5.%=runtime/perl-5%)

# PERL_ARCH is perl's architecture string.  Use in ips manifests.
PERL_ARCH :=	$(shell $(PERL) -e 'use Config; print $$Config{archname}')

PKG_MACROS +=   PERL_ARCH=$(PERL_ARCH)
PKG_MACROS +=   PERL_VERSION=$(PERL_VERSION)

# If the component has perl scripts then the first line should probably
# point at the userland default build perl so as not to be influenced
# by the ips perl mediator.
# In the component's Makefile define PERL_SCRIPTS with a list of files
# to be edited.

# Edit the leading #!/usr/bin/perl line in perl scripts to use the
# BUILD's $(PERL).
PERL_SCRIPT_SHEBANG_FIX_FUNC = \
	$(GSED) -i \
		-e '1s@/usr/bin/perl@$(PERL)@' \
		-e '1s@/usr/perl5/bin/perl@$(PERL)@' \
		-e '1s@/usr/bin/env\ perl@$(PERL)@' $(1);

# PERL_SCRIPTS is a list of files from the calling Makefile.
PERL_SCRIPTS_PROCESS= \
	$(foreach s,$(PERL_SCRIPTS), \
	        $(call PERL_SCRIPT_SHEBANG_FIX_FUNC,$(s)))

# Finally if PERL_SCRIPTS is defined in a Makefile then process them here.
# If multiple installs in the component then clear
# COMPONENT_POST_INSTALL_ACTION =
# and re-add $(PERL_SCRIPTS_PROCESS)
COMPONENT_POST_INSTALL_ACTION += $(PERL_SCRIPTS_PROCESS)

# PHP stuff
PHP_TOP_DIR = $(WS_COMPONENTS)/php

# All versions of PHP for building extension packages.
PHP_VERSIONS = 8.2 8.3 8.4

PHP.8.2 = /usr/php/8.2/bin/php
PHP.8.3 = /usr/php/8.3/bin/php
PHP.8.4 = /usr/php/8.4/bin/php

# This is the default BUILD version of tcl
# Not necessarily the system's default version, i.e. /usr/bin/tclsh
TCL_VERSION =  8.6
TCLSH.8.6.i386.32 =	/usr/bin/i86/tclsh8.6
TCLSH.8.6.i386.64 =	/usr/bin/amd64/tclsh8.6
TCLSH.8.6.sparc.32 =	/usr/bin/sparcv7/tclsh8.6
TCLSH.8.6.sparc.64 =	/usr/bin/sparcv9/tclsh8.6
TCLSH =		$(TCLSH.$(TCL_VERSION).$(MACH).$(BITS))

CCSMAKE =	/usr/ccs/bin/make
DOXYGEN =	/usr/bin/doxygen
ELFEDIT =	/usr/bin/elfedit
GMAKE ?=	/usr/gnu/bin/make
GPATCH =	/usr/bin/patch
PATCH_LEVEL =	1
GPATCH_BACKUP =	--backup --version-control=numbered
GPATCH_FLAGS =	-p$(PATCH_LEVEL) $(GPATCH_BACKUP)
GSED =		/usr/gnu/bin/sed
GDIFF =		/usr/gnu/bin/diff
GSORT =		/usr/gnu/bin/sort
GUNZIP =	/usr/bin/gunzip

PKGREPO =	/usr/bin/pkgrepo
PKGSEND =	/usr/bin/pkgsend
PKGMOGRIFY =	/usr/bin/pkgmogrify
PKGLINT =	/usr/bin/pkglint
ifeq   ($(strip $(PKGLINT_COMPONENT)),)
PKGLINTVAR =	$(PKGLINT)
else
PKGLINTVAR =	${WS_TOOLS}/pkglint
endif

ACLOCAL =	/usr/bin/aclocal-1.16
AUTOMAKE =	/usr/bin/automake-1.16
AUTORECONF = 	/usr/bin/autoreconf

KSH93 =         /usr/bin/ksh93
TOUCH =		/usr/bin/touch
MKDIR =		/bin/mkdir -p
RM =		/bin/rm -f
CP =		/bin/cp -f
MV =		/bin/mv -f
LN =		/bin/ln
CAT =		/bin/cat
SYMLINK =	/bin/ln -s
ENV =		/usr/bin/env
FIND =		/usr/bin/find
INSTALL =	/usr/bin/ginstall
GNU_GREP =	/usr/gnu/bin/grep
CHMOD =		/usr/bin/chmod
NAWK =		/usr/bin/nawk
TAR =		/usr/bin/tar
GNU_TAR =	/usr/gnu/bin/tar
TEE =		/usr/bin/tee
ANT =		/usr/bin/ant
LOCALEDEF =	/usr/bin/localedef

INS.dir=        $(INSTALL) -d $@
INS.file=       $(INSTALL) -m 444 $< $(@D)

MKFONTDIR =	/usr/bin/mkfontdir
MKFONTSCALE =	/usr/bin/mkfontscale
UNZIP =		/usr/bin/unzip

#
# To simplify adding directories to PKG_CONFIG_PATH, since += adds spaces, not :
# use PKG_CONFIG_PATHS += ... and the following will convert to the : form
#
PKG_CONFIG_PATH.32 = /usr/lib/pkgconfig
PKG_CONFIG_PATH.64 = /usr/lib/$(MACH64)/pkgconfig
PKG_CONFIG_DEFAULT = $(PKG_CONFIG_PATH.$(BITS))
PKG_CONFIG_PATH    = $(subst $(space),:,$(strip \
			$(PKG_CONFIG_PATHS) $(PKG_CONFIG_DEFAULT)))

LIBNSL=$(shell elfdump -d /usr/lib/libnsl.so.1 | $(NAWK) 'BEGIN {ret="-lnsl"} $$2 == "FILTER" && $$4 == "libc.so.1" {ret=""} END {print ret}')
LIBSOCKET=$(shell elfdump -d /usr/lib/libsocket.so.1 | $(NAWK) 'BEGIN {ret="-lsocket"} $$2 == "FILTER" && $$4 == "libc.so.1" {ret=""} END {print ret}')
LIBXNET=$(shell elfdump -d /usr/lib/libxnet.so.1 | $(NAWK) 'BEGIN {ret="-lxnet"} $$2 == "FILTER" && $$4 == "libc.so.1" {ret=""} END {print ret}')

#
# C preprocessor flag sets to ease feature selection.  Add the required
# feature to your Makefile with CPPFLAGS += $(FEATURE_MACRO) and add to
# the component build with CONFIGURE_OPTIONS += CPPFLAGS="$(CPPFLAGS)" or
# similar.
#

# Enables visibility of some c99 math functions that aren't visible by default.
# What other side-effects are there?
CPP_C99_EXTENDED_MATH =	-D_STDC_99

# Enables large file support for components that have no other means of doing
# so.  Use CPP_LARGEFILES and not the .32/.64 variety directly
CPP_LARGEFILES.32 :=	$(shell getconf LFS_CFLAGS)
CPP_LARGEFILES.64 :=	$(shell getconf LFS64_CFLAGS)
CPP_LARGEFILES =		$(CPP_LARGEFILES.$(BITS))

# Enables some #pragma redefine_extname to POSIX-compliant Standard C Library
# functions. Also avoids the component's #define _POSIX_C_SOURCE to some value
# we currently do not support.
CPP_POSIX =	-D_POSIX_C_SOURCE=200112L -D_POSIX_PTHREAD_SEMANTICS

# XPG6 mode.  This option enables XPG6 conformance, plus extensions.
# Amongst other things, this option will cause system calls like
# popen (3C) and system (3C) to invoke the standards-conforming
# shell, /usr/xpg4/bin/sh, instead of /usr/bin/sh.  Add studio_XPG6MODE to
# CFLAGS instead of using this directly
CPP_XPG6MODE=	-D_XOPEN_SOURCE=600 -D__EXTENSIONS__=1 -D_XPG6

# XPG5 mode. These options are specific for C++, where _XPG6,
# _XOPEN_SOURCE=600 and C99 are illegal. -D__EXTENSIONS__=1 is legal in C++.
CPP_XPG5MODE=   -D_XOPEN_SOURCE=500 -D__EXTENSIONS__=1 -D_XPG5

#
# Studio C compiler flag sets to ease feature selection.  Add the required
# feature to your Makefile with CFLAGS += $(FEATURE_MACRO) and add to the
# component build with CONFIGURE_OPTIONS += CFLAGS="$(CFLAGS)" or similar.
#

# Generate 32/64 bit objects
CC_BITS =	-m$(BITS)

# Code generation instruction set and optimization 'hints'.  Use studio_XBITS
# and not the .arch.bits variety directly.
studio_XBITS.sparc.32 =	-xtarget=generic -xarch=sparcvis -xchip=generic
studio_XBITS.sparc.64 =
ifneq   ($(strip $(PARFAIT_BUILD)),yes)
studio_XBITS.sparc.64 += -xtarget=generic
endif
studio_XBITS.sparc.64 += -xarch=sparcvis -xchip=generic
studio_XBITS.i386.32 =	-xchip=pentium
studio_XBITS.i386.64 =	-xchip=generic -Ui386 -U__i386
studio_XBITS = $(studio_XBITS.$(MACH).$(BITS))

# Turn on recognition of supported C99 language features and enable the 1999 C
# standard library semantics of routines that appear in	both the 1990 and
# 1999 C standard. To use set studio_C99MODE=$(studio_C99_ENABLE) in your
# component Makefile.
studio_C99_ENABLE =		-xc99=all

# Turn off recognition of C99 language features, and do not enable the 1999 C
# standard library semantics of routines that appeared in both the 1990	and
# 1999 C standard.  To use set studio_C99MODE=$(studio_C99_DISABLE) in your
# component Makefile.
studio_C99_DISABLE =	-xc99=none

# Use the compiler default 'xc99=all,no_lib'
studio_C99MODE =

# For C++, compatibility with C99 (which is technically illegal) is
# enabled in a different way. So, we must use a different macro for it.
studio_cplusplus_C99_ENABLE = 	-xlang=c99

# Turn it off.
studio_cplusplus_C99_DISABLE =

# And this is the macro you should actually use
studio_cplusplus_C99MODE =

# Allow zero-sized struct/union declarations and void functions with return
# statements.
studio_FEATURES_EXTENSIONS =	-features=extensions

# Control the Studio optimization level.
studio_OPT.sparc.32 ?=	-xO4
studio_OPT.sparc.64 ?=	-xO4
studio_OPT.i386.32 ?=	-xO4
studio_OPT.i386.64 ?=	-xO4
studio_OPT ?=		$(studio_OPT.$(MACH).$(BITS))

# Studio PIC code generation.  Use CC_PIC instead to select PIC code generation.
studio_PIC = 	-KPIC -DPIC

# The Sun Studio 11 compiler has changed the behaviour of integer
# wrap arounds and so a flag is needed to use the legacy behaviour
# (without this flag panics/hangs could be exposed within the source).
# This is used through studio_IROPTS, not the 'sparc' variety.
studio_IROPTS.sparc =	-W2,-xwrap_int
studio_IROPTS =		$(studio_IROPTS.$(MACH))

# Control register usage for generated code.  SPARC ABI requires system
# libraries not to use application registers.  x86 requires 'no%frameptr' at
# x04 or higher.

# We should just use -xregs but we need to workaround 7030022. Note
# that we can't use the (documented) -Wc,-xregs workaround because
# libtool really hates -Wc and thinks it should be -Wl. Instead
# we use an (undocumented) option which actually happens to be what
# CC would use.
studio_XREGS.sparc =	-Qoption cg -xregs=no%appl
studio_XREGS.i386 =	-xregs=no%frameptr
studio_XREGS =		$(studio_XREGS.$(MACH))

gcc_XREGS.sparc =	-mno-app-regs
gcc_XREGS.i386 =
gcc_XREGS =		$(gcc_XREGS.$(MACH))

# Set data alignment on sparc to reasonable values, 8 byte alignment for 32 bit
# objects and 16 byte alignment for 64 bit objects.  This is added to CFLAGS by
# default.
studio_ALIGN.sparc.32 =	-xmemalign=8s
studio_ALIGN.sparc.64 =	-xmemalign=16s
studio_ALIGN =		$(studio_ALIGN.$(MACH).$(BITS))

# Studio shorthand for building multi-threaded code,  enables -D_REENTRANT and
# linking with threadin support.  This is added to CFLAGS by default, override
# studio_MT to turn this off.
studio_MT =		-mt

# Security sensitive binaries should be built with -xcheck=stkovf, which
# adds an extra check for stack overflows (not to be confused with stack
# buffer overflows). A stack overflow happens when the entire process/thread
# stack space is exhausted and the next stack dereference hits outside
# of the stack boundaries.
#
# Note that with Studio 12.6, -xcheck=stkovf is on by default for sparc, so we
# must explicitly disable it for the _DISABLE case here.
# Note that in general it is not safe to enable STKOVF for shared libraries, so
# the default needs to be disabled.
studio_CHECK_STKOVF_ENABLE =	-xcheck=stkovf:detect
studio_CHECK_STKOVF_DISABLE =	-xcheck=no%stkovf
studio_CHECK_STKOVF = 		$(studio_CHECK_STKOVF_DISABLE)


# See CPP_XPG6MODE comment above.
studio_XPG6MODE =	$(studio_C99MODE) $(CPP_XPG6MODE)
XPG6MODE =		$(studio_XPG6MODE)

# See CPP_XPG5MODE comment above. You can only use this in C++, not in C99.
studio_XPG5MODE =	$(studio_cplusplus_C99MODE) $(CPP_XPG5MODE)
XPG5MODE =		$(studio_XPG5MODE)

# Default Studio C compiler flags.  Add the required feature to your Makefile
# with CFLAGS += $(FEATURE_MACRO) and add to the component build with
# CONFIGURE_OPTIONS += CFLAGS="$(CFLAGS)" or similar.  In most cases, it
# should not be necessary to add CFLAGS to any environment other than the
# configure environment.
CFLAGS.studio +=	$(studio_OPT) $(studio_XBITS) $(studio_XREGS) \
			$(studio_IROPTS) $(studio_C99MODE) $(studio_ALIGN) \
			$(studio_MT) $(studio_CHECK_STKOVF)

# Default Studio C++ compiler flags.  Add the required feature to your Makefile
# with CXXFLAGS += $(FEATURE_MACRO) and add to the component build with
# CONFIGURE_OPTIONS += CXXFLAGS="$(CXXFLAGS)" or similar.  In most cases, it
# should not be necessary to add CXXFLAGS to any environment other than the
# configure environment.
CXXFLAGS.studio +=	$(studio_OPT) $(studio_XBITS) $(studio_XREGS) \
			$(studio_IROPTS) $(studio_ALIGN)

#
# GNU C compiler flag sets to ease feature selection.  Add the required
# feature to your Makefile with CFLAGS += $(FEATURE_MACRO) and add to the
# component build with CONFIGURE_OPTIONS += CFLAGS="$(CFLAGS)" or similar.
#

# gcc defaults to assuming stacks are 8 byte aligned on x86, but some
# important existing binaries use the 4 byte alignment from the SysV ABI
# and may segv on instructions like MOVAPS that require correct alignment,
# so we override the gcc defaults until gcc fixes - see Oracle bug 21393975
# or upstream bug https://gcc.gnu.org/bugzilla/show_bug.cgi?id=62281
gcc_STACK_ALIGN.i386.32 += -mincoming-stack-boundary=2

# GCC Compiler optimization flag
gcc_OPT.sparc.32 ?=	-O3
gcc_OPT.sparc.64 ?=	-O3
gcc_OPT.i386.32 ?=	-O3
gcc_OPT.i386.64 ?=	-O3
gcc_OPT ?=		$(gcc_OPT.$(MACH).$(BITS)) \
			$(gcc_STACK_ALIGN.$(MACH).$(BITS))

# GCC PIC code generation.  Use CC_PIC instead to select PIC code generation.
gcc_PIC =	-fPIC -DPIC

# Remove the build path from macros and debug information (requires GCC 9.0+).
gcc_FIX_PATH ?= -ffile-prefix-map="$(COMPONENT_DIR)=."

# Generic macro for PIC code generation.  Use this macro instead of the
# compiler-specific variant.
CC_PIC =		$($(COMPILER)_PIC)
CC_PIC_ENABLE =		$(CC_PIC)
CC_PIC_DISABLE =
CC_PIC_MODE ?=		$(CC_PIC_ENABLE)

# Default GNU C compiler flags.  Add the required feature to your Makefile
# with CFLAGS += $(FEATURE_MACRO) and add to the component build with
# CONFIGURE_OPTIONS += CFLAGS="$(CFLAGS)" or similar.  In most cases, it
# should not be necessary to add CFLAGS to any environment other than the
# configure environment.
CFLAGS.gcc +=	$(gcc_OPT)
CFLAGS.gcc +=	$(gcc_XREGS)
CFLAGS.gcc +=	$(gcc_FIX_PATH)

# Default GNU C++ compiler flags.  Add the required feature to your Makefile
# with CXXFLAGS += $(FEATURE_MACRO) and add to the component build with
# CONFIGURE_OPTIONS += CXXFLAGS="$(CXXFLAGS)" or similar.  In most cases, it
# should not be necessary to add CXXFLAGS to any environment other than the
# configure environment.
CXXFLAGS.gcc +=		$(gcc_OPT)
CXXFLAGS.gcc +=		$(gcc_XREGS)
CXXFLAGS.gcc +=		$(gcc_FIX_PATH)

# Build 32 or 64 bit objects.
CFLAGS +=	$(CC_BITS)

# Support building a binary PIE by building each unit PIC. To enable in
# a makefile, add CC_PIC_MODE = $(CC_PIC_ENABLE)
CFLAGS +=	$(CC_PIC_MODE)

# Add compiler-specific 'default' features
CFLAGS +=	$(CFLAGS.$(COMPILER))
CFLAGS +=	$(CFLAGS.$(COMPILER).$(BITS))
CFLAGS +=	$(CFLAGS.$(COMPILER).$(MACH))
CFLAGS +=	$(CFLAGS.$(COMPILER).$(MACH).$(BITS))

# Studio C++ requires -norunpath to avoid adding its location into the RUNPATH
# to C++ applications.
studio_NORUNPATH =	 -norunpath

# To link in standard mode (the default mode) without any C++ libraries
# (except libCrun), use studio_LIBRARY_NONE in your component Makefile.
studio_LIBRARY_NONE =	 -library=%none

# Don't link C++ with any C++ Runtime or Standard C++ library
studio_CXXLIB_NONE =	-xnolib

# Link C++ with the Studio C++ Runtime and Standard C++ library.  This is the
# default for "standard" mode.
studio_CXXLIB_CSTD =	-library=Cstd,Crun

# Tell the compiler that we don't want the studio runpath added to the
# linker flags.  We never want the Studio location added to the RUNPATH.
CXXFLAGS +=	$($(COMPILER)_NORUNPATH)

# Build 32 or 64 bit objects in C++ as well.
CXXFLAGS +=	$(CC_BITS)

# Add compiler-specific 'default' features
CXXFLAGS +=	$(CXXFLAGS.$(COMPILER))
CXXFLAGS +=	$(CXXFLAGS.$(COMPILER).$(BITS))
CXXFLAGS +=	$(CXXFLAGS.$(COMPILER).$(MACH))
CXXFLAGS +=	$(CXXFLAGS.$(COMPILER).$(MACH).$(BITS))
CXXFLAGS +=     $(CC_PIC_MODE)

# Add mach-specific 'default' features
CXXFLAGS +=	$(CXXFLAGS.$(MACH))

#
# Solaris linker flag sets to ease feature selection.  Add the required
# feature to your Makefile with LDFLAGS += $(FEATURE_MACRO) and add to the
# component build with CONFIGURE_OPTIONS += LDFLAGS="$(LDFLAGS)" or similar.
#

# set the bittedness that we want to link
LD_BITS =	-$(BITS)

# Note that spaces are not used after the '-z' below so that these macros can
# be used in arguments to the compiler of the form -Wl,$(LD_Z_*).

# Reduce the symbol table size, effectively conflicting with -g.  We should
# get linker guidance here.
LD_Z_REDLOCSYM =	-zredlocsym

# Cause the linker to rescan archive libraries and resolve remaining unresolved
# symbols recursively until all symbols are resolved.  Components should be
# linking in the libraries they need, in the required order.  This should
# only be required if the component's native build is horribly broken.
LD_Z_RESCAN_NOW =	-zrescan-now

LD_Z_TEXT =		-ztext

# make sure all symbols are defined.
LD_Z_DEFS =		-zdefs

# eliminate unreferenced dynamic dependencies
LD_Z_IGNORE =		-zignore

# eliminate comments
LD_Z_STRIP_CLASS =	-zstrip-class=comment

# use direct binding
LD_B_DIRECT =		-Bdirect

# build a PIE binary
# to enable creating a PIE binary, add LD_Z_PIE_MODE = $(LD_Z_PIE_ENABLE)
# to the component makefile, and ensure that it's built PIC (CC_PIC_ENABLE).
LD_Z_PIE_ENABLE =	-ztype=pie
LD_Z_PIE_DISABLE =
LD_Z_PIE_MODE ?=	$(LD_Z_PIE_ENABLE)

# generic macro names for enabling/disabling security extensions
# -z<extname> is deprecated, but supported, on S11.4 and later, in favor
# of the more flexible -zsx=<extname> format. Security extensions which
# are not supported on S11 use -zsx=<extname> by default.

ifeq ($(OS_VERSION), 11.3)
ASLR_ENABLE = 			-zaslr=enable
ASLR_DISABLE = 			-zaslr=disable
ASLR_NOT_APPLICABLE = 		-zaslr=disable

NXSTACK_ENABLE =		-znxstack=enable
NXSTACK_DISABLE =		-znxstack=disable
NXSTACK_NOT_APPLICABLE =	-znxstack=disable

NXHEAP_ENABLE =			-znxheap=enable
NXHEAP_DISABLE =		-znxheap=disable
NXHEAP_NOT_APPLICABLE =		-znxheap=disable
else
ASLR_ENABLE = 			-zsx=aslr=enable
ASLR_DISABLE = 			-zsx=aslr=disable
ASLR_NOT_APPLICABLE = 		-zsx=aslr=disable

NXSTACK_ENABLE =		-zsx=nxstack=enable
NXSTACK_DISABLE =		-zsx=nxstack=disable
NXSTACK_NOT_APPLICABLE =	-zsx=nxstack=disable

NXHEAP_ENABLE =			-zsx=nxheap=enable
NXHEAP_DISABLE =		-zsx=nxheap=disable
NXHEAP_NOT_APPLICABLE =		-zsx=nxheap=disable

ADIHEAP_ENABLE.sparcv9 =	-zsx=adiheap=enable
ADIHEAP_DISABLE.sparcv9 =	-zsx=adiheap=disable
ADIHEAP_ENABLE =		$(ADIHEAP_ENABLE.$(MACH64))
ADIHEAP_DISABLE =		$(ADIHEAP_DISABLE.$(MACH64))

ADISTACK_ENABLE.sparcv9 =	-zsx=adistack=enable
ADISTACK_DISABLE.sparcv9 =	-zsx=adistack=disable
ADISTACK_ENABLE =		$(ADISTACK_ENABLE.$(MACH64))
ADISTACK_DISABLE =		$(ADISTACK_DISABLE.$(MACH64))

SSBD_ENABLE =			-zsx=ssbd=enable
SSBD_DISABLE =			-zsx=ssbd=disable
endif

# Enable ASLR, NXHEAP and NXSTACK by default unless target build is NO_ARCH.
ifeq ($(strip $(BUILD_BITS)),NO_ARCH)
ASLR_MODE= 		$(ASLR_NOT_APPLICABLE)
NXSTACK_MODE =		$(NXSTACK_NOT_APPLICABLE)
NXHEAP_MODE =		$(NXHEAP_NOT_APPLICABLE)
ADIHEAP_MODE =
ADISTACK_MODE =
else
ASLR_MODE =		$(ASLR_ENABLE)
NXSTACK_MODE =		$(NXSTACK_ENABLE)
NXHEAP_MODE =		$(NXHEAP_ENABLE)
ADIHEAP_MODE =
ADISTACK_MODE =
endif

# by default, turn on Address Space Layout Randomization, non-executable
# stack and non-executable heap for ELF executables;
# to explicitly disable ASLR, set ASLR_MODE = $(ASLR_DISABLE)
# to explicitly disable NXSTACK, set NXSTACK_MODE = $(NXSTACK_DISABLE)
# to explicitly disable NXHEAP, set NXHEAP_MODE = $(NXHEAP_DISABLE)
# in that component's Makefile
LD_Z_ASLR =		$(ASLR_MODE)
LD_Z_NXSTACK =		$(NXSTACK_MODE)
LD_Z_NXHEAP =		$(NXHEAP_MODE)

# by default, ADIHEAP and ADISTACK are opt-in.
# to explicitly enable ADIHEAP, set ADIHEAP_MODE = $(ADIHEAP_ENABLE)
# to explicitly disable ADIHEAP, set ADIHEAP_MODE = $(ADIHEAP_DISABLE)
# to explicitly enable ADISTACK, set ADISTACK_MODE = $(ADISTACK_ENABLE)
# to explicitly disable ADISTACK, set ADISTACK_MODE = $(ADISTACK_DISABLE)
#
# ADIHEAP and ADISTACK are not supported on Solaris 11.3.
#
ifneq ($(OS_VERSION), 11.3)
LD_Z_ADIHEAP =		$(ADIHEAP_MODE)
LD_Z_ADISTACK =		$(ADISTACK_MODE)
endif

#
# More Solaris linker flags that we want to be sure that everyone gets.  This
# is automatically added to the calling environment during the 'build' and
# 'install' phases of the component build.  Each individual feature can be
# turned off by adding FEATURE_MACRO= to the component Makefile.
#

# Create a non-executable bss segment when linking.
LD_MAP_NOEXBSS.i386 =	-M /usr/lib/ld/map.noexbss
LD_MAP_NOEXBSS.sparc =	-M /usr/lib/ld/map.noexbss

# Create a non-executable data segment when linking.  Due to PLT needs, the
# data segment must be executable on sparc, but the bss does not.
# see mapfile comments for more information
LD_MAP_NOEXDATA.i386 =	-M /usr/lib/ld/map.noexdata
LD_MAP_NOEXDATA.sparc =	$(LD_MAP_NOEXBSS.$(MACH))

# Page alignment
LD_MAP_PAGEALIGN =	-M /usr/lib/ld/map.pagealign

# Default linker options that everyone should get.  Do not add additional
# libraries to this macro, as it will apply to everything linked during the
# component build.
LD_OPTIONS +=	$(LD_MAP_NOEXDATA.$(MACH)) \
		$(LD_MAP_PAGEALIGN) $(LD_B_DIRECT) $(LD_Z_IGNORE) \
		$(LD_Z_STRIP_CLASS)

LD_SECEXT_OPTIONS.sparc = $(LD_Z_ADIHEAP) $(LD_Z_ADISTACK)
LD_SECEXT_OPTIONS =	$(LD_Z_ASLR) $(LD_Z_NXSTACK) $(LD_Z_NXHEAP) \
			$(LD_SECEXT_OPTIONS.$(MACH))

# Object type specific options that should be applied through the link-editor
# LD_xxx_OPTIONS environment variables.
#
# Executables can be ET_EXEC or ET_DYN (PIE). LD_EXEC_OPTIONS and
# LD_PIE_OPTIONS apply respectively. A small trick is used to link
# binaries with -ztype=pie, by passing it on the LD_EXEC_OPTIONS list.
#
# All dynamic objects should enable -ztext (pure text that does not need
# runtime fixups) and -zdefs (no undefined symbols). These options are
# the default for executables, but need to be specified for shared objects.
# -zdefs will expose a number of problem shared objects that do not specify
# their dependencies. If possible, those things should be fixed. If not,
# their component makefile can allow it by clearing the macro provided for
# that purpose here:
#
#	LD_SHARED_OPTIONS_Z_TEXT =
#	LD_SHARED_OPTIONS_Z_DEFS =
#
# This indirection, rather than clearing LD_Z_TEXT or LD_Z_DEFS directly,
# is done so that those macros retain their meaning when used in other
# contexts.
#
LD_EXEC_OPTIONS =	$(LD_Z_PIE_MODE) $(LD_SECEXT_OPTIONS)
LD_PIE_OPTIONS =	$(LD_SECEXT_OPTIONS)

LD_SHARED_OPTIONS_Z_TEXT = $(LD_Z_TEXT)
LD_SHARED_OPTIONS_Z_DEFS = $(LD_Z_DEFS)
LD_SHARED_OPTIONS +=	$(LD_SHARED_OPTIONS_Z_TEXT) $(LD_SHARED_OPTIONS_Z_DEFS)

# Generate CTF sections for executables, PIE, and shared objects.
#
# Two variables control CTF generation for Userland. Component makefiles
# should set these before the include of shared-macros.mk:
#
#  CTF_MODE = on|off|relaxed	[default: on for gcc, off for studio]
#	Determines whether CTF is produced (on, relaxed) or disabled (off).
#	'on' includes the -zctf=require option, which ensures that all
#	input objects deliver CTF content. 'relaxed' drops the require
#	option, enabling partial "best effort" results. This can be convenient
#	in cases where CTF is only partially present. However, the lack
#	of CTF becomes a silent failure, and so, 'on' is preferred. The
#	default for CTF_MODE is compiler dependent. See "Studio Compiler
#	Notes" below.
#
#	CTF_MODE=off: The most common reason for this is to work around FOSS
#	makefiles that ignore the CFLAGS we try to pass in, or filter
#	the LD_xxx_OPTIONS environment variables we use. To get CTF into
#	those components, you will need to figure out why the flags and/or
#	environment variables are being dropped. There can also be other
#	reasons for failure. With the Studio compilers, the CTF convert/merge
#	process may fail. In the case of gcc, the -gctf option may not
#	be supported for all languages. We have seen this with C++. When
#	'off' is specified, you should include a comment explaining the
#	reason. Grep for CTF_MODE in existing makefiles for examples.
#
#	CTF_MODE=relaxed: In some components, the flags or environment
#	variables may reach the important parts of the build, but not
#	penetrate every corner. If the missed part is unimportant
#	(e.g. a test or minor utility), 'relaxed' will produce useful CTF
#	with minimum effort. Therefore, whether 'relaxed' is a good idea
#	or not is a judgement call. If interested, try it, and use ctfdump
#	to check the resulting objects.
#
#  CTF_STRIP_DEBUG =0|1		[default: 0, not stripped ]
#	If CTF_MODE is not off, and the Studio compilers are used, the -g
#	option is added to CFLAGS in order to produce dwarf debug sections
#	that can be converted to CTF. CTF_STRIP_DEBUG determines whether
#	these dwarf sections are stripped from the resulting object, or
#	left in place for use by dbx. A value of 0 retains the dwarf
#	sections, while a value of 1 causes them to be removed.
#
# Studio Compiler Notes:
#	Due to the risk of silent failure, where objects build cleanly, but
#	fail to load at runtime, CTF_MODE defaults to off for Studio. The
#	use of $(LD_Z_DEFS) eliminates this risk, and is highly recommended,
#	but many components do not do that.
#
#	With the Studio compilers, CTF generation requires the use of the
#	-g option. When -g is used, Studio retains unused code that would
#	otherwise be thrown away. In particular, static inline functions
#	from headers end up being kept. In a case where a main program
#	loads "plugin" objects, and mapfiles are used to scope reduce
#	unwanted global symbols to local, this -g behavior can result in
#	plugins with external references to symbols that have been made
#	local in the parent.
#
#	Studio components can explicitly set CTF_MODE to a value other
#	than 'off' to enable CTF. In that case, any extra symbols need to
#	be resolved by adding them to mapfiles, or by using -xF (compiler)
#	and -zdiscard-unused=sections (ld) options to allow unused code
#	to be detected and discarded.

# Supply defaults for CTF_MODE and CTF_STRIP_DEBUG.
ifndef CTF_MODE
ifeq ($(strip $(COMPILER)),gcc)
CTF_MODE=on
else
CTF_MODE=off
endif
endif

ifndef CTF_STRIP_DEBUG
# Default to leaving debug sections in the result.
#
# Studio dwarf is compatible with CTF and dbx.
#
# With gcc, use the -gctf option to generate the CTF. The alternative of
# producing dwarf sections and converting them is a poor choice, since
# ctfconvert is limited to version 2 gcc dwarf, and resulting objects will
# have debug sections that are considered to be obsolete by gdb.
CTF_STRIP_DEBUG = 0
endif

# Link-editor option for CTF generation
ifeq ($(strip $(CTF_MODE)),off)
ZCTF_LDFLAGS.studio =
ZCTF_LDFLAGS.gcc =
else ifeq ($(strip $(CTF_MODE)),on)
ZCTF_LDFLAGS.studio =		-zctf=compress,convert,ignore-non-c,require
ZCTF_LDFLAGS.gcc =		-zctf=compress,ignore-non-c,require
else ifeq ($(strip $(CTF_MODE)),relaxed)
ZCTF_LDFLAGS.studio =		-zctf=compress,convert,ignore-non-c
ZCTF_LDFLAGS.gcc =		-zctf=compress,ignore-non-c
else
$(error invalid CTF_MODE, expect on, off, or relaxed: $(CTF_MODE))
endif
ZCTF_LDFLAGS = $(ZCTF_LDFLAGS.$(COMPILER))

# Link-editor option for dropping dwarf sections due to CTF generation
ifeq ($(strip $(CTF_STRIP_DEBUG)),0)
ZCTF_STRIP.studio =
ZCTF_STRIP.gcc =
else ifeq ($(CTF_STRIP_DEBUG),1)
ZCTF_STRIP.studio =	-zstrip-class=debug
ZCTF_STRIP.gcc =
else
$(error invalid CTF_STRIP_DEBUG, expect 1 or 0: $(CTF_STRIP_DEBUG))
endif
ZCTF_STRIP = $(ZCTF_STRIP.$(COMPILER))

# If CTF generation is enabled, set up the necessary macros to pass
# options to the compiler and link-editor.
ifneq ($(strip $(CTF_MODE)),off)
ZCTF_CFLAGS.gcc =	-gctf
CFLAGS.gcc +=		$(ZCTF_CFLAGS.gcc)
CXXFLAGS.gcc +=		$(ZCTF_CFLAGS.gcc)

ZCTF_CFLAGS.studio =	-g
CFLAGS.studio +=	$(ZCTF_CFLAGS.studio)
CXXFLAGS.studio +=	$(ZCTF_CFLAGS.studio)

LD_EXEC_OPTIONS +=	$(ZCTF_LDFLAGS) $(ZCTF_STRIP)
LD_PIE_OPTIONS +=	$(ZCTF_LDFLAGS) $(ZCTF_STRIP)
LD_SHARED_OPTIONS +=	$(ZCTF_LDFLAGS) $(ZCTF_STRIP)
endif

# Environment variables and arguments passed into the build and install
# environment(s).  These are the initial settings.
COMPONENT_BUILD_ENV= \
    LD_OPTIONS="$(LD_OPTIONS)" \
    LD_EXEC_OPTIONS="$(LD_EXEC_OPTIONS)" \
    LD_PIE_OPTIONS="$(LD_PIE_OPTIONS)" \
    LD_SHARED_OPTIONS="$(LD_SHARED_OPTIONS)"

COMPONENT_INSTALL_ENV= \
    LD_OPTIONS="$(LD_OPTIONS)" \
    LD_EXEC_OPTIONS="$(LD_EXEC_OPTIONS)" \
    LD_PIE_OPTIONS="$(LD_PIE_OPTIONS)" \
    LD_SHARED_OPTIONS="$(LD_SHARED_OPTIONS)"

# Add any bit-specific settings
COMPONENT_BUILD_ENV += $(COMPONENT_BUILD_ENV.$(BITS))
COMPONENT_BUILD_ARGS += $(COMPONENT_BUILD_ARGS.$(BITS))
COMPONENT_INSTALL_ENV += $(COMPONENT_INSTALL_ENV.$(BITS))
COMPONENT_INSTALL_ARGS += $(COMPONENT_INSTALL_ARGS.$(BITS))

# declare these phony so that we avoid filesystem conflicts.
.PHONY:	prep build install publish test system-test clean clobber parfait \
	check_rtime check_anitya

# If there are no tests to execute
NO_TESTS =	test-nothing
test-nothing:
	@echo "There are no tests available at this time."

# If the system tests are not implemented yet
SYSTEM_TESTS_NOT_IMPLEMENTED = no-sys-tests
no-sys-tests:
	@echo "The system test target is not yet implemented."

# There are tests, but we're skipping them.
SKIP_TEST =	skip-test
skip-test:
	@echo "Skipping tests"

# check_rtime script from onbld to check binaries are built with the right
# linker flags
ifneq ($(COMPONENT_DIR),$(WS_COMPONENTS))
COMPONENT_CHECK_RTIME_EXCEPTIONS ?= $(BUILD_DIR)/check_rtime.$(MACH)
COMPONENT_CHECK_RTIME_ENV	 += PATH="$(PATH):$(ONBLD_BIN)"
COMPONENT_CHECK_RTIME_ARGS	 += -e $(COMPONENT_CHECK_RTIME_EXCEPTIONS)
COMPONENT_CHECK_RTIME_ARGS	 += -d $(PROTO_DIR) -w $(PROTO_DIR)
COMPONENT_CHECK_RTIME_ARGS	 += -m -o -s

check_rtime: install
	@if [ -d $(PROTO_DIR) ] ; then \
		$(CAT) -s $(WS_TOP)/exception_lists/check_rtime \
			$(COMPONENT_TEST_RESULTS_DIR)/check_rtime > \
			$(COMPONENT_CHECK_RTIME_EXCEPTIONS) ; \
		$(ENV) $(COMPONENT_CHECK_RTIME_ENV) $(ONBLD_BIN)/check_rtime \
			$(COMPONENT_CHECK_RTIME_ARGS) $(PROTO_DIR) ; \
	else \
		echo "No PROTO_DIR found for check_rtime to check" ; \
	fi
endif

# default behaviour for 'component-hook' target is to echo the component
# name and version information, but more complex behaviour can be implemented
# via command line setting of the COMPONENT_HOOK macro.
COMPONENT_HOOK ?=	echo $(COMPONENT_NAME) $(COMPONENT_VERSION)

component-hook:
	@$(COMPONENT_HOOK)

# Display current information about a component from the Antiya database
# at https://release-monitoring.org/
ifneq ($(COMPONENT_DIR),$(WS_COMPONENTS))
ANITYA_SUFFIXES = $(subst COMPONENT_ANITYA_ID_,, $(filter COMPONENT_ANITYA_ID_%, $(.VARIABLES)))
ANITYA_API_URL = https://release-monitoring.org/api/project

define anitya-recipe
	@ print '# $(COMPONENT_NAME$(1)) $(COMPONENT_VERSION$(1))'
	@ print '# $(COMPONENT_PROJECT_URL$(1))'
	@ if [[ -n "$(COMPONENT_ANITYA_ID$(1):N/A=)" ]] ; then \
		print '# $(ANITYA_API_URL)/$(COMPONENT_ANITYA_ID$(1))'; \
		curl -s $(ANITYA_API_URL)/$(COMPONENT_ANITYA_ID$(1)) ; \
		print ; \
	else \
		print '# COMPONENT_ANITYA_ID$(1) = $(COMPONENT_ANITYA_ID$(1))' ;\
	fi

endef

check_anitya:
	$(call anitya-recipe,)
	$(foreach suffix, $(ANITYA_SUFFIXES), \
		$(call anitya-recipe,_$(suffix)))
endif

CLEAN_PATHS +=	$(BUILD_DIR)
CLOBBER_PATHS +=	$(PROTO_DIR)

ifneq ($(strip $(BUILD_BITS)),NO_ARCH)
# Only a default dependency if component being built produces binaries.

ifeq ($(COMPILER),gcc)
REQUIRED_PACKAGES += developer/gcc-$(subst /usr/gcc/,,$(GCC_ROOT))
endif

# We do not add studio compiler to required packages as it is not part of
# solaris publisher. That means that developer/opensolaris/userland would
# not be installable without having studio publisher configured.

# Almost all components need libc and linker, so let's add that
# requirements to all components which do NOT declare
# BUILD_BITS=NO_ARCH.
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/linker
endif

# Almost all components have some sort of shell script, so let's
# add that requirement to all components here.
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93

include $(WS_MAKE_RULES)/environment.mk

# A simple rule to print the value of any macro.  Ex:
#   $ gmake print-REQUIRED_PACKAGES
# Note that some macros are set on a per target basis, so what you see
# is not always what you get.
print-%:
	@echo '$(subst ','\'',$*=$($*)) (origin: $(origin $*), flavor: $(flavor $*))'
