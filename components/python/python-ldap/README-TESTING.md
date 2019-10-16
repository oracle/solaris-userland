# python-ldap 3.2.0 testing

Component python-ldap 3.x testing requires `tox`,  
https://tox.readthedocs.io/en/latest/

The Common Build Environment (CBE) does not currently include tox.  It
is possible to test within a virtual environment, using `pip` to
install tox.  With the exception of py27, all tox tests pass when run
within a virtual environment.

# Commands used to test using tox with virtual environment:

```
    # Download, build and install python-ldap to proto area.
    gmake clean install
    cd python-ldap-3.2.0

    # Append Studio and slapd (openldap server) to PATH
    export PATH=$PATH:/opt/solarisstudio12.4/bin:/usr/lib

    # Create virtual env.
    python3 -m venv python-ldap-test

    # Activate virtual env.
    source python-ldap-test/bin/activate

    # Optionally, set proxies for pip.
    https_proxy=http://www-proxy:80/
    http_proxy=http://www-proxy:80/
    export http_proxy https_proxy

    # Install tox into virtual env.
    pip install tox

    # execute tox, running all tests as per tox.ini
    tox
```

Note, that testing is not using the previously built files.  Rather it
is building new binaries and testing those.  Further investigation is
needed to understand tox implementation and its interaction with
setup.py.  Once understood it's possible that this component could be
updated further to provide a test target, my incomplete workings are
below.

# Future test target

## components/python/python-ldap/Makefile:

```
    --- Makefile    2019-09-09 16:46:20.916478189 +0200
    +++ Makefile.with-test  2019-09-09 16:43:40.443030946 +0200
    @@ -53,13 +53,76 @@

     ASLR_MODE = $(ASLR_NOT_APPLICABLE)

    +# test relies on tox, MY_VIRTUAL_ENV_DIR is location where python
    +# virtual environment will be created and for tox install.
    +MY_VIRTUAL_ENV_DIR=    $(@D)/userland_test_$(PYV)

    +# Limit testing to versions of python being built.  When updating take
    +# a look at what tests are being run and adjust as necessary.
    +MY_TESTS_3.7 = py37,py3-nosasltls,py3-trace
    +MY_TESTS_2.7 = py27
    +
    +# Test requires slapd and Studio compiler to be in PATH, extend PATH from env.
    +# NOTE: this replaces all previous values assigned!
    +COMPONENT_TEST_ENV = PATH=$(SPRO_VROOT)/bin:$$PATH:/usr/lib
    +
    +# pip and tox may need proxies
    +http_proxy=    http://www-proxy.us.oracle.com:80/
    +https_proxy=   https://www-proxy.us.oracle.com:80/
    +COMPONENT_TEST_ENV += http_proxy=$(http_proxy)
    +COMPONENT_TEST_ENV += https_proxy=$(https_proxy)
    +
    +COMPONENT_TEST_ENV_CMD = \
    +       set -x; \
    +       : Extend to source virtual env before setting other ENV variables; \
    +       source  $(MY_VIRTUAL_ENV_DIR)/bin/activate ; \
    +       : add env command back on for COMPONENT_TEST_ENV values. ; \
    +       : and set HOME as setup.py.mk does for build and install. ; \
    +       $(ENV) HOME=$(BUILD_DIR)/config-$*
    +
    +COMPONENT_PRE_TEST_ACTION += \
    +       ( \
    +               : Exit if openldap command slapd missing ; \
    +               [ -e /usr/lib/slapd ] || exit 1 ; \
    +               : Exit if tox already installed in virtual environment; \
    +               [ -f $(MY_VIRTUAL_ENV_DIR)/bin/tox ] && exit 0; \
    +               cd $(@D); \
    +               : ; \
    +               : Create virtual environment for tox install; \
    +               : ; \
    +               $(ENV) $(COMPONENT_TEST_ENV) \
    +                       python3 -m venv $(MY_VIRTUAL_ENV_DIR) || exit 1 ; \
    +               : ; \
    +               : activate virtual environment and install tox. ; \
    +               : ; \
    +               source $(MY_VIRTUAL_ENV_DIR)/bin/activate ; \
    +               $(ENV) HOME=$(BUILD_DIR)/config-$* $(COMPONENT_TEST_ENV) \
    +                       pip install tox || exit 2 ; \
    +               : ; \
    +               : copy component into virtual environment. ; \
    +               : ; \
    +               cd $(PROTO_DIR)$(USRDIR) ; \
    +               echo stacey > lib/stacey ; \
    +               tar cf $(BUILD_DIR)/solaris.tar lib ; \
    +       )
    +
    +# Use nawk to extract just the sections that summarizes the test results.
    +# see `gmake print-COMPONENT_TEST_CREATE_TRANSFORMS`.
    +# sub being used to avoid passing in dollar to nawk script!
    +COMPONENT_TEST_TRANSFORMER = $(NAWK)
    +COMPONENT_TEST_TRANSFORMS = -f $(COMPONENT_DIR)/Solaris/test-transforms.awk
    +COMPONENT_TEST_TRANSFORMS += -v COMPDIR=$(COMPONENT_DIR)
    +
    +COMPONENT_TEST_DIR =   $(SOURCE_DIR)
    +COMPONENT_TEST_CMD =   tox
    +COMPONENT_TEST_ARGS =  -e $(MY_TESTS_$(PYTHON_VERSION))
    +
     # common targets
     build:         $(BUILD_32_and_64)

     install:       $(INSTALL_32_and_64)

    -test:          $(NO_TESTS)
    +test:          $(TEST_32_and_64)

     system-test:    $(SYSTEM_TESTS_NOT_IMPLEMENTED)
```

## components/python/pyton-ldap/Solaris/test-transforms.awk

As tests are carried out in parallel the output file cannot
simply be compared with a previous run, just display summaries.

    /^ERROR: /{sub(COMPDIR, "COMPONENT_DIR"); print };
    /^Ran .+ / { print $1,$2 };
    /!NF/ { print };
    /^OK/ { print };


# End-of-file.
