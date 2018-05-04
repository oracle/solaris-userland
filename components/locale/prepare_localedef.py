#!/usr/bin/python
#
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
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

hash_prefix=6

hdr = """
#
# Copyright (c) 2016, 2018, Oracle and/or its affiliates. All rights reserved.
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


def read_posix(fn, cs = lcc):
    comment_char = '#'
    escape_char = '\\'
    doc = list()

    last = list()
    with open(fn) as fd:
        for l in fd:
            l = l.strip()

            if l.startswith("comment_char"):
                comment_char = l[13]

            elif l.startswith("escape_char"):
                escape_char = l[12]

            elif not l.startswith(comment_char):
                l = l.replace("{0}{0}".format(escape_char), escape_char)
                if l.endswith(escape_char):
                    last.append(l[:-1])
                else:
                    if last:
                        l = ''.join(last) + l
                        last = list()
                    if l:
                        doc.append(l)

    loc = dict()
    for lc in cs:
        d = "\n".join(doc[doc.index(lc)+1:doc.index("END "+lc)])
        m = re_include.match(d)
        loc.update(read_posix(os.path.join(build_dir, "include", m.group(1)), (lc,)) if m else { lc: d })

    return loc


for l in sys.argv[2:]:
    cset = re_cset.match(l).group(1)

    d = read_posix(os.path.join(build_dir,l,"posix.src"))
    locs[l] = { lc: hashlib.sha1(cset + d[lc]).hexdigest()[:hash_prefix] for lc in d.keys() }

    for lc in locs[l].keys():
        h = locs[l][lc]

        # sanity checks that 8 chars prefix of sha1 is unique
        assert h not in data or data[h]['val'] == d[lc]

        if h not in data:
            data[h] = { 'val': d[lc], 'n': 0, 'cset': cset }
        else:
            data[h]['n'] += 1

            # sanity check that we do not try to share between different charmaps
            assert data[h]['cset'] == cset


for l,loc in locs.iteritems():
    # generate "full" version for localedef src package
    with open("{}/{}/posix.localedef_full".format(build_dir, l), "w") as fd:
        fd.write(hdr)
        for lc in lcc:
            fd.write("\n\n{0}\n\n{1}\n\nEND {0}\n".format(lc, data[loc[lc]]['val']))

common_done = list()
for l,loc in locs.iteritems():
    # generate "point" version for locale compilation
    with open("{}/{}/posix.localedef".format(build_dir, l), "w") as fd:
        for lc in lcc:
            h = loc[lc]
            cname = "data.{}".format(h)

            is_point = data[h]['n']

            # we generate shared parts just for UTF-8 locale for now
            is_point = is_point and data[h]['cset'] == 'UTF-8'

            # the categories are not big enough to make sharing effective
            is_point = is_point and lc not in [ 'LC_NUMERIC', 'LC_MONETARY', 'LC_TIME', 'LC_MESSAGES' ]

            # if en_US.UTF-8 changed, the ON *.sort files need to be changed,
            # see 22014135 for details. To avoid it, en_US.UTF-8 is generated "standalone"
            is_point = is_point and l != 'en_US.UTF-8'

            fd.write("\n\n{}\n\n".format(lc))
            fd.write('point "common/{}/{}"'.format(lc,cname) if h not in data or is_point else data[h]['val'])
            fd.write("\n\nEND {}\n".format(lc))

            if is_point and h not in common_done:
                with open("{}/common/{}.localedef".format(build_dir, cname), "w") as fd2:
                    fd2.write(hdr)
                    fd2.write("\n\n{}\n\n".format(lc))
                    fd2.write(data[h]['val'])
                    fd2.write("\nEND {}\n".format(lc))

                print("{}\t{}\t{}\t{}".format(cname, lc, l, "\t".join([ x for x in locs.keys() if locs[x][lc] == h and l != x])))
                common_done.append(h)
