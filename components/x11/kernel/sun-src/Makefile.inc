#
# Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved.
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
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.	 IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.
#
#
###############################################################################
#
#  Makefile.inc - rules common to the kernel directory
#
###############################################################################

### Include common definitions
include $(TOP)/Makefile.init

#
# Default build types, driver is only 64 bit, and this one is x86 only.
#
BUILD_TYPES_DEFAULT	= $(BUILD_TYPES_SET:yes=$(POUND_SIGN))
# debug isn't working quite right yet
# $(BUILD_TYPES_DEFAULT)	BUILD_TYPES=64 debug
$(BUILD_TYPES_DEFAULT)	BUILD_TYPES=64
# $(BUILD_TYPES_DEFAULT)	BUILD_TYPES=64
$(BUILD_TYPES_DEFAULT)	BUILD_TYPES_SET=yes


# Define common LDFLAGS
MODTYPE_LDFLAGS	= -zstrip-class=comment	 -zstrip-class=exclude

###############################################################
# Where to find the common include files
# Search first in kernel/sys
DRM_INCL	= -I$(TOP)/sys
# sys/drm should be removed after all includes properly expand to <drm/...>
DRM_INCL	+= -I$(TOP)/sys/drm
# Point to the build PROTODIR
DRM_INCL	+= -I$(PROTODIR)/usr/include
DRM_INCL	+= -I$(PROTODIR)/usr/include/drm
DRM_INCL	+= -I/usr/include/drm


###############################################################
# CFLAGS for kernel modules
#
# Standard defines needed for this driver on solaris independent of compiler
KDEFINES	= -D_KERNEL -D_ELF64  -D_DDI_STRICT -Dsun -D__sun \
		-D__SVR4 -D_SYSCALL32 -D_SYSCALL32_IMPL -D_ASM_INLINES

# Don't use defines based on MACH.
KDEFINES	+= -U$(MACH) -U__$(MACH)

# Debug flags
KDEFINES_DEBUG	+= -DDEBUG

# Driver features.

###############################################################
# Studio flags
# Note: KFLAGS without a "compiler" extension are common across
# all compilers.
# Use C11
KFLAGS_studio		+= -std=c11
KFLAGS_studio		+= -features=extensions

# Create 64bit code
KFLAGS_studio		+= -m64

# Be verbose
KFLAGS_studio		 += -v

# Use optimizer level 3
KFLAGS_studio		+= -xO3

# Generate code for the "kernel" model
KFLAGS_studio		 += -xmodel=kernel

# Pass "save_args" to code generator
KFLAGS_studio		 += -Wu,-save_args

# Use STABS for debug tags (or mdb won't be useful).
KFLAGS_studio		 += -xdebugformat=stabs

# Don't use a vector library
KFLAGS_studio		 += -xvector=none

# Don't optimize if it increases size
KFLAGS_studio		+= -xspace

# Error flags
# Display the tag associated with the error
KFLAGS_studio		+= -errtags=yes

# Exit on all warnings except specified
# e.g.: KFLAGS_studio	+= -errwarn=%all,no%E_PTR_TO_VOID_IN_ARITHMETIC
KFLAGS_studio		+= -errwarn=%all

# Print only tags when displaying warnings
KFLAGS_studio		+= -errshort=tags

# Errors/Warnings that can be ignored
# e.g.: KFLAGS_studio	+= -erroff=E_PTR_TO_VOID_IN_ARITHMETIC
KFLAGS_studio		+= -erroff=E_EMPTY_INITIALIZER
KFLAGS_studio		+= -erroff=E_ZERO_SIZED_STRUCT_UNION

# Architecture specific flags
# Do not allow float in passed args for kernel modules
KFLAGS_studio_i386	+= -W2,-xregs=no%float
KFLAGS_studio_i386	+= -Wu,-xregs=no%float
KFLAGS_studio_i386	+= -W0,-y-xregs=no%float

# To make sure ctfconvert has STABS/Dwarf data and doesn't
# "globalize"
CTF_FLAGS	= -g
CTF_FLAGS	+= -xglobalize=no


###############################################################
# Add GCC flags here.
#
KFLAGS_gcc	+= -std=gnu11
KFLAGS_gcc	+= -m64
KFLAGS_gcc	+= -FPIC
KFLAGS_gcc	+= -mtune=generic
KFLAGS_gcc	+= -mcmodel=kernel
KFLAGS_gcc	+= -Werror
KFLAGS_gcc	+= -Wfatal-errors
KFLAGS_gcc	+= -gdwarf-2
KFLAGS_gcc	+= -feliminate-unused-debug-symbols
KFLAGS_gcc	+= -gno-strict-dwarf
KFLAGS_gcc	+= -feliminate-dwarf2-dups

###############################################################

INC_PATH	= -I. $(DRM_INCL) -I/usr/include


# Debug, anyone???
PROG_FLAGS	+= $(KDEFINES_$(DEBUG)) $(KFLAGS_$(DEBUG))

# KFLAGS based on compiler
KFLAGS		+= $(KFLAGS_$(MODULE_COMPILER))
# KFLAGS based on compiler and machine
KFLAGS		+= $(KFLAGS_$(MODULE_COMPILER)_$(MACH))

MODTYPE_CPPFLAGS = $(INC_PATH)
MODTYPE_CFLAGS	= $(INC_PATH) $(KDEFINES) $(KFLAGS) $(CTF_FLAGS) $(PROG_FLAGS)

#
# Define the MODTYPE environment
#
MODTYPE_BUILD_ENV	+= CFLAGS="$(MODTYPE_CFLAGS) $(MODULE_CFLAGS)"
MODTYPE_BUILD_ENV	+= CPPFLAGS="$(MODTYPE_CPPFLAGS) $(MODULE_CPPFLAGS)"
MODTYPE_BUILD_ENV	+= LDFLAGS="$(MODTYPE_LDFLAGS) $(MODULE_LDFLAGS)"
MODTYPE_BUILD_ENV	+= CC='$(CC)' LD='$(LD)' LINT='$(LINT)'

### Default rules for common build pattern

all: build

BUILD_ENV += $(MODTYPE_BUILD_ENV) $(MODULE_BUILD_ENV)

build:
	cd src ; $(BUILD_ENV) $(MAKE) $(MAKEFLAGS)

INSTALL_ENV = $(BUILD_ENV) \
	$(MODTYPE_INSTALL_ENV) $(MODULE_INSTALL_ENV)

install: $(INSTALL_DEPS)
	cd src ; $(INSTALL_ENV) $(MAKE) $(MAKEFLAGS) install
