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
# Copyright (c) 2020, Oracle and/or its affiliates.
#

#
# Define both PKG and PKGCMD macro to pkg binary, so the latter can be
# ovverriden without side-effects.
#
PKG=			/usr/bin/pkg
PKGCMD=			$(PKG)
PKG_INST_DIRS=		. $(foreach wc, $(REQUIRED_COMPONENTS), \
				$(wildcard $(WS_COMPONENTS)/$(wc)))
PKG_INST_SET_PUBLISHER=	$(PKGCMD) set-publisher --non-sticky solaris
PKG_INST_CHANGE_FACET=	$(PKGCMD) change-facet $(PKG_INST_FACETS)
PKG_INST_INSTALL=	$(PKGCMD) install --accept -g $(PKG_REPO) \
				$(PKG_INST_FLAGS) $(PKG_INST_PACKAGES)
#
# Existing nightly publisher on the system or its attributes might cause
# conflicts when resolving dependencies. Rely on passing full fmris to pkg
# install.
#
ifdef PKG_INST_FORCE
PKG_INST_NIGHTLY_CHECK= \
	$(if $(shell $(PKG) publisher $(PUBLISHER)> /dev/null 2>&1 && echo 1), \
		$(PKGCMD) unset-publisher $(PUBLISHER))
else
PKG_INST_NIGHTLY_CHECK= \
	$(if $(shell $(PKG) publisher $(PUBLISHER)> /dev/null 2>&1 && echo 1), \
		$(error error: $(PUBLISHER) publisher found, \
		unset it first or remove it automatically by re-running gmake \
		defining macro PKG_INST_FORCE=1))
endif

PKG_INST_PACKAGES=	\
	$(shell $(MAKE) --no-print-directory pkg_install.packages)
PKG_INST_VERSION_LOCKS=	\
	$(shell $(MAKE) --no-print-directory pkg_install.version-locks)
PKG_INST_FACETS=	$(PKG_INST_VERSION_LOCKS) $(PKG_INST_EXTRA_FACETS)

pkg_inst::
	$(PKG_INST_NIGHTLY_CHECK)
	-$(PKG_INST_SET_PUBLISHER)
	-$(PKG_INST_CHANGE_FACET)
	$(PKG_INST_INSTALL)

#
# GNU make implicitly exports macros that were defined on the command line to
# sub-makes via MAKEFLAGS variable. However, this feature doesn't work if
# sub-make is invoked from within $(shell ...) function. That's case of
# passing down REQUIRED_COMPONENTS macro. At time of sub-make invocation from
# $(shell ...) MAKEFLAGS is still empty. Ensure that macros defined on command
# line make it to MAKEFLAGS by explicitly invoking a regular sub-make for
# (common) pkg_inst target.
#
ifdef PKG_INST_DEBUG
pkg_install::
	@($(MAKE) --no-print-directory pkg_inst PKG_INST_FORCE=1 \
		PKGCMD='print -u3 pkg' > /dev/null ) 3>&1
else
pkg_install::
	@$(MAKE) pkg_inst --no-print-directory
endif

pkg_install.version-lock:: HISTORICAL_MANIFESTS=
pkg_install.version-lock::
	@($(PKGMOGRIFY) $(PKG_OPTIONS) -P /dev/fd/3 \
		$(PUBLISHED) \
		$(WS_TRANSFORMS)/auto_fmri \
		$(WS_TRANSFORMS)/pkg_install.version-lock > /dev/null) 3>&1

pkg_install.package:: HISTORICAL_MANIFESTS=
pkg_install.package::
	@($(PKGMOGRIFY) $(PKG_OPTIONS) -P /dev/fd/3 \
		$(PUBLISHED) \
		$(WS_TRANSFORMS)/auto_fmri \
		$(WS_TRANSFORMS)/pkg_install.package > /dev/null) 3>&1

pkg_install.version-locks::
	@print $(foreach dir, $(PKG_INST_DIRS), \
		$(shell $(MAKE) -C "$(dir)" --no-print-directory \
		pkg_install.version-lock))

pkg_install.packages::
	@print $(foreach dir, $(PKG_INST_DIRS), \
		$(shell $(MAKE) -C "$(dir)" --no-print-directory \
		pkg_install.package))
