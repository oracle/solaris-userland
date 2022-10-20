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
# Copyright (c) 2015, 2022, Oracle and/or its affiliates.
#

# parfait is a bit unhappy (22527218)
export PARFAIT_BUILD=no

BUILD_BITS = 64
COMPILER = gcc
include ../../../make-rules/shared-macros.mk

ESR = esr

COMPONENT_NAME =	firefox
COMPONENT_VERSION =	102.4.0
COMPONENT_BAID=		131791
COMPONENT_PROJECT_URL =	http://www.mozilla.com/firefox
COMPONENT_SRC_NAME =	$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_SRC = 	$(COMPONENT_SRC_NAME)
COMPONENT_ARCHIVE =	$(COMPONENT_SRC_NAME)$(ESR).source.tar.xz
COMPONENT_ARCHIVE_HASH = \
    sha256:e79f0ddd4914dfbff61c5eea7ff28ad2dd12ecfbf3d63a41dab57d50171d904e
ifndef CANDIDATE_BUILD
MOZILLA_FTP =		http://ftp.mozilla.org/pub/$(COMPONENT_NAME)/releases/$(COMPONENT_VERSION)$(ESR)
else
MOZILLA_FTP =		http://ftp.mozilla.org/pub/$(COMPONENT_NAME)/candidates/$(COMPONENT_VERSION)$(ESR)-candidates/build$(CANDIDATE_BUILD)
endif
COMPONENT_ARCHIVE_URL =	$(MOZILLA_FTP)/source/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB =	firefox/browser
COMPONENT_ANITYA_ID =	16838

# There are a set of .xpi files (as given in the LANG_LIST definition
# below) that we need. We could download and unpack them individually, but
# they doesn't contain version in its file name and there is lot of them.
# Therefore we will download them and archive them in Userland cache using
# one file with version number.
COMPONENT_ARCHIVE_1 = $(COMPONENT_SRC_NAME)$(ESR)-xpi.tar.bz2
COMPONENT_ARCHIVE_HASH_1 = \
    sha256:877cc77d739d158f70c2d5ffcee12fec78c5b7855cdf60b93c940c40a462c953
COMPONENT_ARCHIVE_URL_1 =       make://download-xpis/$(COMPONENT_ARCHIVE_1)

LANG_LIST = ach af an ar ast az be bg bn br bs ca cak cs cy \
	da de dsb el en-CA en-GB en-US eo es-AR es-CL es-ES es-MX et \
	eu fa ff fi fr fy-NL ga-IE gd gl gn gu-IN he hi-IN hr hsb hu \
	hy-AM ia id is it ja ka kab kk km kn ko lij lt lv mk mr ms my \
	nb-NO ne-NP nl nn-NO oc pa-IN pl pt-BR pt-PT rm ro ru si sk sl son \
	sq sr sv-SE ta te th tr uk ur uz vi xh zh-CN zh-TW

CLEAN_PATHS += $(COMPONENT_DIR)/xpi

CONFIGURE_DEFAULT_DIRS=no

# Tests are now broken and can hang system.
ifndef BROKEN_TESTS
TEST_TARGET= $(SKIP_TEST)
endif

# The unit tests are disabled since they never finish.
$(SKIP_TEST_AT_TOP_LEVEL)

include $(WS_MAKE_RULES)/common.mk

CC_PIC_MODE = $(CC_PIC_DISABLE)
LD_Z_PIE_MODE = $(LD_Z_PIE_DISABLE)

# /usr/gnu/bin needed to pick up the GNU version of tail and readelf.
# /usr/sbin needed for dtrace.
PATH = $(EXTPATH):$(COMPONENT_DIR)/wrapper-node:/usr/gnu/bin:/usr/bin:/usr/sbin

MOZCONFIG = $(SOURCE_DIR)/mozconfig

ifdef DEBUG
# disable code optimization
CFLAGS =
CXXFLAGS =

MOZCONFIG_DEBUG =	$(MOZCONFIG)
MOZCONFIG_NON_DEBUG =	/dev/null
else
MOZCONFIG_DEBUG =	/dev/null
MOZCONFIG_NON_DEBUG =	$(MOZCONFIG)
endif

