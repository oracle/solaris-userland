%global pesign_vre 0.106-1
%global openssl_vre 1.0.2j

%global efidir ORACLE
%global shimrootdir %{_datadir}/shim/
%global shimversiondir %{shimrootdir}/%{version}-%{release}
%global efiarch x64
%global shimdir %{shimversiondir}/%{efiarch}
%global efialtarch ia32
%global shimaltdir %{shimversiondir}/%{efialtarch}

%global debug_package %{nil}
%global __debug_package 1
%global _binaries_in_noarch_packages_terminate_build 0
%global __debug_install_post %{SOURCE100} %{efiarch} %{efialtarch}
%undefine _debuginfo_subpackages

# currently here's what's in our dbx: nothing
%global dbxfile %{nil}

Name:		shim-unsigned-%{efiarch}
Version:	15.8
Release:	1.0.3%{?dist}
Summary:	First-stage UEFI bootloader
ExclusiveArch:	x86_64
License:	BSD
URL:		https://github.com/rhboot/shim
Source0:	https://github.com/rhboot/shim/releases/download/%{version}/shim-%{version}.tar.bz2
Source1:	vendor_db.esl
%if 0%{?dbxfile}
Source2:	%{dbxfile}
%endif
Source3:	sbat.oracle.csv
Source4:	shim.patches

Source100:	shim-find-debuginfo.sh

%include %{SOURCE4}

BuildRequires:	gcc make
BuildRequires:	elfutils-libelf-devel
BuildRequires:	git openssl-devel openssl
BuildRequires:	pesign >= %{pesign_vre}
BuildRequires:	dos2unix findutils

# Shim uses OpenSSL, but cannot use the system copy as the UEFI ABI is not
# compatible with SysV (there's no red zone under UEFI) and there isn't a
# POSIX-style C library.
# BuildRequires:	OpenSSL
Provides:	bundled(openssl) = %{openssl_vre}

%global desc \
Initial UEFI bootloader that handles chaining to a trusted full \
bootloader under secure boot environments.
%global debug_desc \
This package provides debug information for package %{expand:%%{name}} \
Debug information is useful when developing applications that \
use this package or when debugging this package.

%description
%desc

%package -n shim-unsigned-%{efialtarch}
Summary:	First-stage UEFI bootloader (unsigned data)
Provides:	bundled(openssl) = %{openssl_vre}

%description -n shim-unsigned-%{efialtarch}
%desc

%package debuginfo
Summary:	Debug information for shim-unsigned-%{efiarch}
Group:		Development/Debug
AutoReqProv:	0
BuildArch:	noarch

%description debuginfo
%debug_desc

%package -n shim-unsigned-%{efialtarch}-debuginfo
Summary:	Debug information for shim-unsigned-%{efialtarch}
Group:		Development/Debug
AutoReqProv:	0
BuildArch:	noarch

%description -n shim-unsigned-%{efialtarch}-debuginfo
%debug_desc

%package debugsource
Summary:	Debug Source for shim-unsigned
Group:		Development/Debug
AutoReqProv:	0
BuildArch:	noarch

%description debugsource
%debug_desc

%prep
%autosetup -S git_am -n shim-%{version}
git config --unset user.email
git config --unset user.name
mkdir build-%{efiarch}
mkdir build-%{efialtarch}
cp %{SOURCE3} data/

%build
COMMITID=$(cat commit)
MAKEFLAGS="TOPDIR=.. -f ../Makefile COMMITID=${COMMITID} "
MAKEFLAGS+="EFIDIR=%{efidir} PKGNAME=shim RELEASE=%{release} "
MAKEFLAGS+="SBAT_AUTOMATIC_DATE=2021030218 "
MAKEFLAGS+="ENABLE_SHIM_HASH=true "
MAKEFLAGS+="DISABLE_EBS_PROTECTION=y"
MAKEFLAGS+="%{_smp_mflags}"
if [ -f "%{SOURCE1}" ]; then
	MAKEFLAGS="$MAKEFLAGS VENDOR_DB_FILE=%{SOURCE1}"
