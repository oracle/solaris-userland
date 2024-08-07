#
# Copyright (c) 2010, 2024, Oracle and/or its affiliates.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
#

PACKAGE=os-welcome
VERSION=1.3.1

top_builddir=.
top_srcdir=.

SUBDIRS= po
DIST_FILES=
ALL_FILES_BASE= \
	index.html \
	$(null)

# Let's avoid having multiple copies of images - we could do the same for css at
# some stage
ALL_IMAGES = \
	html/C/images/Oracle_Solaris.svg \
	$(null)

ALL_STYLE = \
	html/C/js/1p.js \
	html/C/css/master.css \
	$(null)

ALL_LINGUAS=C de es fr it ja ko pt_BR zh_CN zh_HK zh_TW
ALL_FILES= $(foreach ling, $(ALL_LINGUAS), $(addprefix html/$(ling)/, $(ALL_FILES_BASE)))
ALL_FILES+= html/index.html $(ALL_IMAGES) $(ALL_STYLE)

DATA= \
   os-about \
   os-next-steps \
   os-about.desktop \
   os-next-steps.desktop

DIST_FILES= $(ALL_FILES) \
	Makefile \
	ChangeLog \
	README \
	os-about.py \
	os-about.desktop.in \
	os-next-steps.py \
	os-next-steps.desktop.in \
	images/about-os-logo.png  \
	images/about-os-background.jpg \
	images/os-about-symbolic.svg \
	images/os-about.svg \
	images/os-next-steps-symbolic.svg  \
	images/os-next-steps.svg  \
	images/participate.png \
	images/resources.png

NEXT_STEPS_DIR = /usr/share/os-about
WELCOME_DIR= /usr/share/doc/os-welcome
DESKTOP_DIR= /usr/share/applications
ICON_DIR= /usr/share/icons/hicolor
BIN_DIR = /usr/bin
LIB_DIR = /usr/lib/os-welcome
DESTDIR=
XDG_DIR= /etc/xdg/autostart
INSTALL=/usr/sbin/install
GMSGFMT=/usr/bin/gmsgfmt

default: all

