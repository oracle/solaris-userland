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
# Copyright (c) 2024, 2026, Oracle and/or its affiliates.
#

COMPILER= studio
BUILD_BITS= 64

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libyaml
COMPONENT_VERSION=	0.2.5.20260821
COMPONENT_PROJECT_URL=	https://github.com/yaml/libyaml
GIT_REPO=		https://github.com/yaml/libyaml.git
GIT_COMMIT_ID=		90a56d4500aa1a1798514c5cb55c3ad4cb095f94
GIT_HASH=		sha256:eb0243900c671aed76f4b25c322d12d9d04cd4567420695e3320fb92589705d1

COMPONENT_ANITYA_ID=	1800
COMPONENT_BAID=		443369
COMPONENT_BUGDB=        library/libyaml

include $(WS_MAKE_RULES)/common.mk

# The configure script is not stored in the git repository.
COMPONENT_PREP_ACTION = (cd $(@D); ./bootstrap)

REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/libc