fi
%if 0%{?dbxfile}
if [ -f "%{SOURCE2}" ]; then
	MAKEFLAGS="$MAKEFLAGS VENDOR_DBX_FILE=%{SOURCE2}"
fi
%endif

cd build-%{efiarch}
make ${MAKEFLAGS} \
	DEFAULT_LOADER='\\\\grub%{efiarch}.efi' \
	all
cd ..

%install
COMMITID=$(cat commit)
MAKEFLAGS="TOPDIR=.. -f ../Makefile COMMITID=${COMMITID} "
MAKEFLAGS+="EFIDIR=%{efidir} PKGNAME=shim RELEASE=%{release} "
MAKEFLAGS+="SBAT_AUTOMATIC_DATE=2021030218 "
MAKEFLAGS+="ENABLE_SHIM_HASH=true "
if [ -f "%{SOURCE1}" ]; then
	MAKEFLAGS="$MAKEFLAGS VENDOR_DB_FILE=%{SOURCE1}"
fi
%if 0%{?dbxfile}
if [ -f "%{SOURCE2}" ]; then
	MAKEFLAGS="$MAKEFLAGS VENDOR_DBX_FILE=%{SOURCE2}"
fi
%endif

cd build-%{efiarch}
make ${MAKEFLAGS} \
	DEFAULT_LOADER='\\\\grub%{efiarch}.efi' \
	DESTDIR=${RPM_BUILD_ROOT} \
	install-as-data install-debuginfo install-debugsource
cd ..

