#!/usr/bin/python3.7
#
# Copyright (c) 2016, 2021, Oracle and/or its affiliates.
#
# this script finds common parts in <loc>.src files
# the common parts are saved to 'common/<lc_type>/data.<hash>'
# and new version of the locale file with 'point "common/...."' instead of
# the common part are saved to <loc>.localedef
#
# It is possible to use 'include' in the source file with exactly same syntax
# as 'point' keyword defined in locale(5)
#

import os, re, sys, hashlib

hash_prefix = 6

hdr = """
#
# Copyright (c) 2016, 2021, Oracle and/or its affiliates.
#
# The following content could be generated from following sources:
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
"""

lcc = ['LC_CTYPE', 'LC_COLLATE', 'LC_NUMERIC', 'LC_MONETARY', 'LC_TIME', 'LC_MESSAGES']

re_include = re.compile(r'^\s*include "(\S*)"\s*$', re.M)
re_cset = re.compile(r'^.*?\.(.+?)(@.*)?$')

data = dict()
locs = dict()
build_dir = sys.argv[1]


def read_posix(filename, cs=lcc):
    # default comment_char and escape_char
    comment_char = '#'
    escape_char = '\\'

    doc = list()
    last = list()
    with open(filename, errors="ignore") as ifile:
        for line in ifile:
            line = line.strip()

            # handle comment_char and escape_char overrides
            if line.startswith("comment_char"):
                comment_char = line[13]
            elif line.startswith("escape_char"):
                escape_char = line[12]

            # skip all commented lines
            elif not line.startswith(comment_char):

                # unescape escaped escapes '\\' to just a single '\'
                line = line.replace(f"{escape_char}{escape_char}", escape_char)
                if line.endswith(escape_char):
                    # this line has escaped newline; save if for later
                    last.append(line[:-1])
                else:
                    if last:
                        # handle previous parts of the line
                        line = ''.join(last) + line
                        last = list()
                    if line:
                        doc.append(line)

    loc = dict()
    for lc in cs:
        # get all lines corresponding to given LC_* variable
        lines = doc[doc.index(lc) + 1:doc.index("END " + lc)]
        joined = "\n".join(lines)

        match = re_include.match(joined)
        if match:
            loc.update(read_posix(os.path.join(build_dir, "include", match.group(1)), (lc,)))
        else:
            loc.update({lc: joined})

    return loc


for locale in sys.argv[2:]:

    # get charset of given locale
    cset = re_cset.match(locale).group(1)

    d = read_posix(os.path.join(build_dir, locale, "posix.src"))
    locs[locale] = {lc: hashlib.sha1((cset + d[lc]).encode()).hexdigest()[:hash_prefix] for lc in d}

    for lc, h in locs[locale].items():

        # sanity checks that 8 chars prefix of sha1 is unique
        assert h not in data or data[h]['val'] == d[lc]

        if h not in data:
            data[h] = {'val': d[lc], 'n': 0, 'cset': cset}
        else:
            data[h]['n'] += 1

            # sanity check that we do not try to share between different charmaps
            assert data[h]['cset'] == cset


for l, loc in locs.items():
    # generate "full" version for localedef src package
    with open(f"{build_dir}/{l}/posix.localedef_full", "w") as ofile:
        ofile.write(hdr)
        for lc in lcc:
            ofile.write(f"\n\n{lc}\n\n{data[loc[lc]]['val']}\n\nEND {lc}\n")


common_done = list()
for l, loc in locs.items():
    # generate "point" version for locale compilation
    with open(f"{build_dir}/{l}/posix.localedef", "w") as ofile:
        for lc in lcc:
            h = loc[lc]
            cname = f"{lc[3:].lower()}.{h}"

            is_point = data[h]['n']

            # we generate shared parts just for UTF-8 locale for now
            is_point = is_point and data[h]['cset'] == 'UTF-8'

            # the categories are not big enough to make sharing effective
            is_point = is_point and lc not in ['LC_NUMERIC', 'LC_MONETARY', 'LC_TIME', 'LC_MESSAGES']

            # if en_US.UTF-8 changed, the ON *.sort files need to be changed,
            # see 22014135 for details. To avoid it, en_US.UTF-8 is generated "standalone"
            is_point = is_point and l != 'en_US.UTF-8'

            ofile.write(f"\n\n{lc}\n\n")

            if h not in data or is_point:
                print(f"<transform file path=usr/lib/locale/common/{cname} -> default facet.locale.{l.split('.')[0]} true>")
                ofile.write(f'point "common/{cname}"')
            else:
                ofile.write(data[h]['val'])

            ofile.write(f"\n\nEND {lc}\n")


            if is_point and h not in common_done:
                with open(f"{build_dir}/common/{cname}.localedef", "w") as ofile2:
                    ofile2.write(hdr)
                    ofile2.write(f"\n\n{lc}\n\n")
                    ofile2.write(data[h]['val'])
                    ofile2.write(f"\nEND {lc}\n")

                print(f"# {cname}")
                common_done.append(h)
