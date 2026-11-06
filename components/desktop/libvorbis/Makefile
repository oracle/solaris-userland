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

BUILD_BITS= 		32_and_64
include ../../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		libvorbis
COMPONENT_VERSION=	1.3.7.20260803
# Upstream still installs the generated documentation under its base version.
COMPONENT_BASE_VERSION=$(shell echo $(COMPONENT_VERSION) | $(GSED) -e 's/\.[0-9]\{8\}$$//')
COMPONENT_PROJECT_URL=	https://xiph.org/vorbis/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
GIT_REPO=		https://github.com/xiph/vorbis.git
GIT_COMMIT_ID=		1b75110b5a2754ba1931d82dd83cb822b266a21d
GIT_HASH=		sha256:c618497082a1e2225c59a423b9e670107098ba173c451d5df3bff6c574c0e3d4
COMPONENT_BUGDB=	gnome/multimedia
COMPONENT_ANITYA_ID=	1758

COMPONENT_BAID=		465493

PKG_MACROS +=		COMPONENT_BASE_VERSION=$(COMPONENT_BASE_VERSION)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PRE_CONFIGURE_ACTION += (cd $(SOURCE_DIR); ./autogen.sh) ;

CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS = -k -i
# Ignore configure/build chatter and the variable number of codebook headers.
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/^Testing [1-8] channel/p" ' \
        '-e "/ : ok$$/p" '

CBE_PACKAGES += developer/documentation-tool/doxygen

REQUIRED_PACKAGES += codec/libogg
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/math
