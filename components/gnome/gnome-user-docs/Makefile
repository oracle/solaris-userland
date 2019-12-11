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
# Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-user-docs
COMPONENT_VERSION=	3.34.0
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/DocumentationProject/
COMPONENT_ARCHIVE_HASH= \
	sha256:8f9907ff15fff97da75ece645cc86766703ac54d716d25563ba67ffed1af24ed
COMPONENT_BUGDB=        gnome/help
COMPONENT_ANITYA_ID=	13138

TPNO=			54069

include $(WS_MAKE_RULES)/gnome-component.mk

# Expects GNU msgfmt in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += developer/documentation-tool/itstool
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2

