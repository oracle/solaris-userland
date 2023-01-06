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
# Copyright (c) 2014, 2022, Oracle and/or its affiliates.
#
BUILD_BITS= 64
BUILD_ARCH= i386
COMPILER= gcc
# The golang build process doesn't work with Parfait.
export PARFAIT_BUILD=no

include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		golang
COMPONENT_VERSION=	1.19.4
COMPONENT_MAJOR_VERSION= \
	$(shell echo $(COMPONENT_VERSION) | $(GSED) -e 's/\([0-9]\+\.[0-9]\+\).*/\1/')
COMPONENT_PROJECT_URL=	https://golang.org/
COMPONENT_ARCHIVE=	go$(COMPONENT_VERSION).src.tar.gz
COMPONENT_ARCHIVE_URL=	https://storage.googleapis.com/golang/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH=	 \
	sha256:5366b73b19936a0a1fcaa977e85204868a6e8cf82b4f4602bc276f3ead634f32
COMPONENT_PROJECT_URL=	https://golang.org
COMPONENT_ANITYA_ID=	1227
COMPONENT_BAID=		135087

# Use a simple copy instead of cloney.
CLONEY := echo
COMPONENT_PRE_BUILD_ACTION = $(CP) -rp $(SOURCE_DIR)/. $(@D)

# Bake in where Go package will be installed.
GOROOT_FINAL=		/usr/lib/golang/
COMPONENT_BUILD_ENV +=	GOROOT_FINAL="$(GOROOT_FINAL)"
COMPONENT_BUILD_ENV +=	GOOS="solaris"

BUILD_STYLE= justmake
BUILD_64 += $(BUILD_DIR)/man1/go.1
INSTALL_64 := build $(INSTALL_64)

ifeq ($(MACH),i386)
TEST_TARGET=           $(TEST_64)
else
TEST_TARGET=           $(NO_TESTS)
endif

include $(WS_MAKE_RULES)/common.mk

# Avoid some of the default transforms:
# - facet.devel serves no useful purpose for a development package
# - facet.doc wrongly assumes all things in a doc directory are documentation;
#   in Go's case, some are binaries
PUBLISH_TRANSFORMS := \
	$(filter-out $(WS_TOP)/transforms/devel $(WS_TOP)/transforms/docs, $(PUBLISH_TRANSFORMS))

# Standard manifest cleanup drops all static libraries, but in this case,
# delivering those makes sense. Because of that, Golang uses modified cleanup
# transformation where static libraries are not touched.
MANIFEST_CLEANUP_TRANSFORM = $(COMPONENT_DIR)/manifest-check-cleanup

COMPONENT_POST_UNPACK_ACTION= \
	$(MV) go $(COMPONENT_SRC)

# Go doesn't have a standard Makefile-based build process, so override the
# default.
COMPONENT_BUILD_ACTION=	\
	cd $(@D)/src; $(ENV) $(COMPONENT_BUILD_ENV) ./make.bash

COMPONENT_TARGET_DIR= \
	$(PROTOUSRLIBDIR)/$(COMPONENT_NAME)

# We can't do any ASLR'ing as the Go 6l linker has no understanding of the
# -z aslr=... option. So just override where needed in the .p5m files.
ASLR_MODE = $(ASLR_DISABLE)

COMPONENT_TEST_ENV +=	PATH="$(@D)/bin:$(PATH)"
COMPONENT_TEST_ENV +=	GOROOT="$(@D)"
COMPONENT_TEST_DIR=	$(@D)/src
COMPONENT_TEST_CMD=	./run.bash
COMPONENT_TEST_TARGETS=


XML2ROFF= $(USRSHAREDIR)/xml/xsolbook/python/xml2roff.py

$(BUILD_DIR)/man1/go.1:
	$(XML2ROFF) $(COMPONENT_DIR)/docs/go.1 -o $(BUILD_DIR)

define COMPONENT_INSTALL_ACTION=
	($(MKDIR) $(COMPONENT_TARGET_DIR)/src); \
	(cd $(SOURCE_DIR) && \
	$(GNUBIN)/find . -maxdepth 1 -path "./$(COMPONENT_SRC_NAME)" \
	  -prune -o \( ! -iname ".*" \) -print \
	  -exec $(GNUBIN)/cp -r \
	  --parents {} $(COMPONENT_TARGET_DIR) \;); \
	(cd $(BUILD_DIR_64) && \
	$(GNUBIN)/find src -type f \
		-exec $(GNUBIN)/cp --parents {} $(COMPONENT_TARGET_DIR) \;); \
	(cd $(BUILD_DIR_64) && $(CP) -r bin $(COMPONENT_TARGET_DIR)/); \
	(cd $(BUILD_DIR_64) && $(CP) -r pkg $(COMPONENT_TARGET_DIR)/); \
	($(MKDIR) $(PROTOUSRSHAREDIR)/man); \
	($(CP) -R $(BUILD_DIR)/man1 $(PROTOUSRSHAREDIR)/man);
endef

PERL_SCRIPTS= \
  $(PROTOUSRLIBDIR)/golang/src/regexp/syntax/make_perl_groups.pl \
  $(PROTOUSRLIBDIR)/golang/src/syscall/mksyscall.pl \
  $(PROTOUSRLIBDIR)/golang/src/syscall/mksyscall_libc.pl \
  $(PROTOUSRLIBDIR)/golang/src/syscall/mksysctl_openbsd.pl \
  $(PROTOUSRLIBDIR)/golang/src/syscall/mksysnum_dragonfly.pl \
  $(PROTOUSRLIBDIR)/golang/src/syscall/mksysnum_freebsd.pl \
  $(PROTOUSRLIBDIR)/golang/src/syscall/mksysnum_linux.pl \
  $(PROTOUSRLIBDIR)/golang/src/syscall/mksysnum_netbsd.pl \
  $(PROTOUSRLIBDIR)/golang/src/syscall/mksysnum_openbsd.pl


ifeq ($(MACH), i386)
# Used during the build.
REQUIRED_PACKAGES += developer/gcc
REQUIRED_PACKAGES += developer/versioning/git
# Go bootstraps itself using Go, so at least one previous version must already
# be installed.
REQUIRED_PACKAGES += developer/golang
# Used in this Makefile.
REQUIRED_PACKAGES += file/gnu-findutils
REQUIRED_PACKAGES += text/gnu-sed
# Required to build man pages.
REQUIRED_PACKAGES += developer/documentation-tool/xml2roff
# There's a single test script which requires perl.
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/header
REQUIRED_PACKAGES += system/library
# Used for cgo support at runtime; we don't add a package dependency since cgo
# support is optional.
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/linker
endif
