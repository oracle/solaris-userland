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
# Copyright (c) 2006, 2018, Oracle and/or its affiliates. All rights reserved.
#

#
#	BIND 
#
# If generating compatible-EUC locale, a character in _E1, _E2, _E3, 
# _E4, or _E5 are also classfied into "print" and "graph" classes
# for the backward compatibility in current localedef inmplentation.
# So the characters which are in "graph" class must be assigned into
# _E1 - _E5.
#
LCBIND
	_E1  = 0x00000100
	_E2  = 0x00000200
	_E3  = 0x00000400
	_E4  = 0x00000800
	_E5  = 0x00001000

	jdigit		charclass	_E1
	jhira		charclass	_E2
	jkata		charclass	_E3
	jhankana	charclass	_E4
	jkanji		charclass	_E5
END LCBIND


METHODS

process_code	euc
cswidth		2:2,1:1,2:2

eucpctowc	"__eucpctowc_eucjp" "methods" "/usr/lib/locale/common/" "/usr/lib/locale/common/" "methods_ja_JP.eucJP.so.3"
wctoeucpc	"__wctoeucpc_eucjp"
fgetwc		"__fgetwc_euc_eucjp"
fgetwc@native	"__fgetwc_dense_eucjp"
mbftowc		"__mbftowc_euc_eucjp"
mbftowc@native	"__mbftowc_dense_eucjp"
mblen		"__mblen_eucjp"
mbstowcs	"__mbstowcs_euc_eucjp"
mbstowcs@native	"__mbstowcs_dense_eucjp"
mbtowc		"__mbtowc_euc_eucjp"
mbtowc@native	"__mbtowc_dense_eucjp"
wcstombs	"__wcstombs_euc_eucjp"
wcstombs@native	"__wcstombs_dense_eucjp"
wcswidth	"__wcswidth_euc_eucjp"
wcswidth@native	"__wcswidth_dense_eucjp"
wctomb		"__wctomb_euc_eucjp"
wctomb@native	"__wctomb_dense_eucjp"
wcwidth		"__wcwidth_euc_eucjp"
wcwidth@native	"__wcwidth_dense_eucjp"
mbrlen		"__mbrlen_eucjp"
btowc		"__btowc_euc_eucjp"
btowc@native	"__btowc_dense_eucjp"
wctob		"__wctob_euc_eucjp"
wctob@native	"__wctob_dense_eucjp"
mbrtowc		"__mbrtowc_euc_eucjp"
mbrtowc@native	"__mbrtowc_dense_eucjp"
wcrtomb		"__wcrtomb_euc_eucjp"
wcrtomb@native	"__wcrtomb_dense_eucjp"
mbsrtowcs	"__mbsrtowcs_euc_eucjp"
mbsrtowcs@native	"__mbsrtowcs_dense_eucjp"
wcsrtombs	"__wcsrtombs_euc_eucjp"
wcsrtombs@native	"__wcsrtombs_dense_eucjp"
fnmatch		"__fnmatch_std" "libc" "/usr/lib/" "/usr/lib/" "libc.so.1"
getdate		"__getdate_std"
iswctype	"__iswctype_bc"
iswctype@native	"__iswctype_std"
regcomp		"__regcomp_std"
regerror	"__regerror_std"
regexec		"__regexec_std"
regfree		"__regfree_std"
strcoll		"__strcoll_std"
strfmon		"__strfmon_std"
strftime	"__strftime_std"
strptime	"__strptime_std"
strxfrm		"__strxfrm_std"
towctrans	"__towctrans_bc"
towctrans@native	"__towctrans_std"
towlower	"__towlower_bc"
towlower@native	"__towlower_std"
towupper	"__towupper_bc"
towupper@native	"__towupper_std"
trwctype	"__trwctype_std"
wcscoll		"__wcscoll_bc"
wcscoll@native	"__wcscoll_std"
wcsftime	"__wcsftime_std"
wcsxfrm		"__wcsxfrm_bc"
wcsxfrm@native	"__wcsxfrm_std"
wctrans		"__wctrans_std"
wctype		"__wctype_std"
mbsinit		"__mbsinit_gen"

END METHODS
