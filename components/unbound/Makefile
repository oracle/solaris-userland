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
# Copyright (c) 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER=gcc

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		unbound
COMPONENT_VERSION=	1.16.3
COMPONENT_BAID=		130695
COMPONENT_PROJECT_URL=	https://nlnetlabs.nl/projects/unbound/about/
COMPONENT_ARCHIVE_HASH= \
    sha256:ea0c6665e2c3325b769eac1dfccd60fe1828d5fcf662650039eccb3f67edb28e
COMPONENT_ARCHIVE_URL= \
    https://nlnetlabs.nl/downloads/unbound/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	service/unbound
COMPONENT_ANITYA_ID=	5042

# Enable adiheap and adistack security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv)

PATH = /usr/gnu/bin:/usr/bin

CONFIGURE_OPTIONS +=	--sysconfdir=/etc
CONFIGURE_OPTIONS +=	--with-libevent
CONFIGURE_OPTIONS +=	--with-ssl=/usr/openssl/3
CONFIGURE_OPTIONS +=	--with-username=_unbound

COMPONENT_TEST_TRANSFORMS += '-e "0,/^\.\/unittest$$/d"'
COMPONENT_TEST_TRANSFORMS += '-e "/^[0-9]* checks ok./d"'
COMPONENT_TEST_TRANSFORMS += '-e "/^\[0\] did 10000 in/d"'
COMPONENT_TEST_TRANSFORMS += '-e "/Leaving directory/d"'

REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/libevent
REQUIRED_PACKAGES += library/security/openssl-3
