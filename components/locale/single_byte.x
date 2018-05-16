#
# CDDL HEADER START
#
# The contents of this file are subject to the terms of the
# Common Development and Distribution License (the "License").  
# You may not use this file except in compliance with the License.
#
# You can obtain a copy of the license at src/OPENSOLARIS.LICENSE
# or http://www.opensolaris.org/os/licensing.
# See the License for the specific language governing permissions
# and limitations under the License.
#
# When distributing Covered Code, include this CDDL HEADER in each
# file and include the License file at src/OPENSOLARIS.LICENSE.
# If applicable, add the following below this CDDL HEADER, with the
# fields enclosed by brackets "[]" replaced with your own identifying
# information: Portions Copyright [yyyy] [name of copyright owner]
#
# CDDL HEADER END
#
# Copyright (c) 2005, 2018, Oracle and/or its affiliates. All rights reserved.

#
# This is the generic version of the method file for producing a single
# byte locale which as a EUC based file code charmap and will run in native
# process code.  Don't assume anything about the process code.
# The applications you intend to run must be Code Set Independent (CSI)
# to run properly.
#

METHODS
process_code	dense
cswidth		1:1,0:0,0:0

fgetwc		"__fgetwc_sb"	"libc"	"/usr/lib/"  "/usr/lib/" "libc.so.1"
fnmatch		"__fnmatch_sb"
getdate		"__getdate_std"
iswctype	"__iswctype_sb"
mbftowc		"__mbftowc_sb"
mblen		"__mblen_sb"
mbstowcs	"__mbstowcs_sb"
mbtowc		"__mbtowc_sb"
regcomp		"__regcomp_std"
regexec		"__regexec_std"
regerror	"__regerror_std"
regfree		"__regfree_std"
strcoll		"__strcoll_sb"
strfmon		"__strfmon_std"
strftime	"__strftime_std"
strptime	"__strptime_std"
strxfrm		"__strxfrm_sb"
towctrans	"__towctrans_std"
towlower	"__towlower_std"
towupper	"__towupper_std"
trwctype	"__trwctype_std"
wcscoll		"__wcscoll_bc"
wcscoll@native	"__wcscoll_std"
wcsftime	"__wcsftime_std"
wcstombs	"__wcstombs_sb"
wcswidth	"__wcswidth_sb"
wcsxfrm		"__wcsxfrm_bc"
wcsxfrm@native	"__wcsxfrm_std"
wctomb		"__wctomb_sb"
wctrans		"__wctrans_std"
wctype		"__wctype_std"
wcwidth		"__wcwidth_sb"
btowc		"__btowc_euc"
btowc@native	"__btowc_sb"
wctob		"__wctob_euc"
wctob@native	"__wctob_sb"
mbsinit		"__mbsinit_gen"
mbrlen		"__mbrlen_sb"
mbrtowc		"__mbrtowc_euc"
mbrtowc@native	"__mbrtowc_sb"
wcrtomb		"__wcrtomb_euc"
wcrtomb@native	"__wcrtomb_sb"
mbsrtowcs	"__mbsrtowcs_euc"
mbsrtowcs@native	"__mbsrtowcs_sb"
wcsrtombs	"__wcsrtombs_euc"
wcsrtombs@native	"__wcsrtombs_sb"

END METHODS
