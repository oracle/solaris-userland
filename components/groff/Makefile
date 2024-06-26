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
# Copyright (c) 2013, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		groff
COMPONENT_VERSION=	1.23.0
COMPONENT_ARCHIVE_HASH= \
    sha256:6b9757f592b7518b4902eb6af7e54570bdccba37a871fddb2d30ae3863511c13
COMPONENT_ANITYA_ID=	1253
COMPONENT_BAID=		149809

# NOTE: During an update, do NOT trust generate to split all new files into
# the correct packages. Since there isn't a simple rule of which file belongs
# where, manual verification is necessary (see 35611860).

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/gnu-component.mk

# Deliver scripts from 64-bit build to the 32-bit location.
CONFIGURE_LIBDIR.64 =	$(CONFIGURE_LIBDIR.32)

CONFIGURE_OPTIONS += \
    --with-appresdir=$(CONFIGURE_PREFIX)/X11/lib/X11/app-defaults

# Don't generate tmac wrappers for the Solaris troff macro packages.
# Some man pages (such as groff.1) use long macro name definitions
# which fail in compatibility mode. See:
# http://osdir.com/ml/printing.groff.general/2003-07/msg00088.html
# for more details.
COMPONENT_INSTALL_ARGS += tmac_wrap=""

COMPONENT_INSTALL_ARGS += legacyfontdir=$(PROTOUSRLIBDIR)/font
COMPONENT_INSTALL_ARGS += sys_tmac_prefix=$(PROTOUSRSHARELIBDIR)/tmac/

COMPONENT_PRE_INSTALL_ACTION = \
	($(MKDIR) $(PROTOUSRBINDIR) )

# Adjust '#!/usr/bin/perl'
PERL_SCRIPTS= \
	$(PROTOUSRSHAREDIR)/groff/$(COMPONENT_VERSION)/font/devpdf/util/BuildFoundries \
	$(PROTOUSRLIBDIR)/groff/grog/subs.pl \
	$(PROTOUSRLIBDIR)/groff/gpinyin/subs.pl \
	$(PROTOUSRLIBDIR)/groff/groffer/main_subs.pl \
	$(PROTOUSRLIBDIR)/groff/groffer/subs.pl \
	$(PROTOUSRLIBDIR)/groff/groffer/man.pl \
	$(PROTOUSRBINDIR)/chem \
	$(PROTOUSRBINDIR)/glilypond \
	$(PROTOUSRBINDIR)/gperl \
	$(PROTOUSRBINDIR)/gpinyin \
	$(PROTOUSRBINDIR)/gropdf \
	$(PROTOUSRBINDIR)/grog \
	$(PROTOUSRBINDIR)/mmroff \
	$(PROTOUSRBINDIR)/afmtodit \
	$(PROTOUSRBINDIR)/pdfmom

REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += text/doctools
REQUIRED_PACKAGES += text/gawk
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxmu
REQUIRED_PACKAGES += x11/library/toolkit/libxaw7
REQUIRED_PACKAGES += x11/library/toolkit/libxt
