#!/bin/sh
# Script to build shim binaries on Oracle Linux instance in OCI
ssh opc@$1 sudo dnf -y install podman
scp linux_build/* opc@$1:
ssh opc@$1 https_proxy=$https_proxy podman build -f Dockerfile --output /var/tmp/build
scp opc@$1:/var/tmp/build/root/rpmbuild/BUILD/shim-15.8/build-x64/*.efi files 