%.desktop: %.desktop.in $(wildcard $(top_srcdir)/po/*.po)
	$(GMSGFMT) --desktop --template $< -d $(top_srcdir)/po -o $@

python_scripts: $(DATA)

os-about: os-about.py
	cp $< $@

os-next-steps: os-next-steps.py
	cp $< $@

all: $(DATA)
	@list='$(SUBDIRS)'; for subdir in $$list; do \
	  cd $$subdir && $(MAKE) $@; \
	done;
	@echo use make install DESTDIR=/path/to/proto to install to a proto area

install: $(DATA)
	@list='$(SUBDIRS)'; for subdir in $$list; do \
	  cd $$subdir && $(MAKE) $@; \
	done;
	$(INSTALL) -d -m 755 $(DESTDIR)$(WELCOME_DIR)
	for f in $(ALL_FILES); do \
	  dir=`dirname $$f`; \
	  echo installing $$f in $$dir; \
	  $(INSTALL) -d -m 755 $(DESTDIR)$(WELCOME_DIR)/$$dir; \
	  $(INSTALL) -m 644 -f $(DESTDIR)$(WELCOME_DIR)/$$dir $$f; \
	done
	$(INSTALL) -d -m 755 $(DESTDIR)$(DESKTOP_DIR)
	$(INSTALL) -m 644 -f $(DESTDIR)$(DESKTOP_DIR)/$$dir os-about.desktop
	$(INSTALL) -m 644 -f $(DESTDIR)$(DESKTOP_DIR)/$$dir os-next-steps.desktop
	$(INSTALL) -d -m 755 $(DESTDIR)$(BIN_DIR)
	$(INSTALL) -m 755 -f $(DESTDIR)$(BIN_DIR)/$$dir os-about
	$(INSTALL) -m 755 -f $(DESTDIR)$(BIN_DIR)/$$dir os-next-steps
	$(INSTALL) -d -m 755 $(DESTDIR)$(ICON_DIR)/scalable/apps
	$(INSTALL) -m 644 -f $(DESTDIR)$(ICON_DIR)/scalable/apps/$$dir images/os-about.svg
	$(INSTALL) -m 644 -f $(DESTDIR)$(ICON_DIR)/scalable/apps/$$dir images/os-next-steps.svg
	$(INSTALL) -d -m 755 $(DESTDIR)$(ICON_DIR)/symbolic/apps
	$(INSTALL) -m 644 -f $(DESTDIR)$(ICON_DIR)/symbolic/apps/$$dir images/os-about-symbolic.svg
	$(INSTALL) -m 644 -f $(DESTDIR)$(ICON_DIR)/symbolic/apps/$$dir images/os-next-steps-symbolic.svg
	$(INSTALL) -d -m 755 $(DESTDIR)$(NEXT_STEPS_DIR)
	$(INSTALL) -m 644 -f $(DESTDIR)$(NEXT_STEPS_DIR)/$$dir images/about-os-logo.png
	$(INSTALL) -m 644 -f $(DESTDIR)$(NEXT_STEPS_DIR)/$$dir images/about-os-background.jpg
	$(INSTALL) -m 644 -f $(DESTDIR)$(NEXT_STEPS_DIR)/$$dir images/participate.png
	$(INSTALL) -m 644 -f $(DESTDIR)$(NEXT_STEPS_DIR)/$$dir images/resources.png

uninstall:
	for f in $(ALL_FILES); do \
	  rm -f $(DESTDIR)$(WELCOME_DIR)/$$f; \
	done
	-test -d $(DESTDIR)$(WELCOME_DIR)/html/css && \
	/bin/rmdir -ps $(DESTDIR)$(WELCOME_DIR)/html/css
	-test -d $(DESTDIR)$(WELCOME_DIR)/html/js && \
	/bin/rmdir -ps $(DESTDIR)$(WELCOME_DIR)/html/js
	rm -f $(DESTDIR)$(BIN_DIR)/os-about
	rm -f $(DESTDIR)$(BIN_DIR)/os-next-steps
	rm -f $(DESTDIR)$(DESKTOP_DIR)/os-about.desktop
	rm -f $(DESTDIR)$(DESKTOP_DIR)/os-next-steps.desktop
	-/bin/rmdir -ps $(DESTDIR)$(DESKTOP_DIR)
	-/bin/rmdir -ps $(DESTDIR)$(BIN_DIR)

clean:
	rm os-about.desktop os-next-steps.desktop
	rm os-about os-next-steps

distcheck:
	@for f in $(DIST_FILES); do \
	  test -f $$f && continue; \
	  echo ERROR: $$f not found; \
	  exit 1; \
	done

dist: distcheck
	rm -rf $(PACKAGE)-$(VERSION); \
	mkdir -p $(PACKAGE)-$(VERSION); \
	list='$(SUBDIRS)'; for subdir in $$list; do \
	  if test "$$subdir" = .; then :; else \
	    test -d "$(PACKAGE)-$(VERSION)/$$subdir" \
	    || mkdir -p "$(PACKAGE)-$(VERSION)/$$subdir" \
	    || exit 1; \
	    cd $$subdir && $(MAKE) $@; \
	  fi; \
	done;
	for f in $(DIST_FILES); do \
	  dir=`dirname $$f`; \
	  echo installing $$f in $$dir; \
	  $(INSTALL) -d -m 755 $(PACKAGE)-$(VERSION)/$$dir; \
	  $(INSTALL) -m 644 -f $(PACKAGE)-$(VERSION)/$$dir $$f; \
	done ;\
	/bin/tar cf - $(PACKAGE)-$(VERSION) | \
		bzip2 -9 > $(PACKAGE)-$(VERSION).tar.bz2
	rm -rf $(PACKAGE)-$(VERSION)
