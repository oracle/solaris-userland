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
# Copyright (c) 2016, 2024, Oracle and/or its affiliates.
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		gnome-user-docs
COMPONENT_VERSION=	45.1
COMPONENT_PROJECT_URL=  https://wiki.gnome.org/DocumentationProject/
COMPONENT_ARCHIVE_HASH= \
	sha256:2f90c6827b5f1605df2edfbea2b342870300a9a981bc392dc96214d967f3adf1
COMPONENT_BUGDB=        gnome/help
COMPONENT_ANITYA_ID=	13138

COMPONENT_BAID=		160051

include $(WS_MAKE_RULES)/gnome-component.mk

# Expects GNU msgfmt in PATH.
CONFIGURE_ENV += PATH="$(GNUBIN):$(PATH)"
COMPONENT_BUILD_ENV += PATH="$(GNUBIN):$(PATH)"

REQUIRED_PACKAGES += developer/documentation-tool/itstool
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/libxml2

