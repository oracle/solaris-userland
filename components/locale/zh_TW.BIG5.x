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
# Copyright (c) 1996, 2018, Oracle and/or its affiliates. All rights reserved.
#

LCBIND
 _E1 = 0x00000100
 _E2 = 0x00000200
 _E3 = 0x00000400
 _E4 = 0x00000800
 _E5 = 0x00001000
# _E6 = 0x00002000
 _E9 = 0x00010000
_E10 = 0x00020000
_E11 = 0x00040000
_E12 = 0x00080000
_E13 = 0x00100000
_E14 = 0x00200000
_E15 = 0x00400000
_E16 = 0x00800000
_E17 = 0x01000000
_E18 = 0x02000000

isphonogram charclass _E1
isideogram  charclass _E2
isenglish   charclass _E3
isnumber    charclass _E4
isspecial   charclass _E5
#iswchar6    charclass _E6
iswchar9    charclass _E9
iswchar10   charclass _E10
iswchar11   charclass _E11
#iswchar12   charclass _E12
iswchar13   charclass _E13
#iswchar14   charclass _E14
iswchar15   charclass _E15
iswchar16   charclass _E16
iswchar17   charclass _E17
iswchar18   charclass _E18

END LCBIND

METHODS
process_code	dense

iswctype	"__iswctype_std"	"libc"  "/usr/lib/" "/usr/lib/" "libc.so.1"
towctrans	"__towctrans_std"
towlower	"__towlower_std"
towupper	"__towupper_std"
trwctype        "__trwctype_std"
wctrans         "__wctrans_std"
wctype          "__wctype_std"
 
strcoll         "__strcoll_std"
strxfrm         "__strxfrm_std"
wcscoll         "__wcscoll_std"
wcscoll@native  "__wcscoll_std"
wcsxfrm         "__wcsxfrm_std"
wcsxfrm@native  "__wcsxfrm_std"
fnmatch         "__fnmatch_std"
regcomp         "__regcomp_std"
regexec         "__regexec_std"
regerror        "__regerror_std"
regfree         "__regfree_std"
  
strfmon         "__strfmon_std"

strftime        "__strftime_std"
strptime        "__strptime_std"
wcsftime        "__wcsftime_std"
getdate         "__getdate_std"

mbsinit         "__mbsinit_gen"
mbrlen          "__mbrlen_gen"

fgetwc		"__fgetwc_dense_big5"	"localelib" "/usr/lib/locale/common/" "/usr/lib/locale/common/" "methods_zh_TW.BIG5.so.3"
mbftowc		"__mbftowc_dense_big5"
mbtowc		"__mbtowc_dense_big5"
mbrtowc         "__mbrtowc_dense_big5"
mbstowcs	"__mbstowcs_dense_big5"
mblen		"__mblen_dense_big5"
wctomb		"__wctomb_dense_big5"
wcstombs	"__wcstombs_dense_big5"
wcwidth		"__wcwidth_dense_big5"
wcswidth	"__wcswidth_dense_big5"
btowc           "__btowc_dense_big5"
wctob           "__wctob_dense_big5"
wcrtomb         "__wcrtomb_dense_big5"
mbrtowc         "__mbrtowc_dense_big5"
mbsrtowcs       "__mbsrtowcs_dense_big5"
wcsrtombs       "__wcsrtombs_dense_big5"

END METHODS
