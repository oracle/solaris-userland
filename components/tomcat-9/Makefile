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
# Copyright (c) 2011, 2024, Oracle and/or its affiliates.
#
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		tomcat
COMPONENT_VERSION=	9.0.97
COMPONENT_BAID=		185377
COMPONENT_PROJECT_URL=	https://tomcat.apache.org/
COMPONENT_SRC_NAME=	apache-tomcat
COMPONENT_SRC=		$(COMPONENT_SRC_NAME)-$(COMPONENT_VERSION)-src
COMPONENT_ARCHIVE_HASH=	\
    sha256:1b46490fce5292305b8794a54b38c1e927409e907c9186a06ae8fa29ba0a2f1d
COMPONENT_ARCHIVE_URL=	https://archive.apache.org/dist/tomcat/tomcat-9/v$(COMPONENT_VERSION)/src/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	4987


# Tomcat build components:
# * for build speed up via webapss
COMPONENT_ARCHIVE_1= wsdl4j-1.6.3.jar
COMPONENT_ARCHIVE_HASH_1= \
    sha256:740f448e6b3bc110e02f4a1e56fb57672e732d2ecaf29ae15835051ae8af4725
COMPONENT_ARCHIVE_URL_1= https://repo.maven.apache.org/maven2/wsdl4j/wsdl4j/1.6.3/$(COMPONENT_ARCHIVE_1)
COMPONENT_SIG_URL_1= $(COMPONENT_ARCHIVE_URL_1).asc

# * for OSGi metadata in JAR files
COMPONENT_ARCHIVE_2= biz.aQute.bnd-6.4.1.jar
COMPONENT_ARCHIVE_HASH_2= \
    sha256:71108848bf44b7521afc7d6f63613ac1ffef8d41bf92588a1ec196bfb05fea19
COMPONENT_ARCHIVE_URL_2= https://repo.maven.apache.org/maven2/biz/aQute/bnd/biz.aQute.bnd/6.4.1/$(COMPONENT_ARCHIVE_2)
COMPONENT_SIG_URL_2= $(COMPONENT_ARCHIVE_URL_2).asc

# * for build speed up via webapss
COMPONENT_ARCHIVE_3= geronimo-spec-jaxrpc-1.1-rc4.jar
COMPONENT_ARCHIVE_HASH_3= \
    sha256:288aa3ad7010a27b64e60cb3264d04dbbd4d73561cbb2d9e929c87ffa21220cd
COMPONENT_ARCHIVE_URL_3= https://repo.maven.apache.org/maven2/geronimo-spec/geronimo-spec-jaxrpc/1.1-rc4/$(COMPONENT_ARCHIVE_3)

# Tomcat subcomponents - part of distribution - built from sources
COMPONENT_ARCHIVE_4= ecj-4.20.jar
COMPONENT_ARCHIVE_HASH_4= \
    sha256:48edaf2762f599f74ceee1bde5bac6fdbee85719674b693f8a364889aeeaf4a8
COMPONENT_ARCHIVE_URL_4= make://build-ecj/$(COMPONENT_ARCHIVE_4)

COMPONENT_ARCHIVE_5= ecjsrc-4.20.jar
COMPONENT_ARCHIVE_HASH_5= \
    sha256:4cb55998b273debd2f99b31c5acfa50abb49f6880a38ebb17d407e26cff7c36a
COMPONENT_ARCHIVE_URL_5= http://archive.eclipse.org/eclipse/downloads/drops4/R-4.20-202106111600/$(COMPONENT_ARCHIVE_5)

BUILD_STYLE= ant
TEST_TARGET= $(SKIP_TEST)
SYSTEM_TEST_TARGET= $(SKIP_TEST)
include $(WS_MAKE_RULES)/common.mk

COMPONENT_BUILD_ARGS=-Dbase.path=$(BUILD_DIR_NO_ARCH) -Dskip.build.java.version=true

# Tomcat tests doesn't like cloning.
CLONEY=echo
COMPONENT_PRE_BUILD_ACTION= \
	$(CP) -r $(SOURCE_DIR)/* $(@D);

# Java 11 is required for ECJ (after some Java 14 features are disabled).
# Note that it's not bundled with Solaris. Plus it's available only on
# SPARC. Therefore ECJ is pre-built during download phase and resulting
# jar file is also used on i386.
JAVA_HOME_11=/opt/jdk-11.0.19

# Build ECJ jar from sources.
build-ecj:
	$(RM) -r ecjsrc; $(MKDIR) ecjsrc/scripts/binary/META-INF
	unzip -d ecjsrc $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE_5)
	cd ecjsrc \
	; $(CP) META-INF/MANIFEST.MF scripts/binary/META-INF/ \
	; gpatch -p0 < $(COMPONENT_DIR)/patches/jdk11.patch-ecj \
	; JAVA_HOME="$(JAVA_HOME_11)" LC_ALL="en_US.UTF-8" $(ANT)
	$(MKDIR) ecjsrc/tmp
	cd ecjsrc/tmp \
	; $(JAVA_HOME)/bin/jar xf ../ecj.jar \
	; find . -exec touch -r ../build.xml {} \; \
	; find * | LC_ALL=C sort > ../tmp.list \
	; zip -X ../$(COMPONENT_ARCHIVE_4) -@ < ../tmp.list
	cp ecjsrc/$(COMPONENT_ARCHIVE_4) $(USERLAND_ARCHIVES)$(COMPONENT_ARCHIVE_4)

CLEAN_PATHS += ecjsrc

COMPONENT_POST_BUILD_ACTION += \
	($(MKDIR) $(PROTO_DIR); $(CP) -r $(@D)/output/build/* $(PROTO_DIR) );

# Create configuration backup archive for custom user's deployments.
COMPONENT_POST_BUILD_ACTION += \
	(cd $(PROTO_DIR) ; $(RM) conf/CONF.tar.gz ; \
	    gtar cfz conf/CONF.tar.gz conf/* )

# Used by this Makefile
REQUIRED_PACKAGES += archiver/gnu-tar

REQUIRED_PACKAGES += developer/java/junit
REQUIRED_PACKAGES += runtime/java/jre-8
REQUIRED_PACKAGES += shell/ksh93
REQUIRED_PACKAGES += system/core-os
REQUIRED_PACKAGES += system/network
