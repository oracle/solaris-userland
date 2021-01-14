#
# Copyright (c) 2021, Oracle and/or its affiliates.
#
# Recompile mercurial files into their custom bytecode. The only way to do
# so seems to be by importing them (py_compile/compileall cannot be used),
# so that is what this script does.
#

import importlib
import os
import re
import sys

# import from current working directory
sys.path[0] = os.getcwd()

# register custom loader by importing mercurial
import mercurial

# replace this lambda with print to get more verbose output
verbose = lambda *a, **kv: None


def filter_modules(fullname):
    """Filter out modules that do not use custom mercurial bytecode.

    This function mirrors the beginning of hgpathentryfinder::find_spec()
    from the mercurial base __init__ file.
    """

    # Only handle Mercurial-related modules.
    if not fullname.startswith(('mercurial.', 'hgext.')):
        return False
    # don't try to parse binary
    if fullname.startswith('mercurial.cext.'):
        return False
    # third-party packages are expected to be dual-version clean
    if fullname.startswith('mercurial.thirdparty'):
        return False
    # zstd is already dual-version clean, don't try and mangle it
    if fullname.startswith('mercurial.zstd'):
        return False
    # rustext is built for the right python version,
    # don't try and mangle it
    if fullname.startswith('mercurial.rustext'):
        return False
    # pywatchman is already dual-version clean, don't try and mangle it
    if fullname.startswith('hgext.fsmonitor.pywatchman'):
        return False
    return True


def compile_directory(directory):
    """Recompile all files in the given directory."""

    for root, _, files in os.walk(directory):
        for file in sorted(files):
            if not file.endswith(".py"):
                continue

            path = os.path.join(root, file)
            module = path.replace("/", ".")[:-3]
            if module.endswith("__init__"):
                module = module[:-9]

            if not filter_modules(module):
                verbose(f"skipping module {module}")
                continue

            print(f"Recompiling module {module}")
            try:
                importlib.import_module(module)
            except BaseException as exc:
                verbose(f"Exception ocurred during {module} compilation\n{exc}")
                # exception in imported file doesn't mean failure
                pass

            # verify that .pyc file exists and contains mercurial bytecode
            pyver = f"{sys.version_info.major}{sys.version_info.minor}"
            pycpath = re.sub(r"\.py$", f".cpython-{pyver}.pyc", path)
            pycpath = re.sub(r"/([^/]*)$", r"/__pycache__/\1", pycpath)

            try:
                with open(pycpath, "rb") as ifile:
                    if not ifile.readline().startswith(b"HG"):
                        sys.stderr.write(f"File {pycpath} doesn't include mercurial bytecode.\n")
                        sys.exit(1)
            except IOError:
                sys.stderr.write(f"File {pycpath} doesn't exist.\n")
                sys.exit(2)


if __name__ == "__main__":
    compile_directory("mercurial")
    compile_directory("hgext")
