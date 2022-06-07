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
# Copyright (c) 2022, Oracle and/or its affiliates.
#

include $(WS_MAKE_RULES)/python-common.mk

# build the configured source
$(BUILD_DIR)/%/.built:	$(SOURCE_DIR)/.prep $(BUILD_DIR)/config-%/$(CFG)
	$(RM) -r $(@D) ; $(MKDIR) $(@D)
	$(COMPONENT_PRE_BUILD_ACTION)
	(cd $(SOURCE_DIR) ; $(ENV) HOME=$(BUILD_DIR)/config-$* $(COMPONENT_BUILD_ENV) \
		$(PYTHON.$(BITS)) -m build -nw -o $(BUILD_DIR)/$*/dist)
	$(COMPONENT_POST_BUILD_ACTION)
ifeq   ($(strip $(PARFAIT_BUILD)),yes)
	-$(PARFAIT) -e all -W --baseline-out=$(@D)/parfait.baseline -z $(SOURCE_DIR) -o $(@D)/parfait.report $(@D)
endif
	$(TOUCH) $@


COMPONENT_INSTALL_ARGS +=	--root $(PROTO_DIR)
COMPONENT_INSTALL_ARGS +=	--install-lib=$(PYTHON_LIB)
COMPONENT_INSTALL_ARGS +=	--install-data=$(PYTHON_DATA)
COMPONENT_INSTALL_ARGS +=	--force

PYDEPEND = $(WS_TOOLS)/pydepend

# install the built source into a prototype area
$(BUILD_DIR)/%/.installed:	$(BUILD_DIR)/%/.built $(BUILD_DIR)/config-%/$(CFG)
	$(COMPONENT_PRE_INSTALL_ACTION)
	(cd $(SOURCE_DIR) ; $(ENV) HOME=$(BUILD_DIR)/config-$* $(COMPONENT_INSTALL_ENV) \
		$(PYTHON.$(BITS)) $(WS_TOOLS)/pyinstaller $(COMPONENT_INSTALL_ARGS) $(BUILD_DIR)/$*/dist)
	$(COMPONENT_POST_INSTALL_ACTION)
	$(PYDEPEND) $(PYTHON_VERSION) $(PROTO_DIR)$(PYTHON_LIB)
	$(TOUCH) $@

ifneq ($(findstring 2.7, $(PYTHON_VERSIONS)),)
$(error pybuild cannot be used with Python 2.7)
endif
ifneq ($(findstring 3.7, $(PYTHON_VERSIONS)),)
REQUIRED_PACKAGES += library/python/build-37
REQUIRED_PACKAGES += library/python/installer-37
REQUIRED_PACKAGES += library/python/wheel-37
endif
ifneq ($(findstring 3.9, $(PYTHON_VERSIONS)),)
REQUIRED_PACKAGES += library/python/build-39
REQUIRED_PACKAGES += library/python/installer-39
REQUIRED_PACKAGES += library/python/wheel-39
endif
