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
# Copyright (c) 2014, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		mailman
COMPONENT_MINOR_VERSION=2.1
COMPONENT_MICRO_VERSION=$(COMPONENT_MINOR_VERSION).29
COMPONENT_VERSION=	$(COMPONENT_MICRO_VERSION)-1
IPS_COMPONENT_VERSION=	$(COMPONENT_MICRO_VERSION).1
COMPONENT_PROJECT_URL=	http://www.list.org/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_MICRO_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tgz
COMPONENT_ARCHIVE_URL=	https://launchpad.net/mailman/$(COMPONENT_MINOR_VERSION)/$(COMPONENT_MICRO_VERSION)/+download/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ARCHIVE_HASH=	sha256:838872713601e8a124146e550f53709482c1ef168f1e16d201465c651cbf0d2c
COMPONENT_ANITYA_ID=	1875

TPNO=			44475

# There are no tests that can be executed automatically,
# the unit tests require some setup as described in file TESTING.
TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/gnu-component.mk

CONFIGURE_ENV	+=	MAILMAN_USER=mailman
CONFIGURE_ENV	+=	MAILMAN_GROUP=mailman

CONFIGURE_PREFIX= $(USRLIBDIR)/mailman
CONFIGURE_OPTIONS +=	--with-var-prefix=$(VARDIR)/mailman
CONFIGURE_OPTIONS +=	--with-mail-gid=other
CONFIGURE_OPTIONS +=	--with-cgi-gid=webservd
CONFIGURE_OPTIONS +=	--with-python=$(PYTHON.2.7)
CONFIGURE_OPTIONS +=	--without-permcheck
# Address 127.0.0.1 is used instead of localhost to bypass the domain check in unit tests.
# A valid domain, see ValidateEmail() in usr/lib/mailman/Mailman/Utils.py,
# must have at least two parts, which obviously fails for localhost.
CONFIGURE_OPTIONS +=	--with-mailhost=127.0.0.1
CONFIGURE_OPTIONS +=	--with-urlhost=127.0.0.1

# Copy generated file to proto area.  Then py-compile several files that are
# used as modules in a devious way.
COMPONENT_POST_INSTALL_ACTION=	\
	($(CP) $(BUILD_DIR_64)/Mailman/Defaults.py \
		$(PROTOUSRLIBDIR)/mailman/Mailman/ ; \
	 $(PYTHON.2.7) -m py_compile $(PROTOUSRLIBDIR)/mailman/*/paths.py \
		$(PROTOUSRLIBDIR)/mailman/Mailman/Defaults.py)

REQUIRED_PACKAGES += library/python/dnspython-27
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network
