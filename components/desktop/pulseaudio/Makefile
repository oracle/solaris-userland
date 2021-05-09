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
# Copyright (c) 2015, 2021, Oracle and/or its affiliates.
#

BUILD_BITS = 		64_and_32
COMPILER = 		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		pulseaudio
COMPONENT_VERSION=	14.2
COMPONENT_PROJECT_URL=	http://freedesktop.org/software/pulseaudio
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
    sha256:75d3f7742c1ae449049a4c88900e454b8b350ecaa8c544f3488a2562a9ff66f1
COMPONENT_ARCHIVE_URL=	http://freedesktop.org/software/$(COMPONENT_NAME)/releases/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/multimedia
COMPONENT_ANITYA_ID=	3729

TPNO=			70294

# Build for python 3.7
PYTHON_VERSION = 3.7

include $(WS_MAKE_RULES)/common.mk

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

# No one should be using esd anymore.
CONFIGURE_OPTIONS += --disable-esound
CONFIGURE_OPTIONS += --disable-force-preopen
# Solaris has native OSS; don't use PulseAudio wrapper.
CONFIGURE_OPTIONS += --disable-oss-wrapper
CONFIGURE_OPTIONS += --disable-static
CONFIGURE_OPTIONS += --enable-avahi
CONFIGURE_OPTIONS += --enable-dbus
CONFIGURE_OPTIONS += --disable-gconf
CONFIGURE_OPTIONS += --enable-glib2
CONFIGURE_OPTIONS += --enable-gtk3
CONFIGURE_OPTIONS += --enable-hal-compat
CONFIGURE_OPTIONS += --enable-ipv6
CONFIGURE_OPTIONS += --enable-manpages
CONFIGURE_OPTIONS += --enable-openssl
CONFIGURE_OPTIONS += --enable-orc
CONFIGURE_OPTIONS += --enable-oss-output
CONFIGURE_OPTIONS += --enable-solaris
CONFIGURE_OPTIONS += --with-database=gdbm
CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS += --with-zsh-completion-dir=/usr/share/zsh/vendor-functions/Completion
CONFIGURE_OPTIONS += --disable-tests
#gsetting was introduced in version 12, enabled by default. This causes pseudo errors about the configuration files.
#Disabling it now.
CONFIGURE_OPTIONS += --disable-gsettings

# To avoid using the current system default, one is explicitly specified here.
CONFIGURE_ENV += PYTHON=$(PYTHON)

CONFIGURE_OPTIONS += --libexecdir=$(USRLIBDIR)

# Required due to patches; must use special bootstrap script and not standard
# autoreconf due to use of both gettext and intltool in the same project! If
# you use standard autoreconf, configure will fail.
COMPONENT_PREP_ACTION += ( cd $(@D) ; NOCONFIGURE=1 $(CONFIG_SHELL) bootstrap.sh );

COMPONENT_SYSTEM_TEST_ENV +=    PATH=/usr/gnu/bin:/usr/bin
unexport SHELLOPTS
COMPONENT_PRE_CONFIGURE_ACTION += ($(CLONEY) $(SOURCE_DIR) $(@D));
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS = -k -i
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '

# Need to convert "#! /usr/bin/env python" to actual path for pkgdepend to work
PYTHON_SCRIPTS += $(PROTO_DIR)$(CONFIGURE_BINDIR.$(BITS))/qpaeq

# qpaeq (equalizer gui) needs Qt4 and PyQt4 so is omitted from p5m for now.
REQUIRED_PACKAGES += codec/speex
REQUIRED_PACKAGES += library/database/gdbm
REQUIRED_PACKAGES += library/desktop/orc
REQUIRED_PACKAGES += library/fftw-3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/json-c
REQUIRED_PACKAGES += library/libsndfile
REQUIRED_PACKAGES += library/libtool/libltdl
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/gmp
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/network/avahi
REQUIRED_PACKAGES += x11/library/libice
REQUIRED_PACKAGES += x11/library/libsm
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxtst
REQUIRED_PACKAGES += library/desktop/gstreamer-1
REQUIRED_PACKAGES += library/desktop/gstreamer-1/gst-plugins-base
