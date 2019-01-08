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
# Copyright (c) 2011, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		binutils
COMPONENT_VERSION=	2.32
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:0ab6c55dd86a92ed561972ba15b9b70a8b9f75557f896446c82e8b36e473ee04
COMPONENT_BUGDB=	utility/gnu-binutils
COMPONENT_ANITYA_ID=	7981

TPNO=			49258

#
# for platform and cross platform support
#
VARIANTS =	$(BUILD_DIR_64) $(BUILD_DIR_64)-cross

CONFIGURE_64 =	$(VARIANTS:%=%/.configured)
BUILD_64 =	$(VARIANTS:%=%/.built)
INSTALL_64 =	$(VARIANTS:%=%/.installed)

$(BUILD_DIR_64)-cross/.configured: CONFIGURE_OPTIONS += --target=$(CROSS_ARCH)


TEST_TARGET= $(TEST_64)
include $(WS_MAKE_RULES)/gnu-component.mk

IPS_COMPONENT_VERSION=	2.32.0

export PATH=$(dirname $(CC)):$(GNUBIN):/usr/bin
COMPONENT_TEST_ARGS += -k
COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master

# Keep only the test results.  Details are always in the build directory
COMPONENT_TEST_TRANSFORMS += \
	'-n '\
	'-e "/^\# of/p" '\
	'-e "/Summary =/p" '

PARCH =		$(MACH:i386=x86_64-pc)
GNU_ARCH =	$(PARCH:sparc=sparcv9-sun)-solaris$(SOLARIS_VERSION)

CROSS_ARCH_ =	$(MACH:i386=sparcv9-sun)
CROSS_ARCH =	$(CROSS_ARCH_:sparc=x86_64-pc)-solaris$(SOLARIS_VERSION)

CROSS_MACH_ =	$(CROSS_ARCH:sparcv9%=sparc)
CROSS_MACH =	$(CROSS_MACH_:x86_64%=i386)

PKG_MACROS +=	CROSS_ARCH="$(CROSS_ARCH)"
PKG_MACROS +=	CROSS_MACH="$(CROSS_MACH)"

# Set GNU_ARCH differently based on whether we're mogrifying the cross-build
# package or not, so that we can share a single manifest across both packages.
$(MANIFEST_BASE)-%.mogrified: PKG_MACROS += GNU_ARCH=$(GNU_ARCH)
$(MANIFEST_BASE)-binutils-cross-MACH.mogrified: PKG_MACROS += GNU_ARCH=$(CROSS_ARCH)

CONFIGURE_PREFIX =	$(USRDIR)/gnu

CONFIGURE_OPTIONS +=    --mandir=$(CONFIGURE_MANDIR)
CONFIGURE_OPTIONS +=    --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS +=    --disable-gold
CONFIGURE_OPTIONS +=    --disable-libtool-lock
CONFIGURE_OPTIONS +=    --enable-64-bit-bfd
CONFIGURE_OPTIONS +=    --enable-deterministic-archives
CONFIGURE_OPTIONS +=    --enable-host-shared
CONFIGURE_OPTIONS +=    --enable-largefile
CONFIGURE_OPTIONS +=    --enable-nls
CONFIGURE_OPTIONS +=    --enable-plugins
CONFIGURE_OPTIONS +=    --with-system-zlib
CONFIGURE_OPTIONS +=    --with-sysroot
CONFIGURE_OPTIONS +=    --build=$(GNU_ARCH)

REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/flex-runtime
