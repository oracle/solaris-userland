#
# Copyright (c) 2021, 2025, Oracle and/or its affiliates.
#

COMPONENT_NAME=		openssl-3
COMPONENT_VERSION=	3.0.17
COMPONENT_PROJECT_URL=	https://www.openssl.org/
COMPONENT_SRC=		openssl-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH=	\
	sha256:dfdd77e4ea1b57ff3a6dbde6b0bdc3f31db5ac99e7fdd4eaf9e1fbb6ec2db8ce
COMPONENT_DOWNLOAD_URL=	https://github.com/openssl/openssl/releases/download
COMPONENT_ARCHIVE_URL=	$(COMPONENT_DOWNLOAD_URL)/$(COMPONENT_SRC)/$(COMPONENT_ARCHIVE)
COMPONENT_BUGDB=	library/openssl
COMPONENT_ANITYA_ID=	2566
COMPONENT_BAID=		335354

#
# The extra .1 the version in is to distinguish between the community version
# of OpenSSL 3.0.x and the Solaris package version. The Solaris package
# contains some extra patches from OpenSSL 3.2. These patches change behavior
# of the existing RSA decryption methods and implement an implicit rejection in
# PKCS#1 v1.5.  The upstream decided to not backport them, but some Linux
# distributions (and Solaris) did the backport on their own.
#
IPS_COMPONENT_VERSION=	$(COMPONENT_VERSION).1
HUMAN_VERSION=		$(COMPONENT_VERSION)-1

CONFIGURE_DEFAULT_DIRS = no

# OpenSSL does not use autoconf but its own configure system.
CONFIGURE_SCRIPT= $(SOURCE_DIR)/config

REQUIRED_PACKAGES += developer/build/makedepend
# Perl is needed for Configure, tests and the distributed CA.pl script.
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += system/core-os
