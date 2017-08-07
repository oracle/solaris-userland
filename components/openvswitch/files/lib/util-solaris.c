/*
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 */

/*
 * The contents of this file are subject to the terms of the
 * Common Development and Distribution License (the "License").
 * You may not use this file except in compliance with the License.
 *
 * You can obtain a copy of the license at usr/src/OPENSOLARIS.LICENSE
 * or http://www.opensolaris.org/os/licensing.
 * See the License for the specific language governing permissions
 * and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL HEADER in each
 * file and include the License file at usr/src/OPENSOLARIS.LICENSE.
 * If applicable, add the following below this CDDL HEADER, with the
 * fields enclosed by brackets "[]" replaced with your own identifying
 * information: Portions Copyright [yyyy] [name of copyright owner]
 *
 */

#include <config.h>

#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <alloca.h>
#include <errno.h>
#include <limits.h>
#include <string.h>
#include <strings.h>
#include <stropts.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <inet/ip.h>
#include <inet/ip6.h>
#include <arpa/inet.h>
#include <sys/sockio.h>
#include <sys/vnic_mgmt.h>
#include <netinet/vrrp.h>
#include <libdlpi.h>
#include <libdladm.h>
#include <libdllink.h>
#include <zone.h>
#include <net/if_types.h>
#include <inet/arp.h>
#include <sys/socket.h>
#include <sys/devpoll.h>
#include <poll.h>
#include <netdb.h>

#undef	IP_VERSION
#include "netlink-protocol.h"
#include "netlink.h"
#include "flow.h"
#include "packets.h"
#include "util-solaris.h"
#include "util.h"
#include "smap.h"
#include "openvswitch/vlog.h"

#ifndef _B_TRUE
#define	_B_TRUE  1
#define	_B_FALSE 0
#endif

typedef enum {
	DATALINK_FIELD_ZONE	= 0x01,
	DATALINK_FIELD_CLASS	= 0x02,
	DATALINK_FIELD_MTU	= 0x04,
	DATALINK_FIELD_OVER	= 0x08,
	DATALINK_FIELD_STATE	= 0x10,
	DATALINK_FIELD_BRIDGE	= 0x20,
	DATALINK_FIELD_NAME	= 0x40
} datalink_fields_t;

/*
 * Enumeration: DLValueType
 */
typedef enum DLValueType {
	DLVT_BOOLEAN = 0,
	DLVT_BOOLEANS = 1,
	DLVT_LONG = 2,
	DLVT_LONGS = 3,
	DLVT_ULONG = 4,
	DLVT_ULONGS = 5,
	DLVT_STRING = 6,
	DLVT_STRINGS = 7,
	DLVT_DICTIONARY = 8,
	DLVT_DICTIONARYS = 9,
} DLValueType_t;

VLOG_DEFINE_THIS_MODULE(util_solaris);

typedef struct {
	uint_t		ifsp_ppa;	/* Physical Point of Attachment */
	uint_t		ifsp_lun;	/* Logical Unit number */
	boolean_t	ifsp_lunvalid;	/* TRUE if lun is valid */
	char		ifsp_devnm[LIFNAMSIZ]; /* only the device name */
} ifspec_t;

static int
extract_uint(const char *valstr, uint_t *val)
{
	char		*ep;
	unsigned long	ul;

	errno = 0;
	ul = strtoul(valstr, &ep, 10);
	if (errno != 0 || *ep != '\0' || ul > UINT_MAX)
		return (-1);
	*val = (uint_t)ul;
	return (0);
}

/*
 * Given a token with a logical unit spec, return the logical unit converted
 * to a uint_t.
 *
 * Returns: 0 for success, nonzero if an error occurred. errno is set if
 * necessary.
 */
static int
getlun(const char *bp, size_t bpsize, uint_t *lun)
{
	const char	*ep = &bp[bpsize - 1];
	const char	*tp;

	/* Lun must be all digits */
	for (tp = ep; tp > bp && isdigit(*tp); tp--)
		/* Null body */;

	if (tp == ep || tp != bp || extract_uint(bp + 1, lun) != 0) {
		errno = EINVAL;
		return (-1);
	}
	return (0);
}

/*
 * Given a single token ending with a ppa spec, return the ppa spec converted
 * to a uint_t.
 *
 * Returns: 0 for success, nonzero if an error occurred. errno is set if
 * necessary.
 */
static int
getppa(const char *bp, size_t bpsize, uint_t *ppa)
{
	const char	*ep = &bp[bpsize - 1];
	const char	*tp;

	for (tp = ep; tp >= bp && isdigit(*tp); tp--)
		/* Null body */;

	/*
	 * If the device name does not end with a digit or the device
	 * name is a sequence of numbers or a PPA contains a leading
	 * zero, return error.
	 */
	if (tp == ep || tp < bp || ((ep - tp) > 1 && *(tp + 1) == '0'))
		goto fail;

	if (extract_uint(tp + 1, ppa) != 0)
		goto fail;

	/* max value of PPA is 4294967294, which is (UINT_MAX - 1) */
	if (*ppa > UINT_MAX - 1)
		goto fail;
	return (0);
fail:
	errno = EINVAL;
	return (-1);
}

