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
# Copyright (c) 2010, 2025, Oracle and/or its affiliates.
#

# The Makefile of this component does not support multiple build jobs.
COMPONENT_MAKE_JOBS=1

CTF_MODE =		off	# Has no effect
include ../../make-rules/shared-macros.mk

LD_Z_IGNORE =

COMPONENT_NAME=	open-fabrics
COMPONENT_VERSION=3.18
COMPONENT_SRC=

COMPONENT_PROJECT_URL=	http://www.openfabrics.org/
COMPONENT_BUGDB=	library/ofuv_lib
COMPONENT_ANITYA_ID=	17225

COMPONENT_BAID_IBUTILS=	26510
COMPONENT_BAID_INFINIBAND_DIAGS=	26509
COMPONENT_BAID_LIBIBMAD=	26446
COMPONENT_BAID_LIBIBUMAD=	26506
COMPONENT_BAID_LIBIBVERBS=	27059
COMPONENT_BAID_LIBMLX4=	27060
COMPONENT_BAID_LIBRDMACM=	27054
COMPONENT_BAID_OPENSM=	26507
COMPONENT_BAID_QPERF=	26508
COMPONENT_BAID_LIBSDP=	159559
COMPONENT_BAID_PERFTEST=	159556
COMPONENT_BAID_RDS_TOOLS=	159540

# for now, everything with a Makefile should be built
SUBDIRS =	$(shell echo */Makefile | sed -e 's;/Makefile;;g')

include ofed.mk
include $(WS_MAKE_RULES)/ips.mk

# Do not apply the standard license transforms for this component. The
# license actions in the open-fabrics.p5m file are already tagged with the
# attributes.
LICENSE_TRANSFORMS =

.PHONY:	$(SUBDIRS)

download::		TARGET = download
unpack::		TARGET = unpack
patch::			TARGET = patch
prep::			TARGET = prep
install:		TARGET = install
clean:			TARGET = clean
clobber:		TARGET = clobber
test:			TARGET = test
system-test:		TARGET = system-test
parfait:		TARGET = parfait

build:		install

.DEFAULT:	publish

download unpack patch prep::	$(SUBDIRS)
install test system-test: $(SUBDIRS)

parfait:
	$(MAKE) PARFAIT_BUILD=yes install

clean::	$(SUBDIRS)
	$(RM) -r prototype build

clobber::	$(SUBDIRS) clean

$(SUBDIRS):	FORCE
	@cd $@ && echo "$(TARGET) $@" && $(MAKE) $(TARGET)

# GNU Build System files have to be regenerated for automake 1.16.
# It can be removed when the upstream starts to use a newer automake version.
COMPONENT_PREP_ACTION = (cd $(@D) ; autoreconf -fiv)

# declare module dependencies
librdmacm:		libibverbs
libmlx4:		libibverbs
rds-tools:		libibverbs
perftest:		libibverbs librdmacm
qperf:			libibverbs librdmacm
libibumad:		libibverbs
libibmad:		libibumad
opensm:			libibumad libibmad
ibutils:		opensm
infiniband-diags:	libibverbs opensm

FORCE:

REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += runtime/tcl-8
REQUIRED_PACKAGES += shell/bash
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/math
