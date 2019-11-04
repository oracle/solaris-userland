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
# Copyright (c) 2013, 2020, Oracle and/or its affiliates. All rights reserved.
#

COMPILER=	gcc
include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		mysqlclient
COMPONENT_VERSION=	1.4.5
COMPONENT_SRC=		$(COMPONENT_NAME)-$(COMPONENT_VERSION)
COMPONENT_ARCHIVE=	$(COMPONENT_SRC).tar.gz
COMPONENT_ARCHIVE_HASH= \
    sha256:66b7024d50b82bf17ccaf783efb8140b537f0269c5591ec75db46398ff8b2a79
COMPONENT_ARCHIVE_URL=	$(call pypi_url)
COMPONENT_PROJECT_URL=	https://github.com/PyMySQL/mysqlclient-python
COMPONENT_BUGDB=	python-mod/mysql
COMPONENT_ANITYA_ID=	7972

TPNO=			54996

PYTHON_VERSIONS=       $(PYTHON2_VERSIONS) 3.7

include $(WS_MAKE_RULES)/prep.mk
include $(WS_MAKE_RULES)/setup.py.mk
include $(WS_MAKE_RULES)/ips.mk

# Remove trailing carriage returns, if present, in the files.
COMPONENT_POST_UNPACK_ACTION = \
    /usr/bin/find $(SOURCE_DIR) -type f -exec $(GSED) -i 's/\r//' '{}' \; ;

PATH_64=		/usr/mysql/5.7/bin:/usr/bin:$(SPRO_VROOT)/bin
COMPONENT_BUILD_ENV +=		PATH=$(PATH_$(BITS)):$(PATH)
COMPONENT_INSTALL_ENV +=	PATH=$(PATH_$(BITS)):$(PATH)
CFLAGS_64=	-L/usr/mysql/5.7/lib/$(MACH64) -R/usr/mysql/5.7/lib/$(MACH64)
CFLAGS +=	$(CFLAGS_$(BITS))

COMPONENT_TEST_DIR =	$(SOURCE_DIR)/tests
COMPONENT_TEST_CMD =	$(PYTHON) -m pytest
COMPONENT_TEST_ARGS =
COMPONENT_TEST_ENV += MYSQL_HISTFILE=/dev/null

# For the testing we need to run mysql database first. The database needs it's
# directory, which will be $(MYSQL_TEST_DATADIR). The directory will also
# contain socket over which the testing will be performed. Problem is that the
# path can be maximally 107 characters long. To overcome that limit, we'll
# create a symlink in /tmp pointing to the directory and refer the database to
# that symlink. The symlink must have random name, so that multiple tests may
# be executed simultaneously.

# Second challenge is to make sure that the mysql daemon will be stopped once
# the tests end (finish or are interrupted). There are three mechanisms to do
# that.
# a) mysql stores it's pid to $(MYSQL_TEST_DATADIR)/pid
# b) the COMPONENT_PRE_TEST_ACTION runs a background task which kills the
#    daemon in 10 minutes no matter what.
# c) the COMPONENT_POST_TEST_ACTION kills both the mysql daemon and the
#    background task

MYSQL_VERSION       = 5.7
MYSQL_BINDIR        = $(USRDIR)/mysql/$(MYSQL_VERSION)/bin
MYSQL_TEST_USER     = root
MYSQL_TEST_PASSWORD = test-password
MYSQL_TEST_DATADIR  = $(COMPONENT_TEST_BUILD_DIR)/test_datadir

COMPONENT_PRE_TEST_ACTION = ( \
	cd "$(@D)"; \
	: "Prepare the testing directory and create the symlink to it"; \
	$(RM) -rf "$(MYSQL_TEST_DATADIR)"; \
	mkdir -p "$(MYSQL_TEST_DATADIR)"; \
	TEST_LINK=`mktemp -t dbd-mysql-test.XXXXXX`; \
	$(RM) "$$TEST_LINK"; \
	ln -s $(MYSQL_TEST_DATADIR) "$$TEST_LINK"; \
	\
	: "Initialize mysql DB"; \
	"$(MYSQL_BINDIR)/mysqld" \
			--initialize-insecure \
			--datadir="$$TEST_LINK" \
			--basedir=/usr/mysql/$(MYSQL_VERSION) ; \
	\
	echo "$$TEST_LINK" > "$$TEST_LINK"/test_link; \
	\
	: "Run the daemon in background. --gdb makes it possible to terminate mysqld via Ctrl+C"; \
	"$(MYSQL_BINDIR)/mysqld" \
			--skip-networking \
			-u "$(MYSQL_TEST_USER)"\
			--datadir="$$TEST_LINK" \
			--socket="$$TEST_LINK"/socket \
			--pid-file="$$TEST_LINK"/pid \
			--gdb & \
	: "Now wait for the database to be online"; \
	sleep 10; \
	if [ ! -e "$$TEST_LINK/socket" ]; then \
		: "We were not able to bring up the database?"; \
		PID=`cat "$$TEST_LINK"/pid`; \
		ps -p $$PID && kill $$PID || : \
		$(RM) "$$TEST_LINK"; \
		exit 1; \
	fi; \
	\
	: "Set admin password"; \
	"$(MYSQL_BINDIR)/mysqladmin" \
			--socket "$$TEST_LINK"/socket \
			-u "$(MYSQL_TEST_USER)" \
			password "$(MYSQL_TEST_PASSWORD)" ; \
	\
	: "Create a database"; \
	"$(MYSQL_BINDIR)/mysqladmin" \
			--socket "$$TEST_LINK"/socket \
			-u "$(MYSQL_TEST_USER)" \
			--password="$(MYSQL_TEST_PASSWORD)" \
			create test; \
	\
	: "Run job which will kill mysqld in 10 minutes"; \
	( $(SET_X) PID=`cat "$$TEST_LINK"/pid`; sleep 600; ps -p $$PID && kill $$PID || : ) & \
	echo $$! > "$$TEST_LINK"/pid_of_guard; \
	\
	: "Create config file for the mysqlclient"; \
	echo "[MySQLdb-tests]\n \
			socket = $$TEST_LINK/socket\n \
			user = $(MYSQL_TEST_USER)\n \
			database = test\n \
			password = $(MYSQL_TEST_PASSWORD)\n \
			default-character-set = utf8" > $(SOURCE_DIR)/tests/default.cnf \
)

COMPONENT_POST_TEST_ACTION = ( \
	( $(SET_X) PID=`cat $(MYSQL_TEST_DATADIR)/pid`; [ -n "$$PID" ] && ps -p $$PID && kill $$PID || : ); \
	( $(SET_X) PID=`cat $(MYSQL_TEST_DATADIR)/pid_of_guard`; [ -n "$$PID" ] && ps -p $$PID && kill $$PID || : ); \
	( $(SET_X) if [ -e "$(MYSQL_TEST_DATADIR)/test_link" ]; then rm -f `cat "$(MYSQL_TEST_DATADIR)/test_link"`; fi ); \
)


ASLR_MODE = $(ASLR_NOT_APPLICABLE)

# common targets
build:		$(BUILD_64)

install:	$(INSTALL_64)

test:		$(TEST_64)

system-test:    $(NO_TESTS)


REQUIRED_PACKAGES += database/mysql-57
REQUIRED_PACKAGES += database/mysql-57/library
REQUIRED_PACKAGES += system/library
