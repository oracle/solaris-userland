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
# Copyright (c) 2015, 2020, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS= 64_and_32
include ../../../make-rules/shared-macros.mk
COMPILER =              gcc

COMPONENT_NAME=         gtkspell3
COMPONENT_VERSION=      3.0.10
COMPONENT_PROJECT_URL=  http://sourceforge.net/
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH= \
    sha256:b040f63836b347eb344f5542443dc254621805072f7141d49c067ecb5a375732
COMPONENT_ARCHIVE_URL=  $(COMPONENT_PROJECT_URL)/projects/gtkspell/files/$(COMPONENT_VERSION)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=        library/gtkspell
COMPONENT_ANITYA_ID=    13110

TPNO=                   56018

TEST_TARGET= $(NO_TESTS)
include $(WS_MAKE_RULES)/common.mk

# Needed to pick up the GNU version of xgettext.
PATH =		$(GNUBIN):$(USRBINDIR)

COMPONENT_PREP_ACTION = \
	(cd $(@D) ; \
	libtoolize --force --copy ; \
	aclocal -I . ; \
	libtoolize --force ; \
	autoheader ; \
	automake -a -c -f ; \
	autoconf )

COMPONENT_POST_INSTALL_ACTION.64 += \
       $(INSTALL) -D -m 0444 $(COMPONENT_DIR)/files/libgtkspell.3 \
               $(PROTO_DIR)/usr/share/man/man3/libgtkspell.3; \

REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc
REQUIRED_PACKAGES += library/desktop/gtk2
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/perl-5/xml-parser
REQUIRED_PACKAGES += library/spell-checking/enchant
REQUIRED_PACKAGES += library/desktop/gtk3 
