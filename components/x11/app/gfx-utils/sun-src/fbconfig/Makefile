#
# Copyright (c) 1999, 2016, Oracle and/or its affiliates. All rights reserved.
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the "Software"),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice (including the next
# paragraph) shall be included in all copies or substantial portions of the
# Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.
#


BIN	= fbconfig
INSTALL_BIN_DIR = $(DESTDIR)/usr/sbin

HEADERS	=
CSOURCES=fbconfig.c
OBJECTS	=$(CSOURCES:.c=.o)

INCPATHS=-I../gfx_common/include
CFLAGS += $(INCPATHS)
CFLAGS += $(CPPFLAGS)

LIBPATHS=-lscf

all:	$(BIN)

$(BIN):	$(OBJECTS)
	$(CC) $^ $(LDFLAGS) $(LIBPATHS) -o $@

%.o:	%.c
	$(CC) $(CFLAGS) -c $< -o $@

%.lint: %.c
	$(LINT.c) -DDEBUG_FB $(CFLAGS) $(LIBPATHS) $<

clean:
	-rm -f $(OBJECTS)

clobber: clean
	-rm -f $(BIN)

install: all
	-mkdir -p $(INSTALL_BIN_DIR)
	$(INSTALL) -m 0555 $(BIN) $(INSTALL_BIN_DIR)
	$(INSTALL) -m 0444 exec_attr $(DESTDIR)/etc/security/exec_attr.d/fbconfig
	$(INSTALL) -m 0444 fbconfig.8 $(DESTDIR)/usr/share/man/man8/fbconfig.8

# End of Makefile
