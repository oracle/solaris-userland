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
# Copyright (c) 2018, 2024, Oracle and/or its affiliates.
#
# gnupth only delivers scripts that embed paths, so prefer 32-bit.
BUILD_BITS= 32_and_64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		npth
COMPONENT_VERSION=	1.7
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:8589f56937b75ce33b28d312fccbf302b3b71ec3f3945fde6aaa74027914ad05
COMPONENT_BUGDB=	library/pth
COMPONENT_ANITYA_ID=	2505

COMPONENT_ARCHIVE_URL=https://gnupg.org/ftp/gcrypt/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=$(COMPONENT_ARCHIVE_URL).sig

COMPONENT_BAID=		168893

include $(WS_MAKE_RULES)/gnu-component.mk

# Enable C99 mode + -Xc for its additional warnings.
CFLAGS += -std=gnu99

# -xbuiltin=%none -- builtins have been known to be buggy
CFLAGS += -fno-builtin

CFLAGS += -D_XPG6
CFLAGS += $(CPP_POSIX)
CFLAGS += -fPIC

CPPFLAGS += $(CPP_LARGEFILES) $(CPP_POSIX)

LDFLAGS =	-lpthread -lposix4 -lrt

CONFIGURE_OPTIONS  +=	--localstatedir=$(VARDIR)
CONFIGURE_OPTIONS  +=	--with-pic
CONFIGURE_OPTIONS  +=	--enable-install-npth-config

CONFIGURE_ENV += LD="$(CC) $(CFLAGS) $(LDFLAGS)"
CONFIGURE_ENV += CPP="$(CC) $(CPPFLAGS) $(CFLAGS) -E"
CONFIGURE_ENV += INSTALL="$(INSTALL)"

COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-e "s|\(^Pth:\).*|\1|" '

REQUIRED_PACKAGES += shell/ksh93
