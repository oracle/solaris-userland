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
# Copyright (c) 2012, 2020, Oracle and/or its affiliates.
#
BUILD_BITS= 64
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mod_wsgi
COMPONENT_VERSION=	4.7.1
COMPONENT_ARCHIVE_HASH=	sha256:a82467c80369c02dbe487e6559d8db3b1170073c767a946a8c4851e99690ab16
COMPONENT_ARCHIVE_URL=	https://pypi.python.org/packages/source/m/mod_wsgi/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=  https://modwsgi.readthedocs.io/
COMPONENT_BUGDB=	utility/apache
COMPONENT_ANITYA_ID=	2001

TPNO=			62529

# Don't use default CPPFLAGS; it causes Apache's custom CPP to fail.
CONFIGURE_CPPFLAGS=
VARIANTS_64 += $(BUILD_DIR)/apache24-python27
VARIANTS_64 += $(BUILD_DIR)/apache24-python37
VARIANTS_64 += $(BUILD_DIR)/apache24-python39
include ../modules.mk

# Python is now built in C99 mode and we need it too (24743682).
studio_C99MODE= $(studio_C99_ENABLE)

$(BUILD_DIR)/apache24-%/$(MACH64)/.configured: APXS=$(APACHE_24_USR_PREFIX)/bin/apxs BITS=64
$(BUILD_DIR)/apache24-%/$(MACH64)/.built: BITS=64
$(BUILD_DIR)/apache24-%/$(MACH64)/.tested: BITS=64

$(BUILD_DIR)/apache2%-python27/$(MACH64)/.configured: PYTHON=$(PYTHON.2.7.64)
$(BUILD_DIR)/apache2%-python37/$(MACH64)/.configured: PYTHON=$(PYTHON.3.7.64)
$(BUILD_DIR)/apache2%-python39/$(MACH64)/.configured: PYTHON=$(PYTHON.3.9.64)

COMPONENT_PRE_CONFIGURE_ACTION = \
	($(CLONEY) $(SOURCE_DIR) $(@D))

CONFIGURE_OPTIONS += --with-python=$(PYTHON)

REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += runtime/python-37
REQUIRED_PACKAGES += runtime/python-39
REQUIRED_PACKAGES += system/library/math
