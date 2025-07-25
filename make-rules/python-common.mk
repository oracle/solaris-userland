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

CONSOLIDATION = python

$(BUILD_DIR)/%-3.9/.built:		PYTHON_VERSION=3.9
$(BUILD_DIR)/%-3.11/.built:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.built:		PYTHON_VERSION=3.13
$(BUILD_DIR)/$(MACH64)-%/.built:	BITS=64

$(BUILD_DIR)/%-3.9/.installed:		PYTHON_VERSION=3.9
$(BUILD_DIR)/%-3.11/.installed:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.installed:		PYTHON_VERSION=3.13
$(BUILD_DIR)/$(MACH64)-%/.installed:	BITS=64

$(BUILD_DIR)/%-3.9/.tested:		PYTHON_VERSION=3.9
$(BUILD_DIR)/%-3.11/.tested:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.tested:		PYTHON_VERSION=3.13
$(BUILD_DIR)/$(MACH64)-%/.tested:	BITS=64

$(BUILD_DIR)/%-3.9/.tested-and-compared:	PYTHON_VERSION=3.9
$(BUILD_DIR)/%-3.11/.tested-and-compared:	PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.tested-and-compared:	PYTHON_VERSION=3.13
$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared:	BITS=64

$(BUILD_DIR)/%-3.9/.system-tested:		PYTHON_VERSION=3.9
$(BUILD_DIR)/%-3.11/.system-tested:		PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.system-tested:		PYTHON_VERSION=3.13
$(BUILD_DIR)/$(MACH64)-%/.system-tested:	BITS=64

$(BUILD_DIR)/%-3.9/.system-tested-and-compared:		PYTHON_VERSION=3.9
$(BUILD_DIR)/%-3.11/.system-tested-and-compared:	PYTHON_VERSION=3.11
$(BUILD_DIR)/%-3.13/.system-tested-and-compared:	PYTHON_VERSION=3.13
$(BUILD_DIR)/$(MACH64)-%/.system-tested-and-compared:	BITS=64

BUILD_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.built)
BUILD_NO_ARCH = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH)-%/.built)

INSTALL_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.installed)
INSTALL_NO_ARCH = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH)-%/.installed)

PYTHON_ENV =	CC="$(CC)"
ifeq ($(COMPILER),gcc)
PYTHON_ENV +=	CXX="$(CXX)"
PYTHON_ENV +=	LDSHARED="$(CC) -shared"
PYTHON_ENV +=	LDCXXSHARED="$(CXX) -shared"
endif
PYTHON_ENV +=	CFLAGS="$(CFLAGS)"
PYTHON_ENV +=	PATH="$(PATH):$(SPRO_VROOT)/bin"
PYTHON_ENV +=	PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)"

COMPONENT_BUILD_ENV += $(PYTHON_ENV)
COMPONENT_INSTALL_ENV += $(PYTHON_ENV)
COMPONENT_TEST_ENV += $(PYTHON_ENV)
COMPONENT_SYSTEM_TEST_ENV += $(PYTHON_ENV)

# List of all PYTHON_VERSIONS without the dot.
PYVS = $(shell echo $(PYTHON_VERSIONS) | tr -d .)

# Create a distutils config file specific to the combination of build
# characteristics (bittedness x Python version), and put it in its own
# directory.  We can set $HOME to point distutils at it later, allowing
# the install phase to find the temporary build directories.
CFG=.pydistutils.cfg
$(BUILD_DIR)/config-%/$(CFG):
	$(MKDIR) $(@D)
	echo "[build]\nbuild_base = $(BUILD_DIR)/$*" > $@


# Remove _solaris_dep file generated by pydepend. We need it during the resolve
# phase to determine package dependencies, but we don't want to ship it.
POSTRESOLVE_TRANSFORMS += $(WS_TOP)/transforms/remove_solaris_dep

