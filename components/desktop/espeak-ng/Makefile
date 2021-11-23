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
# Copyright (c) 2016, 2022, Oracle and/or its affiliates.
#

# parfait doesn't like sketchy code (25158912)
export PARFAIT_BUILD=no

BUILD_BITS=		64
# For now, all things built for C++11 require gcc.
COMPILER =		gcc

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1
include ../../../make-rules/shared-macros.mk

GIT_REPO=		https://github.com/espeak-ng/espeak-ng
GIT_COMMIT_ID=		0577cd9
GIT_HASH= sha256:457a6739e6a05f026fcf64a46776394e2a55aba705a4440e9193caad9b87fbf2

COMPONENT_NAME=		espeak-ng
COMPONENT_VERSION=	1.50
COMPONENT_PROJECT_URL=	https://github.com/espeak-ng/espeak-ng
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)-$(GIT_COMMIT_ID)
COMPONENT_BUGDB=	gnome/accessibility
COMPONENT_ANITYA_ID=	12958
COMPONENT_BAID= 	115279

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION += (cd $(SOURCE_DIR); ./autogen.sh) ;
COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR) $(@D)) ;

CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

CFLAGS.sparc += -DBYTE_ORDER=BIG_ENDIAN
CFLAGS += $(CFLAGS.$(MACH))

REQUIRED_PACKAGES += library/audio/pcaudiolib
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
