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
# Copyright (c) 2012, 2020, Oracle and/or its affiliates.
#

# The component does not deliver any architecture specific files but
# many tests fail if NO_ARCH is used since it passes -m32 compiler flag.
# The linker reports an error that it cannot create a 64-bit executable
# from 32-bit object files (flag '-m32' was not passed to the linker).
BUILD_BITS= 64

# We only deliver scripts but unit tests use C++11
# which is better supported by GCC compiler...
COMPILER= gcc

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		automake
COMPONENT_SHORT_VERSION= 1.16
COMPONENT_VERSION=	$(COMPONENT_SHORT_VERSION).3
COMPONENT_ARCHIVE_HASH=	\
    sha256:ce010788b51f64511a1e9bb2a1ec626037c6d0e7ede32c1c103611b9d3cba65f
COMPONENT_ANITYA_ID=	144

TPNO=			63375

include $(WS_MAKE_RULES)/gnu-component.mk

CONFIGURE_OPTIONS += --infodir=$(USRSHAREDIR)/$(COMPONENT_NAME)-$(COMPONENT_SHORT_VERSION)/info
CONFIGURE_OPTIONS += PERL="$(PERL)"

COMPONENT_TEST_ENV += -i
COMPONENT_TEST_ENV += PATH=$(GCC_ROOT)/bin:$(GNUBIN):$(USRBINDIR)
COMPONENT_TEST_ENV += PKG_CONFIG_PATH=/usr/lib/64/pkgconfig

# Directory 'share' is set 000 permissions during the unit tests.
# Revert it to enable a clean removal of build directory.
PRE_CLEAN_ACTION = chmod 755 $(BUILD_DIR)/*/t/uninstall-fail.dir/__inst-dir__/share &> /dev/null || :

PKG_HARDLINKS += usr/bin/aclocal-1.16 usr/bin/automake-1.16
PKG_MACROS += SVER=$(COMPONENT_SHORT_VERSION) LVER=$(COMPONENT_VERSION) MVER=$(COMPONENT_SHORT_VERSION).1

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
