package ifneeded sqlite3 %%%SQLITE_VERSION%%% [list load [file join $dir [expr $::tcl_platform(wordSize) * 8] libsqlite%%%SQLITE_VERSION%%%.so] sqlite3]