COMPONENT_PRE_CONFIGURE_ACTION += \
	echo "ac_add_options MOZILLA_OFFICIAL=1" >> $(MOZCONFIG) ; \
	echo "ac_add_options --prefix=/usr" >> $(MOZCONFIG) ; \
	echo "ac_add_options --libdir=/usr/lib" >> $(MOZCONFIG) ; \
	echo "ac_add_options --disable-crashreporter" >> $(MOZCONFIG) ; \
	echo "ac_add_options --disable-debug-symbols" >> $(MOZCONFIG_NON_DEBUG) ; \
	echo "ac_add_options --disable-install-strip" >> $(MOZCONFIG_DEBUG) ; \
	echo "ac_add_options --disable-optimize" >> $(MOZCONFIG_DEBUG) ; \
	echo "ac_add_options --disable-tests" >> $(MOZCONFIG) ; \
	echo "ac_add_options --disable-updater" >> $(MOZCONFIG) ; \
	echo "ac_add_options --enable-debug" >> $(MOZCONFIG_DEBUG) ; \
	echo "ac_add_options --enable-debug-symbols" >> $(MOZCONFIG_DEBUG) ; \
	echo "ac_add_options --enable-jemalloc" >> $(MOZCONFIG) ; \
	echo "ac_add_options --enable-js-shell" >> $(MOZCONFIG) ; \
	echo "ac_add_options --enable-official-branding" >> $(MOZCONFIG) ; \
	echo "ac_add_options --enable-optimize" >> $(MOZCONFIG_NON_DEBUG) ; \
	echo "ac_add_options --enable-pulseaudio" >> $(MOZCONFIG) ; \
	echo "ac_add_options --enable-replace-malloc" >> $(MOZCONFIG) ; \
	echo "ac_add_options --enable-system-ffi" >> $(MOZCONFIG) ; \
	echo "ac_add_options --enable-system-pixman" >> $(MOZCONFIG) ; \
	echo "ac_add_options --enable-update-channel=esr" >> $(MOZCONFIG) ; \
	echo "ac_add_options --with-intl-api" >> $(MOZCONFIG) ; \
	echo "ac_add_options --with-system-libevent" >> $(MOZCONFIG) ; \
	echo "ac_add_options --with-system-zlib" >> $(MOZCONFIG) ; \
	echo "ac_add_options --with-system-libvpx" >> $(MOZCONFIG) ; \
	echo "ac_add_options --without-wasm-sandboxed-libraries" >> $(MOZCONFIG) ; \

CXXFLAGS += -Wno-invalid-offsetof -fpermissive

LD_SECEXT_OPTIONS += $(SSBD_ENABLE)

# 28395728
LD_MAP_NOEXBSS.sparc=

# libmozgtk needs to link to gtk3 and others
LD_Z_IGNORE=

# missing symbols from gtk3 during Firefox start
LD_B_DIRECT=

# SPARC build seems to require more open files for "Reticulating splines" phase
ENV := ulimit -n 16384; $(ENV)

# UL works better with configure script (instead mach script)
COMPONENT_PRE_CONFIGURE_ACTION += $(CP) $(SOURCE_DIR)/configure.in $(SOURCE_DIR)/configure ;

# make sure that node wrapper is executable
COMPONENT_PRE_CONFIGURE_ACTION += (chmod 555 $(COMPONENT_DIR)/wrapper-node/node);

# Old 91ESR version need special change when build with new cbindgen (bug 1773259).
COMPONENT_PRE_CONFIGURE_ACTION += ( \
	cbindgen --version | grep '0.19.0' || \
	gsed -i 's/const uint64_t ROOT_CLIP_CHAIN = ~0;//' \
	    $(SOURCE_DIR)/gfx/webrender_bindings/webrender_ffi.h);

COMPONENT_POST_BUILD_ACTION = \
	(cd $(@D)/browser/installer ; $(ENV) $(COMPONENT_BUILD_ENV) \
		$(GMAKE) $(COMPONENT_BUILD_ARGS) $(COMPONENT_BUILD_TARGETS))

COMPONENT_POST_INSTALL_ACTION += \
        $(MKDIR) $(PROTOUSRLIBDIR)/firefox/browser/extensions ; $(RM) -rf xpi ; \
        $(TAR) xvf $(COMPONENT_ARCHIVE_1) > /dev/null 2>&1 ; \
        list1='$(LANG_LIST)' ; for f in $$list1 ; do \
            $(CP) xpi/$$f.xpi \
                $(PROTOUSRLIBDIR)/firefox/browser/extensions/langpack-$$f@firefox.mozilla.org.xpi ; \
        done ;

MOZ_XPI = $(MOZILLA_FTP)/linux-i686/xpi

