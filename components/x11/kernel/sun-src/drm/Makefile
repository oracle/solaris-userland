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
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.
#
#
###############################################################################
#
#  This Makefile drives the production of the DRM (Direct Rendering
#  Manager) common misc module.
#
###############################################################################

TOP	= ..

#
# Module core info
#
MODULE			= drm

# Where are the local sources relative to the build dir
REL_SOURCE_DIR		= ../src

# Where do we install the driver.
MODULE_PREFIX		= kernel/misc/$(MACH64_i386)

MODULE_MAKEFLAGS	= VPATH=$(REL_SOURCE_DIR) -f $(REL_SOURCE_DIR)/Makefile
MODULE_BUILD_ENV	= $(CONFIG_ENV) PREFIX=$(MODULE_PREFIX)
MODULE_LDFLAGS		= -ztype=kmod -znodefs  -Nmisc/agpmaster -Nmisc/gfx_private

#
#	Include kernel rules.
#
include $(TOP)/Makefile.inc
include $(TOP)/Makefile.rules
