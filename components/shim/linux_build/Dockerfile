FROM oraclelinux:9

RUN yum -y install wget rpm-build gcc gcc-c++ make yum-utils
COPY shim-unsigned-x64-15.8-1.0.3.el9.src.rpm /
RUN rpm -ivh shim-unsigned-x64-15.8-1.0.3.el9.src.rpm
COPY shim-unsigned-x64.spec /
COPY vendor_db.esl /root/rpmbuild/SOURCES
COPY sbat.oracle.csv /root/rpmbuild/SOURCES
RUN yum-builddep -y --enablerepo=ol9_appstream,ol9_baseos_latest /shim-unsigned-x64.spec
RUN rpmbuild -bb /shim-unsigned-x64.spec
#COPY shimx64.efi /
#RUN ls -l /
#RUN ls -l /root/rpmbuild/RPMS/x86_64
#RUN rpm2cpio /root/rpmbuild/RPMS/x86_64/shim-unsigned-x64-15.8-1.0.3.el9.x86_64.rpm | cpio -idmv
#RUN hexdump -Cv ./usr/share/shim/15.8-1.0.3.el9/x64/shimx64.efi > built-x64.hex
#RUN hexdump -Cv /shimx64.efi > orig-x64.hex
#RUN sha256sum /usr/share/shim/15.8-1.0.3.el9/x64/shimx64.efi /shimx64.efi
#RUN diff -u orig-x64.hex built-x64.hex
#RUN objdump -h /usr/share/shim/15.8-1.0.3.el9/x64/shimx64.efi