/*
 * Given a `linkname' of the form drv(ppa), parse it into `driver' and `ppa'.
 * If the `dsize' for the `driver' is not atleast MAXLINKNAMELEN then part of
 * the driver name will be copied to `driver'.
 *
 * This function also validates driver name and PPA and therefore callers can
 * call this function with `driver' and `ppa' set to NULL, to just verify the
 * linkname.
 */
boolean_t
dlparse_drvppa(const char *linknamep, char *driver, uint_t dsize, uint_t *ppa)
{
	char	*tp;
	char    linkname[MAXLINKNAMELEN];
	size_t	len;
	uint_t	lppa;

	if (linknamep == NULL || linknamep[0] == '\0')
		goto fail;

	len = strlcpy(linkname, linknamep, MAXLINKNAMELEN);
	if (len >= MAXLINKNAMELEN)
		goto fail;

	/* Get PPA */
	if (getppa(linkname, len, &lppa) != 0)
		return (_B_FALSE);

	/* strip the ppa off of the linkname, if present */
	for (tp = &linkname[len - 1]; tp >= linkname && isdigit(*tp); tp--)
		*tp = '\0';

	/*
	 * Now check for the validity of the device name. The legal characters
	 * in a device name are: alphanumeric (a-z,  A-Z,  0-9), underscore
	 * ('_'), hyphen ('-'), and period ('.'). The first character
	 * of the device name cannot be a digit and should be an alphabetic
	 * character.
	 */
	if (!isalpha(linkname[0]))
		goto fail;
	for (tp = linkname + 1; *tp != '\0'; tp++) {
		if (!isalnum(*tp) && *tp != '_' && *tp != '-' && *tp != '.')
			goto fail;
	}

	if (driver != NULL)
		(void) strlcpy(driver, linkname, dsize);

	if (ppa != NULL)
		*ppa = lppa;

	return (_B_TRUE);
fail:
	errno = EINVAL;
	return (_B_FALSE);
}

/*
 * Given an IP interface name, which is either a
 *	- datalink name (which is driver name plus PPA), for e.g. bge0 or
 *	- datalink name plus a logical interface identifier (delimited by ':'),
 *		for e.g. bge0:34
 * the following function validates its form and decomposes the contents into
 * ifspec_t.
 *
 * Returns _B_TRUE for success, otherwise _B_FALSE is returned.
 */
static boolean_t
ifparse_ifspec(const char *ifname, ifspec_t *ifsp)
{
	char	*lp;
	char	ifnamecp[LIFNAMSIZ];

	if (ifname == NULL || ifname[0] == '\0' ||
	    strlcpy(ifnamecp, ifname, LIFNAMSIZ) >= LIFNAMSIZ) {
		errno = EINVAL;
		return (_B_FALSE);
	}

	ifsp->ifsp_lunvalid = _B_FALSE;

	/* Any logical units? */
	lp = strchr(ifnamecp, ':');
	if (lp != NULL) {
		if (getlun(lp, strlen(lp), &ifsp->ifsp_lun) != 0)
			return (_B_FALSE);
		*lp = '\0';
		ifsp->ifsp_lunvalid = _B_TRUE;
	}

	return (dlparse_drvppa(ifnamecp, ifsp->ifsp_devnm,
	    sizeof (ifsp->ifsp_devnm), &ifsp->ifsp_ppa));
}

/*
 * Issues the ioctl SIOCSLIFNAME to kernel.
 */
static int
slifname(const char *ifname, uint64_t flags, int fd)
{
	struct lifreq	lifr;
	int		status = 0;
	ifspec_t	ifsp;
	boolean_t	valid_if;

	bzero(&lifr, sizeof (lifr));

	/* We should have already validated the interface name. */
	valid_if = ifparse_ifspec(ifname, &ifsp);
	ovs_assert(valid_if);

	lifr.lifr_ppa = ifsp.ifsp_ppa;
	lifr.lifr_flags = flags;
	(void) strlcpy(lifr.lifr_name, ifname, sizeof (lifr.lifr_name));
	if (ioctl(fd, SIOCSLIFNAME, &lifr) == -1) {
		status = errno;
	}

	return (status);
}

/*
 * Wrapper for sending a non-transparent I_STR ioctl().
 * Returns: Result from ioctl().
 */
static int
strioctl(int s, int cmd, char *buf, uint_t buflen)
{
	struct strioctl ioc;

	(void) memset(&ioc, 0, sizeof (ioc));
	ioc.ic_cmd = cmd;
	ioc.ic_timout = 0;
	ioc.ic_len = buflen;
	ioc.ic_dp = buf;

	return (ioctl(s, I_STR, (char *)&ioc));
}

/*
 * Issues the ioctl SIOCSLIFNAME to kernel on the given ARP stream fd.
 */
