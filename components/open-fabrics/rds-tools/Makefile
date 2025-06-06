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
# Copyright (c) 2011, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../ofed-component-macros.mk

COMPONENT_NAME=		rds-tools
COMPONENT_VERSION=	2.0.4
COMPONENT_ARCHIVE_HASH=	\
    sha256:31b5924f73bed59e513470586c69ebe92eeb708fcc61a0519045fcf7954233a3
COMPONENT_BUGDB=	utility/ofuv_tools
COMPONENT_ANITYA_ID=	17143

include ../ofed-component.mk

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-int-conversion

CPPFLAGS +=	-I$(PROTOUSRINCDIR)
CFLAGS +=	-O2 -Wall -D_XOPEN_SOURCE=500 -D__EXTENSIONS__ $(CPPFLAGS)

LIBS +=	-llgrp -lkstat -libverbs

COMPONENT_PREP_ACTION = \
	cp rds-vendor.c $(@D)/

CLEANUP_DIRS =	$(PROTOUSRBINDIR)/net

CLEANUP_FILES =\
	$(PROTO_DIR)/$(CONFIGURE_MANDIR)/man7/rds.7\
	$(PROTO_DIR)/$(CONFIGURE_MANDIR)/man7rds-rdma.7

COMPONENT_POST_INSTALL_ACTION =\
	$(RM) $(CLEANUP_FILES);\
	$(RM) $(CLEANUP_DIRS)

COMPONENT_BUILD_ENV += CFLAGS="$(CFLAGS)"
COMPONENT_INSTALL_ENV += INSTALL=$(INSTALL)

COMPONENT_PRE_CONFIGURE_ACTION =	($(CLONEY) $(SOURCE_DIR) $(@D))

