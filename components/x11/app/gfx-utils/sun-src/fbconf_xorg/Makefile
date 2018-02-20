#
# Makefile for fbconf_xorg(1M)
#

#
# Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.
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


include Makefile.common

VPATH	=$(FBC_SRC_DIR)


#
# Preprocessor flags
#

PROG_NAME = -DFBC_PROG_NAME=\"$(BIN)\"

XF86_DEFINE = -DSMI_FBCONFIG
FBC_DEFINE = $(DEFINE) $(XF86_DEFINE)

FBC_INC	= -I$(FBC_SRC_DIR) -I$(XF86_SRC_DIR) -I$(GFX_COMMON)/include

#
# Linker flags
#

LIBS	= $(L_FBC)

#
# Code modules
#

BIN_HDRS = \
	fbc.h \
	  fbc_dev.h \
	  fbc_get_properties.h \
	    fbc_properties.h \
	  fbc_getargs.h \
	    fbc_keywds.h \
	  fbc_help.h \
	  fbc_open_device.h \
	  fbc_gamma_table.h \
	  fbc_line_er.h \
	  fbc_xorg.h \
	  fbc_edit_config.h \
	    fbc_Device.h \
	    fbc_Screen.h \
	    fbc_Monitor.h \
	    fbc_ModeLine.h \
	      fbc_Option.h \
	    fbc_fields.h \
	      fbc_open_master.h \
	  fbc_prconf.h \
	  fbc_propt.h \
	  fbc_res.h \
	    sun_edid.h \
	    fbc_mode_list.h \
	  fbc_ask.h \
	  fbc_error.h

BIN_CSRCS = \
	$(BIN).c \
	  fbc_dev.c \
	  fbc_get_properties.c \
	  fbc_help.c \
	  fbc_open_device.c \
	  fbc_line_er.c

BIN_OBJ_FILES = $(BIN_CSRCS:.c=.o)
BIN_OBJS = $(BIN_OBJ_FILES:%=$(FBC_BIN_DIR)/%)

.NO_PARALLEL:	clean clobber

TARGETS	= \
	$(BIN_DIR) \
	$(BIN_DIR)/$(LIB_AST_SO)$(VERS) \
	$(BIN_DIR)/$(LIB_MGA_SO)$(VERS) \
	$(BIN_DIR)/$(BIN)

all:		init $(TARGETS) 

$(BIN_DIR)/$(BIN): $(BIN_OBJS) $(BIN_DIR)/$(LIB_FBC_SO)$(VERS)
	$(CC) -o $@ $(BIN_OBJS) $(LDFLAGS) $(LIBS)

$(BIN_DIR)/$(LIB_FBC_SO)$(VERS): Makefile.fbc
	$(MAKE) -f Makefile.fbc all

$(BIN_DIR)/$(LIB_AST_SO)$(VERS): $(BIN_DIR)/$(LIB_FBC_SO)$(VERS) Makefile.ast
	$(MAKE) -f Makefile.ast all

$(BIN_DIR)/$(LIB_MGA_SO)$(VERS): $(BIN_DIR)/$(LIB_FBC_SO)$(VERS) Makefile.mga
	$(MAKE) -f Makefile.mga all

# Component-specific compilation rule

$(FBC_BIN_DIR)/%.o: $(FBC_SRC_DIR)/%.c $(FBC_HDRS)
	$(CC) $(FBC_DEFINE) $(FBC_INC) $(CFLAGS) -c -o $@ $<


install: $(INSTALL_BIN_DIR)/$(BIN) $(INSTALL_LIB_DIR)/SunModes_xorg.conf
	$(MAKE) -f Makefile.fbc install
	$(MAKE) -f Makefile.ast install
	$(MAKE) -f Makefile.mga install

$(INSTALL_BIN_DIR)/$(BIN): $(BIN)
	$(INSTALL) -m 0555 $? $@

$(INSTALL_LIB_DIR)/SunModes_xorg.conf: data/SunModes_xorg.conf
	$(INSTALL) -m 0444 $? $@

init:
	$(MKDIR) -p $(BIN_DIR)

clean:
	$(MAKE) -f Makefile.xf86 clean
	$(MAKE) -f Makefile.fbc clean
	$(MAKE) -f Makefile.ast clean
	$(MAKE) -f Makefile.mga clean
	-rm -f $(BIN_OBJS) $(FBC_SRC_DIR)/*~ *~

clobber: clean
	$(MAKE) -f Makefile.xf86 clobber
	$(MAKE) -f Makefile.fbc clobber
	$(MAKE) -f Makefile.ast clobber
	$(MAKE) -f Makefile.mga clobber
	rm -f $(BIN_DIR)/$(BIN)


# End of Makefile
