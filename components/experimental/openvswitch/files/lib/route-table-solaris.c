/*
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 */

/*
 * Copyright (c) 2012 Ed Maste. All rights reserved.
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

#include <config.h>

#include "route-table.h"

#include <net/route.h>
#include <net/if_dl.h>

#include <string.h>
#include <unistd.h>

#include "util.h"
#include "packets.h"
#include "ovs-router.h"
#include "openvswitch/vlog.h"

VLOG_DEFINE_THIS_MODULE(route_table_solaris);

#define	ROUNDUP_LONG(a) ((a) > 0 ? (1 + (((a) - 1) | (sizeof (long) - 1))) : \
    sizeof (long))
#define	RT_ADVANCE(x, n) ((x) += ROUNDUP_LONG(salen(n)))
#define	BUF_SIZE 2048

typedef struct rtmsg {
	struct rt_msghdr	m_rtm;
	char			m_space[BUF_SIZE];
} rtmsg_t;

static int
salen(const struct sockaddr *sa)
{
	switch (sa->sa_family) {
	case AF_INET:
		return (sizeof (struct sockaddr_in));
	case AF_LINK:
		return (sizeof (struct sockaddr_dl));
	case AF_INET6:
		return (sizeof (struct sockaddr_in6));
	default:
		return (sizeof (struct sockaddr));
	}
}


uint64_t
route_table_get_change_seq(void)
{
	return (0);
}

void
route_table_init(void)
{
	ovs_router_init();
}

void
route_table_run(void)
{
}

void
route_table_wait(void)
{
}

bool
route_table_fallback_lookup(const struct in6_addr *ip6_dst, char name[],
		struct in6_addr *gw6)
{
	ovs_be32		ip;
	rtmsg_t			m_rtmsg;
	struct rt_msghdr	*rtm = &m_rtmsg.m_rtm;
	char			*cp = m_rtmsg.m_space;
	int			rtsock_fd;
	struct sockaddr_in	sin;
	struct sockaddr_dl	sdl;
	ssize_t			ssz;
	static int		seq = 0;
	int			rlen;
	int			i;
	int			l;
	int			pid = getpid();

	if (!IN6_IS_ADDR_V4MAPPED(ip6_dst)) {
		VLOG_DBG("route_table_fallback_lookup: .. not IPv4 addr\n");
		return (false);
	}
	ip = in6_addr_get_mapped_ipv4(ip6_dst);
	*gw6 = in6addr_any;

	rtsock_fd = socket(PF_ROUTE, SOCK_RAW, 0);
	if (rtsock_fd == -1) {
		VLOG_DBG("route_table_fallback_lookup: error opening sock\n");
		return (false);
	}
	memset(&sin, 0, sizeof (sin));
	sin.sin_family = AF_INET;
	sin.sin_port = 0;
	sin.sin_addr.s_addr = ip;

	VLOG_DBG("route_table_fallback_lookup: IP address is %s\n",
		inet_ntoa(sin.sin_addr));
	memset(&sdl, 0, sizeof (sdl));
	sdl.sdl_family = AF_LINK;

	memset(&m_rtmsg, 0, sizeof (m_rtmsg));
	rtm->rtm_version = RTM_VERSION;
	rtm->rtm_type = RTM_GET;
	rtm->rtm_addrs = RTA_DST|RTA_IFP;
	rtm->rtm_seq = ++seq;

	l = ROUNDUP_LONG(sizeof (struct sockaddr_in));
	(void) memcpy(cp, &sin, l);
	cp += l;

	l = ROUNDUP_LONG(sizeof (struct sockaddr_dl));
	(void) memcpy(cp, &sdl, l);
	cp += l;

	rtm->rtm_msglen = l = cp - (char *)&m_rtmsg;
	if ((rlen = write(rtsock_fd, (char *)&m_rtmsg, l)) < l) {
		VLOG_DBG("route_table_fallback_lookup: error writing..\n");
		close(rtsock_fd);
		return (false);
	}

	do {
		ssz = read(rtsock_fd, &m_rtmsg, sizeof (m_rtmsg));
	} while (ssz > 0 && (rtm->rtm_seq != seq || rtm->rtm_pid != pid));
	close(rtsock_fd);

	if (ssz < 0)
		return (false);

	cp = (void *)&m_rtmsg.m_space;
	for (i = 1; i; i <<= 1) {
		if ((rtm->rtm_addrs & i) != 0) {
			const struct sockaddr *sa = (const void *)cp;

			if ((i == RTA_IFP) && sa->sa_family == AF_LINK) {
				const struct sockaddr_dl * const sdlp =
				    ALIGNED_CAST(const struct sockaddr_dl *,
				    sa);
				int namelen;

				namelen = sdlp->sdl_nlen;
				if (namelen > IFNAMSIZ - 1)
					namelen = IFNAMSIZ - 1;
				memcpy(name, sdlp->sdl_data, namelen);
				name[namelen] = '\0';
				return (true);
			} else if (i == RTA_GATEWAY && sa->sa_family ==
			    AF_INET) {
				const struct sockaddr_in *sin_dst =
				    ALIGNED_CAST(struct sockaddr_in *, sa);

				in6_addr_set_mapped_ipv4(gw6,
					sin_dst->sin_addr.s_addr);
			}
			RT_ADVANCE(cp, sa);
		}
	}
	return (false);
}
