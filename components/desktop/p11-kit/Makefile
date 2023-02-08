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
# Copyright (c) 2015, 2023, Oracle and/or its affiliates.
#

BUILD_BITS =            64_and_32
COMPILER=		gcc

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		p11-kit
COMPONENT_VERSION=	0.24.1
COMPONENT_PROJECT_URL=	https://p11-glue.github.io/p11-glue/p11-kit.html
COMPONENT_ARCHIVE=	$(COMPONENT_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:27f3c23531b24a2672ab198a3118f4f399d3a1faa8697924cc8a1065a17ead25
COMPONENT_ARCHIVE_URL=	https://github.com/p11-glue/p11-kit/archive/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	gnome/security
COMPONENT_ANITYA_ID=	2582

COMPONENT_BAID=		135546

include $(WS_MAKE_RULES)/common.mk

studio_C99MODE=$(studio_C99_ENABLE)

# Needed due to patch to automake-related files.
# Remove the perl substitution when the patched gettext will get to CBE (bug 30997231).
COMPONENT_PREP_ACTION += ( \
	cd $(@D); \
	autoreconf -fiv; \
	perl -i -pe 's/\@MSGMERGE_FOR_MSGFMT_OPTION\@//' po/Makefile.in.in; \
);

CONFIGURE_ENV += CFLAGS="$(CFLAGS)"
CONFIGURE_OPTIONS += --enable-doc
CONFIGURE_OPTIONS += --localstatedir=$(VARDIR)
CONFIGURE_OPTIONS += --sysconfdir=$(ETCDIR)
CONFIGURE_OPTIONS.32 += --with-module-path=/usr/lib/security
CONFIGURE_OPTIONS.64 += --with-module-path=/usr/lib/security/$(MACH64)
CONFIGURE_OPTIONS += --with-trust-paths=/etc/certs/ca-certificates.crt
CONFIGURE_OPTIONS += --libexecdir=$(CONFIGURE_LIBDIR.$(BITS))

$(SKIP_TEST_AT_TOP_LEVEL)
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += \
        '-n ' \
        '-e "/TOTAL:/p" ' \
        '-e "/SKIP:/p" ' \
        '-e "/PASS:/p" ' \
        '-e "/FAIL:/p" ' \
        '-e "/ERROR:/p" '

REQUIRED_PACKAGES += developer/build/gnu-make
REQUIRED_PACKAGES += developer/documentation-tool/gtk-doc 
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/libtasn1
REQUIRED_PACKAGES += library/libxslt
