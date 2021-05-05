
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
# Copyright (c) 2011, 2021, Oracle and/or its affiliates.
#
BUILD_BITS= 64
# Can't use the Studio compilers as they don't support the GNU 
# __attribute__ extension
COMPILER= gcc
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=         nmap
COMPONENT_VERSION=      7.80
COMPONENT_PROJECT_URL=  https://nmap.org/
COMPONENT_ARCHIVE=      $(COMPONENT_SRC).tgz
COMPONENT_ARCHIVE_HASH= \
    sha256:780cbf4a0ddb9e9cd49d8fbdfa5c7f368cc7ae857ddfc39102dd2b83a905d7a7
COMPONENT_ARCHIVE_URL=  $(COMPONENT_PROJECT_URL)dist/$(COMPONENT_ARCHIVE)
COMPONENT_ANITYA_ID=	2096

TPNO=			53513

include $(WS_MAKE_RULES)/common.mk

PYTHON_VERSION = 2.7

# Installation relies on file types in the build directory,
# avoid cloney to properly install nmap and zenmap components.
CLONEY = echo
COMPONENT_PRE_CONFIGURE_ACTION = $(CP) -rp $(SOURCE_DIR)/. $(@D)

PKG_MACROS +=		PYVER=$(PYTHON_VERSION)

CONFIGURE_OPTIONS  +=   LIBS="$(LIBSOCKET) $(LIBNSL)"

# Fix 64-bit linking via compiler.
LDFLAGS += $(CC_BITS)

CONFIGURE_OPTIONS  +=   PYTHON="$(PYTHON.$(PYTHON_VERSION))"
CONFIGURE_OPTIONS  +=   --srcdir=$(BUILD_DIR_64)
CONFIGURE_OPTIONS  +=   --localstatedir=$(VARDIR)
CONFIGURE_OPTIONS  +=   --without-localdirs 
CONFIGURE_OPTIONS  +=   --with-zenmap 
CONFIGURE_OPTIONS  +=   --with-openssl
CONFIGURE_OPTIONS  +=   --with-libpcap
CONFIGURE_OPTIONS  +=   --with-libpcre
CONFIGURE_OPTIONS  +=   --with-liblua 
CONFIGURE_OPTIONS  +=   --with-ncat 
CONFIGURE_OPTIONS  +=   --with-ndiff
CONFIGURE_OPTIONS  +=   --with-system-ssl-certs=/etc/certs

# Python packages are delivered to vendor-packages instead of site-packages.
CONFIGURE_OPTIONS  +=   am_cv_python_pythondir=$(PYTHON_VENDOR_PACKAGES.32)

# Ensure that the test results are reproducible.
COMPONENT_TEST_TRANSFORMS += -E \
	'-e "s|on port [0-9]+ \\(pid [0-9]+\\)|on port PORT (pid PID)|g" ' \
	'-e "s|^(Ran [0-9]* tests) in .*s|\1|" ' '-e "/Nothing to be done for/d" ' \
	'-e "s|Nmap .* \\( https://nmap.org \\) at .*\\$$|Nmap VERSION ( https://nmap.org ) at DATETIME|g" ' \
	'-e "/Initiating NSE at .*/d" ' '-e "/Completed NSE at .*/d" ' \
	'-e "s|scanned in (.*) seconds|scanned in TIME seconds|g" ' \
	'-e "/ WARNING **/d" ' '-e "/python2\.7/d" ' '-e "/warnings\.warn/d" ' \
	'-e "/\/usr\/gcc\/[0-9]+\/bin\/gcc/d" ' '-e "/\/usr\/gcc\/[0-9]+\/bin\/g\+\+/d" '

REQUIRED_PACKAGES += library/libssh2
REQUIRED_PACKAGES += library/pcre
REQUIRED_PACKAGES += library/python/pygobject-27
REQUIRED_PACKAGES += library/python/pygtk2-27
REQUIRED_PACKAGES += library/security/openssl
REQUIRED_PACKAGES += library/zlib
REQUIRED_PACKAGES += runtime/lua
REQUIRED_PACKAGES += runtime/python-27
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c++-runtime
REQUIRED_PACKAGES += system/library/libpcap
REQUIRED_PACKAGES += system/library/math
REQUIRED_PACKAGES += system/network/bpf
