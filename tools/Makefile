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

#
# Copyright (c) 2010, 2025, Oracle and/or its affiliates.
#

COMPILER= gcc

include ../make-rules/shared-macros.mk

download setup prep build install publish \
validate:	links pkglint time-$(MACH32).so time-$(MACH64).so

# generate wrappers for parfait. we need to generate them
# with the correct compiler variables from the common makefiles because
# some things reset the environment which causes lovely infinite
# loops
links:
	@$(MKDIR) $(PARFAIT_TOOLS)
	@MACH=$$(uname -p); \
	[[ "$$MACH" == "i386" ]] && MACH=x86_64; \
	for i in cc CC g++ ld ; do \
		$(RM) $(PARFAIT_TOOLS)/$$i ; \
		echo "#!/bin/ksh" > $(PARFAIT_TOOLS)/$$i ; \
		echo "IFS=" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "export PARFAIT_NATIVESUNCC=$(SPRO_VROOT)/bin/cc" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "export PARFAIT_NATIVESUNCXX=$(SPRO_VROOT)/bin/CC" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "export PARFAIT_NATIVEGCC=$(GCC_ROOT)/bin/gcc" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "export PARFAIT_NATIVEGXX=$(GCC_ROOT)/bin/g++" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "export PARFAIT_NATIVELD=/usr/bin/ld" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "exec" $(PARFAIT_VROOT)/$$MACH/parfait-$$i '$$*' >> $(PARFAIT_TOOLS)/$$i ; \
		chmod +x $(PARFAIT_TOOLS)/$$i ; \
	done; \
	for i in gcc ; do \
		$(RM) $(PARFAIT_TOOLS)/$$i ; \
		echo "#!/bin/ksh" > $(PARFAIT_TOOLS)/$$i ; \
		echo "IFS=" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "export PARFAIT_NATIVESUNCC=$(SPRO_VROOT)/bin/cc" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "export PARFAIT_NATIVESUNCXX=$(SPRO_VROOT)/bin/CC" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "export PARFAIT_NATIVEGCC=$(GCC_ROOT)/bin/gcc" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "export PARFAIT_NATIVEGXX=$(GCC_ROOT)/bin/g++" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "export PARFAIT_NATIVELD=/usr/bin/ld" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "if  [[ \"\$$1\" == \"-print-prog-name=ld\" ]]; then" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "    echo \$$(dirname \$$0)/ld" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "else" >> $(PARFAIT_TOOLS)/$$i ; \
		echo "    exec" $(PARFAIT_VROOT)/$$MACH/parfait-$$i -D_Noreturn= '$$*' >> $(PARFAIT_TOOLS)/$$i ; \
		echo "fi" >> $(PARFAIT_TOOLS)/$$i ; \
		chmod +x $(PARFAIT_TOOLS)/$$i ; \
	done

pkglint:
	@chmod +x pkglint

time-$(MACH64).o:			BITS=64
time-$(MACH32).o time-$(MACH64).o:	CFLAGS += $(CC_PIC)

time-$(MACH32).o time-$(MACH64).o:	time.c
	@$(CC) $(CFLAGS) -c -o $@ $<

time-%.so:	time-%.o
	@$(LD) -G -o $@ $<

clean:
	@$(RM) time-*.o time*.bc

clobber:	clean
	@$(RM) time-*.so python/pkglint/*.pyc
	@$(RM) -r $(PARFAIT_TOOLS) $(MACH)
	@$(RM) .gnupg/pubring.gpg~ .gnupg/secring.gpg .gnupg/trustdb.gpg

.PHONY: pkglint
