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
# Prefer 32-bit as only "binary" delivered is a script with embedded paths.
BUILD_BITS =		32_and_64
CTF_MODE =		relaxed
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libksba
COMPONENT_VERSION=	1.6.7
COMPONENT_PROJECT_URL=	http://www.gnupg.org/related_software/libksba/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:cf72510b8ebb4eb6693eef765749d83677a03c79291a311040a5bfd79baab763
COMPONENT_ARCHIVE_URL=	https://www.gnupg.org/ftp/gcrypt/libksba/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_BUGDB=	utility/gnupg
COMPONENT_ANITYA_ID=	1649

COMPONENT_BAID=		178873

include $(WS_MAKE_RULES)/common.mk

# The compilation sometimes internally uses CC_FOR_BUILD which does not pass
# our PIE flags. This is workaround for that
COMPONENT_BUILD_ARGS += CC_FOR_BUILD='$(CC) $(CONFIGURE_CPPFLAGS) $(CC_PIC_ENABLE)'

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

COMPONENT_TEST_MASTER = \
	$(COMPONENT_TEST_RESULTS_DIR)/results-libksba.master

CONFIGURE_ENV +=	INSTALL="$(INSTALL)"

CONFIGURE_OPTIONS  +=		--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS  +=		--infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS  +=		--enable-shared
CONFIGURE_OPTIONS  +=		--disable-static
CONFIGURE_OPTIONS  +=		--disable-silent-rules
CONFIGURE_OPTIONS  +=		--with-gpg-error-prefix=$(CONFIGURE_PREFIX)
CONFIGURE_OPTIONS  +=		--with-pic

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

REQUIRED_PACKAGES += library/security/libgpg-error
REQUIRED_PACKAGES += shell/ksh93
