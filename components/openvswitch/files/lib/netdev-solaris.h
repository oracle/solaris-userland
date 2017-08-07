/*
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 */

#ifndef	_NETDEV_SOLARIS_H
#define	_NETDEV_SOLARIS_H

#ifdef	__cplusplus
extern "C" {
#endif

/*
 * Copyright (c) 2011, 2013, 2014 Nicira, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <stdint.h>
#include <stdbool.h>

/*
 * When network devices are constructed, the internal devices (i.e., bridges)
 * are initially created over this etherstub and are moved when uplink ports
 * are added to the bridge.
 */
#define	NETDEV_IMPL_ETHERSTUB	"ovs.etherstub0"

/*
 * These functions are Solaris specific, so they should be used directly only by
 * Solaris-specific code.
 */

struct netdev;

extern struct shash port_to_bridge_map;

int netdev_create_impl_etherstub(void);
void netdev_delete_impl_etherstub(void);
boolean_t netdev_impl_etherstub_exists(void);
const char *netdev_solaris_get_name(const struct netdev *);
int internal_to_devname(const char *iname, char *devname, int len);
int devname_to_internal(const char *devname, char *iname, int len);

#ifdef	__cplusplus
}
#endif

#endif	/* _NETDEV_SOLARIS_H */
