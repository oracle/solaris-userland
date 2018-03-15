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
# Copyright (c) 2013, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS= 64
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		smp_utils
COMPONENT_VERSION=	0.98
COMPONENT_PROJECT_URL= http://sg.danny.cz/sg/smp_utils.html
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tgz
COMPONENT_ARCHIVE_HASH= \
    sha256:eb1952a192992bc60c7c84301f43d57fd386d6dcc9eef3f018a94114a38bb7e0
COMPONENT_ARCHIVE_URL=	http://sg.danny.cz/sg/p/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	utility/smputils
COMPONENT_ANITYA_ID=	4840

TPNO=			39251

include $(WS_MAKE_RULES)/common.mk

CPPFLAGS += -I$(COMPONENT_DIR)/$(COMPONENT_SRC)/include
CONFIGURE_OPTIONS +=	--disable-static

# Don't use rpath!
COMPONENT_POST_CONFIGURE_ACTION = \
	(cd $(BUILD_DIR_64) ; \
	$(GSED) -i 's|^hardcode_libdir_flag_spec=.*|hardcode_libdir_flag_spec=""|g' libtool ; \
	$(GSED) -i 's|^runpath_var=LD_RUN_PATH|runpath_var=DIE_RPATH_DIE|g' libtool)

COMPONENT_INSTALL_ARGS += INSTALL=$(INSTALL)
COMPONENT_INSTALL_ARGS += INSTALL_TOP=$(PROTOUSRDIR) 
$(INSTALL_64):  COMPONENT_INSTALL_ARGS += INSTALL_LIB=$(PROTOUSRLIBDIR64)
$(INSTALL_64):  COMPONENT_INSTALL_ARGS += INSTALL_SBIN=$(PROTOUSRBINDIR)

COMPONENT_TEST_ENV +=	LD_LIBRARY_PATH=$(PROTOUSRLIBDIR64)
COMPONENT_TEST_CMD =	\
		$(PROTOUSRSBINDIR)/smp_conf_general -V; \
		$(PROTOUSRSBINDIR)/smp_conf_phy_event -V; \
		$(PROTOUSRSBINDIR)/smp_conf_route_info -V; \
		$(PROTOUSRSBINDIR)/smp_conf_zone_man_pass -V; \
		$(PROTOUSRSBINDIR)/smp_conf_zone_perm_tbl -V; \
		$(PROTOUSRSBINDIR)/smp_conf_zone_phy_info -V; \
		$(PROTOUSRSBINDIR)/smp_discover -V; \
		$(PROTOUSRSBINDIR)/smp_discover_list -V; \
		$(PROTOUSRSBINDIR)/smp_ena_dis_zoning -V; \
		$(PROTOUSRSBINDIR)/smp_phy_control -V; \
		$(PROTOUSRSBINDIR)/smp_phy_test -V; \
		$(PROTOUSRSBINDIR)/smp_read_gpio -V; \
		$(PROTOUSRSBINDIR)/smp_rep_broadcast -V; \
		$(PROTOUSRSBINDIR)/smp_rep_exp_route_tbl -V; \
		$(PROTOUSRSBINDIR)/smp_rep_general -V; \
		$(PROTOUSRSBINDIR)/smp_rep_manufacturer -V; \
		$(PROTOUSRSBINDIR)/smp_rep_phy_err_log -V; \
		$(PROTOUSRSBINDIR)/smp_rep_phy_event -V; \
		$(PROTOUSRSBINDIR)/smp_rep_phy_event_list -V; \
		$(PROTOUSRSBINDIR)/smp_rep_phy_sata -V; \
		$(PROTOUSRSBINDIR)/smp_rep_route_info -V; \
		$(PROTOUSRSBINDIR)/smp_rep_self_conf_stat -V; \
		$(PROTOUSRSBINDIR)/smp_rep_zone_man_pass -V; \
		$(PROTOUSRSBINDIR)/smp_rep_zone_perm_tbl -V; \
		$(PROTOUSRSBINDIR)/smp_write_gpio -V; \
		$(PROTOUSRSBINDIR)/smp_zone_activate -V; \
		$(PROTOUSRSBINDIR)/smp_zone_lock -V; \
		$(PROTOUSRSBINDIR)/smp_zone_unlock -V; \
		$(PROTOUSRSBINDIR)/smp_zoned_broadcast -V

