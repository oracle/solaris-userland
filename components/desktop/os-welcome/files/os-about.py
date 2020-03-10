#!/usr/bin/python3.7

#
# Copyright (c) 2010, 2020, Oracle and/or its affiliates. All rights reserved.
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

import locale
import gettext
from gettext import gettext as _
import os
import platform
import subprocess

import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, Gdk

def N_(message): return message

PACKAGE = "os-welcome"
LOCALEDIR = "/usr/share/locale"

release_text = N_("Release")
space_text = N_("Used Space")
available_text = N_("Available Space")
memory_text = N_("Memory")

def get_solaris_version():
    # product name is not localized. Uses version from uname -v.
    return f"Oracle Solaris {platform.version()}"


def get_machine_memory():
    res = subprocess.run("/usr/sbin/prtconf", capture_output=True, text=True)
    # don't assume that output is the same forever
    for line in res.stdout.splitlines():
        if line.startswith("Memory size:"):
            memory_info = line
            break
    else:
        # if memory size cannot be determined
        return "Unknown"

    value, unit = memory_info.split("Memory size: ")[1].split(" ")
    if "Megabytes" in unit:
        return _("%.1f MB") % int(value)
    elif "Gigabytes" in unit:
        return _("%.1f GB") % int(value)
    else:
        return f"{value} {unit}"


def format_size_for_display(size):
    KILOBYTE_FACTOR = 1024.0
    MEGABYTE_FACTOR = 1024.0 ** 2
    GIGABYTE_FACTOR = 1024.0 ** 3

    if size < KILOBYTE_FACTOR:
        return _("%u bytes") % size
    else:
        if size < MEGABYTE_FACTOR:
            displayed_size = size / KILOBYTE_FACTOR
            return _("%.1f KB") % displayed_size
        elif size < GIGABYTE_FACTOR:
            displayed_size = size / MEGABYTE_FACTOR
            return _("%.1f MB") % displayed_size
        else:
            displayed_size = size / GIGABYTE_FACTOR
            return _("%.1f GB") % displayed_size


class NoticeDialog(Gtk.Dialog):

    def __init__(self, parent, filename):
        title = _('Oracle Solaris Notices')
        Gtk.Dialog.__init__(self, title, parent, modal=True, destroy_with_parent=True)
        self.add_buttons(Gtk.STOCK_OK, Gtk.ResponseType.OK)

        # destroy the dialog once button is clicked
        self.connect('response', lambda w, id: self.destroy())

        self.set_decorated(True)
        self.set_default_size(700, 700)
        self.set_border_width(12)
        self.set_resizable(True)

        self.scrolledwin = Gtk.ScrolledWindow()
        # this determines when the scrollbar should be displayed
        self.scrolledwin.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC)
        # type of bevel shadow drawn around the contents of the scrolled window
        self.scrolledwin.set_shadow_type(Gtk.ShadowType.ETCHED_IN)

        # set number of pixels to place between children of the box
        self.vbox.set_spacing(12)
        # add scrolledwin at the start of dialog main area
        self.vbox.pack_start(self.scrolledwin, expand=True, fill=True, padding=0)

        self.textview = Gtk.TextView()
        self.textview.set_cursor_visible(False)
        self.textview.set_editable(False)

        self.textbuffer = self.textview.get_buffer()
        self.iter = self.textbuffer.get_iter_at_offset(0)

        with open(filename) as ifile:
            for string in ifile.readlines():
                self.textbuffer.insert(self.iter, string)

        self.scrolledwin.add(self.textview)
        self.show_all()


