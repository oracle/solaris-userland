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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=             64_and_32
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-keyring
COMPONENT_VERSION=	3.34.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Projects/GnomeKeyring
COMPONENT_ARCHIVE_HASH= \
sha256:e9cda9542a3e37c61636145e7e9e2513c569092ea8020752a834e1f40ad41943
COMPONENT_BUGDB=	gnome/security
COMPONENT_ANITYA_ID=	13133

TPNO=			56357

include $(WS_MAKE_RULES)/gnome-component.mk

PAM_MODULE_DIR.32 = $(USRLIBDIR)/security
PAM_MODULE_DIR.64 = $(PAM_MODULE_DIR.32)/$(MACH64)
PAM_MODULE_DIR = $(PAM_MODULE_DIR.$(BITS))

CONFIGURE_OPTIONS += --disable-selinux
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-pam
CONFIGURE_OPTIONS += --enable-shared
CONFIGURE_OPTIONS += --enable-ssh-agent
CONFIGURE_OPTIONS += --with-pam-dir=$(PAM_MODULE_DIR)
CONFIGURE_OPTIONS += --with-pic
# Linux-specific capabilities support.
CONFIGURE_OPTIONS += --without-libcap-ng

# Required due to patches.
COMPONENT_PREP_ACTION += (cd $(@D); autoreconf -fiv);

CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(BITS).master
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMS += \
       '-n ' \
       '-e "/TOTAL:/p" ' \
       '-e "/SKIP:/p" ' \
       '-e "/PASS:/p" ' \
       '-e "/FAIL:/p" ' \
       '-e "/ERROR:/p" '

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gcr
REQUIRED_PACKAGES += network/ssh
REQUIRED_PACKAGES += system/library/pam-core
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/security/libgcrypt

