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
# Copyright (c) 2015, 2024, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
COMPILER=		gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gtk-doc
COMPONENT_VERSION=	1.34.0
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/DocumentationProject/GtkDoc
COMPONENT_ARCHIVE_HASH= \
    sha256:b20b72b32a80bc18c7f975c9d4c16460c2276566a0b50f87d6852dff3aa7861c
COMPONENT_BUGDB=	gnome/dev-tools
COMPONENT_ANITYA_ID=	13140
COMPONENT_BAID=		165095

BUILD_STYLE=		meson
PYTHON_VERSION=		3.11

TEST_TARGET= $(SKIP_TEST)

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU msgfmt in PATH.
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_INSTALL_ENV += PATH="$(GNUBIN):$(PATH)"

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_ARGS =   -k -i
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/result_count/d" ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '

# Compile all python sources to .pyc files
COMPONENT_POST_INSTALL_ACTION += \
        $(PYTHON) -m compileall $(PROTO_DIR)$(USRSHAREDIR)/gtk-doc/python;

# For autopyc transformation
PKG_MACROS += PYVER=$(PYTHON_VERSION) PYV="$(PYTHON_VERSION:3.%=3%)"

REQUIRED_PACKAGES += data/docbook/docbook-dtds
REQUIRED_PACKAGES += data/docbook/docbook-style-xsl 
REQUIRED_PACKAGES += data/sgml-common
REQUIRED_PACKAGES += data/xml-common
REQUIRED_PACKAGES += developer/documentation-tool/itstool
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += library/python/lxml-311
REQUIRED_PACKAGES += library/python/pygments-311
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += text/gnu-gettext
