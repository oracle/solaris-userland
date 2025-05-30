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
# Copyright (c) 2011, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk
include $(WS_MAKE_RULES)/shared-targets.mk

COMPONENT_NAME=		zsh
COMPONENT_VERSION=	5.8.1
COMPONENT_PROJECT_URL=	https://www.zsh.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:b6973520bace600b4779200269b1e5d79e5f505ac4952058c11ad5bbf0dd9919
COMPONENT_ARCHIVE_URL=	\
	https://downloads.sourceforge.net/project/zsh/zsh/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_PUBLIC_KEY_URL= https://raw.githubusercontent.com/clearlinux-pkgs/zsh/master/ACF8146CAE8CBBC4.pkey
COMPONENT_ANITYA_ID=	5307

COMPONENT_BAID = 118759

BUILD_TARGET=
INSTALL_TARGET=
include $(WS_MAKE_RULES)/common.mk

# We need to get also the man pages copied, so they can be installed
COMPONENT_PRE_CONFIGURE_ACTION = \
    ($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_LIBDIR.64= $(CONFIGURE_LIBDIR.32)

CONFIGURE_OPTIONS += --enable-cppflags="$(CPP_LARGEFILES)"
CONFIGURE_OPTIONS += --enable-dynamic
CONFIGURE_OPTIONS += --enable-etcdir=$(ETCDIR)
CONFIGURE_OPTIONS += --enable-function-subdirs
# Zsh uses the compiler to link, so we need to pass CC_BITS, not LD_BITS.
CONFIGURE_OPTIONS += --enable-ldflags="$(CC_BITS) -zignore"
CONFIGURE_OPTIONS += --enable-libs="$(LIBNSL)"
CONFIGURE_OPTIONS += --enable-additional-fpath=/usr/share/zsh/vendor-functions/Completion
CONFIGURE_OPTIONS += --enable-maildir-support
CONFIGURE_OPTIONS += --enable-multibyte
CONFIGURE_OPTIONS += --enable-pcre
CONFIGURE_OPTIONS += --with-tcsetpgrp
CONFIGURE_OPTIONS += --disable-gdbm

COMPOVERRIDES = $(shell test -d find && find Completion -type f -print)

$(PROTOETCDIR)/%: % $(PROTOETCDIR)
	$(INS.file)

$(PROTOETCDIR)/zprofile: $(PROTOETCDIR)
	$(RM) $@; $(SYMLINK) profile $@

# The configure test for NIS tests to make sure that NIS is working, not whether
# it's available to compile against.  We actually want to go through the switch
# in all cases, so we force it off, regardless of whether the build environment
# has it enabled.
CONFIGURE_ENV += zsh_cv_sys_nis=no

# Tests need gnu version of grep to work correctly
COMPONENT_TEST_ENV += PATH="$(GNUBIN):$(PATH)"

$(COMPONENT_SRC)/Completion/%: Completion/%
	$(CP) $< $@

# common targets
build:		$(BUILD_64) $(COMPOVERRIDES:%=$(COMPONENT_SRC)/%)

install:	build $(INSTALL_64) $(PROTOETCDIR)/zprofile $(PROTOETCDIR)/zshrc

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
        '-n -e "/^.* successful test scripts, .* failures, .* skipped/p"'

REQUIRED_PACKAGES += library/ncurses
REQUIRED_PACKAGES += library/pcre
REQUIRED_PACKAGES += system/library/math
