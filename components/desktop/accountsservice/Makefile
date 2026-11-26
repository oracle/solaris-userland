#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at LICENSE.txt
# or https://oss.oracle.com/licenses/.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at LICENSE.txt.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#

#
# Copyright (c) 2016, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
CTF_MODE =		relaxed
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		accountsservice
COMPONENT_VERSION=	26.27.3
COMPONENT_PROJECT_URL=	http://freedesktop.org/wiki/Software/AccountsService/
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
	sha256:11de07bcd499c2277f78a6fc830d1437654f3397cc7bbed19c28b3818435ba38
COMPONENT_ARCHIVE_URL=	https://gitlab.freedesktop.org/accountsservice/accountsservice/-/archive/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	13107

COMPONENT_BAID=		472167
BUILD_STYLE=		meson

TEST_TARGET = $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Assumes GNU xgettext in PATH
COMPONENT_BUILD_ENV += PATH=$(GNUBIN):$(PATH)
COMPONENT_INSTALL_ENV += PATH=$(GNUBIN):$(PATH)
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

CONFIGURE_OPTIONS += -Dsystemd=false
CONFIGURE_OPTIONS += -Dsystemdsystemunitdir='no'
CONFIGURE_OPTIONS += -Delogind=false
# Upstream tests build mocklibc, which assumes Linux libc interfaces.
CONFIGURE_OPTIONS += -Dtests=false
CONFIGURE_OPTIONS += -Dgtk_doc=true
CONFIGURE_OPTIONS += --libexecdir="$(USRLIBDIR)"
CONFIGURE_OPTIONS += --localstatedir="$(VARDIR)"
CONFIGURE_OPTIONS += --sysconfdir="$(ETCDIR)"

# Solaris reserves uids < 100 for system accounts
CONFIGURE_OPTIONS += -Dminimum_uid=100

# Solaris does not have a wheel group, so we use the "sysadmin" group to
# determine which accounts should be ACT_USER_ACCOUNT_TYPE_ADMINISTRATOR
CONFIGURE_OPTIONS += -Dadmin_group=sysadmin

# Only need to install library from 32-bit builds, everything else overlaps
# with 64-bit builds
COMPONENT_INSTALL_ARGS.32 += SUBDIRS=src/libaccountsservice
COMPONENT_INSTALL_ARGS += $(COMPONENT_INSTALL_ARGS.$(BITS))

# SMF manifest & method
COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/accountsservice.xml \
                $(PROTO_DIR)/lib/svc/manifest/system/accountsservice.xml; \
        $(INSTALL) -D -m 0555 $(COMPONENT_DIR)/files/svc-accountsservice \
                $(PROTO_DIR)/lib/svc/method/svc-accountsservice; 

CBE_PACKAGES += developer/documentation-tool/gtk-doc
CBE_PACKAGES += developer/documentation-tool/xmlto
CBE_PACKAGES += developer/vala
CBE_PACKAGES += library/desktop/gobject/gobject-introspection
CBE_PACKAGES += library/libxslt

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/json-c
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/polkit
