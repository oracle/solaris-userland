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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		fetchmail
COMPONENT_VERSION=	6.4.21
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
    sha256:6a459c1cafd7a1daa5cd137140da60c18c84b5699cd8e7249a79c33342c99d1d
COMPONENT_ARCHIVE_URL=	https://sourceforge.net/projects/$(COMPONENT_NAME)/files/branch_6.4/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	http://www.fetchmail.info/
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	801

TPNO=			73360

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS  +=		PYTHON="$(PYTHON.3.7.64)"
CONFIGURE_OPTIONS  +=		--with-kerberos5
CONFIGURE_OPTIONS  +=		--with-ssl
CONFIGURE_OPTIONS  +=		--enable-NTLM

# Change the shebang line to use Python 2.7 explicitly, and drop the
# fixed file into /usr/bin, where our package manifest expects it.
COMPONENT_POST_INSTALL_ACTION = \
    $(GSED) -e "s|/usr/bin/env python|$(PYTHON.3.7.64)|" \
	$(PROTO_DIR)/usr/lib/python3.7/site-packages/fetchmailconf.py > \
	$(PROTO_DIR)$(USRBIN.32)/fetchmailconf

COMPONENT_TEST_TRANSFORMS += \
	'-n ' \
	'-e "/SKIP/p" ' \
	'-e "/PASS/p" ' \
	'-e "/FAIL/p" ' \
	'-e "/^=======/p" ' \
	'-e "/were not run/p" ' \
	'-e "/passed/p" '

REQUIRED_PACKAGES += library/python/tkinter-37
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += shell/ksh93
