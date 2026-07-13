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
# Copyright (c) 2015, 2026, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		developer/opensolaris/userland
COMPONENT_VERSION=
COMPONENT_SRC=
COMPONENT_ARCHIVE=
COMPONENT_ARCHIVE_SRC=	none
COMPONENT_PROJECT_URL=	https://github.com/oracle/solaris-userland
COMPONENT_ARCHIVE_URL=	https://github.com/oracle/solaris-userland.git
COMPONENT_BUGDB=	gate-stuff/userland

# This component collects REQUIRED_PACKAGES and CBE_PACKAGES from all other
# components. We do not need to check that the packages do exist here again.
SKIP_REQUIRED_PACKAGES_CHECK=

include $(WS_MAKE_RULES)/prep.mk

include $(WS_MAKE_RULES)/ips.mk

# The package is created in two parts: the checked-in manifest and a generated
# file of dependency actions based on the workspace requires.mk.
PKG_OPTIONS += -I $(BUILD_DIR)

$(WS_MACH)/requires.mk:
	(cd $(WS_COMPONENTS) ; $(GMAKE) $@)

# Do not include the existing requires.mk while the top-level process is
# regenerating it from scratch.
ifeq ($(REQUIRES_MK_GENERATION),)
-include $(WS_MACH)/requires.mk
endif

$(BUILD_DIR)/package.list:	$(BUILD_DIR) $(WS_MACH)/requires.mk
	@echo $(REQUIRED_PACKAGES:%="depend type=require fmri=pkg:/%\n") >$@

build install: $(BUILD_DIR)/package.list

test:	$(NO_TESTS)

system-test:    $(NO_TESTS)

# This component is not suitable for generating a report
NO_PKG_REPORT = 1

clean clobber::
	$(RM) -r $(BUILD_DIR)

#
# Packages with tools that are required by userland infrastructure
#

# Userland infrastructure is driven by GNU make
CBE_PACKAGES += developer/build/gnu-make

# We use HG as a versioning system
CBE_PACKAGES += developer/versioning/mercurial

# Utils to generate IPS packages
CBE_PACKAGES += package/pkg

# Some of our tools need python 3.11, bash or ksh
CBE_PACKAGES += runtime/python-311
CBE_PACKAGES += shell/bash
CBE_PACKAGES += shell/ksh93

# Public build machines do use sudo
CBE_PACKAGES += security/sudo

# Generic tools our infrastructure uses
CBE_PACKAGES += file/gnu-findutils
CBE_PACKAGES += text/gawk
CBE_PACKAGES += text/gnu-grep
CBE_PACKAGES += text/gnu-sed

# Generally useful tools for development
CBE_PACKAGES += developer/build/autoconf
CBE_PACKAGES += library/python/pipx
