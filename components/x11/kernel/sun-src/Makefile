#
# Copyright (c) 2015, 2019, Oracle and/or its affiliates. All rights reserved.
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
#  Primary Makefile to build the components in kernel/sun-src
#
###############################################################################

TOP = .
PWD:sh=pwd

include $(TOP)/Makefile.init

#
# Definitions that are similar to other Makefiles
#
OS_SUBDIRS_common =

OS_SUBDIRS_sparc = $(OS_SUBDIRS_common)

OS_SUBDIRS_i386  = $(OS_SUBDIRS_common)	\
	drm \
	i915 \
	mdb

# MACH will be either "sparc" or "i386"
MACH=$(TARGET_ARCH:-%=%)

OS_SUBDIRS=$(OS_SUBDIRS_$(MACH))

# Variables to always pass down to subdirs
PASSDOWN_VARS = V="$(V)" TOP="$(PWD)" CDEBUGFLAGS="$(CDEBUGFLAGS)"

.DEFAULT:
	$(MAKE) -e $(MAKEFLAGS) $(PASSDOWN_VARS) subdirs OS_TARGET=$@

# debug isn't working quite right yet.
# World: clean all debug install
World: clean all install lint

clobber: xref-clobber parfait-clobber
	$(MAKE) $(MAKEFLAGS) $(PASSDOWN_VARS) subdirs OS_TARGET=clobber

subdirs: $(OS_SUBDIRS)

debug:
	@ set +e; \
	cd $@ ; \
	print "## making debug" $(OS_TARGET) "in $(DIRNAME)$@..."; \
	$(MAKE) DEBUG=DEBUG $(MAKEFLAGS) $(PASSDOWN_VARS) $(DEBUGPASSDOWN) $(OS_TARGET)

$(OS_SUBDIRS): ALWAYS_RUN
	@case '${MAKEFLAGS}' in *[ik]*) set +e;; esac; \
	cd $@ ; \
	print "## making" $(OS_TARGET) "in $(DIRNAME)$@..."; \
        $(MAKE) $(MAKEFLAGS) $(PASSDOWN_VARS) $(OS_TARGET)

# Build various x-ref's
XREFDIRS	= Make* sys $(OS_SUBDIRS_i386) $(OS_SUBDIRS_sparc) $(PROTODIR)/usr/include/drm

xref: tags cscope.out

xref-clobber: tags-clobber cscope-clobber

cscope.files: ALWAYS_RUN
	@echo "Building filelist from $(XREFDIRS)"; \
	find $(XREFDIRS) -follow -name "Make*" -o -name "*.[ch]" > $@; \
	if [[ -f gfxp_files ]]; then \
		/usr/bin/cat -s gfxp_files >> $@; \
	fi

tags: cscope.files
	@ctags -tw `cat cscope.files`

tags-clobber:
	@rm -f tags cscope.files

cscope.out: cscope.files
	@cscope-fast -bq

cscope-clobber:
	@rm -f cscope.files cscope.in.out cscope.out cscope.out.in cscope.out.po cscope.po.out

# Create local Parfait output
XBUILD_HG_ID:sh=hg id -i
PLOG			= parfait_log
PARFAIT_MAX_JOBS	= 100%


${PLOG}:
	@if [[ ! -d $@ ]] ; then mkdir $@ ; fi ; \

parfait: ALWAYS_RUN ${PLOG}
	-@echo "Making Parfait" ; \
	parfait -e all -c ${TOP}/../../X-parfait.conf \
	   -z "${TOP}" -j "${PARFAIT_MAX_JOBS}" \
	   -r "${XBUILD_HG_ID}" -o ${PLOG}/parfait.txt -g ${PLOG}/parfait \
	   ${TOP} > ${PLOG}/parfait.out 2>&1 ; \
	if [[ $$? != 0 ]]; \
	  then echo "Parfait defects discovered, see ${PWD}/${PLOG}"; \
	fi ; \
	return 0

parfait-clobber:
	rm -rf ${PLOG}

# Dummy target to force another target to always be run, even if a file
# or directory with the same name already exists (as it will for subdirs)
ALWAYS_RUN:

# Tell dmake it can build subdirs in parallel
.PARALLEL: $(OS_SUBDIRS)

# Dependencies between modules
i915: drm