# Run gmake download-xpis to download a tarball for xpi locally.
download-xpis:
	@echo "download-xpis"
	$(RM) -r $(COMPONENT_DIR)/xpi $(COMPONENT_DIR)/$(COMPONENT_ARCHIVE_1)
	$(MKDIR) $(COMPONENT_DIR)/xpi
	@echo "downloading $(COMPONENT_NAME) xpis"
	list1='$(LANG_LIST)' ; for f in $$list1 ; do \
	    echo $$f; \
	    /usr/bin/curl -R -s -o $(COMPONENT_DIR)/xpi/$$f.xpi \
	        $(MOZ_XPI)/$$f.xpi; \
	    file $(COMPONENT_DIR)/xpi/$$f.xpi | grep ZIP > /dev/null; \
	    if [ $$? -ne 0 ]; then \
	        echo "File $$f is not ZIP archive!"; exit 1; \
	    fi ; \
	done
	(cd $(COMPONENT_DIR); \
	    TZ=UTC gtar cjvf $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE_1) --mtime='1970-01-01' --owner=root --group=root xpi/* )
	/usr/bin/sha256sum $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE_1)

license: install
	@echo "regenerating license text"
	unzip -c $(PROTOUSRLIBDIR)/$(COMPONENT_NAME)/omni.ja chrome/toolkit/content/global/license.html \
	    | LC_ALL=en_US.UTF-8 lynx --display_charset=utf-8 -stdin --dump -nolist > $(COMPONENT_NAME).license

SIGNED_LIST.i386 = libsoftokn3.so libnssdbm3.so libfreebl3.so
SIGNED_LIST.sparc = libsoftokn3.so libnssdbm3.so libfreebl_64fpu_3.so libfreebl_64int_3.so
SIGNED_LIST = $(SIGNED_LIST.$(MACH))

COMPONENT_POST_INSTALL_ACTION += \
	slist='$(SIGNED_LIST)' ; for f in $$slist ; do \
	    mcs -d $(PROTOUSRLIBDIR)/$(COMPONENT_NAME)/$$f ; \
	    LD_LIBRARY_PATH=$(PROTOUSRLIBDIR)/$(COMPONENT_NAME) $(BUILD_DIR_64)/dist/bin/shlibsign -v -i $(PROTOUSRLIBDIR)/$(COMPONENT_NAME)/$$f ; \
        done ;

COMPONENT_TEST_MASTER = $(COMPONENT_TEST_RESULTS_DIR)/results-$(MACH).master

COMPONENT_TEST_DIR =    $(@D)/js/src
COMPONENT_TEST_TARGETS=check-jit-test
COMPONENT_TEST_TRANSFORMS = \
	'-e "/^PASSED ALL/,/Failed:/p" ' \
	'-e "/^FAILURES:/,/Failed:/p" ' \
	'-e "/.*/d" '

REQUIRED_PACKAGES += codec/libogg
REQUIRED_PACKAGES += codec/libvorbis
REQUIRED_PACKAGES += codec/libvpx
REQUIRED_PACKAGES += compress/bzip2
REQUIRED_PACKAGES += compress/unzip
REQUIRED_PACKAGES += database/sqlite-3
REQUIRED_PACKAGES += desktop/xdg/desktop-file-utils
REQUIRED_PACKAGES += developer/rust/cbindgen
ifneq ($(MACH), sparc)
REQUIRED_PACKAGES += developer/nasm
endif
REQUIRED_PACKAGES += library/desktop/atk
REQUIRED_PACKAGES += library/desktop/cairo
REQUIRED_PACKAGES += library/desktop/gdk-pixbuf
REQUIRED_PACKAGES += library/desktop/gtk3
REQUIRED_PACKAGES += library/desktop/harfbuzz
REQUIRED_PACKAGES += library/desktop/pango
REQUIRED_PACKAGES += library/desktop/startup-notification
REQUIRED_PACKAGES += library/glib2
REQUIRED_PACKAGES += library/graphics/pixman
REQUIRED_PACKAGES += library/icu
REQUIRED_PACKAGES += library/libevent
REQUIRED_PACKAGES += library/libffi
REQUIRED_PACKAGES += library/zlib
ifneq ($(MACH), sparc)
REQUIRED_PACKAGES += runtime/nodejs
endif
REQUIRED_PACKAGES += system/library
REQUIRED_PACKAGES += system/library/fontconfig
REQUIRED_PACKAGES += system/library/freetype-2
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/libdbus
REQUIRED_PACKAGES += system/library/libdbus-glib
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += web/browser/lynx
REQUIRED_PACKAGES += x11/library/libx11
REQUIRED_PACKAGES += x11/library/libxcb
REQUIRED_PACKAGES += x11/library/libxext
REQUIRED_PACKAGES += x11/library/libxrandr