class DialogOS(Gtk.Dialog):

    def __init__(self, parent=None):
        Gtk.Dialog.__init__(self, self.__class__.__name__, parent)
        self.connect('destroy', lambda *w: Gtk.main_quit())
        self.set_name('os_dialog')

        Gtk.Window.set_default_icon_from_file("/usr/share/os-about/about-os-window-icon.png")

        self.set_title(_("Welcome to Oracle Solaris"))
        self.set_border_width(5)
        self.set_resizable(False)
        self.action_area.set_border_width(5)

        main_vbox = Gtk.VBox(homogeneous=False, spacing=8)
        main_vbox.set_border_width(5)

        # Logo
        logo = Gtk.Image()
        logo.set_from_file("/usr/share/os-about/about-os-logo.png")
        main_vbox.pack_start(logo, False, False, 0)

        # System Information
        vfs = os.statvfs("/")
        size = vfs.f_blocks * vfs.f_frsize
        avail = vfs.f_bfree * vfs.f_frsize
        used = size - avail

        # add some vertical space with an empty hbox
        hbox = Gtk.HBox(homogeneous=False, spacing=0)
        main_vbox.pack_start(hbox, False, False, 6)

        info_vbox = Gtk.VBox(homogeneous=False, spacing=0)

        # Version
        release_label = Gtk.Label()
        release_label.set_xalign(0)
        release_label.set_markup(
            "<span size='small'><b>%s:</b></span> <span size='small'>%s</span>" %
            (_(release_text), get_solaris_version()))
        info_vbox.add(release_label)

        # Used Space
        used_label = Gtk.Label()
        used_label.set_xalign(0)
        used_label.set_markup(
            "<span size='small'><b>%s:</b></span> <span size='small'>%s</span>" %
            (_(space_text), format_size_for_display(used)))
        info_vbox.add(used_label)

        # Available Space
        avail_label = Gtk.Label()
        avail_label.set_xalign(0)
        avail_label.set_markup(
            "<span size='small'><b>%s:</b></span> <span size='small'>%s</span>" %
            (_(available_text), format_size_for_display(avail)))
        info_vbox.add(avail_label)

        # Memory Information
        memory_label = Gtk.Label()
        memory_label.set_xalign(0)
        memory_label.set_markup(
            "<span size='small'><b>%s:</b></span> <span size='small'>%s</span>" %
            (_(memory_text), get_machine_memory()))
        info_vbox.add(memory_label)

        # insert everything into hbox with side margins
        hbox = Gtk.HBox(homogeneous=False, spacing=0)
        hbox.pack_start(info_vbox, False, False, 12)

        # insert main_vbox into the dialog itself
        main_vbox.pack_start(hbox, False, False, 0)
        self.vbox.pack_start(main_vbox, False, False, 0)

        notices_button = Gtk.Button(label=_("_Notices"), use_underline=True)
        notices_button.connect('clicked', self.on_license_button_clicked)
        self.action_area.pack_end(notices_button, False, True, 0)

        close_button = self.add_button(Gtk.STOCK_CLOSE, Gtk.ResponseType.CANCEL)
        self.set_default_response(Gtk.ResponseType.CANCEL)
        close_button.grab_default()
        close_button.grab_focus()
        close_button.connect('clicked', lambda *w: Gtk.main_quit())

        help_button = Gtk.Button(stock=Gtk.STOCK_HELP)
        help_button.connect('clicked', self.on_getting_started_button_clicked)
        self.action_area.pack_end(help_button, False, True, 0)
        self.action_area.set_child_secondary(help_button, True)

        self.show_all()

    def on_license_button_clicked(self, button):
        dialog = NoticeDialog(self, "/etc/notices/NOTICES")
        dialog.run()

    def on_getting_started_button_clicked(self, button):
        Gtk.show_uri(None, "file:///usr/share/doc/os-welcome/html/index.html",
                     Gtk.get_current_event_time())


def main():
    locale.setlocale(locale.LC_ALL, "")
    gettext.textdomain(PACKAGE)
    gettext.install(PACKAGE, LOCALEDIR)

    style_provider = Gtk.CssProvider()
    css = b"""
    #os_dialog {
      background-image: url('/usr/share/os-about/about-os-background.jpg');
      background-position: left top;
    }
    GtkTextView, GtkScrolledWindow {
      background: none;
      border: none;
    }
    """
    style_provider.load_from_data(css)

    Gtk.StyleContext.add_provider_for_screen(
        Gdk.Screen.get_default(),
        style_provider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    )

    dialog = DialogOS()
    Gtk.main()


if __name__ == '__main__':
    main()