%files
%license COPYRIGHT
%dir %{shimrootdir}
%dir %{shimversiondir}
%dir %{shimdir}
%{shimdir}/*.efi
%{shimdir}/*.hash
%{shimdir}/*.CSV

%files debuginfo -f build-%{efiarch}/debugfiles.list

%files debugsource -f build-%{efiarch}/debugsource.list

%changelog
* Wed Feb 07 2024 Alex Burmashev <alexander.burmashev@oracle.com> - 15.8-1.0.3.el9
- Set SBAT_AUTOMATIC_DATE=2021030218 [Orabug: 36072879]
- Set ol.shim sbat generation back to 3 [Orabug: 36072879]

* Tue Jan 23 2024 Alex Burmashev <alexander.burmashev@oracle.com> - 15.8-1.0.2.el9
- Update MAKEFLAGS [Orabug: 36072879]

* Tue Jan 23 2024 Alex Burmashev <alexander.burmashev@oracle.com> - 15.8-1.0.1.el9
- Update to 15.8 [Orabug: 36072879]
- Bump ol.shim sbat generation to 4 [Orabug: 36072879]
- fix CVE-2023-40546, CVE-2023-40547, CVE-2023-40548, CVE-2023-40549, CVE-2023-40550, CVE-2023-40551 [Orabug: 36072879]

* Mon Dec 05 2022 Ilya Okomin <ilya.okomin@oracle.com> - 15.7-1.0.2.el9
- Make sbat_var.S parse right with buggy gcc/binutils [Orabug: 34848038]

* Tue Nov 22 2022 Ilya Okomin <ilya.okomin@oracle.com> - 15.7-1.0.1.el9
- Update to shim-15.7 [Orabug: 34821869]
- Update ol.shim sbat generation to 3 [Orabug: 34821869]

* Wed Nov 02 2022 Ilya Okomin <ilya.okomin@oracle.com> - 15.6-1.0.3.el9
- Update Oracle sbat metadata and vendor certificates [Orabug: 34821869]
- Update SBAT_VAR_LATEST_REVOCATIONS value for grub2 and shim [Orabug: 34821869]
- Reference MokListRT instead of MokList [Orabug: 34821869]

* Wed Jun 01 2022 Peter Jones <pjones@redhat.com> - 15.6-1.el9
- Update to shim-15.6
  Resolves: CVE-2022-28737

* Wed Mar 09 2022 Peter Jones <pjones@redhat.com> - 15.5-1
- Update to shim-15.5
  Related: rhbz#1932057

* Thu Apr 01 2021 Peter Jones <pjones@redhat.com> - 15.4-4
- Fix the sbat data to actually match /this/ product.
  Resolves: CVE-2020-14372
  Resolves: CVE-2020-25632
  Resolves: CVE-2020-25647
  Resolves: CVE-2020-27749
  Resolves: CVE-2020-27779
  Resolves: CVE-2021-20225
  Resolves: CVE-2021-20233

* Wed Mar 31 2021 Peter Jones <pjones@redhat.com> - 15.4-3
- Build with the correct certificate trust list for this OS.
  Resolves: CVE-2020-14372
  Resolves: CVE-2020-25632
  Resolves: CVE-2020-25647
  Resolves: CVE-2020-27749
  Resolves: CVE-2020-27779
  Resolves: CVE-2021-20225
  Resolves: CVE-2021-20233

* Wed Mar 31 2021 Peter Jones <pjones@redhat.com> - 15.4-2
- Fix the ia32 build.
  Resolves: CVE-2020-14372
  Resolves: CVE-2020-25632
  Resolves: CVE-2020-25647
  Resolves: CVE-2020-27749
  Resolves: CVE-2020-27779
  Resolves: CVE-2021-20225
  Resolves: CVE-2021-20233

* Tue Mar 30 2021 Peter Jones <pjones@redhat.com> - 15.4-1
- Update to shim 15.4
  - Support for revocations via the ".sbat" section and SBAT EFI variable
  - A new unit test framework and a bunch of unit tests
  - No external gnu-efi dependency
  - Better CI
  Resolves: CVE-2020-14372
  Resolves: CVE-2020-25632
  Resolves: CVE-2020-25647
  Resolves: CVE-2020-27749
  Resolves: CVE-2020-27779
  Resolves: CVE-2021-20225
  Resolves: CVE-2021-20233

* Wed Mar 24 2021 Peter Jones <pjones@redhat.com> - 15.3-0~1
- Update to shim 15.3
  - Support for revocations via the ".sbat" section and SBAT EFI variable
  - A new unit test framework and a bunch of unit tests
  - No external gnu-efi dependency
  - Better CI
  Resolves: CVE-2020-14372
  Resolves: CVE-2020-25632
  Resolves: CVE-2020-25647
  Resolves: CVE-2020-27749
  Resolves: CVE-2020-27779
  Resolves: CVE-2021-20225
  Resolves: CVE-2021-20233

* Wed Jun 05 2019 Javier Martinez Canillas <javierm@redhat.com> - 15-3
- Make EFI variable copying fatal only on secureboot enabled systems
  Resolves: rhbz#1715878
- Fix booting shim from an EFI shell using a relative path
  Resolves: rhbz#1717064

* Tue Feb 12 2019 Peter Jones <pjones@redhat.com> - 15-2
- Fix MoK mirroring issue which breaks kdump without intervention
  Related: rhbz#1668966

* Thu Apr 05 2018 Peter Jones <pjones@redhat.com> - 15-1
- Update to shim 15
- better checking for bad linker output
- flicker-free console if there's no error output
- improved http boot support
- better protocol re-installation
- dhcp proxy support
- tpm measurement even when verification is disabled
- REQUIRE_TPM build flag
- more reproducable builds
- measurement of everything verified through shim_verify()
- coverity and scan-build checker make targets
- misc cleanups

* Fri Feb 09 2018 Fedora Release Engineering <releng@fedoraproject.org> - 13-0.2
- Rebuilt for https://fedoraproject.org/wiki/Fedora_28_Mass_Rebuild

* Fri Aug 18 2017 Peter Jones <pjones@redhat.com> - 13-0.1
- Make a new shim-unsigned-x64 package like the shim-unsigned-aarch64 one.
- This will (eventually) supersede what's in the "shim" package so we can
  make "shim" hold the signed one, which will confuse fewer people.
