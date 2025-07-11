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
# Copyright (c) 2016, 2025, Oracle and/or its affiliates.
#

# This variable has no impact on perl build, it is here merely to satisfy
# "modernized" gate infrastructure. The bitness of the module is driven by the
# bitness of perl interpreter itself. That is hardcoded in
# $(WS_MAKE_RULES)/makemaker.mk
BUILD_BITS =		64
CTF_MODE =		off	# Has no effect

include ../../../make-rules/shared-macros.mk

COMPONENT_NAME=		DBD-mysql
COMPONENT_VERSION=	4.050
IPS_COMPONENT_VERSION=  4050
HUMAN_VERSION=		$(COMPONENT_VERSION)
COMPONENT_ARCHIVE_HASH=	\
	sha256:4f48541ff15a0a7405f76adc10f81627c33996fbf56c95c26c094444c0928d78
COMPONENT_ARCHIVE_URL=	https://cpan.metacpan.org/authors/id/D/DV/DVEEDEN/$(COMPONENT_ARCHIVE)
COMPONENT_PROJECT_URL=	https://github.com/perl5-dbi/DBD-mysql
COMPONENT_BUGDB=	perl-mod/dbd-mysql
COMPONENT_ANITYA_ID=	2807

COMPONENT_BAID=		137464

BUILD_STYLE= makemaker
LICENSE=DBD-mysql.license
BUILD_TARGET= $(BUILD_$(MK_BITS)) $(LICENSE)

include $(WS_MAKE_RULES)/common.mk

CLEAN_PATHS += $(LICENSE)

COMPONENT_TEST_MASTER =		$(COMPONENT_TEST_RESULTS_DIR)/results.master

COMPONENT_TEST_TARGETS = test
COMPONENT_TEST_TRANSFORMS += '-n -e "/^Result:/p"'
COMPONENT_TEST_TRANSFORMS += '-e "/Failed:/p"'

ASLR_MODE = $(ASLR_NOT_APPLICABLE)

MYSQL_VERSION       = 8.0
MYSQL_BINDIR        = $(USRDIR)/mysql/$(MYSQL_VERSION)/bin
MYSQL_TEST_USER     = root
MYSQL_TEST_PASSWORD = new-password
MYSQL_TEST_DATADIR  = $(COMPONENT_TEST_BUILD_DIR)/test_datadir

COMPONENT_TEST_ENV  += MYSQL_HISTFILE=/dev/null

CONFIGURE_OPTIONS += --mysql_config="$(MYSQL_BINDIR)/mysql_config"
CONFIGURE_OPTIONS += --testuser=$(MYSQL_TEST_USER)
CONFIGURE_OPTIONS += --testpassword=$(MYSQL_TEST_PASSWORD)
CONFIGURE_OPTIONS += --testsocket=CHANGEME

# Avoid unnecessary RPATH to Developer Studio 12.6
COMPONENT_PRE_BUILD_ACTION += (cd $(@D) ; $(GSED) -i 's/-latomic//' Makefile)

# For the testing we need to run mysql database first. The database needs it's
# directory, which will be $(MYSQL_TEST_DATADIR). The directory will also
# contain socket over which the testing will be performed. Problem is that the
# path can be maximally 107 characters long. To overcome that limit, we'll
# create a symlink in /tmp pointing to the directory and refer the database to
# that symlink. The symlink must have random name, so that multiple tests may
# be executed simultaneously. Problem is that we have to specify the symlink
# name during configure. To overcome that I specify the socket name as
# 'CHANGEME' and "fix" the tests once I know the name of symlink.

# Second challenge is to make sure that the mysql daemon will be stopped once
# the tests end (finish or are interrupted). There are three mechanisms to do
# that.
# a) mysql stores it's pid to $(MYSQL_TEST_DATADIR)/pid
# b) the COMPONENT_PRE_TEST_ACTION runs a background task which kills the
#    daemon in 10 minutes no matter what.
# c) the COMPONENT_POST_TEST_ACTION kills both the mysql daemon and the
#    background task

