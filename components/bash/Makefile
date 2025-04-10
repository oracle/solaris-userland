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
# Copyright (c) 2011, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		bash
COMPONENT_VERSION=	5.2
COMPONENT_ARCHIVE_HASH = \
    sha256:d287cbdfc2ebd175d574901baa925bda80907a5aaa5261b6cfa24b7484635241
COMPONENT_ANITYA_ID=	166

COMPONENT_BAID=		178911

include $(WS_MAKE_RULES)/gnu-component.mk

# Avoid running configure again during the build due to patches to
# configure-related files by running autoconf before we run configure.
COMPONENT_PREP_ACTION += (cd $(@D); autoconf)

BASH_PATCHLEVEL=$(shell grep -h "define PATCHLEVEL" $(COMPONENT_DIR)/patches/bash* | $(NAWK) '{print $$NF}' | sort -n | tail -1)
IPS_COMPONENT_VERSION = $(COMPONENT_VERSION).$(BASH_PATCHLEVEL)
PATCH_LEVEL = 0

PKG_PROTO_DIRS += $(COMPONENT_DIR)/Solaris

# Enable C99 mode + -Xc for its additional warnings.
studio_C99MODE = -Xc $(studio_C99_ENABLE)

# Use the maximum number of registers on sparc since we have no libraries
studio_XREGS.sparc = -xregs=appl

# 8 byte memory alignment + interpretation of non-alignment instead of SIGBUS
studio_ALIGN.sparc.32 = -xmemalign=8i
studio_ALIGN.sparc.64 = -xmemalign=16i

# -xinline=%auto -- we like inlining where appropriate
CFLAGS += -xinline=%auto

# -xbuiltin=%none -- builtins have been known to be buggy
CFLAGS += -xbuiltin=%none

CFLAGS += $(XPG6MODE)
CFLAGS += $(CPP_C99_EXTENDED_MATH)
CFLAGS += -I$(USRINCDIR)/ncurses

# -z redlocsym -- let's shrink the SHT_SYMTAB as much as we can
LDFLAGS =	$(LD_Z_REDLOCSYM)

# Ignore tgetent() checks in configure and use libncurses on Solaris.
CONFIGURE_ENV += ac_cv_func_tgetent=yes
CONFIGURE_ENV += ac_cv_lib_termcap_tgetent=no
CONFIGURE_ENV += ac_cv_lib_curses_tgetent=no
CONFIGURE_ENV += ac_cv_lib_ncurses_tgetent=yes
CONFIGURE_ENV += bash_cv_termcap_lib=libncurses

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
CONFIGURE_OPTIONS += --enable-separate-helpfiles
CONFIGURE_OPTIONS += --enable-single-help-strings
CONFIGURE_OPTIONS += --enable-static-link
CONFIGURE_OPTIONS += --enable-usg-echo-default=yes
CONFIGURE_OPTIONS += --enable-xpg-echo-default=yes
CONFIGURE_OPTIONS += --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)
CONFIGURE_OPTIONS += --with-bash-malloc=yes
CONFIGURE_OPTIONS += --with-curses
CONFIGURE_OPTIONS += --with-installed-readline=no

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

# Due to a bug in Makefile gmake tries to remake few targets after application
# of upstream patches. Following transform removes build related lines from the
# test output.
COMPONENT_TEST_TRANSFORMS += "-e '/^rm -f/,/^[[:digit:]]\+[[:space:]].*bash$$/d'"

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
