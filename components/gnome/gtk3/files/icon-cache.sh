#!/usr/bin/ksh
#
# Copyright (c) 2008, 2023, Oracle and/or its affiliates.
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, and/or sell copies of the Software, and to permit persons
# to whom the Software is furnished to do so, provided that the above
# copyright notice(s) and this permission notice appear in all copies of
# the Software and that both the above copyright notice(s) and this
# permission notice appear in supporting documentation.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
# OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
# OF THIRD PARTY RIGHTS. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
# HOLDERS INCLUDED IN THIS NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL
# INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING
# FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
# NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION
# WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
#
# Except as contained in this notice, the name of a copyright holder
# shall not be used in advertising or otherwise to promote the sale, use
# or other dealings in this Software without prior written authorization
# of the copyright holder.
#
###########################################################################
#

PATH=/usr/bin:/usr/sbin

. /lib/svc/share/smf_include.sh

#
# for each icon directory update the icon cache if:
#  - a index.theme file exist
# AND
#  - icons in the directory tree are newer than the icon cache
# OR
#  - if no cache exist but subdirectories (hence icons) are present
#
ICONDIR="/usr/share/icons"

start_icon_cache ()
{
if [[ ! -w $ICONDIR ]] ; then
    echo "$ICONDIR is not writable, skipping."
    return
fi
for DIR in /usr/share/icons/*; do
    if [[ -a "$DIR/index.theme" ]] ; then
      if [[ -a "$DIR/icon-theme.cache" ]] ; then
	RESULT="$(/usr/bin/find $DIR -follow -newer $DIR/icon-theme.cache)"
      else
	RESULT="$(/usr/bin/find $DIR -type d)"
	if [ ${#RESULT} == ${#DIR} ]; then
	  echo "$DIR doesn't contain subdirectories.  No icon cache is needed"
	  RESULT=""
	else
	  RESULT="nocache"
	fi
      fi
      if [[ -n "$RESULT" ]]; then
	  if [[ "$RESULT" == "nocache" ]]; then
	    echo "No icon cache found in $DIR.  Generating one."
	  else
	    echo "Icons newer than the cache found in $DIR.  Updating the cache."
	  fi
	  rm -f $DIR/.icon-theme.cache
	  /usr/bin/gtk-update-icon-cache $DIR
	  if [ $? -ne 0 ]; then
	    echo "/usr/bin/gtk-update-icon-cache exited with an error while \
generating the icon cache for $DIR."
	  else
	    echo "Icon cache successfully generated in $DIR"
	  fi
      fi
    fi
done
}

refresh_icon_cache ()
{
if [[ ! -w $ICONDIR ]] ; then
  echo "$ICONDIR is not writable, skipping."
  return
fi
for DIR in /usr/share/icons/*; do
    if [[ -a "$DIR/index.theme" ]] ; then
      if [[ -a "$DIR/icon-theme.cache" ]] ; then
	rm -f $DIR/icon-theme.cache
	RESULT="$(/usr/bin/find $DIR ! -type d -follow 2>/dev/null)"
      else
	RESULT="$(/usr/bin/find $DIR -type d)"
	if [[ ${#RESULT} == ${#DIR} ]]; then
	  echo "$DIR doesn't contain subdirectories.  No icon cache is needed"
	  RESULT=""
	else
	  RESULT="nocache"
	fi
      fi
      if [[ -n "$RESULT" ]]; then
	  if [[ "$RESULT" == "nocache" ]]; then
	    echo "No icon cache found in $DIR.  Generating one."
	  else
	    echo "Icons newer than the cache found in $DIR.  Updating the cache."
	  fi
	  rm -f $DIR/.icon-theme.cache
	  /usr/bin/gtk-update-icon-cache $DIR
	  if [[ $? -ne 0 ]]; then
	    echo "/usr/bin/gtk-update-icon-cache exited with an error while \
generating the icon cache for $DIR."
	  else
	    echo "Icon cache successfully generated in $DIR"
	  fi
      fi
    fi
done
}

METHOD=$1

case $METHOD in
    start)
	if ! is_self_assembly_boot; then
		exit $SMF_EXIT_OK
	fi
	# Continue with rest of script
	;;
    refresh)
	# Continue with rest of script
	;;
esac

${METHOD}_icon_cache

exit $SMF_EXIT_OK