static int
slifname_arp(const char *ifname, uint64_t flags, int fd)
{
	struct lifreq	lifr;
	ifspec_t	ifsp;

	bzero(&lifr, sizeof (lifr));
	(void) ifparse_ifspec(ifname, &ifsp);
	lifr.lifr_ppa = ifsp.ifsp_ppa;
	lifr.lifr_flags = flags;
	(void) strlcpy(lifr.lifr_name, ifname, sizeof (lifr.lifr_name));
	/*
	 * Tell ARP the name and unit number for this interface.
	 * Note that arp has no support for transparent ioctls.
	 */
	if (strioctl(fd, SIOCSLIFNAME, (char *)&lifr,
	    sizeof (lifr)) == -1) {
		return (errno);
	}
	return (0);
}

/*
 * Open "/dev/udp{,6}" for use as a multiplexor to PLINK the interface stream
 * under. We use "/dev/udp" instead of "/dev/ip" since STREAMS will not let
 * you PLINK a driver under itself, and "/dev/ip" is typically the driver at
 * the bottom of the stream for tunneling interfaces.
 */
static int
open_arp_on_udp(const char *udp_dev_name, int *fd)
{
	int err;

	if ((*fd = open(udp_dev_name, O_RDWR)) == -1)
		return (errno);
	/*
	 * Pop off all undesired modules (note that the user may have
	 * configured autopush to add modules above udp), and push the
	 * arp module onto the resulting stream. This is used to make
	 * IP+ARP be able to atomically track the muxid for the I_PLINKed
	 * STREAMS, thus it isn't related to ARP running the ARP protocol.
	 */
	while (ioctl(*fd, I_POP, 0) != -1)
		;
	if (errno == EINVAL && ioctl(*fd, I_PUSH, ARP_MOD_NAME) != -1)
		return (0);

	err = errno;
	(void) close(*fd);
	return (err);
}

/*
 * Returns the flags value for the logical interface in `lifname'
 * in the buffer pointed to by `flags'.
 */
static int
solaris_get_flags(int sock, const char *lifname, uint64_t *flags)
{
	struct lifreq	lifr;

	bzero(&lifr, sizeof (lifr));
	(void) strlcpy(lifr.lifr_name, lifname, sizeof (lifr.lifr_name));

	if (ioctl(sock, SIOCGLIFFLAGS, (caddr_t)&lifr) < 0)
		return (errno);
	*flags = lifr.lifr_flags;

	return (0);
}

/*
 * For a given interface name, checks if IP interface exists.
 */
int
solaris_if_enabled(int sock, const char *ifname, uint64_t *flags)
{
	struct lifreq	lifr;
	int		error = 0;

	bzero(&lifr, sizeof (lifr));
	(void) strlcpy(lifr.lifr_name, ifname, sizeof (lifr.lifr_name));
	if (ioctl(sock, SIOCGLIFFLAGS, (caddr_t)&lifr) != 0)
		error = errno;

	if (error == 0 && flags != NULL)
		*flags = lifr.lifr_flags;

	return (error);
}

int
solaris_unplumb_if(int sock, const char *ifname, sa_family_t af)
{
	int		ip_muxid;
	int		arp_muxid;
	int		mux_fd = -1;
	int		muxid_fd = -1;
	char		*udp_dev_name;
	uint64_t	ifflags = 0;
	boolean_t	changed_arp_muxid = B_FALSE;
	struct lifreq	lifr;
	int		ret = 0;
	boolean_t	v6 = (af == AF_INET6);

	/*
	 * We used /dev/udp or udp6 to set up the mux. So we have to use
	 * the same now for PUNLINK also.
	 */
	udp_dev_name = (v6 ?  UDP6_DEV_NAME : UDP_DEV_NAME);
	if ((muxid_fd = open(udp_dev_name, O_RDWR)) == -1) {
		ret = errno;
		goto done;
	}
	ret = open_arp_on_udp(udp_dev_name, &mux_fd);
	if (ret != 0)
		goto done;

	bzero(&lifr, sizeof (lifr));
	(void) strlcpy(lifr.lifr_name, ifname, sizeof (lifr.lifr_name));
	if (ioctl(muxid_fd, SIOCGLIFMUXID, (caddr_t)&lifr) < 0) {
		ret = errno;
		goto done;
	}
	arp_muxid = lifr.lifr_arp_muxid;
	ip_muxid = lifr.lifr_ip_muxid;

	ret = solaris_get_flags(sock, ifname, &ifflags);
	if (ret != 0)
		goto done;
	/*
	 * We don't have a good way of knowing whether the arp stream is
	 * plumbed. We can't rely on IFF_NOARP because someone could
	 * have turned it off later using "ifconfig xxx -arp".
	 */
	if (arp_muxid != 0) {
		if (ioctl(mux_fd, I_PUNLINK, arp_muxid) < 0) {
			if ((errno == EINVAL) &&
			    (ifflags & (IFF_NOARP | IFF_IPV6))) {
				/*
				 * Some plumbing utilities set the muxid to
				 * -1 or some invalid value to signify that
				 * there is no arp stream. Set the muxid to 0
				 * before trying to unplumb the IP stream.
				 * IP does not allow the IP stream to be
				 * unplumbed if it sees a non-null arp muxid,
				 * for consistency of IP-ARP streams.
				 */
				lifr.lifr_arp_muxid = 0;
				(void) ioctl(muxid_fd, SIOCSLIFMUXID,
				    (caddr_t)&lifr);
				changed_arp_muxid = B_TRUE;
			}
		}
	}

	if (ioctl(mux_fd, I_PUNLINK, ip_muxid) < 0) {
		if (changed_arp_muxid) {
			/*
			 * Some error occurred, and we need to restore
			 * everything back to what it was.
			 */
			ret = errno;
			lifr.lifr_arp_muxid = arp_muxid;
			lifr.lifr_ip_muxid = ip_muxid;
			(void) ioctl(muxid_fd, SIOCSLIFMUXID, (caddr_t)&lifr);
		}
	}
done:
	if (muxid_fd != -1)
		(void) close(muxid_fd);
	if (mux_fd != -1)
		(void) close(mux_fd);

	return (ret);
}

