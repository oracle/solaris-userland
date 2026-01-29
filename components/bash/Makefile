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
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		bash
COMPONENT_VERSION=	5.3
COMPONENT_ARCHIVE_HASH = \
    sha256:5875e8d8328321cef4ae6ccc8d37bc6b4161bcf7e6cd7a5356aa735950c7113a
COMPONENT_ANITYA_ID=	166

COMPONENT_BAID=		344221

include $(WS_MAKE_RULES)/gnu-component.mk

# Avoid running configure again during the build due to patches to
# configure-related files by running autoconf before we run configure.
COMPONENT_PREP_ACTION += (cd $(@D); autoconf)

BASH_PATCHLEVEL=$(shell grep -h "define PATCHLEVEL" $(COMPONENT_DIR)/patches/bash* 2>/dev/null | $(NAWK) '{print $$NF}' | sort -n | tail -1)
ifneq ($(strip $(BASH_PATCHLEVEL)),)
# Modify IPS_COMPONENT_VERSION only if there are any patches available
IPS_COMPONENT_VERSION = $(COMPONENT_VERSION).$(BASH_PATCHLEVEL)
endif

# Bash releases updates as patches which are supposed to be applied with -p0.
PATCH_LEVEL = 0

PKG_PROTO_DIRS += $(COMPONENT_DIR)/Solaris

# -z redlocsym -- let's shrink the SHT_SYMTAB as much as we can
LDFLAGS =	$(LD_Z_REDLOCSYM)

CONFIGURE_OPTIONS += --disable-profiling
CONFIGURE_OPTIONS += --disable-strict-posix-default
CONFIGURE_OPTIONS += --enable-alias
CONFIGURE_OPTIONS += --enable-arith-for-command
CONFIGURE_OPTIONS += --enable-array-variables
CONFIGURE_OPTIONS += --enable-bang-history
CONFIGURE_OPTIONS += --enable-brace-expansion
CONFIGURE_OPTIONS += --enable-casemod-attributes
CONFIGURE_OPTIONS += --enable-casemod-expansions
CONFIGURE_OPTIONS += --enable-command-timing
CONFIGURE_OPTIONS += --enable-cond-command
CONFIGURE_OPTIONS += --enable-cond-regexp
CONFIGURE_OPTIONS += --enable-coprocesses
# test1.sub fails if following option is not enabled
CONFIGURE_OPTIONS += --enable-dev-fd-stat-broken
CONFIGURE_OPTIONS += --enable-debugger
CONFIGURE_OPTIONS += --enable-directory-stack
CONFIGURE_OPTIONS += --enable-disabled-builtins
CONFIGURE_OPTIONS += --enable-dparen-arithmetic
CONFIGURE_OPTIONS += --enable-extended-glob
CONFIGURE_OPTIONS += --enable-help-builtin
CONFIGURE_OPTIONS += --enable-history
CONFIGURE_OPTIONS += --enable-job-control
CONFIGURE_OPTIONS += --enable-largefile
CONFIGURE_OPTIONS += --enable-mem-scramble
CONFIGURE_OPTIONS += --enable-multibyte
CONFIGURE_OPTIONS += --enable-net-redirections
CONFIGURE_OPTIONS += --enable-nls
CONFIGURE_OPTIONS += --enable-process-substitution
CONFIGURE_OPTIONS += --enable-progcomp
CONFIGURE_OPTIONS += --enable-prompt-string-decoding
CONFIGURE_OPTIONS += --enable-readline
CONFIGURE_OPTIONS += --enable-restricted
CONFIGURE_OPTIONS += --enable-select
CONFIGURE_OPTIONS += --enable-single-help-strings
CONFIGURE_OPTIONS += --enable-usg-echo-default=yes
CONFIGURE_OPTIONS += --enable-xpg-echo-default=yes
CONFIGURE_OPTIONS += --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)
CONFIGURE_OPTIONS += --with-bash-malloc=yes
CONFIGURE_OPTIONS += --with-curses
CONFIGURE_OPTIONS += --with-installed-readline=no

# The directory examples/loadables does contain bash modules. The modules do
# use symbols from running bash. But since bash is a binary the modules can not
# link to it (there is no libbash.so, just bash binary). Because of that the
# modules must be linked without the linker option -zdefs. This is achieved by
# the patch link-modules.patch. Slight problem is that there is a different
# code path in bash's Makefile to compile/link the modules. One is target
# 'loadables' the other is in target 'install'. It fits our infrastructure
# better to build everything in our 'build' step. So we need to force the
# modules to be built too with the rest of bash. Which is why we specify the
# additional 'loadables' target here:
COMPONENT_BUILD_TARGETS=all loadables

COMPONENT_TEST_DIR		= $(BUILD_DIR_64)
COMPONENT_TEST_ENV		= - $(TEST_PATH)
# The bash test harness needs the GNU userland utilities
TEST_PATH	= "PATH=$(GNUBIN):$(USRBINDIR)"
# Results output is slightly different on Intel vs. SPARC.
COMPONENT_TEST_MASTER		= \
    $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master

# Bash tests can't pass if they don't have tty available. This script makes
# sure to provide a tty if we are missing one
COMPONENT_TEST_CMD = $(COMPONENT_DIR)/bash_test_wrapper

# If the tests decided they need to execute itself in screen(1) then move the
# resulting file to final location where the rest of userland infrastructure
# will process it
COMPONENT_POST_TEST_ACTION += \
    if [ -e "$(COMPONENT_TEST_DIR)/outfile" ]; then \
	mv $(COMPONENT_TEST_DIR)/outfile $(COMPONENT_TEST_OUTPUT); \
    fi

COMPONENT_POST_INSTALL_ACTION += \
	( cd $(PROTOUSRSHAREDIR)/locale ; \
	    cp -Rp "en@boldquot" en ; \
	    cp -Rp "en@boldquot" en_CA ; \
	    cp -Rp "en@boldquot" en_GB )

REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += terminal/screen
