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
# Copyright (c) 2010, 2024, Oracle and/or its affiliates.
#
COMPILER= gcc
BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		a2ps
COMPONENT_VERSION=	4.14
COMPONENT_ARCHIVE_HASH=	\
    sha256:f3ae8d3d4564a41b6e2a21f237d2f2b104f48108591e8b83497500182a3ab3a4
COMPONENT_ANITYA_ID=	5

COMPONENT_BAID=		161033

include $(WS_MAKE_RULES)/gnu-component.mk

# don't use LD_Z_IGNORE: causes linker problems
LD_Z_IGNORE=

# Needed to get the tests to work.
COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS  +=		--enable-shared
CONFIGURE_OPTIONS  +=		--disable-static
CONFIGURE_OPTIONS  +=		--sysconfdir=$(ETCDIR)/gnu
CONFIGURE_OPTIONS  +=		--infodir=$(CONFIGURE_INFODIR)

# These autoconf checks in a2ps 4.14 hit build errors with gcc 14
# and incorrectly fail.  They've been fixed in later upstream releases
# and the old autoconf files in 4.14 fail to rebuild with modern
# autoconf versions, so we workaround them until we upgrade.
CONFIGURE_OPTIONS  +=		ac_cv_func_rename_works=yes
CONFIGURE_OPTIONS  +=		jm_cv_func_working_malloc=yes
CONFIGURE_OPTIONS  +=		jm_cv_func_working_realloc=yes

# because viewpathing isn't quite right in this version of a2ps
COMPONENT_PREP_ACTION = \
	(cd $(@D) ; \
	$(RM) mkinstalldirs ; \
	ln -s $(SOURCE_DIR)/auxdir/mkinstalldirs)

COMPONENT_TEST_ARGS += -k
COMPONENT_TEST_DIR =	$(@D)/tests
COMPONENT_TEST_TRANSFORMS += \
	'-e "s|^make.*: Leaving directory.*$$|XXX_REMOVE_XXX|g" ' \
	'-e "s|^make.*: Entering directory.*$$|XXX_REMOVE_XXX|g" ' \
	'-e "/^XXX_REMOVE_XXX$$/d" '

# Adjust '#!/usr/bin/perl'
PERL_SCRIPTS = \
	$(PROTOUSRBINDIR)/composeglyphs \
	$(PROTOUSRBINDIR)/ogonkify

REQUIRED_PACKAGES += developer/gperf
REQUIRED_PACKAGES += editor/gnu-emacs
REQUIRED_PACKAGES += library/libpaper
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += image/pspdfutils