/*
 * Plumbs the interface `ifname'.
 */
int
solaris_plumb_if(int sock, const char *ifname, sa_family_t af)
{
	int		ip_muxid;
	int		mux_fd = -1, ip_fd, arp_fd;
	char		*udp_dev_name;
	dlpi_handle_t	dh_arp = NULL, dh_ip = NULL;
	uint64_t	ifflags;
	uint_t		dlpi_flags;
	int		status = 0;
	const char	*linkname;
	int		ret;

	if (solaris_if_enabled(sock, ifname, NULL) == 0) {
		status = EEXIST;
		goto done;
	}

	dlpi_flags = DLPI_NOATTACH;
	linkname = ifname;

	/*
	 * We use DLPI_NOATTACH because the ip module will do the attach
	 * itself for DLPI style-2 devices.
	 */
	ret = dlpi_open(linkname, &dh_ip, dlpi_flags);
	if (ret != DLPI_SUCCESS) {
		ret = (ret == DL_SYSERR) ? errno : EOPNOTSUPP;
		goto done;
	}

	ip_fd = dlpi_fd(dh_ip);
	if (ioctl(ip_fd, I_PUSH, IP_MOD_NAME) == -1) {
		status = errno;
		goto done;
	}

	if (af == AF_INET) {
		ifflags = IFF_IPV4;
	} else {
		ifflags = IFF_IPV6;
		ifflags |= IFF_NOLINKLOCAL;
	}

	status = slifname(ifname, ifflags, ip_fd);
	if (status != 0)
		goto done;

	/* Get the full set of existing flags for this stream */
	status = solaris_get_flags(sock, ifname, &ifflags);
	if (status != 0)
		goto done;

	udp_dev_name = (af == AF_INET6 ? UDP6_DEV_NAME : UDP_DEV_NAME);
	status = open_arp_on_udp(udp_dev_name, &mux_fd);
	if (status != 0)
		goto done;

	/* Check if arp is not needed */
	if (ifflags & (IFF_NOARP|IFF_IPV6)) {
		/*
		 * PLINK the interface stream so that the application can exit
		 * without tearing down the stream.
		 */
		if ((ip_muxid = ioctl(mux_fd, I_PLINK, ip_fd)) == -1)
			status = errno;
		goto done;
	}

	/*
	 * This interface does use ARP, so set up a separate stream
	 * from the interface to ARP.
	 *
	 * We use DLPI_NOATTACH because the arp module will do the attach
	 * itself for DLPI style-2 devices.
	 */
	ret = dlpi_open(linkname, &dh_arp, dlpi_flags);
	if (ret != DLPI_SUCCESS) {
		ret = (ret == DL_SYSERR) ? errno : EOPNOTSUPP;
		goto done;
	}

	arp_fd = dlpi_fd(dh_arp);
	if (ioctl(arp_fd, I_PUSH, ARP_MOD_NAME) == -1) {
		status = errno;
		goto done;
	}
	status = slifname_arp(ifname, ifflags, arp_fd);
	if (status != 0)
		goto done;
	/*
	 * PLINK the IP and ARP streams so that we can exit
	 * without tearing down the stream.
	 */
	if ((ip_muxid = ioctl(mux_fd, I_PLINK, ip_fd)) == -1) {
		status = errno;
		goto done;
	}

	if (ioctl(mux_fd, I_PLINK, arp_fd) < 0) {
		status = errno;
		(void) ioctl(mux_fd, I_PUNLINK, ip_muxid);
	}

done:
	dlpi_close(dh_ip);
	if (dh_arp != NULL)
		dlpi_close(dh_arp);
	if (mux_fd != -1)
		(void) close(mux_fd);

	return (status);
}

static dladm_handle_t dlhdl = NULL;

int
solaris_init_dladm()
{
	dladm_status_t status;
	char errmsg[DLADM_STRSIZE];

	if ((status = dladm_open(&dlhdl)) != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("solaris_init: failed with %s", errmsg);
		return (ENODEV);
	}

	return (0);
}

