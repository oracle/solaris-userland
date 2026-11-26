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
# Copyright (c) 2019, 2026, Oracle and/or its affiliates.
#

BUILD_BITS =            32_and_64
# All components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gmime
COMPONENT_VERSION=	3.2.15
COMPONENT_PROJECT_URL=	https://github.com/jstedfast/gmime
COMPONENT_ARCHIVE_URL=	https://github.com/jstedfast/gmime/releases/download/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH= \
	sha256:84cd2a481a27970ec39b5c95f72db026722904a2ccf3fdbd57b280cf2d02b5c4
COMPONENT_BUGDB=        gnome/libraries
COMPONENT_ANITYA_ID=	13124

COMPONENT_BAID=		465579

include $(WS_MAKE_RULES)/gnome-component.mk

CONFIGURE_OPTIONS += --disable-static
# Required for other components.
CONFIGURE_OPTIONS.32 += --disable-introspection
CONFIGURE_OPTIONS.64 += --enable-introspection
# Required for other components.
CONFIGURE_OPTIONS += --enable-shared
# Required for other components.
CONFIGURE_OPTIONS.32 += --disable-vala
CONFIGURE_OPTIONS.64 += --enable-vala
# /usr/bin/mcs accepts the --version option, which causes configure to think
# it has found GNU Mono, and enable Mono support. On Solaris, mcs is an ELF
# utility, and Mono is not available. Explicitly disable it in order to
# sidestep the issue.
CONFIGURE_OPTIONS += --enable-mono=no
# Solaris is missing "right" getdomainname().
CONFIGURE_OPTIONS += ac_cv_func_getdomainname=no

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
GMIME_TEST_GNUPGHOME = $(WS_TOP)/.gmime-test-$(BITS)/gnupg
COMPONENT_PRE_TEST_ACTION += /bin/mkdir -p $(WS_TOP)/.gmime-test-$(BITS); \
	/bin/rm -f $(GMIME_TEST_GNUPGHOME); \
	/bin/ln -s $(COMPONENT_TEST_DIR)/tests/tmp/.gnupg $(GMIME_TEST_GNUPGHOME)
COMPONENT_TEST_ENV += GMIME_TEST_GNUPGHOME=$(GMIME_TEST_GNUPGHOME)
COMPONENT_POST_TEST_ACTION += /bin/rm -f $(GMIME_TEST_GNUPGHOME); \
	/bin/rmdir $(WS_TOP)/.gmime-test-$(BITS)
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/Testing/p" ' \
        '-e "/test/p" ' \
        '-e "/Fail/p" '

CBE_PACKAGES += developer/documentation-tool/gtk-doc
CBE_PACKAGES += developer/vala
CBE_PACKAGES += library/desktop/gobject/gobject-introspection
CBE_PACKAGES += library/security/libassuan

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libidn2
REQUIRED_PACKAGES += library/security/gpgme
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
