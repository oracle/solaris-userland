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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

# This variable has no impact on perl build, it is here merely to satisfy
# "modernized" gate infrastructure. The bitness of the module is driven by the
# bitness of perl interpreter itself. That is hardcoded in
# $(WS_MAKE_RULES)/makemaker.mk
BUILD_BITS =		64
CTF_MODE =		off	# Has no effect

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		DBD-SQLite
COMPONENT_VERSION=	1.72
COMPONENT_ARCHIVE_HASH=	\
	sha256:5ca41e61eb52b52bd862a3088b912a75fe70910ac789b9a9983e0a449e94f551
COMPONENT_ARCHIVE_URL=	http://backpan.perl.org/authors/id/I/IS/ISHIGAKI/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	https://github.com/DBD-SQLite/DBD-SQLite
COMPONENT_BUGDB=	perl-mod/dbd-sqlite
COMPONENT_ANITYA_ID=	2810

COMPONENT_BAID=		137466

BUILD_STYLE= makemaker
LICENSE=DBD-SQLite.license
BUILD_TARGET= $(BUILD_$(MK_BITS)) $(LICENSE)

CLONEY=echo
COMPONENT_PRE_CONFIGURE_ACTION = $(CP) -r $(SOURCE_DIR)/* $(@D);

include $(WS_MAKE_RULES)/common.mk

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-all.master
COMPONENT_TEST_TRANSFORMS += '-n -e "/^Result:/p"'

# DBD::Sqlite ships custom sqlite3 sources. We remove the sources to make sure
# that we do not build/link against it. However just removing the files would
# break the build process. The next best thing is to make the files empty. The
# macro $(RM) is intentionaly not used here, as it contains '-f' parameter.
# Using plain 'rm' makes the action fail if the files are not found.
COMPONENT_PRE_CONFIGURE_ACTION+= ( \
	cd $(SOURCE_DIR) && \
	rm sqlite3.h sqlite3.c && \
	$(TOUCH) sqlite3.h sqlite3.c; \
)

# This makes the configuration process a bit more chatty
CONFIGURE_ENV += AUTOMATED_TESTING=1

CLEAN_PATHS += $(LICENSE)

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

$(LICENSE): $(LICENSE).template
	$(PERL) -pe 's/COMPONENT_VERSION/$(COMPONENT_VERSION)/g' "$<" > "$@"

REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += $(PERL_VERSIONS:5.%=library/perl-5/database-5%)
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
