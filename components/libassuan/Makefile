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

COMPONENT_NAME=		libassuan
COMPONENT_VERSION=	3.0.2
COMPONENT_PROJECT_URL=	http://www.gnupg.org/related_software/libassuan/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:d2931cdad266e633510f9970e1a2f346055e351bb19f9b78912475b8074c36f6
COMPONENT_ARCHIVE_URL=	https://www.gnupg.org/ftp/gcrypt/libassuan/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/gnupg
COMPONENT_ANITYA_ID=	1559

COMPONENT_BAID=		329736

include $(WS_MAKE_RULES)/common.mk

# Some binaries (like mkheader) are built by compiler in CC_FOR_BUILD. That
# does not respect our PIE config so we need to work around it
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
	$(COMPONENT_TEST_RESULTS_DIR)/results-libassuan.master

COMPONENT_TEST_TRANSFORMS += \
     '-e "s/fdpassing\[[0-9]\{1,9\}\]\: //g"' \
     '-e "s/ Pleased to meet you, process [0-9]\{1,9\}//g"' \
     '-e "s/chan_[0-9]\{1,9\}/chan/g"'

CONFIGURE_ENV +=	CFLAGS="$(CFLAGS)"
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
