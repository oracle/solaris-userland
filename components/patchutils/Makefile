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
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		patchutils
COMPONENT_VERSION=	0.3.4
IPS_PKG_NAME=		text/patchutils
COMPONENT_PROJECT_URL=	http://cyberelk.net/tim/patchutils/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:cf55d4db83ead41188f5b6be16f60f6b76a87d5db1c42f5459d596e81dabe876
COMPONENT_ARCHIVE_URL=	http://cyberelk.net/tim/data/patchutils/stable/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sig
COMPONENT_ANITYA_ID=	2599

TPNO=			35972

include $(WS_MAKE_RULES)/common.mk

# The tests really expect bash, which is not our /bin/sh; this is simpler than
# patching each one individually.
COMPONENT_PREP_ACTION += \
	$(FIND) $(SOURCE_DIR)/tests -name run-test | \
	    xargs $(GSED) -i -e '1s,!/bin/sh,!/bin/bash,'

# If xmlto isn't available, all manpages are elided from the makefile, even
# though they've been pre-generated and delivered in the source tarball.  If we
# override the xmlto discovery, everything just works.
CONFIGURE_OPTIONS +=	ac_cv_path_XMLTO=/bin/true

# Make sure we use GNU diff.  We should use GNU patch, as well, but
# /usr/bin/patch already is GNU patch.
CONFIGURE_OPTIONS +=	--with-diff=gdiff

COMPONENT_TEST_ARGS +=	TEST_SUITE_LOG=$(COMPONENT_TEST_OUTPUT)
COMPONENT_TEST_ENV +=	DIFF=gdiff

COMPONENT_TEST_TRANSFORMS += \
	'-e "s|$(BUILD_DIR)|\\$$(BUILD_DIR)|g"' \
	'-e "s|$(MACH64)|\\$$(MACH64)|g"' \
	'-e "1,3s|==*|=====================================================================|"'

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += text/gnu-diffutils
REQUIRED_PACKAGES += text/gnu-patch
