#
# Copyright (c) 2021, 2023, Oracle and/or its affiliates.
#

COMPONENT_NAME=		openssl-3
COMPONENT_VERSION=	3.0.9
COMPONENT_PROJECT_URL=	https://www.openssl.org/
COMPONENT_SRC=		openssl-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:eb1ab04781474360f77c318ab89d8c5a03abc38e63d65a603cabbf1b00a1dc90
COMPONENT_ARCHIVE_URL=	$(COMPONENT_PROJECT_URL)source/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/openssl
COMPONENT_ANITYA_ID=	2566
COMPONENT_BAID=		145181

CONFIGURE_DEFAULT_DIRS = no

# OpenSSL does not use autoconf but its own configure system.
CONFIGURE_SCRIPT= $(SOURCE_DIR)/config

REQUIRED_PACKAGES += developer/build/makedepend
# Perl is needed for Configure, tests and the distributed CA.pl script.
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/core-os
