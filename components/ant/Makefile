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
# Copyright (c) 2011, 2018, Oracle and/or its affiliates. All rights reserved.
#
BUILD_BITS= NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		ant
COMPONENT_VERSION=	1.10.1
COMPONENT_PROJECT_URL=	https://ant.apache.org/
COMPONENT_SRC_NAME=	apache-ant
COMPONENT_ARCHIVE=	$(COMPONENT_SRC)-src.tar.bz2
COMPONENT_ARCHIVE_HASH=	\
    sha256:d5e3d87f0b4b42e0505b44215b4c4bbfaf6f49655c0a530136adfe4e724363b4
COMPONENT_ARCHIVE_URL=	https://archive.apache.org/dist/ant/source/$(COMPONENT_ARCHIVE)
COMPONENT_SIG_URL=	$(COMPONENT_ARCHIVE_URL).asc
COMPONENT_ANITYA_ID=	50

TPNO=			39149

BUILD_STYLE= justmake
include $(WS_MAKE_RULES)/common.mk

GMAKE=./build.sh

ANT_ENV+=JAVA_HOME=$(JAVA_HOME)

ANT_DIST_DIRS+=-Ddist.dir=$(PROTO_DIR)
ANT_DIST_DIRS+=-Ddist.bin=$(PROTOUSRBINDIR)
ANT_DIST_DIRS+=-Ddist.etc=$(PROTOUSRSHARELIBDIR)/ant
ANT_DIST_DIRS+=-Ddist.docs=$(PROTOUSRSHAREDOCDIR)/ant
ANT_DIST_DIRS+=-Ddist.manual=$(PROTOUSRSHAREDOCDIR)/ant/manual
ANT_DIST_DIRS+=-Ddist.javadocs=$(PROTOUSRSHAREDOCDIR)/ant/manual/api
ANT_DIST_DIRS+=-Ddist.lib=$(PROTOUSRSHARELIBDIR)/ant

OPTIONAL_LIBS+=$(USRSHARELIBDIR)/java/junit.jar
OPTIONAL_LIBS+=$(USRSHAREDIR)/antlr-2.7.7/antlr.jar

COMPONENT_PRE_BUILD_ACTION = $(CP) $(OPTIONAL_LIBS) $(@D)/lib/optional

COMPONENT_BUILD_TARGETS =	build
COMPONENT_BUILD_ENV +=		$(ANT_ENV)

COMPONENT_INSTALL_ARGS =	$(ANT_DIST_DIRS)
COMPONENT_INSTALL_TARGETS =	dist
COMPONENT_INSTALL_ENV +=	$(ANT_ENV)

# Adjust '#!/usr/bin/perl'
PERL_SCRIPTS = \
        $(PROTOUSRBINDIR)/antRun.pl \
        $(PROTOUSRBINDIR)/complete-ant-cmd.pl \
        $(PROTOUSRBINDIR)/runant.pl

COMPONENT_TEST_TARGETS =	test
COMPONENT_TEST_ENV +=		$(ANT_ENV)

COMPONENT_TEST_TRANSFORMS +=  \
	'-e "/=/d" ' \
	'-e "s/, Time elapsed: [0-9][0-9]*\.*[0-9]* sec//" '  \
	'-e "/propertyfilecli/d" ' \
	'-e "/Building zip:/d" ' \
	'-e "/Processing /d" ' \
	'-e "/Transform time: /d" ' \
	'-e "/Deleting: /d" ' \
	'-e "/^Buildfile: /d" ' \
	'-e "/^Total time: /d" '

REQUIRED_PACKAGES += developer/java/junit
REQUIRED_PACKAGES += developer/parser/antlr-2
REQUIRED_PACKAGES += $(PERL_PKG)
REQUIRED_PACKAGES += shell/ksh93
