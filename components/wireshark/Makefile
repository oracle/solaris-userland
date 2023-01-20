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
# Copyright (c) 2011, 2023, Oracle and/or its affiliates.
#
BUILD_BITS= 64
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		wireshark
COMPONENT_VERSION=	4.0.3
COMPONENT_BAID=		136493
COMPONENT_PROJECT_URL=	http://www.wireshark.org/
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.xz
COMPONENT_ARCHIVE_HASH=	\
    sha256:6c51e15bcc0afb93734e686dbff354ffd159f570bd2904bcbbad6f3feb7e9511
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)download/src/all-versions/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	5137

COMPONENT_ARCHIVE_1 = $(COMPONENT_SRC)-docs-generated.tar.bz2
COMPONENT_ARCHIVE_HASH_1 = \
    sha256:e99dff8cd917919d10dd364358c5a2f92099e815866d2c7b298ebb19b0a4fa6a
COMPONENT_ARCHIVE_URL_1 =  make://docs-generated/$(COMPONENT_ARCHIVE_1)

BUILD_STYLE=	cmake

# Enable adiheap security extension
ADIHEAP_MODE =	$(ADIHEAP_ENABLE)

# adistack needs to stay disabled because of 26288117
ADISTACK_MODE =	$(ADISTACK_DISABLE)

# Cannot use patching on UTF-16 file
COMPONENT_PREP_ACTION += ( $(GSED) -i \
	-e 's;TryExec=wireshark;TryExec=/usr/sbin/wireshark;' \
	-e 's;Exec=wireshark %f;Exec=pfexec /usr/sbin/wireshark %f;' \
	$(SOURCE_DIR)/org.wireshark.Wireshark.desktop );

# Extract and install pre-generated documentation
COMPONENT_PREP_ACTION += gtar xvf $(COMPONENT_ARCHIVE_1) ;

COMPONENT_POST_INSTALL_ACTION += ( \
	$(MKDIR) $(PROTOUSRSHAREMAN1DIR) $(PROTOUSRSHAREMAN4DIR); \
	$(CP) $(SOURCE_DIR)/doc/*.1 $(PROTOUSRSHAREMAN1DIR); \
	$(CP) $(SOURCE_DIR)/doc/*.4 $(PROTOUSRSHAREMAN4DIR); \
	$(CP) $(SOURCE_DIR)/doc/AUTHORS-SHORT $(PROTOUSRSHAREDIR)/wireshark; \
	$(CP) $(SOURCE_DIR)/doc/*.html $(PROTOUSRSHAREDIR)/wireshark; )

TEST_TARGET= $(NO_TESTS)

include $(WS_MAKE_RULES)/common.mk

PKG_MACROS+= MAJOR_VERSION=$(word 1,$(subst ., ,$(COMPONENT_VERSION))).$(word 2,$(subst ., ,$(COMPONENT_VERSION)))
PKG_MACROS+= MICRO_VERSION=$(word 3,$(subst ., ,$(COMPONENT_VERSION)))

# Reported via bug 12923
CFLAGS += -I/usr/include/kerberosv5

CMAKE_OPTIONS += -DUSE_qt6=ON

# Set path to Qt cmake modules.
CMAKE_OPTIONS += -DCMAKE_PREFIX_PATH=$(USRLIBDIR64)/cmake/
# Add non-standard path to perl pod2man and pod2html commands.
CMAKE_OPTIONS += -DCMAKE_PROGRAM_PATH=$(USRDIR)/perl5/bin/
# Install all the wireshark executables to sbin directory.
CMAKE_OPTIONS += -DCMAKE_INSTALL_BINDIR=sbin

# Disable lua support as wireshark doesn't support lua 5.3.X
CMAKE_OPTIONS += -DENABLE_LUA=OFF
CMAKE_OPTIONS += -DBUILD_androiddump=OFF
CMAKE_OPTIONS += -DBUILD_randpkt=OFF
CMAKE_OPTIONS += -DBUILD_dftest=OFF

# Version 3.6 started to require 'asciidoctor' for documentation build.
# Since 'asciidoctor' isn't part of CBE we need to ship pre-built
# documentation. The documentation is generated during download phase with
# use of Ruby gem installed 'asciidoctor'.
docs-generated:
	$(RM) -r $(COMPONENT_SRC); gtar xf $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE)
	mkdir $(SOURCE_DIR)/home; HOME=$(SOURCE_DIR)/home gem install --user-install asciidoctor
	cd $(COMPONENT_SRC); \
	  for i in `find $(COMPONENT_DIR)/patches -name '*.patch'` ; do gpatch -p1 < $$i; done ; \
	  $(ENV) $(CONFIGURE_ENV) HOME=$(SOURCE_DIR)/home \
	    PATH="$(PATH):$(SOURCE_DIR)/home/.gem/ruby/2.6.0/bin" $(CMAKE) $(CMAKE_OPTIONS) . ; \
	  $(ENV) $(COMPONENT_BUILD_ENV) HOME=$(SOURCE_DIR)/home $(GMAKE) docs
	TZ=UTC gtar cjvf $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE_1) --sort=name \
	  --mtime='1970-01-01' --owner=root --group=root $(COMPONENT_SRC)/doc/*.1 \
	  $(COMPONENT_SRC)/doc/*.4 $(COMPONENT_SRC)/doc/*.html $(COMPONENT_SRC)/doc/AUTHORS-SHORT
	/usr/bin/sha256sum $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE_1)

REQUIRED_PACKAGES += developer/lexer/flex
REQUIRED_PACKAGES += developer/parser/bison
REQUIRED_PACKAGES += diagnostic/wireshark/wireshark-common
REQUIRED_PACKAGES += codec/speex
REQUIRED_PACKAGES += library/desktop/qt6
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/gnutls-3
REQUIRED_PACKAGES += library/libcares
REQUIRED_PACKAGES += library/libxml2
REQUIRED_PACKAGES += library/nghttp2
REQUIRED_PACKAGES += library/pcre2
REQUIRED_PACKAGES += library/security/libgpg-error
REQUIRED_PACKAGES += library/snappy
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += compress/lz4
REQUIRED_PACKAGES += runtime/ruby-26
REQUIRED_PACKAGES += security/kerberos-5
REQUIRED_PACKAGES += system/library/libpcap
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/library/security/libgcrypt
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
