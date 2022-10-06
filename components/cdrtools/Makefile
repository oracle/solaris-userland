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
# Copyright (c) 2011, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64

# Parallel mode can be enabled only if GNU make is used.
COMPONENT_MAKE_JOBS=1

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         cdrtools
RELEASE_VERSION=	2022-09-18
COMPONENT_VERSION=	$(subst -,,$(RELEASE_VERSION))
COMPONENT_PROJECT_URL= 	https://codeberg.org/schilytools
COMPONENT_SRC=		schilytools
COMPONENT_ARCHIVE=      $(RELEASE_VERSION).tar.gz
COMPONENT_ARCHIVE_HASH=	sha256:67b258cbdeb6299e6d7b281e0432d7aa32675387d0d34410b4ea673a50413e25
COMPONENT_ARCHIVE_URL=  $(COMPONENT_PROJECT_URL)/schilytools/archive/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	9153

COMPONENT_BAID=		131090

ifeq ($(strip $(PARFAIT_BUILD)),yes)
PATH=$(PARFAIT_TOOLS):$(SPRO_VROOT)/bin:$(USRBINDIR)
else
PATH=$(SPRO_VROOT)/bin:$(USRBINDIR):$(GNUBIN)
endif

C_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

BUILD_STYLE= justmake
TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

COMPONENT_BUILD_ENV +=	MAKE="$(CCSMAKE)"	# Schilytools requires CCS make
COMPONENT_BUILD_ENV +=	LDFLAGS="$(CC_BITS)"	# Propagate correct LDFLAGS to the linking phase.

ifeq ($(strip $(PARFAIT_BUILD)),yes)
COMPONENT_BUILD_ENV +=	"ac_cv_exeext=no"
COMPONENT_BUILD_ENV +=	"ac_cv_objext=o"
endif

# Re-create license file. Remove parts we do not deliver from COPYING and
# Schily.Copyright. Append all the main licenses. There are latin-1 characters,
# so finally recode to UTF-8.
DIST_COPYING=		$(SOURCE_DIR)/COPYING
DIST_COPYRIGHT=		$(SOURCE_DIR)/Schily.Copyright
DIST_LICENSES=		$(SOURCE_DIR)/CDDL.Schily.txt $(SOURCE_DIR)/GPL-2.0.txt $(SOURCE_DIR)/LGPL-2.1.txt
DELIVERABLES=		cdda2wav|cdrecord|mkisofs|readcd
cdrtools.license: $(DIST_COPYING) $(DIST_COPYRIGHT) $(DIST_LICENSES)
	(echo "### $(notdir $(DIST_COPYING)) file follows.";\
	gawk '/^[[:alpha:]]+\// {progs = 1}\
		progs && /^$$/ {progs = 0}\
		!progs {print; next}\
		progs && follow && /^[[:space:]]+/ {print; next}\
		follow && /[^[:space:]]/ {follow = 0}\
		/^($(DELIVERABLES))\// {follow = 1; print}' $(DIST_COPYING);\
	echo "\n\n### $(notdir $(DIST_COPYRIGHT)) file follows.";\
	gawk 'BEGIN {follow = 1}\
		/^The buildsystem/ {finish = 1}\
		finish {print; next}\
		follow && /^-+$$/ {print; follow = 0; next}\
		follow {print}\
		/^* ($(DELIVERABLES))/ {follow = 1; print}' $(DIST_COPYRIGHT);\
	for file in $(DIST_LICENSES); do\
		echo "\n\n### $$(basename $$file) file follows.";\
		cat $$file;\
	done) |\
	iconv -f ISO-8859-1 -t UTF-8 - >$@

REQUIRED_PACKAGES += developer/build/make
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += library/audio/pulseaudio
