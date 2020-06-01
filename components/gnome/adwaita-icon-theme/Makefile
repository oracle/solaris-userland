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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates. 
#

BUILD_BITS=             NO_ARCH
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		adwaita-icon-theme
COMPONENT_VERSION=	3.33.92
COMPONENT_PROJECT_URL=	https://github.com/GNOME/adwaita-icon-theme
COMPONENT_ARCHIVE_HASH= \
    sha256:bf041ecf7d9bf02267b83efa5f500431a98ad17f3dc85a5421d21c245f943c63
COMPONENT_BUGDB=        gnome/themes
COMPONENT_ANITYA_ID=	13117

TPNO=			53954

include $(WS_MAKE_RULES)/gnome-component.mk

# Assumes GNU xgettext in PATH
CONFIGURE_ENV += PATH=$(GNUBIN):$(PATH)

# Required so that configure can find and use 64-bit version
CONFIGURE_ENV += ac_cv_path_GTK_ENCODE_SYMBOLIC_SVG=$(USRBINDIR64)/gtk-encode-symbolic-svg

REQUIRED_PACKAGES += runtime/perl-526
REQUIRED_PACKAGES += library/perl-5/xml-parser-526