# Define bit specific and Python version specific filenames.
COMPONENT_TEST_BUILD_DIR = $(BUILD_DIR)/test/$(PYTHON_VERSION)
COMPONENT_TEST_MASTER =	$(COMPONENT_TEST_RESULTS_DIR)/results-$(PYTHON_VERSION).master
COMPONENT_TEST_OUTPUT =	$(COMPONENT_TEST_BUILD_DIR)/test-$(PYTHON_VERSION)-results
COMPONENT_TEST_DIFFS =	$(COMPONENT_TEST_BUILD_DIR)/test-$(PYTHON_VERSION)-diffs
COMPONENT_TEST_SNAPSHOT = $(COMPONENT_TEST_BUILD_DIR)/results-$(PYTHON_VERSION).snapshot
COMPONENT_TEST_TRANSFORM_CMD = $(COMPONENT_TEST_BUILD_DIR)/transform-$(PYTHON_VERSION)-results

COMPONENT_TEST_DEP =	$(BUILD_DIR)/%/.installed
COMPONENT_TEST_DIR =	$(COMPONENT_SRC)/test
COMPONENT_TEST_ENV_CMD =	$(ENV)
COMPONENT_TEST_ENV +=	PYTHONPATH=$(PROTO_DIR)$(PYTHON_VENDOR_PACKAGES)
COMPONENT_TEST_CMD =	$(PYTHON)
COMPONENT_TEST_ARGS +=	./runtests.py

# use the same values as for component test
COMPONENT_SYSTEM_TEST_DIR =	$(COMPONENT_TEST_DIR)
COMPONENT_SYSTEM_TEST_ENV_CMD =	$(COMPONENT_TEST_ENV_CMD)
COMPONENT_SYSTEM_TEST_CMD =	$(COMPONENT_TEST_CMD)
COMPONENT_SYSTEM_TEST_ARGS =	$(COMPONENT_TEST_ARGS)

# except for the following which are always different
COMPONENT_SYSTEM_TEST_DEP =	$(SOURCE_DIR)/.prep
COMPONENT_SYSTEM_TEST_ENV +=	PYTHONPATH=$(PYTHON_VENDOR_PACKAGES)

# determine the type of tests we want to run.
ifeq ($(strip $(wildcard $(COMPONENT_TEST_RESULTS_DIR)/results*.master)),)
TEST_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.tested)
TEST_NO_ARCH = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH)-%/.tested)
else
TEST_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.tested-and-compared)
TEST_NO_ARCH = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH)-%/.tested-and-compared)
endif

ifeq ($(strip $(wildcard $(COMPONENT_SYSTEM_TEST_RESULTS_DIR)/results-*.master)),)
SYSTEM_TEST_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.system-tested)
SYSTEM_TEST_NO_ARCH = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH)-%/.system-tested)
else
SYSTEM_TEST_64 = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH64)-%/.system-tested-and-compared)
SYSTEM_TEST_NO_ARCH = $(PYTHON_VERSIONS:%=$(BUILD_DIR)/$(MACH)-%/.system-tested-and-compared)
endif

# Test the built source.  If the output file shows up in the environment or
# arguments, don't redirect stdout/stderr to it.
$(BUILD_DIR)/%/.tested-and-compared:    $(COMPONENT_TEST_DEP)
	$(RM) -rf $(COMPONENT_TEST_BUILD_DIR)
	$(MKDIR) $(COMPONENT_TEST_BUILD_DIR)
	$(COMPONENT_PRE_TEST_ACTION)
	-(cd $(COMPONENT_TEST_DIR) ; \
		$(COMPONENT_TEST_ENV_CMD) $(COMPONENT_TEST_ENV) $(COMPONENT_TEST_CMD) \
		$(if $(findstring pytest, $(COMPONENT_TEST_CMD)),-o console_output_style=classic,) $(COMPONENT_TEST_ARGS)) \
		$(if $(findstring $(COMPONENT_TEST_OUTPUT),$(COMPONENT_TEST_ENV)$(COMPONENT_TEST_ARGS)),,&> $(COMPONENT_TEST_OUTPUT))
	$(COMPONENT_POST_TEST_ACTION)
	$(COMPONENT_TEST_CREATE_TRANSFORMS)
	$(COMPONENT_TEST_PERFORM_TRANSFORM)
	$(COMPONENT_TEST_COMPARE)
	$(COMPONENT_TEST_CLEANUP)
	$(TOUCH) $@

$(BUILD_DIR)/%/.tested:    $(COMPONENT_TEST_DEP)
	$(COMPONENT_PRE_TEST_ACTION)
	(cd $(COMPONENT_TEST_DIR) ; \
		$(COMPONENT_TEST_ENV_CMD) $(COMPONENT_TEST_ENV) \
		$(COMPONENT_TEST_CMD) $(COMPONENT_TEST_ARGS))
	$(COMPONENT_POST_TEST_ACTION)
	$(COMPONENT_TEST_CLEANUP)
	$(TOUCH) $@

# Test the installed packages.  If the output file shows up in the environment
# or arguments, don't redirect stdout/stderr to it.
$(BUILD_DIR)/%/.system-tested-and-compared:    $(COMPONENT_SYSTEM_TEST_DEP)
	$(RM) -rf $(COMPONENT_TEST_BUILD_DIR)
	$(MKDIR) $(COMPONENT_TEST_BUILD_DIR)
	$(RM) -rf $(@D)
	$(MKDIR) $(@D)
	$(COMPONENT_PRE_SYSTEM_TEST_ACTION)
	-(cd $(COMPONENT_SYSTEM_TEST_DIR) ; \
		$(COMPONENT_SYSTEM_TEST_ENV_CMD) $(COMPONENT_SYSTEM_TEST_ENV) $(COMPONENT_SYSTEM_TEST_CMD) \
		$(if $(findstring pytest, $(COMPONENT_SYSTEM_TEST_CMD)),-o console_output_style=classic,) $(COMPONENT_SYSTEM_TEST_ARGS)) \
		$(if $(findstring $(COMPONENT_TEST_OUTPUT),$(COMPONENT_SYSTEM_TEST_ENV)$(COMPONENT_SYSTEM_TEST_ARGS)),,&> $(COMPONENT_TEST_OUTPUT))
	$(COMPONENT_POST_SYSTEM_TEST_ACTION)
	$(COMPONENT_TEST_CREATE_TRANSFORMS)
	$(COMPONENT_TEST_PERFORM_TRANSFORM)
	$(COMPONENT_TEST_COMPARE)
	$(COMPONENT_SYSTEM_TEST_CLEANUP)
	$(TOUCH) $@

$(BUILD_DIR)/%/.system-tested:    $(COMPONENT_SYSTEM_TEST_DEP)
	$(MKDIR) $(@D)
	$(COMPONENT_PRE_SYSTEM_TEST_ACTION)
	(cd $(COMPONENT_SYSTEM_TEST_DIR) ; \
		$(COMPONENT_SYSTEM_TEST_ENV_CMD) $(COMPONENT_SYSTEM_TEST_ENV) \
		$(COMPONENT_SYSTEM_TEST_CMD) $(COMPONENT_SYSTEM_TEST_ARGS))
	$(COMPONENT_POST_SYSTEM_TEST_ACTION)
	$(COMPONENT_SYSTEM_TEST_CLEANUP)
	$(TOUCH) $@

ifeq   ($(strip $(PARFAIT_BUILD)),yes)
parfait: build
else
parfait:
	$(MAKE) PARFAIT_BUILD=yes parfait
endif

# Make it easy to construct a URL for a pypi source download.  This
# construct supports an optional call to a number from
# NUM_EXTRA_ARCHIVES for multiple archive downloads.
pypi_url_multi = pypi:///$(if $(COMPONENT_NAME_$(1)),$(COMPONENT_NAME_$(1)),$(COMPONENT_NAME))==$(COMPONENT_VERSION_$(1))
pypi_url_single = pypi:///$(COMPONENT_NAME)==$(COMPONENT_VERSION)
pypi_url = $(if $(COMPONENT_VERSION_$(1)),$(pypi_url_multi),$(pypi_url_single))

ifneq ($(findstring 3.9, $(PYTHON_VERSIONS)),)
REQUIRED_PACKAGES += runtime/python-39
REQUIRED_PACKAGES += library/python/setuptools-39
REQUIRED_PACKAGES += library/python/pytest-39
endif
ifneq ($(findstring 3.11, $(PYTHON_VERSIONS)),)
REQUIRED_PACKAGES += runtime/python-311
REQUIRED_PACKAGES += library/python/setuptools-311
REQUIRED_PACKAGES += library/python/pytest-311
endif
ifneq ($(findstring 3.13, $(PYTHON_VERSIONS)),)
REQUIRED_PACKAGES += runtime/python-313
REQUIRED_PACKAGES += library/python/setuptools-313
REQUIRED_PACKAGES += library/python/pytest-313
endif
