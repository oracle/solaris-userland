# Copyright (c) 2017, 2021, Oracle and/or its affiliates.
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

import itertools
import os
import shlex
import shutil
import subprocess

from cloudbaseinit.metadata.services.osconfigdrive import base
from oslo_config import cfg
from oslo_log import log as oslo_logging

opts = [
    cfg.StrOpt('tar', default='/usr/bin/tar',
               help='path to "tar", used to extract ISO ConfigDrive '
                    'files'),
    cfg.StrOpt('cd_device', default='/dev/dsk/c1d1p0',
               help='path to CD device'),
]
CONF = cfg.CONF
CONF.register_opts(opts)

LOG = oslo_logging.getLogger(__name__)


class SolarisConfigDriveManager(base.BaseConfigDriveManager):

    def __init__(self):
        super(SolarisConfigDriveManager, self).__init__()

    def _config_drive_iso_cdrom(self):
        """ Currently we support iso_cdrom because this is the closest "set" to
        what we can currently get into the zone.  We cannot push a file into
        the zone without several complicated steps that would be prone to
        breakage. So we are bringing in the ISO as a device in the zone. This
        device can then be mounted. The way we present the device to the zone
        is a read only cdrom like device so we will mount it as a "cdrom".
        """
        LOG.debug("self.target_path = %s" % self.target_path)
        mountdir = '/root/cbi_cdrom'
        try:
            #
            # If the CD is already mounted, reuse the mount.
            # This can happen if the system/filesystem/rmvolmgr service
            # is enabled.
            #
            mounted = False
            try:
                for line in open('/etc/mnttab', 'r'):
                    if shlex.split(line)[0] == CONF.cd_device:
                        LOG.warn("CD already mounted. If the config drive "
                                  "contained any secrets, they could have "
                                  "been accessed by unauthorized users.")
                        mountdir = shlex.split(line)[1]
                        mounted = True
            except Exception as ex:
                LOG.error("Failure parsing /etc/mnttab: %s" % ex)
                pass

            if not mounted:
                if not os.path.exists(mountdir):
                    os.mkdir(mountdir, 0o500)

                subprocess.check_call(['/usr/sbin/mount', '-F', 'hsfs',
                                       CONF.cd_device, mountdir])
                mounted = True

            chkfile = os.path.join(mountdir, 'openstack/latest/meta_data.json')
            if os.path.exists(chkfile):
                os.rmdir(self.target_path)
                os.mkdir(self.target_path, 0o500)
                copycmd = ['/usr/bin/cp', '-rp']
                for d in os.listdir(mountdir):
                    copycmd.append(mountdir + '/' + d)

                copycmd.append(self.target_path)
                subprocess.check_call(copycmd)
            else:
                return False
        except Exception as ex:
            LOG.error("Get config drive data failed: %s" % ex)
            return False
        finally:
            if mounted:
                subprocess.call(['/usr/sbin/umount', mountdir])
            if os.path.exists(mountdir):
                os.rmdir(mountdir)
            # Set the property to complete the mount/copy/umount process and
            # release the BUILD status in the controller.
            subprocess.call(['/usr/sbin/svccfg', '-s',
                             'cloudbase-init:default', 'setprop',
                             'configdrive/copydone', '=', 'true'])

        return True

    def _config_drive_iso_hdd(self):
        """ Currently not supported
        """
        LOG.error("iso/hdd is currently not supported")
        return False

    def _config_drive_iso_partition(self):
        """ Currently not supported
        """
        LOG.error("iso/partition is currently not supported")
        return False

    def _config_drive_vfat_cdrom(self):
        """ Currently not supported
        """
        LOG.error("vfat/cdrom is currently not supported")
        return False

    def _config_drive_vfat_hdd(self):
        """ Currently not supported
        """
        LOG.error("vfat/hdd is currently not supported")
        return False

    def _config_drive_vfat_partition(self):
        """ Currently not supported
        """
        LOG.error("vfat/partition is currently not supported")
        return False

    def get_config_drive_files(self, searched_types=None,
                               searched_locations=None):
        # The problem we face is that the type and locations are not really
        # relevant because we do not literally inject the config drive file
        # into the zone.  We provide an iso as a device to the zone which can
        # then be mounted as a cdrom (readonly device) and then the data
        # extracted from there.  So looping through like this isn't really
        # going to buy much, but we get simply write those methods as not
        # supported yet.
        #
        # A lot of this will change once we can truly inject files into the
        # zone.
        for cd_type, cd_location in itertools.product(searched_types,
                                                      searched_locations):
            LOG.info('Looking for Config Drive %(type)s in %(location)s',
                     {"type": cd_type, "location": cd_location})
            find_drive = getattr(self, "_config_drive_" + cd_type + '_' +
                                 cd_location)
            if find_drive():
                return True

        return False
