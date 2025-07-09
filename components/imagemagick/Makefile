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
# Copyright (c) 2011, 2025, Oracle and/or its affiliates.
#

BUILD_BITS=		64
COMPILER=		gcc
CTF_MODE =		relaxed
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		ImageMagick
COMPONENT_VERSION=	7.1.1-47
COMPONENT_PROJECT_URL=	https://www.imagemagick.org/
COMPONENT_ARCHIVE=	$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	sha256:818e21a248986f15a6ba0221ab3ccbaed3d3abee4a6feb4609c6f2432a30d7ed
COMPONENT_ARCHIVE_URL=	https://github.com/ImageMagick/ImageMagick/archive/refs/tags/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/imagemagick
COMPONENT_ANITYA_ID=	1372

COMPONENT_BAID=		331297

IPS_COMPONENT_VERSION=	$(shell echo $(COMPONENT_VERSION) | $(GSED) -e 's/-/./')
COMPONENT_MAJOR_VERSION=$(shell echo $(COMPONENT_VERSION) | $(GSED) -e 's/\..*//')
COMPONENT_BASE_VERSION=	$(shell echo $(COMPONENT_VERSION) | $(GSED) -e 's/-.*//')

# Enable ADI security extensions
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)
ADISTACK_MODE =	$(ADISTACK_ENABLE)

include $(WS_MAKE_RULES)/common.mk

CONFIGURE_OPTIONS+= --with-modules
CONFIGURE_OPTIONS+= --disable-static
CONFIGURE_OPTIONS+= --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS+= --with-fftw
CONFIGURE_OPTIONS+= --with-gslib
CONFIGURE_OPTIONS+= --with-rsvg
CONFIGURE_OPTIONS+= --with-perl=$(PERL)

# Remove wrong RUNPATH and RPATH
COMPONENT_POST_INSTALL_ACTION = (\
	p=$$($(PERL) -E 'use Config; say "$(PROTO_DIR)" . \
		"$$Config{sitelib}/$$Config{archname}/auto/Image/Magick"'); \
	for i in $$p/Magick.so $$p/Q16HDRI/Q16HDRI.so; do \
		$(CHMOD) +w $$i; \
		$(ELFEDIT) -e "dyn:delete RUNPATH" -e "dyn:delete RPATH" $$i; \
	done);

# Get .la files back to package otherwise modules loading will not work
PUBLISH_TRANSFORMS += $(COMPONENT_DIR)/deliver_la_files
PKGMOGRIFY_TRANSFORMS_LIBTOOL_DROP =

PKG_MACROS += COMPONENT_MAJOR_VERSION=$(COMPONENT_MAJOR_VERSION)
PKG_MACROS += COMPONENT_BASE_VERSION=$(COMPONENT_BASE_VERSION)

REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += compress/libzip
REQUIRED_PACKAGES += compress/xz
REQUIRED_PACKAGES += image/ghostscript
REQUIRED_PACKAGES += image/graphviz
REQUIRED_PACKAGES += image/library/libjpeg
REQUIRED_PACKAGES += image/library/libpng16
REQUIRED_PACKAGES += image/library/librsvg
REQUIRED_PACKAGES += image/library/libtiff
REQUIRED_PACKAGES += image/library/libwebp
REQUIRED_PACKAGES += image/library/openjpeg2
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/fftw-3
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/lcms2
REQUIRED_PACKAGES += library/libtool/libltdl
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxext
