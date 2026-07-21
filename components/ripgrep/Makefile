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
# Copyright (c) 2026, Oracle and/or its affiliates.
#

BUILD_BITS =		64
CTF_MODE =		off	# Has no effect
include ../../make-rules/shared-macros.mk

COMPONENT_NAME =	ripgrep
COMPONENT_VERSION =	15.1.0
COMPONENT_BAID =	409192
COMPONENT_PROJECT_URL =	https://github.com/BurntSushi/ripgrep
COMPONENT_SRC =		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE =	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH = \
    sha256:046fa01a216793b8bd2750f9d68d4ad43986eb9c0d6122600f993906012972e8
COMPONENT_ARCHIVE_URL =	$(COMPONENT_PROJECT_URL)/archive/$(COMPONENT_VERSION).tar.gz

# hash for vendored sources
COMPONENT_ARCHIVE_HASH_crates = \
    sha256:6ca5b4bdabe425683eaf03e231f140c0b64e5ea5f00ebbc01fc945ea65921030

COMPONENT_BUGDB =	utility/ripgrep
COMPONENT_ANITYA_ID =	15461

BUILD_STYLE = cargo

include $(WS_MAKE_RULES)/common.mk

RIPGREP_FEATURES =	pcre2

COMPONENT_BUILD_ACTION = \
	cd $(@D); $(ENV) $(COMPONENT_BUILD_ENV) \
	$(CARGO) build --release --frozen --features $(RIPGREP_FEATURES)

COMPONENT_INSTALL_ACTION = \
	cd $(@D); $(ENV) $(COMPONENT_INSTALL_ENV) \
	$(CARGO) install --path . --root=$(PROTO_DIR) --force \
	    --features $(RIPGREP_FEATURES)

COMPONENT_POST_INSTALL_ACTION += \
	$(RM) $(PROTO_DIR)/.crates.toml $(PROTO_DIR)/.crates2.json; \
	$(MKDIR) $(PROTOUSRSHAREMAN1DIR) \
	    $(PROTOUSRSHAREDIR)/bash-completion/completions \
	    $(PROTOUSRSHAREDIR)/zsh/site-functions; \
	$(PROTO_DIR)/bin/rg --generate man > $(PROTOUSRSHAREMAN1DIR)/rg.1; \
	$(PROTO_DIR)/bin/rg --generate complete-bash \
	    > $(PROTOUSRSHAREDIR)/bash-completion/completions/rg; \
	$(PROTO_DIR)/bin/rg --generate complete-zsh \
	    > $(PROTOUSRSHAREDIR)/zsh/site-functions/_rg

# Everything expects GNU utilities, so make sure those are preferred.
PATH = /usr/gnu/bin:/usr/bin

COMPONENT_TEST_TARGETS += --features $(RIPGREP_FEATURES) -- --test-threads=1
COMPONENT_TEST_TRANSFORMS += \
	'-e "s;$(BUILD_DIR)/.cargo;\$$(BUILD_DIR)/.cargo;" ' \
	'-e "/ *Compiling /d" ' \
	'-e "/^ *Running /s;-................)$$;-xxxxxxxxxxxxxxxx);" ' \
	'-e "/Finished /s; in .*;;" ' \
	'-e "/^test result:/s; finished in .*;;" '

REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libc
