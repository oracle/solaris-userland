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
# Copyright (c) 2011, 2026, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		meld
COMPONENT_VERSION=	3.24.0
COMPONENT_PROJECT_URL=	https://meldmerge.org/
COMPONENT_ARCHIVE_HASH=	\
    sha256:19f036297e7c89514516bcd2e56182db2bb2ba13b4850893c1ce597445018b94
COMPONENT_BUGDB=	utility/meld
COMPONENT_ANITYA_ID=	5520
COMPONENT_BAID=		441744

# We just need to build one version.
PYTHON_VERSION=		3.11

BUILD_STYLE=	meson
TEST_TARGET=	$(TEST_64)

include $(WS_MAKE_RULES)/gnome-component.mk

# Needed to find GNU xgettext.
PATH =			$(GNUBIN):$(USRBINDIR)

PKG_MACROS +=		PYVER="$(PYTHON_VERSION)" PYV="$(PYTHON_VERSION:3.%=3%)"

PYTHON_DATA =		/usr

# Don't build and package these, they need to be generated on install to
# reflect all the other packages installed on the machine too, not just meld
COMPONENT_SETUP_ARGS += --no-compile-schemas
COMPONENT_SETUP_ARGS += --no-update-icon-cache

PYTHON_SCRIPTS += $(PROTOUSRBINDIR)/meld

# To find py3cairo
PKG_CONFIG_PATHS += /usr/lib/python$(PYTHON_VERSION)/vendor-packages/lib/pkgconfig

# Convert the installed Mallard help to static HTML because Solaris no longer
# ships Yelp to display help: URIs.
COMPONENT_POST_INSTALL_ACTION += ( set -e ; \
	for meld_locale_dir in $(PROTOUSRSHAREDIR)/help/* ; do \
		meld_locale=$$(/usr/bin/basename "$$meld_locale_dir") ; \
		meld_help_dir=$$meld_locale_dir/meld ; \
		meld_html_dir=$(PROTOUSRSHAREDIR)/meld/help/$$meld_locale ; \
		$(MKDIR) $$meld_html_dir ; \
		( cd $$meld_help_dir ; \
			$(USRBINDIR)/yelp-build html -o $$meld_html_dir . ) ; \
	done );

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

CBE_PACKAGES += library/desktop/gobject/gobject-introspection
CBE_PACKAGES += library/gnome/yelp-tools
CBE_PACKAGES += library/gnome/yelp-xsl
CBE_PACKAGES += library/python/pycairo-311
CBE_PACKAGES += library/python/tkinter-311
CBE_PACKAGES += text/gnu-gettext

REQUIRED_PACKAGES += gnome/gsettings-desktop-schemas
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/gtksourceview
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/python/pycairo-311
REQUIRED_PACKAGES += library/python/pygobject-3-311
REQUIRED_PACKAGES += runtime/python-311
