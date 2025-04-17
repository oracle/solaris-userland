#
# Copyright (c) 2009, 2025, Oracle and/or its affiliates.
#

#
# This file is sourced by interactive ksh93 shells before ${HOME}/.kshrc
#

# Enable "gmacs"+"multiline" editor mode if the user did not set an
# input mode yet (for example via ${EDITOR}, ${VISUAL} or any
# "set -o" flag)
if [[ "$(set +o)" != ~(Er)--(gmacs|emacs|vi)( .*|) ]] ; then
	set -o gmacs
	# enable multiline input mode
	set -o multiline
	# enable globstar mode (match subdirs with **/)
	set -o globstar
fi

# Set a default prompt unless already set.
if [[ -z $(typeset -p PS1) ]]; then
	PS1=$(/usr/bin/id -un)
	PS1="$PS1@$(/usr/bin/hostname):\${PWD/~(K)\$HOME/\~}$([[ \
	    $PS1 == root ]] && print \# || print \$) "
fi
