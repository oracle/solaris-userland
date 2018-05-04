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
_E19 = 0x04000000
_E20 = 0x08000000
_E21 = 0x10000000
_E22 = 0x20000000
_E23 = 0x40000000
_E24 = 0x80000000

isphonogram charclass _E1
isideogram  charclass _E2
isenglish   charclass _E3
isnumber    charclass _E4
isspecial   charclass _E5
#iswchar6    charclass _E6
iswchar9    charclass _E9
iswchar10   charclass _E10
iswchar11   charclass _E11
iswchar12   charclass _E12
iswchar13   charclass _E13
iswchar14   charclass _E14
iswchar15   charclass _E15
iswchar16   charclass _E16
iswchar17   charclass _E17
iswchar18   charclass _E18
iswchar19   charclass _E19
iswchar20   charclass _E20
iswchar21   charclass _E21
iswchar22   charclass _E22
iswchar23   charclass _E23
iswchar24   charclass _E24

END LCBIND

METHODS
process_code	euc
cswidth		2:2,0:0,0:0

iswctype	"__iswctype_bc"	"libc"	"/usr/lib/" "/usr/lib/" "libc.so.1"
iswctype@native	"__iswctype_std"
towctrans	"__towctrans_bc"
towctrans@native "__towctrans_std"
towlower	"__towlower_bc"
towlower@native	"__towlower_std"
towupper	"__towupper_bc"
towupper@native	"__towupper_std"
trwctype	"__trwctype_std"
wctrans		"__wctrans_std"
wctype		"__wctype_std"

strcoll		"__strcoll_std"
strxfrm		"__strxfrm_std"
wcscoll		"__wcscoll_bc"
wcscoll@native	"__wcscoll_std"
wcsxfrm		"__wcsxfrm_bc"
wcsxfrm@native	"__wcsxfrm_std"
fnmatch		"__fnmatch_std"
regcomp		"__regcomp_std"
regexec		"__regexec_std"
regerror	"__regerror_std"
regfree		"__regfree_std"

strfmon		"__strfmon_std"

strftime	"__strftime_std"
strptime	"__strptime_std"
wcsftime	"__wcsftime_std"
getdate		"__getdate_std"

btowc           "__btowc_euc"
btowc@native    "__btowc_dense"
wctob           "__wctob_euc"
wctob@native    "__wctob_dense"
mbsinit         "__mbsinit_gen"
mbrlen          "__mbrlen_gen"
mbrtowc         "__mbrtowc_euc"
mbrtowc@native  "__mbrtowc_dense"
wcrtomb         "__wcrtomb_euc"
wcrtomb@native  "__wcrtomb_dense"
mbsrtowcs       "__mbsrtowcs_euc"
mbsrtowcs@native        "__mbsrtowcs_dense"
wcsrtombs       "__wcsrtombs_euc"
wcsrtombs@native        "__wcsrtombs_dense"

fgetwc		"__fgetwc_euc_euckr"	"l10n"	"/usr/lib/locale/common/" "/usr/lib/locale/common/" "methods_ko_KR.EUC.so.3"
fgetwc@native	"__fgetwc_dense_euckr"
mbftowc		"__mbftowc_euc_euckr"
mbftowc@native	"__mbftowc_dense_euckr"
mblen		"__mblen_euc_euckr"
mbtowc		"__mbtowc_euc_euckr"
mbtowc@native	"__mbtowc_dense_euckr"
mbstowcs	"__mbstowcs_euc_euckr"
mbstowcs@native	"__mbstowcs_dense_euckr"
wctomb		"__wctomb_euc_euckr"
wctomb@native	"__wctomb_dense_euckr"
wcstombs	"__wcstombs_euc_euckr"
wcstombs@native	"__wcstombs_dense_euckr"
wcwidth		"__wcwidth_euc_euckr"
wcwidth@native	"__wcwidth_dense_euckr"
wcswidth	"__wcswidth_euc_euckr"
wcswidth@native	"__wcswidth_dense_euckr"
eucpctowc	"__eucpctowc_euckr" 
wctoeucpc	"__wctoeucpc_euckr"
END METHODS