static int
solaris_get_dlinfo(const char *netdev_name, char *info_val, size_t info_len,
    datalink_fields_t dlfield)
{
	dladm_status_t	dlstatus;
	int		dlerror = 0;
	datalink_id_t linkid;
	datalink_class_t class;

	dlstatus = dladm_name2info(dlhdl, netdev_name, &linkid,
		NULL, NULL, NULL);
	if (dlstatus != DLADM_STATUS_OK) {
		dlerror = ENODEV;
		goto out;
	}
	dlstatus = dladm_datalink_id2linkinfo(dlhdl, linkid, NULL, &class, NULL,
		NULL, 0, NULL);

	if (dlstatus != DLADM_STATUS_OK) {
		VLOG_ERR("failed to get linknfo %s", netdev_name);
		dlerror = ENODEV;
		goto out;
	}
	switch (dlfield) {
	case DATALINK_FIELD_CLASS:
		(void) dladm_class2str(class, info_val);
		break;
	case DATALINK_FIELD_OVER:
		dlstatus = dladm_get_lowerlink(dlhdl, linkid, class,
			DLADM_OPT_ACTIVE, info_val, info_len);
		if (dlstatus != DLADM_STATUS_OK) {
			VLOG_ERR("failed to get lowerlink for %s", netdev_name);
			dlerror = ENODEV;
			goto out;
		}
		break;
	case DATALINK_FIELD_ZONE:
	case DATALINK_FIELD_MTU:
	case DATALINK_FIELD_STATE:
	case DATALINK_FIELD_BRIDGE:
	case DATALINK_FIELD_NAME:
		dlerror = ENOTSUP;
		break;
	}
out:
	return (dlerror);
}

int
solaris_get_devname(const char *netdev_name, char *name_val, size_t name_len)
{
	dladm_status_t		status;
	datalink_id_t		physid;
	dladm_phys_attr_t	phys_attr;
	int			error = 0;
	char			errmsg[DLADM_STRSIZE];

	status = dladm_name2info(dlhdl, netdev_name, &physid, NULL, NULL, NULL);
	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to get devname for %s : %s",
			netdev_name, errmsg);
		return (ENODEV);
	}

	status = dladm_phys_info(dlhdl, physid, &phys_attr, DLADM_OPT_ACTIVE);
	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to get phys info for %s : %s",
			netdev_name, errmsg);
		return (ENODEV);
	}

	memcpy(name_val, phys_attr.dp_dev, name_len);
	return (error);
}

int
solaris_get_dlclass(const char *netdev_name, char *class_val, size_t class_len)
{
	int status = solaris_get_dlinfo(netdev_name, class_val, class_len,
		DATALINK_FIELD_CLASS);

	VLOG_WARN("get_dlclass: netdev = %s, class_val = %s",
		netdev_name, class_val);

	return (status);
}

int
solaris_get_dllower(const char *netdev_name, char *lower_val, size_t lower_len)
{
	int status = solaris_get_dlinfo(netdev_name, lower_val, lower_len,
		DATALINK_FIELD_OVER);

	VLOG_DBG("get_dllower: netdev = %s, lower_val = %s", netdev_name,
		(status == 0 ? lower_val : "none"));

	return (status);
}

int
solaris_get_dlprop(const char *netdev_name, const char *prop_name,
    const char *field_name OVS_UNUSED, char *prop_value, size_t prop_len)
{
	dladm_status_t	dlstatus;
	char		*dlbuf;
	char		**pvals;
	uint_t		bufsize, valcnt = DLADM_MAX_PROP_VALCNT;
	uint_t		j;
	int		dlerror = 0;
	datalink_id_t linkid;

	*prop_value = '\0';
	/* allocate and initialize buffer and pointers */
	bufsize = (sizeof (char *) + DLADM_PROP_VAL_MAX) *
	    DLADM_MAX_PROP_VALCNT;
	if ((dlbuf = calloc(1, bufsize)) == NULL) {
		return (ENODEV);
	}
	pvals = (char **)(void *)dlbuf;
	for (j = 0; j < valcnt; j++) {
		pvals[j] = dlbuf + sizeof (char *) * DLADM_MAX_PROP_VALCNT +
		    j * DLADM_PROP_VAL_MAX;
	}

	dlstatus = dladm_name2info(dlhdl, netdev_name, &linkid,
		NULL, NULL, NULL);
	if (dlstatus != DLADM_STATUS_OK) {
		dlerror = ENODEV;
		goto out;
	}
	dlstatus = dladm_get_linkprop(dlhdl, linkid, DLADM_PROP_VAL_CURRENT,
		prop_name, pvals, &valcnt);

	if (dlstatus != DLADM_STATUS_OK) {
		VLOG_ERR("failed to get property(%s, %s): %d",
		    netdev_name, prop_name, dlstatus);
		dlerror = ENODEV;
		goto out;
	}

	memcpy(prop_value, pvals[0], prop_len);

out:
	VLOG_DBG("get_dlprop: netdev = %s, propname = %s, "
			"propval = %s, error = %d",
		netdev_name, prop_name, prop_value, dlerror);
	free(dlbuf);
	return (dlerror);
}

