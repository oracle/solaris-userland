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
# Copyright (c) 2009, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		rsync
COMPONENT_VERSION=	3.1.3
COMPONENT_PROJECT_URL=	http://rsync.samba.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:55cc554efec5fdaad70de921cd5a5eeb6c29a95524c715f3bbf849235b0800c0
COMPONENT_ARCHIVE_URL=	http://rsync.samba.org/ftp/rsync/src/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	4217

TPNO=			44283

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS  +=		SHELL_PATH=$(BINDIR)/sh
CONFIGURE_OPTIONS  +=		--with-included-popt
CONFIGURE_OPTIONS  +=		--enable-xattr-support
CONFIGURE_OPTIONS  +=		--with-included-zlib=no

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/passed$$/p" ' \
	'-e "/skipped$$/p" '

REQUIRED_PACKAGES += library/zlib
