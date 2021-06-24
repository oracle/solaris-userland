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
	$(TOUCH) proto/usr/lib/pkglinttest/foo.txt

	$(CC) source.c $(ASLR_ENABLE) -m32 -o proto/32bin
	$(CC) source.c $(ASLR_ENABLE) -m64 -o proto/64bin

	$(MKDIR) proto/usr/bin/sparcv7 proto/usr/bin/amd64
	$(CP) proto/32bin proto/usr/bin/sparcv7/32in32a
	$(CP) proto/32bin proto/usr/bin/amd64/32in64a
	$(CP) proto/32bin proto/usr/bin/sparcv7/32in32b
	$(CP) proto/32bin proto/usr/bin/amd64/32in64b

	$(CP) proto/64bin proto/usr/bin/sparcv7/64in32a
	$(CP) proto/64bin proto/usr/bin/amd64/64in64a
	$(CP) proto/64bin proto/usr/bin/sparcv7/64in32b
	$(CP) proto/64bin proto/usr/bin/amd64/64in64b

	$(MKDIR) proto/usr/lib/runpath
	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/lib:/lib/python:/usr/lib:\$$ORIGIN/asdf -o proto/usr/lib/runpath/good32
	$(CC) source.c $(ASLR_ENABLE) -m64 -Wl,-rpath,/usr/64:/lib/amd64:/lib/amd64-solaris2.11 -o proto/usr/lib/runpath/good64
	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/wrong:/lib:/tmp -o proto/usr/lib/runpath/bad

	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/lib -o proto/usr/lib/runpath/32with32
	$(CC) source.c $(ASLR_ENABLE) -m64 -Wl,-rpath,/lib -o proto/usr/lib/runpath/64with32
	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/lib/amd64 -o proto/usr/lib/runpath/32with64
	$(CC) source.c $(ASLR_ENABLE) -m64 -Wl,-rpath,/lib/amd64 -o proto/usr/lib/runpath/64with64

	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/usr/openwin/lib -o proto/usr/lib/runpath/linka
	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/usr/openwin/bin -o proto/usr/lib/runpath/linkb
	$(CC) source.c $(ASLR_ENABLE) -m32 -Wl,-rpath,/usr/X11/bin -o proto/usr/lib/runpath/linkc

	$(MKDIR) proto/usr/lib/aslr
	$(CC) source.c $(ASLR_ENABLE) -o proto/usr/lib/aslr/enabled
	$(CC) source.c $(ASLR_DISABLE) -o proto/usr/lib/aslr/disabled
	$(CC) source.c -o proto/usr/lib/aslr/noflag


	$(MKDIR) proto/usr/lib/python
	$(TOUCH) proto/usr/lib/python/without.py
	$(TOUCH) proto/usr/lib/python/orphan.py
	$(PYTHON.2.7) -m compileall proto/usr/lib/python/orphan.py
	$(RM) proto/usr/lib/python/orphan.py

	$(TOUCH) proto/usr/lib/python/magicmismatch.py
	$(PYTHON.3.9) -m compileall proto/usr/lib/python/magicmismatch.py
	$(MV) proto/usr/lib/python/__pycache__/magicmismatch.cpython-39.pyc \
		proto/usr/lib/python/__pycache__/magicmismatch.cpython-37.pyc

	$(TOUCH) proto/usr/lib/python/correct2.py
	$(TOUCH) proto/usr/lib/python/correct3.py
	$(PYTHON.2.7) -m compileall proto/usr/lib/python/correct2.py
	$(PYTHON.3.7) -m compileall proto/usr/lib/python/correct3.py

	$(TOUCH) proto/usr/lib/python/stale2.py
	$(TOUCH) proto/usr/lib/python/stale3.py
	$(PYTHON.2.7) -m compileall proto/usr/lib/python/stale2.py
	$(PYTHON.3.7) -m compileall proto/usr/lib/python/stale3.py
	# wait, otherwise timestamp might be unchanged
	sleep 1
	$(TOUCH) proto/usr/lib/python/stale2.py
	$(TOUCH) proto/usr/lib/python/stale3.py

	$(TOUCH) proto/manifest.xml

	$(TOUCH) $@

build: proto/.prepared

test: build
	$(PYTHON) -m pytest -v runtest.py

clean:
	$(RM) -r proto source.c
	$(RM) -r .pytest_cache __pycache__
