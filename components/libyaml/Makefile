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
# Copyright (c) 2024, Oracle and/or its affiliates.
#

BUILD_BITS= 64

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		libyaml
COMPONENT_VERSION=	0.2.5
COMPONENT_PROJECT_URL=	https://pyyaml.org/wiki/LibYAML
COMPONENT_ARCHIVE_HASH=	sha256:c642ae9b75fee120b2d96c712538bd2cf283228d2337df2cf2988e3c02678ef4
COMPONENT_SRC_NAME=	yaml
COMPONENT_ARCHIVE_URL=	http://pyyaml.org/download/libyaml/$(COMPONENT_ARCHIVE)

COMPONENT_ANITYA_ID=	1800
COMPONENT_BAID=		163198
COMPONENT_BUGDB=        library/libyaml

include $(WS_MAKE_RULES)/common.mk
