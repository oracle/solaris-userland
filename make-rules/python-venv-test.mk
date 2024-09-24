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

VENV_SRC = test_venv
VENV_DIR = $(COMPONENT_DIR)/$(VENV_SRC)

CLEAN_PATHS += $(VENV_SRC)

TEST_VENV = $(PYTHON_VERSIONS:%=$(VENV_DIR)/venv-%/.ready)

$(VENV_DIR)/%/.ready: $(MAKEFILE_PREREQ)
	$(RM) -rf $(VENV_DIR)/venv-$(PYTHON_VERSION);
	$(PYTHON) -m venv --system-site-packages $(VENV_DIR)/venv-$(PYTHON_VERSION);
	$(VENV_DIR)/venv-$(PYTHON_VERSION)/bin/pip --disable-pip-version-check install \
		--no-deps $(PYTHON_VENV_TEST_COMPONENTS);
	$(TOUCH) $@

venv: $(TEST_VENV)

VENV_PYTHON=$(VENV_DIR)/venv-$(PYTHON_VERSION)/bin/python

define define-venv-targets
$(VENV_DIR)/venv-$(1)/.ready:	PYTHON_VERSION=$(1)

$(BUILD_DIR)/$(MACH)-$(1)/.tested: $(VENV_DIR)/venv-$(1)/.ready
$(BUILD_DIR)/$(MACH)-$(1)/.tested-and-compared: $(VENV_DIR)/venv-$(1)/.ready
$(BUILD_DIR)/$(MACH)-$(1)/.system-tested: $(VENV_DIR)/venv-$(1)/.ready
$(BUILD_DIR)/$(MACH)-$(1)/.system-tested-and-compared: $(VENV_DIR)/venv-$(1)/.ready

$(BUILD_DIR)/$(MACH64)-$(1)/.tested: $(VENV_DIR)/venv-$(1)/.ready
$(BUILD_DIR)/$(MACH64)-$(1)/.tested-and-compared: $(VENV_DIR)/venv-$(1)/.ready
$(BUILD_DIR)/$(MACH64)-$(1)/.system-tested: $(VENV_DIR)/venv-$(1)/.ready
$(BUILD_DIR)/$(MACH64)-$(1)/.system-tested-and-compared: $(VENV_DIR)/venv-$(1)/.ready
endef

# Create targets for each Python version current component is delivered for.
$(foreach pyver, $(PYTHON_VERSIONS), \
	$(eval $(call define-venv-targets,$(pyver))) \
)
