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
# Copyright (c) 2015, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gvfs
COMPONENT_VERSION=	1.60.3
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/Projects/gvfs
COMPONENT_ARCHIVE_HASH= \
	sha256:4cb21d511c2e29511a99f3a193deaa914a8bb7d9e372228673c6b085aff63f4b
COMPONENT_BUGDB=	gnome/libraries
COMPONENT_ANITYA_ID=	5496

COMPONENT_BAID=		451005
BUILD_STYLE=		meson

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU xgettext in PATH.
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

# Assumes GNU xgettext is first in $PATH.
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

# We build goa only 64-bit in Solaris
CONFIGURE_OPTIONS.32 += -Dgoa=false
# gcr-4 is only delivered 64-bit in Solaris
CONFIGURE_OPTIONS.32 += -Dgcr=false
CONFIGURE_OPTIONS += -Dsmb=false
CONFIGURE_OPTIONS += -Dnfs=false
CONFIGURE_OPTIONS += -Dgoogle=false
CONFIGURE_OPTIONS += -Donedrive=false
CONFIGURE_OPTIONS += -Dwsdd=false
CONFIGURE_OPTIONS += -Dburn=true
CONFIGURE_OPTIONS += -Ddeprecated_apis=true
CONFIGURE_OPTIONS += -Dman=true
CONFIGURE_OPTIONS += -Dunit_tests=true
# admin requires libcap
CONFIGURE_OPTIONS += -Dadmin=false
CONFIGURE_OPTIONS += -Dbluray=false
CONFIGURE_OPTIONS += -Dfuse=false
# Requires linux specific systemd
CONFIGURE_OPTIONS += -Dlogind=false
CONFIGURE_OPTIONS += -Dsystemduserunitdir=no
CONFIGURE_OPTIONS += -Dtmpfilesdir=no
CONFIGURE_OPTIONS += -Dgudev=false
# Requires dependencies we don't have on Solaris - gudev
CONFIGURE_OPTIONS += -Dudisks2=false
CONFIGURE_OPTIONS += -Dcdda=false
CONFIGURE_OPTIONS += -Dgphoto2=false
CONFIGURE_OPTIONS += -Dmtp=false
# Requires dependencies we don't have on Solaris - libimobiledevice, libplist
CONFIGURE_OPTIONS += -Dafc=false
CONFIGURE_OPTIONS += --libexecdir=$(USRLIBDIR)

# Upstream builds outputstream but does not register it with Meson's test target.
# Run its local-file tests directly for both bitnesses.
COMPONENT_PRE_TEST_ACTION = $(MKDIR) $(@D)/outputstream-test-data
COMPONENT_TEST_ENV += GIO_USE_VFS=local
COMPONENT_TEST_ENV += TMPDIR=$(@D)/outputstream-test-data
COMPONENT_TEST_CMD = $(@D)/test/unit/outputstream
COMPONENT_TEST_ARGS = $(@D)/outputstream-test-data
# Local GIO reports an initial append offset of 0; this test expects EOF.
COMPONENT_TEST_ARGS += -s /write/append-tell
COMPONENT_TEST_TARGETS =
COMPONENT_POST_TEST_ACTION = $(RM) -r $(@D)/outputstream-test-data

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnome/gcr-4
REQUIRED_PACKAGES += library/gnome/gnome-online-accounts
REQUIRED_PACKAGES += library/gnome/libsecret
REQUIRED_PACKAGES += library/libarchive
REQUIRED_PACKAGES += library/libsoup-3
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
REQUIRED_PACKAGES += system/library/security/libgcrypt
REQUIRED_PACKAGES += system/network/avahi
