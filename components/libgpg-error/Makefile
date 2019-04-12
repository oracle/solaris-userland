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
# Copyright (c) 2010, 2019, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64_and_32
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libgpg-error
COMPONENT_VERSION=	1.36
COMPONENT_PROJECT_URL=  https://gnupg.org/software/libgpg-error/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.bz2
COMPONENT_ARCHIVE_HASH= \
    sha256:babd98437208c163175c29453f8681094bcaf92968a15cafb1a276076b33c97c
COMPONENT_ARCHIVE_URL=  https://gnupg.org/ftp/gcrypt/$(COMPONENT_NAME)/$(COMPONENT_ARCHIVE)

COMPONENT_BUGDB=	library/libgpg-error
COMPONENT_ANITYA_ID=	1628

TPNO=			50966

COMPONENT_BUILD_TARGETS = all info

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += --infodir=$(CONFIGURE_INFODIR)
CONFIGURE_OPTIONS += --enable-threads=posix

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

include ../../make-rules/shared-targets.mk

REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
