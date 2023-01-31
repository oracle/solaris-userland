# Getting started with the Userland Consolidation

This repository contains the build recipes, local modifications, and
IPS package manifests for most of the free and open source software
that is packaged for Oracle Solaris 11.4 and published in the official
Oracle Solaris package repository on pkg.oracle.com.

Some open source software in Solaris is maintained and packaged outside
of the Userland Consolidation.  Source code for those components may be
available from
<https://www.oracle.com/downloads/opensource/solaris-source-code-downloads.html>.

## Getting Started
This README provides a very brief overview of the gate (i.e., source
code repository), how to retrieve a copy, and how to build it.  Detailed
documentation about the Userland gate can be found in the `doc` directory.

## Overview
The Userland consolidation maintains a project at

     https://github.com/oracle/solaris-userland

That repo contains build recipes, patches, IPS (i.e., pkg(7)) manifests,
and other files necessary to download, prep, build, test, package and publish
open source software.  The build infrastructure makes use of hierarchical
Makefiles which provide dependency and recipe information for building
the components.  In order to build the contents of the Userland gate,
you need to clone it.  Since you are reading this, you may already have.

## Getting the Bits
The canonical repository internal to Oracle is stored in Mercurial, and
is mirrored to an external Git repository on GitHub.  In order to build
or develop in the gate, you will need to clone it.  For the external Git
repository you can do so with the following command:

    $ git clone https://github.com/oracle/solaris-userland /scratch/clone

This will create a replica of the various pieces that are checked into the
source code management system, but it does not retrieve the community
source archives associated with the gate content.  To download the
community source associated with your cloned workspace, you will need to
execute the following:

    $ cd /scratch/clone/components
    $ gmake download

This will use GNU make and the downloading tool in the gate to walk through
all of the component directories downloading and validating the community
source archives from the gate machine or their canonical source repository.

There are two variation to this that you may find interesting.  First, you
can cause gmake(1) to perform its work in parallel by adding `-j (jobs)`
to the command line.  Second, if you are only interested in working on a
particular component, you can change directories to that component's
directory and use `gmake download` from that to only get its source
archive.

## Building the Bits.
You can build individual components or the contents of the entire gate.

### Component build
If you are only working on a single component, you can just build it using
following:

Setup the workspace for building components

    $ cd (your-workspace)/components ; gmake setup

Build the individual component

    $ cd (component-dir) ; gmake publish

### Complete Top Down build
Complete top down builds are also possible by simply running
    $ tools/full-build # see --help for options

That is generally wrapper around
    $ cd (your-workspace)
    $ # cleanup your workspace to pristine state
    $ gmake publish
    $ # examine the log files and provide a summary

## Help

See <https://www.oracle.com/solaris/technologies/free-open-source-software.html>
for information on support for free and open source software provided for
Oracle Solaris.

Discussion forums are available at:
- <https://community.oracle.com/mosc/categories/oracle_sun_technologies>
- <https://community.oracle.com/tech/apps-infra/categories/13305-solaris>

## Contributing

Instead of submitting a pull request, please
[follow our contribution guide](./CONTRIBUTING.md).

## Security

Please consult the [security guide](./SECURITY.md) for our
security vulnerability reporting and disclosure process.

## License

Copyright (c) 2010, 2023, Oracle and/or its affiliates.

Most of the content of this repo is released under the
Common Development and Distribution License (CDDL)
as shown at <https://oss.oracle.com/licenses/>.

Modifications to upstream projects are generally licensed under
the same terms as the upstream project unless otherwise specified
in the files providing the changes.