static int
solaris_set_dlprop(const char *netdev_name, const char *propname, void *arg,
    DLValueType_t vtype, boolean_t temp)
{
	dladm_status_t		status;
	datalink_id_t		linkid;
	int			error = 0;
	char			errmsg[DLADM_STRSIZE];
	char			propval[DLADM_STRSIZE];
	char			*p = propval;
	uint_t			flags = DLADM_OPT_ACTIVE;

	switch (vtype) {
	case DLVT_STRING:
		if (arg != NULL)
		strncpy(propval, (char *)arg, sizeof (propval));
		break;
	case DLVT_BOOLEAN:
	case DLVT_BOOLEANS:
	case DLVT_LONG:
	case DLVT_LONGS:
	case DLVT_ULONG:
	case DLVT_ULONGS:
	case DLVT_STRINGS:
	case DLVT_DICTIONARY:
	case DLVT_DICTIONARYS:
		VLOG_WARN("set_dlprop: unsupported propname = %s", propname);
		return (ENOTSUP);
	default:
		VLOG_WARN("set_dlprop: Invalid propname = %s", propname);
		return (EINVAL);
	}

	if (arg != NULL)
		VLOG_WARN("set_dlprop: netdev = %s, "
			"propname = %s propval = %s",
		    netdev_name, propname, propval);
	else
		VLOG_WARN("set_dlprop: netdev = %s, "
			"propname = %s propval = NULL",
		    netdev_name, propname);

	status = dladm_name2info(dlhdl, netdev_name, &linkid, NULL, NULL, NULL);
	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to get link info for %s : %s",
			netdev_name, errmsg);
		return (ENODEV);
	}

	if (temp) {
		flags &= ~DLADM_OPT_PERSIST;
	}
	if (arg == NULL) {
		status = dladm_set_linkprop(dlhdl, linkid, propname,
			NULL, 0, flags);
	} else {
		status = dladm_set_linkprop(dlhdl, linkid, propname,
			&p, 1, flags);
	}
	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		if (arg != NULL)
			VLOG_ERR("set_dlprop: failed for %s, propname = %s, "
					"value = %s: %s",
				netdev_name, propname, propval, errmsg);
		else
			VLOG_ERR("set_dlprop: failed for %s, propname = %s, "
				"value = NULL: %s",
			    netdev_name, propname, errmsg);

		return (ENOTSUP);
	}

	return (error);
}

int
solaris_set_dlprop_boolean(const char *netdev_name, const char *propname,
    void *arg, boolean_t temp)
{
	return (solaris_set_dlprop(netdev_name, propname, arg, DLVT_BOOLEAN,
	    temp));
}

int
solaris_set_dlprop_ulong(const char *netdev_name, const char *propname,
    void *arg, boolean_t temp)
{
	return (solaris_set_dlprop(netdev_name, propname, arg, DLVT_ULONG,
	    temp));
}

int
solaris_set_dlprop_string(const char *netdev_name, const char *propname,
    void *arg, boolean_t temp)
{
	return (solaris_set_dlprop(netdev_name, propname, arg, DLVT_STRING,
	    temp));
}

int
solaris_create_vnic(const char *lowerlink, const char *vnicname)
{
	dladm_status_t	status;
	datalink_id_t	lower_linkid, vnic_id;
	char		errmsg[DLADM_STRSIZE];
	uint32_t	flags = DLADM_OPT_ACTIVE | DLADM_OPT_NONAMECHECK;

	status = dladm_name2info(dlhdl, lowerlink, &lower_linkid,
		NULL, NULL, NULL);
	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to get lower link info for %s: %s",
			lowerlink, errmsg);
		return (ENOTSUP);
	}

	status = dladm_vnic_create(dlhdl, vnicname, lower_linkid, ALL_ZONES,
		VNIC_MAC_ADDR_TYPE_AUTO, NULL, 0, NULL, 0, NULL, 0, 0, 0,
		MAC_PVLAN_NONE, VRRP_VRID_NONE,
		AF_UNSPEC, &vnic_id, NULL, 0, flags);

	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to create vnic %s over %s: %s", vnicname,
			lowerlink, errmsg);
		return (ENOTSUP);
	}

	VLOG_WARN("create_vnic: created vnic %s over lowerlink %s",
		vnicname, lowerlink);

	return (0);
}

int
solaris_modify_vnic(const char *lowerlink, const char *vnicname)
{
	dladm_status_t	status;
	datalink_id_t	lower_linkid, vnic_id;
	char		errmsg[DLADM_STRSIZE];
	uint32_t	flags = DLADM_OPT_ACTIVE; /* temporary */

	if (!dladm_valid_linkname(vnicname)) {
		VLOG_ERR("Invalid vnic name %s", vnicname);
		return (ENOTSUP);
	}

	status = dladm_name2info(dlhdl, vnicname, &vnic_id, NULL, NULL, NULL);
	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to get vnic info for %s: %s",
			vnicname, errmsg);
		return (ENOTSUP);
	}

	status = dladm_name2info(dlhdl, lowerlink, &lower_linkid,
		NULL, NULL, NULL);
	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to get lower link info for %s: %s",
			lowerlink, errmsg);
		return (ENOTSUP);
	}

	status = dladm_vnic_modify(dlhdl, vnic_id, lower_linkid, -1,
		VNIC_MAC_ADDR_TYPE_UNKNOWN, NULL, 0, NULL, 0, NULL, 0, 0, 0,
		MAC_PVLAN_NONE, VRRP_VRID_NONE, AF_UNSPEC, NULL, flags);

	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to modify vnic %s over %s: %s", vnicname,
			lowerlink, errmsg);
		return (ENOTSUP);
	}

	VLOG_WARN("modify_vnic: modified vnic %s over lowerlink %s",
		vnicname, lowerlink);

	return (0);
}

