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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
include ../../make-rules/shared-macros.mk

PATH=$(dir $(CC)):$(USRBINDIR):$(GNUBIN)

COMPONENT_NAME=		gpgme
COMPONENT_VERSION=	1.11.1
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_PROJECT_URL=	http://www.gnupg.org/related_software/gpgme/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:2d1b111774d2e3dd26dcd7c251819ce4ef774ec5e566251eb9308fa7542fbd6f
COMPONENT_ARCHIVE_URL=	https://www.gnupg.org/ftp/gcrypt/gpgme/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=	utility/gnupg
COMPONENT_ANITYA_ID=	1239

TPNO=			42836

# Although building and running the GpgME tests is enabled, GpgME's
# Test Harness is not suitable for running in an automated test
# environment. The GpgME tests require interactive, manual input
# from the tty as well as system configuration changes.
# The GpgME Test Harness can only be run manually, and interactively
# from a terminal.
TEST_TARGET= $(SKIP_TEST)
include $(WS_MAKE_RULES)/common.mk

# Enable C99 mode + -Xc for its additional warnings.
studio_C99MODE = -Xc $(studio_C99_ENABLE)

# -xinline=%auto -- we like inlining where appropriate
CFLAGS += -xinline=%auto

# -xbuiltin=%none -- builtins have been known to be buggy
CFLAGS += -xbuiltin=%none

CFLAGS += $(CPP_LARGEFILES)
CFLAGS += $(XPG6MODE)
CFLAGS += $(CPP_POSIX)
CFLAGS += $(CPP_C99_EXTENDED_MATH)
CFLAGS += $(studio_PIC)

# Needed to apply changes to *.am files
# Please note that the autoreconf invocation expects GNU version of head(1) and
# maybe others, wo we need to prepend the path
COMPONENT_PREP_ACTION = (cd $(@D) ; PATH=/usr/gnu/bin:$$PATH autoreconf -fiv)

CONFIGURE_ENV +=	INSTALL="$(INSTALL)"

CONFIGURE_OPTIONS  +=		--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS  +=		--infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS  +=		--enable-shared
CONFIGURE_OPTIONS  +=		--disable-static
CONFIGURE_OPTIONS  +=		--disable-silent-rules
CONFIGURE_OPTIONS  +=		--with-gpg-error-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--enable-largefile
CONFIGURE_OPTIONS  +=		--enable-gpg-test
CONFIGURE_OPTIONS  +=		--enable-gpgsm-test
CONFIGURE_OPTIONS  +=		--enable-gpgconf-test
CONFIGURE_OPTIONS  +=		--with-libgpg-error-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-libassuan-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-pic

# Please see comments in patches/GNUPGHOME.patch
GNUPG_HOME_DIR = GNUPGHOME
GNUPG_HOME_LINK = LINK
COMPONENT_PRE_BUILD_ACTION += ( \
    set -x; \
    DEST="$(@D)/$(GNUPG_HOME_DIR)"; \
    LINK="$$(mktemp)"; \
    echo "$$LINK" | tee "$(@D)/$(GNUPG_HOME_LINK)"; \
    $(RM) "$$DEST" "$$LINK"; \
    $(MKDIR) "$$DEST"; \
    ln -s "$$DEST" "$$LINK"; \
);

COMPONENT_POST_BUILD_ACTION += ( \
    set -x; \
    LINK="$$(< "$(@D)/$(GNUPG_HOME_LINK)")"; \
    [ -z "$$LINK" ] || $(RM) "$$LINK"; \
);

COMPONENT_BUILD_ARGS += GNUPGHOME="$$(< "$(@D)/$(GNUPG_HOME_LINK)")"

REQUIRED_PACKAGES += library/security/libassuan
REQUIRED_PACKAGES += library/security/libgpg-error
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
