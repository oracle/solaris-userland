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
# Copyright (c) 2010, 2019, Oracle and/or its affiliates. All rights reserved.
#

SUBDIRS = components

download:	TARGET = download
unpack:		TARGET = unpack
patch:		TARGET = patch
prep:		TARGET = prep
build:		TARGET = build
install:	TARGET = install
publish:	TARGET = publish
validate:	TARGET = validate
clean:		TARGET = clean
clobber:	TARGET = clobber
setup:		TARGET = setup
test:		TARGET = test
system-test:	TARGET = system-test
check_rtime:	TARGET = check_rtime
component-hook:		TARGET = component-hook

.DEFAULT_GOAL :=	publish

download setup unpack patch prep build install publish validate clean clobber \
test system-test component-hook check_rtime: $(SUBDIRS)

JOBS_PER_COMPONENT ?= 1

$(SUBDIRS):	FORCE
	@+echo "$(TARGET) $@" ; env COMPONENT_MAKE_JOBS=$(JOBS_PER_COMPONENT) $(MAKE) -C $@ $(TARGET)

FORCE:
.PHONY: FORCE
