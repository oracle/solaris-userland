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
# Copyright (c) 2021, Oracle and/or its affiliates.
#

include ../../../make-rules/shared-macros.mk

source.c:
	echo "int main(void){return 0;}" > $@

proto/.prepared: Makefile source.c
	$(MKDIR) proto

	$(MKDIR) proto/usr/lib/pkglinttest
	$(TOUCH) proto/usr/lib/pkglinttest/foo.py

	$(CC) source.c $(ASLR_ENABLE) -m32 -o proto/32bin
	$(CC) source.c $(ASLR_ENABLE) -m64 -o proto/64bin

	$(MKDIR) proto/sparcv7 proto/amd64
	$(CP) proto/32bin proto/sparcv7/32in32a
	$(CP) proto/32bin proto/amd64/32in64a
	$(CP) proto/32bin proto/sparcv7/32in32b
	$(CP) proto/32bin proto/amd64/32in64b

	$(CP) proto/64bin proto/sparcv7/64in32a
	$(CP) proto/64bin proto/amd64/64in64a
	$(CP) proto/64bin proto/sparcv7/64in32b
	$(CP) proto/64bin proto/amd64/64in64b

	$(MKDIR) proto/runpath
	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/lib:/lib/python:/usr/lib:\$$ORIGIN/asdf -o proto/runpath/good32
	$(CC) source.c $(ASLR_ENABLE) -m64 -Wl,-rpath,/usr/64:/lib/amd64:/lib/amd64-solaris2.11 -o proto/runpath/good64
	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/wrong:/lib:/tmp -o proto/runpath/bad

	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/lib -o proto/runpath/32with32
	$(CC) source.c $(ASLR_ENABLE) -m64 -Wl,-rpath,/lib -o proto/runpath/64with32
	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/lib/amd64 -o proto/runpath/32with64
	$(CC) source.c $(ASLR_ENABLE) -m64 -Wl,-rpath,/lib/amd64 -o proto/runpath/64with64

	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/usr/openwin/lib -o proto/runpath/linka
	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/usr/openwin/bin -o proto/runpath/linkb
	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/usr/X11/bin -o proto/runpath/linkc

	$(MKDIR) proto/aslr
	$(CC) source.c $(ASLR_ENABLE) -o proto/aslr/enabled
	$(CC) source.c $(ASLR_DISABLE) -o proto/aslr/disabled
	$(CC) source.c -o proto/aslr/noflag

	$(TOUCH) $@

build: proto/.prepared

test: build
	$(PYTHON) -m pytest -v runtest.py

clean:
	$(RM) -r proto source.c
	$(RM) -r .pytest_cache __pycache__