int
solaris_delete_vnic(const char *vnicname)
{
	dladm_status_t		status;
	datalink_id_t		linkid;
	datalink_class_t	class;
	char			errmsg[DLADM_STRSIZE];
	uint32_t		flags = DLADM_OPT_ACTIVE; /* temporary */

	status = dladm_name2info(dlhdl, vnicname, &linkid, NULL, &class, NULL);
	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to get vnic info for %s: %s",
			vnicname, errmsg);
		return (ENOTSUP);
	}

	if (class == DATALINK_CLASS_VNIC)
		status = dladm_vnic_delete(dlhdl, linkid, flags);
	else
		status = dladm_vlan_delete(dlhdl, linkid, flags);

	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to delete vnic %s: %s", vnicname, errmsg);
		return (ENOTSUP);
	}

	VLOG_WARN("delete_vnic: deleted vnic %s", vnicname);

	return (0);
}

int
solaris_create_etherstub(const char *ethstub_name)
{
	dladm_status_t	status;
	datalink_id_t	ether_id;
	char		errmsg[DLADM_STRSIZE];

	uint32_t	flags = DLADM_OPT_ANCHOR | DLADM_OPT_ACTIVE |
			DLADM_OPT_PERSIST;

	if (!dladm_valid_linkname(ethstub_name)) {
		VLOG_ERR("invalid etherstub name %s", ethstub_name);
		return (ENOTSUP);
	}

	status = dladm_vnic_create(dlhdl, ethstub_name,
		DATALINK_INVALID_LINKID, -1, -1, NULL, 0, NULL,
		0, NULL, 0, 0, 0, MAC_PVLAN_NONE, VRRP_VRID_NONE,
		AF_UNSPEC, &ether_id, NULL, 0, flags);

	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to create etherstub name %s: %s",
			ethstub_name, errmsg);
		return (ENOTSUP);
	}

	VLOG_WARN("create_etherstub: Created %s", ethstub_name);

	return (0);
}

int
solaris_delete_etherstub(const char *ethstub_name)
{
	dladm_status_t	status;
	datalink_id_t	linkid;
	char		errmsg[DLADM_STRSIZE];
	uint32_t	flags = DLADM_OPT_ACTIVE | DLADM_OPT_PERSIST;

	status = dladm_name2info(dlhdl, ethstub_name, &linkid,
		NULL, NULL, NULL);
	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("no such etherstub %s: %s", ethstub_name, errmsg);
		return (ENOTSUP);
	}
	status = dladm_vnic_delete(dlhdl, linkid, flags);
	if (status != DLADM_STATUS_OK) {
		dladm_status2str(status, errmsg);
		VLOG_ERR("failed to delete etherstub %s: %s",
			ethstub_name, errmsg);
		return (ENOTSUP);
	}

	VLOG_WARN("delete_etherstub: succeeded for %s", ethstub_name);

	return (0);
}


#define	FP_NAME_VAL_DELIM		'@'
#define	FP_MULTI_ACTION_DELIM		'#'
#define	FP_ACTION_NAME_VALUE_DELIM	'-'
#define	FP_ACTION_MULTI_VAL_DELIM	'^'
#define	FP_MULTI_ACTION_DELIM_STR	"#"


void
slowpath_to_actions(enum slow_path_reason reason, struct ofpbuf *buf)
{
	union user_action_cookie cookie;

	cookie.type = USER_ACTION_COOKIE_SLOW_PATH;
	cookie.slow_path.unused = 0;
	cookie.slow_path.reason = reason;

	odp_put_userspace_action(0, &cookie, sizeof (cookie.slow_path),
		ODPP_NONE, false, buf); /* ??? */
}



boolean_t
kstat_handle_init(kstat2_handle_t *khandlep)
{
	kstat2_status_t	stat;

	stat = kstat2_open(khandlep, NULL);
	return (stat != KSTAT2_S_OK ? B_FALSE: B_TRUE);
}

boolean_t
kstat_handle_update(kstat2_handle_t khandle)
{
	kstat2_status_t	stat;

	stat = kstat2_update(khandle);
	return (stat != KSTAT2_S_OK ? B_FALSE: B_TRUE);
}

void
kstat_handle_close(kstat2_handle_t *khandlep)
{
	kstat2_close(khandlep);
}

uint64_t
get_nvvt_int(kstat2_map_t map, char *name)
{
	kstat2_status_t stat;
	kstat2_nv_t val;

	stat = kstat2_map_get(map, name, &val);
	if (stat != KSTAT2_S_OK) {
		(void) printf("can't get value: %s\n",
		    kstat2_status_string(stat));
		return (0);
	}

	if (val->type != KSTAT2_NVVT_INT) {
		(void) printf("%s is not KSTAT2_NVVT_INT type\n", name);
		return (0);
	}

	return (val->kstat2_integer);
}


