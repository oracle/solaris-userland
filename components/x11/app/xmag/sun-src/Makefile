# Copyright (c) 2013, 2025, Oracle and/or its affiliates.
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

SRCS = 	xmag_multivis.c multivis.c
OBJS = $(SRCS:.c=.o)

MULTIVIS_CPPFLAGS = -DSHAPE -DALLPLANES -Wall
LIBS = -lXext -lX11

all:: xmag_multivis

xmag_multivis: $(OBJS)
	$(LD) -o $@ $(CFLAGS) $(LDFLAGS) $(OBJS) $(LIBS)

.c.o:
	$(CC) $(CFLAGS) $(MULTIVIS_CPPFLAGS) $(CPPFLAGS) -c $(OUTPUT_OPTION) $<

install: xmag_multivis xmag_multivis.man
	mkdir -p $(DESTDIR)$(PREFIX)/bin $(DESTDIR)$(PREFIX)/share/man/man1
	$(INSTALL) -m 0555 xmag_multivis $(DESTDIR)$(PREFIX)/bin
	$(INSTALL) -m 0444 xmag_multivis.man $(DESTDIR)$(PREFIX)/share/man/man1/xmag_multivis.1

