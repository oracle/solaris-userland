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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

BUILD_BITS =            64
# Also, all components using gobject-introspection must be built with gcc as
# gobject-introspection does not produce correct results when using Studio.
COMPILER =              gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		polkit
COMPONENT_VERSION=	125
COMPONENT_PROJECT_URL=	http://www.freedesktop.org/wiki/Software/polkit/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
	sha256:ea5cd6e6e2afa6bad938ee770bf0c2cd9317910f37956faeba2869adcf3747d1
COMPONENT_ARCHIVE_URL=	https://github.com/polkit-org/polkit/archive/refs/tags/$(COMPONENT_VERSION).tar.gz
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).sign
COMPONENT_BUGDB=	gnome/security
COMPONENT_ANITYA_ID=	3682
COMPONENT_SIG_URL=

COMPONENT_BAID=		178240

BUILD_STYLE=		meson

# Tests don't work on Solaris
TEST_TARGET = $(SKIP_TEST)

# Workaround the mozjs issue described in 24935318
ifeq ($(MACH), sparc)
ADDITIONAL_PATCHES += patches/08-mozjs-workaround.sparc
COMPONENT_POST_UNPACK_ACTION += \
	xargs -n 1 $(CP) /usr/lib/ld/map.vas47<<< "$(SOURCE_DIR)/src/polkitbackend $(SOURCE_DIR)/src/programs $(SOURCE_DIR)/src/polkitagent";
LD_EXEC_OPTIONS.64 += -M /usr/lib/ld/map.vas47
endif

include $(WS_MAKE_RULES)/common.mk

# g-ir-scanner
CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# Need C99 or later to get fpclassify() & isfinite() in <math.h>
CFLAGS += -ggdb
CFLAGS.gcc += -std=gnu11
CFLAGS.studio += -std=c11 -xlang=c11

CONFIGURE_OPTIONS += -Dgtk_doc=true
CONFIGURE_OPTIONS += -Dman=true
CONFIGURE_OPTIONS += -Dauthfw=pam
CONFIGURE_OPTIONS += -Dpolkitd_user=_polkitd
CONFIGURE_OPTIONS += -Dpolkitd_uid=63
CONFIGURE_OPTIONS += -Dos_type=solaris
CONFIGURE_OPTIONS += -Djs_engine=mozjs
CONFIGURE_OPTIONS += -Dsession_tracking=ConsoleKit
CONFIGURE_OPTIONS += -Dexamples=true
CONFIGURE_OPTIONS += --sysconfdir="$(ETCDIR)"

ADIHEAP_MODE = $(ADIHEAP_DISABLE)
ADISTACK_MODE = $(ADISTACK_DISABLE)

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

COMPONENT_POST_INSTALL_ACTION.64 += \
        $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/polkit.xml \
                $(PROTO_DIR)/lib/svc/manifest/system/polkit.xml; \
        $(INSTALL) -D -m 0555 $(COMPONENT_DIR)/files/svc-polkit \
                $(PROTO_DIR)/lib/svc/method/svc-polkit; \

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gobject/gobject-introspection
REQUIRED_PACKAGES += library/expat
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libmozjs-115
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/dbus
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/pam-core
