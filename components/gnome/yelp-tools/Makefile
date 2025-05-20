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
# Copyright (c) 2015, 2025, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		yelp-tools
COMPONENT_VERSION=	42.1
COMPONENT_PROJECT_URL=	https://wiki.gnome.org/Apps/Yelp/Tools
COMPONENT_ARCHIVE_HASH= \
	sha256:3e496a4020d4145b99fd508a25fa09336a503a4e8900028421e72c6a4b11f905
COMPONENT_BUGDB=	gnome/docviewer
COMPONENT_ANITYA_ID=	8420

COMPONENT_BAID=		153940
BUILD_STYLE=		meson
PYTHON_VERSION=		3.11

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/gnome-component.mk

# pkgdepend doesn't like the first line of a Python script to be:
# '#!/usr/bin/env python3' so turn it into '#!/usr/bin/python3.11'

COMPONENT_POST_INSTALL_ACTION += \
        $(GSED) -i -e 's?python3?python$(PYTHON_VERSION)?' \
                $(PROTOUSRBINDIR)/yelp-new; \
        $(GSED) -i -e 's?python3?python$(PYTHON_VERSION)?' \
                $(PROTOUSRBINDIR)/yelp-check; \
        $(GSED) -i -e 's?python3?python$(PYTHON_VERSION)?' \
                $(PROTOUSRBINDIR)/yelp-build;

REQUIRED_PACKAGES += data/docbook/docbook-dtds
REQUIRED_PACKAGES += developer/documentation-tool/itstool
REQUIRED_PACKAGES += library/gnome/yelp-xsl
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/libxslt
REQUIRED_PACKAGES += library/python/lxml-311
REQUIRED_PACKAGES += runtime/python-311
