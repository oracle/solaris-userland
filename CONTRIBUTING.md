# Contributing to this repository

We welcome your contributions! There are multiple ways to contribute.

## Opening issues

For bugs or enhancement requests, priority is given to those filed
in Oracle's internal bug database.  Customers with Oracle Solaris support
contracts should open a Service Request with Oracle Support to start
this process.

If you don't have an Oracle Solaris support contract, please file a GitHub
issue to report bugs or enhancement requests, unless it's security related.
When filing a bug remember that the better written the bug is,
the more likely it is to be fixed. If you think you've found a security
vulnerability, do not raise a GitHub issue and instead follow the instructions
in our [security policy](./SECURITY.md).

## Contributing code

Fixes or enhancements to the third party projects built in this repo should
be contributed to the upstream project first, and then brought in from
upstream to our builds.

Before submitting code directly to this repo you will need to have signed the
[Oracle Contributor Agreement][OCA] (OCA).

Only contributions from committers that can be verified
as having signed the OCA can be accepted.

## Pull request process

As the GitHub repo is a read-only mirror of a Oracle internal Mercurial repo,
we cannot accept Github pull requests.  Instead, follow this modified process:

1. Ensure there is an issue created to track and discuss the fix or enhancement
   you intend to submit.
2. Fork this repository.
3. Create a branch in your fork to implement the changes. We recommend using
   the issue number as part of your branch name, e.g. `1234-fixes`.
   Changes should be in a single commit per issue or set of issues.
4. Ensure that any documentation is updated with the changes that are required
   by your change.
5. Provide a pointer to the commit in your fork in the issue. Explain exactly
   what your changes are meant to do and provide simple steps on how to validate.
   your changes.
6. We will assign the commit to an engineer for review, and if accepted,
   to apply the changes to the Mercurial repo, from which it will be
   propagated back out to this GitHub repo.

Modifications to upstream projects need to identify if the change has been
submitted or accepted upstream, preferably in the comments at the start of
a patch file against the upstream project.

## Code of conduct

Follow the [Golden Rule](https://en.wikipedia.org/wiki/Golden_Rule). If you'd
like more specific guidelines, see the [Contributor Covenant Code of Conduct][COC].

[OCA]: https://oca.opensource.oracle.com
[COC]: https://www.contributor-covenant.org/version/1/4/code-of-conduct/