int
solaris_dladm_status2error(dladm_status_t status)
{
	int error;

	if (status == DLADM_STATUS_NOMEM) {
		error = ENOMEM;
	} else if (status == DLADM_STATUS_DENIED) {
		error = EPERM;
	} else if (status == DLADM_STATUS_OK) {
		error = 0;
	} else if (status == DLADM_STATUS_IOERR) {
		error = EIO;
	} else {
		error = EINVAL;
	}
	return (error);
}

boolean_t
solaris_is_uplink_class(const char *class)
{
	return (strcmp("phys", class) == 0 ||
	    strcmp("aggr", class) == 0 ||
	    strcmp("etherstub", class) == 0 ||
	    strcmp("vxlan", class) == 0 ||
	    strcmp("veth", class) == 0 ||
	    strcmp("simnet", class) == 0);
}

/*
 * This is a copy of dlparse_zonelinkname() function in libinetutil. libinetutil
 * is not a public interface, therefore we make a copy here.
 *
 * Given a linkname that can be specified using a zonename prefix retrieve
 * the optional linkname and/or zone ID value. If no zonename prefix was
 * specified we set the optional linkname and set optional zone ID return
 * value to ALL_ZONES.
 */
boolean_t
solaris_dlparse_zonelinkname(const char *name, char *link_name,
    zoneid_t *zoneidp)
{
	char buffer[MAXLINKNAMESPECIFIER];
	char *search = "/";
	char *zonetoken;
	char *linktoken;
	char *last;
	size_t namelen;

	if (link_name != NULL)
		link_name[0] = '\0';
	if (zoneidp != NULL)
		*zoneidp = ALL_ZONES;

	if ((namelen = strlcpy(buffer, name, sizeof (buffer))) >=
	    sizeof (buffer))
		return (_B_FALSE);

	if ((zonetoken = strtok_r(buffer, search, &last)) == NULL)
		return (_B_FALSE);

	/* If there are no other strings, return given name as linkname */
	if ((linktoken = strtok_r(NULL, search, &last)) == NULL) {
		if (namelen >= MAXLINKNAMELEN)
			return (_B_FALSE);
		if (link_name != NULL)
			(void) strlcpy(link_name, name, MAXLINKNAMELEN);
		return (_B_TRUE);
	}

	/* First token is the zonename. Check zone and link lengths */
	if (strlen(zonetoken) >= ZONENAME_MAX || strlen(linktoken) >=
	    MAXLINKNAMELEN)
		return (_B_FALSE);
	/*
	 * If there are more '/' separated strings in the input
	 * name  then we return failure. We only support a single
	 * zone prefix or a devnet directory (f.e. net/bge0).
	 */
	if (strtok_r(NULL, search, &last) != NULL)
		return (_B_FALSE);

	if (link_name != NULL)
		(void) strlcpy(link_name, linktoken, MAXLINKNAMELEN);
	if (zoneidp != NULL) {
		if ((*zoneidp = getzoneidbyname(zonetoken)) < MIN_ZONEID)
			return (_B_FALSE);
	}

	return (_B_TRUE);
}

/*
 * Sets *n_cores to the total number of cores on this system, or 0 if the
 * number cannot be determined.
 */
void
solaris_parse_cpuinfo(long int *n_cores)
{
	kstat2_handle_t	handle;
	kstat2_status_t	stat;
	kstat2_map_t	map;
	kstat2_nv_t	val;
	char		kuri[1024];
	int		coreid;
	int		lcoreid = -1;
	int		i;

	*n_cores = 0;

	stat = kstat2_open(&handle, NULL);
	if (stat != KSTAT2_S_OK) {
		VLOG_ERR("solaris_parse_cpuinfo kstat2_open failed (%s). "
		    "Core count may be inaccurate.",
		    kstat2_status_string(stat));
		return;
	}

	for (i = 0; ; i++) {
		(void) snprintf(kuri, sizeof (kuri),
		    "kstat:/system/cpu/%d/info", i);
		stat = kstat2_lookup_map(handle, kuri, &map);
		if (stat == KSTAT2_S_OK) {
			stat = kstat2_map_get(map, "core_id", &val);
			if (stat != KSTAT2_S_OK) {
				VLOG_ERR("solaris_parse_cpuinfo"
				    "kstat2_map_get failed (%s). "
				    "Core count may be inaccurate.",
				    kstat2_status_string(stat));
				*n_cores = 0;
				break;
			}

			if (val->type != KSTAT2_NVVT_INT) {
				VLOG_ERR("solaris_parse_cpuinfo "
				    "kstat2 value error. "
				    "Core count may be inaccurate.");
				*n_cores = 0;
				break;
			}

			coreid = val->kstat2_integer;
			if (coreid != lcoreid) {
				(*n_cores)++;
				lcoreid = coreid;
			}
		} else if (stat == KSTAT2_S_NOT_FOUND) {
			/* no more cores */
			break;
		} else {
			VLOG_ERR("solaris_parse_cpuinfo kstat2_lookup_map "
			    "failed (%s). Core count may be inaccurate.",
			    kstat2_status_string(stat));
			*n_cores = 0;
			break;
		}
	}

	kstat2_close(&handle);
}
