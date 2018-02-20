/*
 * Copyright (c) 2008, Oracle and/or its affiliates. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice (including the next
 * paragraph) shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

#ifndef _GFX_COMMON_H
#define _GFX_COMMON_H

#include <sys/types.h>

#define GFXIOC					('g' << 8)

#define GFX_IOCTL_GET_IDENTIFIER		(GFXIOC | 1)
#define GFX_IOCTL_GET_CURRENT_VIDEO_MODE	(GFXIOC | 2)
#define GFX_IOCTL_GET_PCI_CONFIG		(GFXIOC | 3)
#define GFX_IOCTL_SET_VIDEO_MODE		(GFXIOC | 4)
#define GFX_IOCTL_GET_EDID_LENGTH		(GFXIOC | 5)
#define GFX_IOCTL_GET_EDID			(GFXIOC | 6)

#define GFX_MAX_MODELNAME_LEN			36
#define GFX_MAX_PARTNUM_LEN			36
#define GFX_MAX_VMODE_LEN			48

#define GFX_IDENT_VERSION			1
#define GFX_IDENT_MODELNAME			0x01
#define GFX_IDENT_PARTNUM			0x02

#define GFX_EDID_VERSION			1
#define GFX_EDID_BLOCK_SIZE			128
#define GFX_EDID_HEAD_ONE			1
#define GFX_EDID_HEAD_TWO			2
#define GFX_EDID_HEAD_THREE			3
#define GFX_EDID_HEAD_FOUR			4


typedef struct	gfx_identifier {
	uint32_t	version;
	uint32_t	flags;
	char		model_name[GFX_MAX_MODELNAME_LEN];
	char		part_number[GFX_MAX_PARTNUM_LEN];
	char		pad[100];
} gfx_identifier_t;


typedef struct  gfx_video_mode {
	char		mode_name[GFX_MAX_VMODE_LEN];
	uint32_t	vRefresh;
	char		pad[96];
} gfx_video_mode_t;


typedef struct  gfx_pci_cfg {
	uint16_t 	VendorID;
	uint16_t 	DeviceID;
	uint16_t 	Command;
	uint16_t 	Status;
	uint8_t  	RevisionID;
	uint8_t  	ProgIF;
	uint8_t  	SubClass;
	uint8_t  	BaseClass;

	uint8_t  	CacheLineSize;
	uint8_t  	LatencyTimer;
	uint8_t  	HeaderType;
	uint8_t  	BIST;

	uint32_t 	bar[6];
	uint32_t   	CIS;
	uint16_t 	SubVendorID;
	uint16_t 	SubSystemID;
	uint32_t   	ROMBaseAddress;

	uint8_t  	CapabilitiesPtr;
	uint8_t  	Reserved_1[3];
	uint32_t   	Reserved_2;

	uint8_t  	InterruptLine;
	uint8_t  	InterruptPin;
	uint8_t  	MinimumGrant;
	uint8_t  	MaximumLatency;

	uint8_t  	pad[100];
} gfx_pci_cfg_t;


typedef struct gfx_edid {
	uint32_t	version;
	uint32_t	head;
#ifndef _LP64 
	uint32_t	pad;
#endif
	caddr_t		data;		/* pointer to the buffer that receives data */
	uint32_t	length;		/* length of the buffer. */
} gfx_edid_t;

#endif /* _GFX_COMMON_H */
	

