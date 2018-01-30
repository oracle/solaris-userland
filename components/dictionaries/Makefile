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
# Copyright (c) 2017, 2018, Oracle and/or its affiliates. All rights reserved.
#

BUILD_BITS=             NO_ARCH
include ../../make-rules/shared-macros.mk

COMPONENT_NAME=		dictionaries
COMPONENT_VERSION=	0.1
IPS_COMPONENT_VERSION=	$(PKG_SOLARIS_VERSION)

COMPONENT_PROJECT_URL=	http://hunspell.github.io/

COMPONENT_SRC=		de_DE-20051213
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).zip
COMPONENT_ARCHIVE_URL=	http://pkgs.fedoraproject.org/lookaside/pkgs/hunspell-de/$(COMPONENT_ARCHIVE)/b6256f5abb2c5347b7fb15516902da04/$(COMPONENT_ARCHIVE)
COMPONENT_ARCHIVE_HASH=	sha256:0558481cad16ea77c6eb1546d737b6e1ec1568e7a6c10a86a6f71e038f80e8f7
UNPACK_ARGS=		-r $(COMPONENT_SRC)

COMPONENT_SRC_1=	en_US
COMPONENT_ARCHIVE_1=	$(COMPONENT_SRC_1).zip
COMPONENT_ARCHIVE_URL_1=http://pkgs.fedoraproject.org/lookaside/pkgs/hunspell-en/$(COMPONENT_ARCHIVE_1)/b68f2940bf422074213fef74488b1da1/$(COMPONENT_ARCHIVE_1)
COMPONENT_ARCHIVE_HASH_1=sha256:5da3275e59c9cbd099ff58bf0d4dd7ef2922013bf363be08851b9fde5147a679
UNPACK_ARGS_1=		-r $(COMPONENT_SRC_1)

COMPONENT_SRC_2=	es_ES
COMPONENT_ARCHIVE_2=	$(COMPONENT_SRC_2).zip
COMPONENT_ARCHIVE_URL_2=http://pkgs.fedoraproject.org/lookaside/pkgs/hunspell-es/$(COMPONENT_ARCHIVE_2)/4b272f7c958dd619b2ddc007c45db53b/$(COMPONENT_ARCHIVE_2)
COMPONENT_ARCHIVE_HASH_2=sha256:5af9d57cc747d40601a9355ec16026271b6a7cc8968ec92325705630f02daad0
UNPACK_ARGS_2=		-r $(COMPONENT_SRC_2)

COMPONENT_SRC_3=	pt_BR-2700g
COMPONENT_ARCHIVE_3=	$(COMPONENT_SRC_3).zip
COMPONENT_ARCHIVE_URL_3=http://pkgs.fedoraproject.org/lookaside/pkgs/hunspell-pt/$(COMPONENT_ARCHIVE_3)/1126056a65628c95abae967ef063680a/$(COMPONENT_ARCHIVE_3)
COMPONENT_ARCHIVE_HASH_3=sha256:803e8b57e854371c2ce3ad29271b4856b2f699cceaa4ab9a10e50f943d611a9a
UNPACK_ARGS_3=		-r $(COMPONENT_SRC_3)

COMPONENT_SRC_4=	fr_FR
COMPONENT_ARCHIVE_4=	$(COMPONENT_SRC_4).zip
COMPONENT_ARCHIVE_URL_4=http://pkgs.fedoraproject.org/lookaside/pkgs/openoffice.org/$(COMPONENT_ARCHIVE_4)/md5/904d799ab36df32cc598a8dc7990649f/$(COMPONENT_ARCHIVE_4)
COMPONENT_ARCHIVE_HASH_4=sha256:1fbd40b649d5d26598091102d7473c41a81009808606275fa8d6798fbce93a18
UNPACK_ARGS_4=		-r $(COMPONENT_SRC_4)

COMPONENT_SRC_5=	italiano_2_3_beta_2006_07_23
COMPONENT_ARCHIVE_5=	$(COMPONENT_SRC_5).zip
COMPONENT_ARCHIVE_URL_5=http://prdownloads.sf.net/linguistico/$(COMPONENT_ARCHIVE_5)
COMPONENT_ARCHIVE_HASH_5=sha256:4939ebbfadfec6eca89ef23dfabebea04b1a8d3aa021af3c72d7719722c6f626
UNPACK_ARGS_5=		-r $(COMPONENT_SRC_5)

COMPONENT_BUGDB=	g11n/locale-other

TPNO_DE=		11366
TPNO_EN=		10696
TPNO_ES=		11252
TPNO_PTBR=		11260
TPNO_FR=		11238
TPNO_IT=		11242

BUILD_STYLE=		archive
TEST_TARGET=		$(NO_TESTS)

LIST =			1 2 3 4 5
PKG_PROTO_DIRS +=	$(foreach n,$(LIST),$(COMPONENT_SRC_$n))
PKG_VARS +=		$(foreach n,$(LIST),COMPONENT_ARCHIVE_URL_$n)

include $(WS_MAKE_RULES)/common.mk

install: prep