# If you want to keep mysqld running for your own testing purposes, delete all
# the lines containing 'kill' in COMPONENT_PRE_TEST_ACTION and whole
# COMPONENT_POST_TEST_ACTION. Then run "gmake test" once which will both run
# the DB and configure the module to use it. After that you can "cd builds/..."
# and "gmake test" directly there.

# Normally the noise from background jobs is sent to /dev/null so that it does
# not clobber the terminal. For debugging you can leave SILENT empty which will
# even turn on more output
SILENT = >/dev/null 2>&1
ifeq ($(strip $(SILENT)),)
SET_X = set -x;
MYSQLD_VERBOSE =
else
SET_X =
MYSQLD_VERBOSE = --verbose
endif

COMPONENT_PRE_TEST_ACTION = ( \
	$(SET_X) cd "$(@D)"; \
	\
	: "Prepare the testing directory and create the symlink to it"; \
	$(RM) -r "$(MYSQL_TEST_DATADIR)"; \
	mkdir -p "$(MYSQL_TEST_DATADIR)"; \
	TEST_LINK=`mktemp -t dbd-mysql-test.XXXXXX`; \
	$(RM) "$$TEST_LINK"; \
	ln -s $(MYSQL_TEST_DATADIR) "$$TEST_LINK"; \
	\
	: "alter the tests to use the path we just created"; \
	$(PERL) -pi -e "s,('testsocket' => ')CHANGEME',\$$1/$$TEST_LINK/socket'," t/mysql.mtest ;\
	\
	: "Initialize mysql DB"; \
	"$(MYSQL_BINDIR)/mysqld" \
			--initialize-insecure \
			--datadir="$$TEST_LINK" \
			--basedir=/usr/mysql/$(MYSQL_VERSION) $(SILENT) ; \
	\
	echo "$$TEST_LINK" > "$$TEST_LINK"/test_link; \
	\
	: "Run the daemon in background. --gdb makes it possible to terminate mysqld via Ctrl+C"; \
	"$(MYSQL_BINDIR)/mysqld" \
			$(MYSQLD_VERBOSE) \
			--skip-networking \
			-u "$(MYSQL_TEST_USER)"\
			--datadir="$$TEST_LINK" \
			--socket="$$TEST_LINK"/socket \
			--pid-file="$$TEST_LINK"/pid \
			--gdb \
			$(SILENT) & \
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
	( $(SET_X) PID=`cat "$$TEST_LINK"/pid`; sleep 600; ps -p $$PID && kill $$PID || : ) $(SILENT) & \
	echo $$! > "$$TEST_LINK"/pid_of_guard; \
	sleep 60; \
)

COMPONENT_POST_TEST_ACTION = ( \
	( $(SET_X) PID=`cat $(MYSQL_TEST_DATADIR)/pid`; [ -n "$$PID" ] && ps -p $$PID && kill $$PID || : ) $(SILENT); \
	( $(SET_X) PID=`cat $(MYSQL_TEST_DATADIR)/pid_of_guard`; [ -n "$$PID" ] && ps -p $$PID && kill $$PID || : ) $(SILENT); \
	( $(SET_X) if [ -e "$(MYSQL_TEST_DATADIR)/test_link" ]; then rm -f `cat "$(MYSQL_TEST_DATADIR)/test_link"`; fi ) $(SILENT); \
)

$(LICENSE): $(LICENSE).template
	$(PERL) -pe 's/COMPONENT_VERSION/$(COMPONENT_VERSION)/g' "$<" > "$@"

REQUIRED_PACKAGES += database/mysql-80/library
REQUIRED_PACKAGES += library/perl-5/database
REQUIRED_PACKAGES += system/library/c++-runtime
REQUIRED_PACKAGES += system/library/gcc/gcc-c-runtime
