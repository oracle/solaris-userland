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
BUILD_BITS =		64
COMPILER =		gcc
CTF_MODE =		relaxed

# Temporary opt out till mysql-84 is in CBE
SKIP_REQUIRED_PACKAGES_CHECK=

include ../../make-rules/shared-macros.mk

# This component does not fully specify dependencies of shared objects
LD_SHARED_OPTIONS_Z_DEFS=

COMPONENT_NAME=		lighttpd
COMPONENT_VERSION=	1.4.82
COMPONENT_PROJECT_URL=	http://www.lighttpd.net/
COMPONENT_ARCHIVE_HASH=	sha256:4f07f2d61ee8d136d105d9a62f139a46ad8216fe9e346476ee5340f87bcabd79
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)download/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	1817

COMPONENT_BAID=		352770

BUILD_STYLE=	cmake

LIGHTTPD_INSTALLDIR =	$(USRDIR)/lighttpd/1.4
LIGHTTPD_ETC =		$(ETCDIR)/lighttpd/1.4

# lighttpd doesn't install config files and docs by default
COMPONENT_POST_INSTALL_ACTION += \
	$(MKDIR) $(PROTO_DIR)/$(LIGHTTPD_ETC) && \
	$(CP) -r $(COMPONENT_SRC)/doc/config/* $(PROTO_DIR)/$(LIGHTTPD_ETC)

include $(WS_MAKE_RULES)/common.mk

# Need to have in PATH mysql_config for cmake and exact perl version for tests
PATH = /usr/perl/$(PERL_VERSION)/bin:/usr/mysql/8.0/bin:/usr/gnu/bin:/usr/bin:/usr/sbin

CMAKE_PREFIX= $(LIGHTTPD_INSTALLDIR)

CMAKE_OPTIONS += -DCMAKE_INSTALL_MANDIR="man"
CMAKE_OPTIONS += -DCMAKE_POSITION_INDEPENDENT_CODE=ON
CMAKE_OPTIONS += -DLIGHTTPD_MODULES_DIR="lib"
CMAKE_OPTIONS += -DWITH_MYSQL=ON
CMAKE_OPTIONS += -DWITH_OPENSSL=ON
CMAKE_OPTIONS += -DWITH_LDAP=ON
CMAKE_OPTIONS += -DWITH_LUA=ON

COMPONENT_TEST_TRANSFORMS += \
	'-e "s/\x1B\[[0-9;]*[A-Za-z]//g" '  \
	'-e "s/   [0-9]\.[0-9][0-9] sec//" '  \
	'-e "s/  [0-9][0-9]\.[0-9][0-9] sec//" '

REQUIRED_PACKAGES += database/mysql-80
REQUIRED_PACKAGES += database/mysql-80/library
REQUIRED_PACKAGES += database/mysql-84
REQUIRED_PACKAGES += database/mysql-84/library
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += library/security/openssl-3
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network
REQUIRED_PACKAGES += system/network/ldap/openldap
REQUIRED_PACKAGES += web/fastcgi/spawn-fcgi
