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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		fetchmail
COMPONENT_VERSION=	6.5.6
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
	sha256:ec10e0e0eaa417313559379ede76c74614766d838b39470b66474863aa690dab
COMPONENT_ARCHIVE_URL=	https://sourceforge.net/projects/$(COMPONENT_NAME)/files/branch_6.5/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://www.fetchmail.info/
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	801

COMPONENT_BAID=	348924

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

include $(WS_MAKE_RULES)/common.mk

# python3.11 only delivers tkinter requested by fetchmailconf.py
# one also requires python3.11 as a min.python version so we are
# clipped on this version
PYTHON_VERSION = 3.11

CONFIGURE_OPTIONS  +=		PYTHON="$(PYTHON)"
CONFIGURE_OPTIONS  +=		--with-kerberos5
CONFIGURE_OPTIONS  +=		--enable-NTLM

COMPONENT_POST_INSTALL_ACTION = \
    $(MV) $(PROTO_DIR)/usr/lib/python$(PYTHON_VERSION)/site-packages/fetchmailconf.py \
          $(PROTO_DIR)/usr/bin/fetchmailconf ; \
    $(call PYTHON_SCRIPT_SHEBANG_FIX_FUNC,"$(PROTO_DIR)/usr/bin/fetchmailconf")

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/^=======/p" ' \
	'-e "/were not run/p" ' \
	'-e "/passed/p" '

REQUIRED_PACKAGES += library/python/tkinter-311
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
