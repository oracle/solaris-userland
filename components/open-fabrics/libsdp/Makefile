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

COMPONENT_NAME=		libsdp
COMPONENT_VERSION=	1.1.108
COMPONENT_ARCHIVE=	$(COMPONENT_SRC)-0.15.gd7fdb72.tar.gz
COMPONENT_ARCHIVE_HASH=	\
    sha256:b72d4d84c7a02207c261082d1837757f8c131942193ceaf017daf684d61e8be1
COMPONENT_BUGDB=	library/ofuv_lib
COMPONENT_ANITYA_ID=	17142

include ../ofed-component.mk

MAN3FILES = libsdp.3lib
MAN5FILES = libsdp.conf.5

SUFFIX.64 = $(MACH64)

# Required by GCC 14 - needs to be evaluated and properly fixed.
CFLAGS += -Wno-implicit-function-declaration -Wno-incompatible-pointer-types

CFLAGS += -D_POSIX_PTHREAD_SEMANTICS

CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)/infiniband
CONFIGURE_OPTIONS += --libdir=$(USRLIBDIR)/secure/$(SUFFIX.$(BITS))

CLEANUP_DIRS =	$(PROTOUSRBINDIR)/linux
CLEANUP_FILES =\
	$(PROTO_DIR)/$(CONFIGURE_PREFIX)/lib/secure/$(COMPONENT_NAME).la\
	$(PROTO_DIR)/$(CONFIGURE_PREFIX)/lib/secure/$(MACH64)/$(COMPONENT_NAME).la\

COMPONENT_PREP_ACTION = \
	$(MKDIR) $(@D)/man ; \
	cp manpages/$(MAN3FILES) manpages/$(MAN5FILES) $(@D)/man ; \

COMPONENT_POST_INSTALL_ACTION=\
	$(RM) $(CLEANUP_FILES);\
	$(RM) $(CLEANUP_DIRS)

