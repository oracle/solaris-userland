#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2016, 2026, Oracle and/or its affiliates.
#

# parfait doesn't like sketchy code (25158912)
export PARFAIT_BUILD=no

BUILD_BITS=		64
# For now, all things built for C++11 require gcc.

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1
include ../../../make-rules/shared-macros.mk

GIT_COMMIT_ID=		a6ad07d4d7b58194ae671809bf194bc0ce967af9
COMPONENT_ARCHIVE_HASH= sha256:dda54c4da27a318840a5430729776d4135816692aee0123a85cc82c21c05047b
COMPONENT_ARCHIVE_URL= https://codeload.github.com/espeak-ng/espeak-ng/tar.gz/$(GIT_COMMIT_ID)

COMPONENT_NAME=		espeak-ng
COMPONENT_VERSION=	1.53.0.20261103
COMPONENT_PROJECT_URL=	https://github.com/espeak-ng/espeak-ng
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_POST_UNPACK_ACTION= ( $(MV) espeak-ng-$(GIT_COMMIT_ID) $(COMPONENT_SRC))
COMPONENT_BUGDB=	gnome/accessibility
COMPONENT_ANITYA_ID=	12958
COMPONENT_BAID= 	465771

BUILD_STYLE= cmake

CMAKE_OPTIONS += -DBUILD_SHARED_LIBS=ON
CMAKE_OPTIONS += -DCMAKE_INSTALL_LIBDIR="lib/$(MACH64)"
CMAKE_OPTIONS += -DUSE_MBROLA=ON
CMAKE_OPTIONS += -DUSE_LIBPCAUDIO=ON
CMAKE_OPTIONS += -DUSE_LIBSONIC=OFF
CMAKE_OPTIONS += -DESPEAK_BUILD_MANPAGES=OFF

include $(WS_MAKE_RULES)/common.mk

# Upstream's shell tests use GNU grep options.
COMPONENT_TEST_ENV += PATH="$(GNUBIN):$(PATH)"

CFLAGS.sparc += -DBYTE_ORDER=BIG_ENDIAN
CFLAGS += $(CFLAGS.$(MACH))

REQUIRED_PACKAGES += library/audio/pcaudiolib
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
