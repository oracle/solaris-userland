/* Copyright (c) 2009, 2015, Oracle and/or its affiliates. All rights reserved.
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



#if defined(__sparc)

#ifdef HAVE_CONFIG_H
#include <config.h>
#endif
#include "xf86.h"
#include "xf86_OSproc.h"
#include "xf86cmap.h"
#include "compiler.h"
#include "vgaHW.h"
#include "mipointer.h"
#include "micmap.h"

#include "fb.h"
#include "regionstr.h"
#include "xf86xv.h"
#include <X11/extensions/Xv.h>
#include "vbe.h"

#include "xf86PciInfo.h"
#include "xf86Pci.h"

/* framebuffer offscreen manager */
#include "xf86fbman.h"

/* include xaa includes */
#ifdef HAVE_XAA
#include "xaa.h"
#endif
#include "xaarop.h"

/* H/W cursor support */
#include "xf86Cursor.h"

#include "ast.h"
#include "ast_vgatool.h"
#include <stdlib.h>
#include <stdio.h>
#include <fcntl.h>
#include <sys/mman.h>

extern Bool ASTGetRec(ScrnInfoPtr pScrn);

#define AST_REG_SIZE       		(256*1024)
#define AST_REG_SIZE_LOG2  		18

#define AST_DEFAULT_DEVICE_PATH 	"/dev/fb0"

#define PCI_MAP_MEMORY                  0x00000000
#define PCI_MAP_IO                      0x00000001

#define PCI_MAP_MEMORY_TYPE             0x00000007
#define PCI_MAP_MEMORY_TYPE_64BIT       0x00000004
#define PCI_MAP_IO_TYPE                 0x00000003

#define PCI_MAP_MEMORY_ADDRESS_MASK     0xfffffff0
#define PCI_MAP_IO_ADDRESS_MASK         0xfffffffc

#define PCI_MAP_IS_IO(b)        	((b) & PCI_MAP_IO)

#define PCI_MAP_IS64BITMEM(b)   \
        (((b) & PCI_MAP_MEMORY_TYPE) == PCI_MAP_MEMORY_TYPE_64BIT)

#define PCIGETMEMORY(b)         	((b) & PCI_MAP_MEMORY_ADDRESS_MASK)
#define PCIGETMEMORY64HIGH(b)   	(*((CARD32*)&(b) + 1))
#define PCIGETMEMORY64(b)       \
        (PCIGETMEMORY(b) | ((CARD64)PCIGETMEMORY64HIGH(b) << 32))

#define PCIGETIO(b)             	((b) & PCI_MAP_IO_ADDRESS_MASK)


struct pci_device *ASTGetPciInfo(ASTRecPtr info)
{
    int status;
    struct pci_device *pciInfo = NULL;
    int i;
    struct vis_pci_cfg  pciCfg;
    int bar;

    if ((status = ioctl(info->fd, VIS_GETPCICONFIG, &pciCfg))
		!= -1) {
        pciInfo = malloc(sizeof(struct pci_device));

	pciInfo->vendor_id = pciCfg.VendorID;
	pciInfo->device_id = pciCfg.DeviceID;
	pciInfo->revision = pciCfg.RevisionID;
	pciInfo->subvendor_id = pciCfg.SubVendorID;
	pciInfo->subdevice_id = pciCfg.SubSystemID;

	for (i = 0; i < 6; i++) {
	    bar = pciCfg.bar[i];
	    if (bar != 0) {
		if (bar & PCI_MAP_IO) {
		    pciInfo->regions[i].base_addr = (memType)PCIGETIO(bar);

		} else {
		    pciInfo->regions[i].size = AST_REG_SIZE_LOG2;
		    pciInfo->regions[i].base_addr = (memType)PCIGETMEMORY(bar);
		    if (PCI_MAP_IS64BITMEM(bar)) {
                        if (i == 5) {
		    	    pciInfo->regions[i].base_addr = 0;
                        } else {
                            int  bar_hi = pciCfg.bar[i+1];
                            /* 64 bit architecture */
                            pciInfo->regions[i].base_addr |= (memType)bar_hi << 32;
                            ++i;    /* Step over the next BAR */
                        }
		    }
		}
	    }
	}
    }

    return pciInfo;
}

static ScrnInfoPtr
ast_get_scrninfo(int entity_num)
{
    ScrnInfoPtr   pScrn = NULL;
    EntityInfoPtr pEnt;

    pScrn = xf86ConfigFbEntity(NULL,0,entity_num, NULL,NULL,NULL,NULL);
    return pScrn;
}

ScrnInfoPtr
ASTAllocScreen(DriverPtr drv, GDevPtr pDev)
{
    int i;
    int foundScreen = FALSE;

    char * dev;
    int entity;
    ASTRecPtr info;
    int fd;
    ScrnInfoPtr pScrn = NULL;

    entity = xf86ClaimFbSlot(drv, 0, pDev, TRUE);
    if (pScrn = xf86ConfigFbEntity(NULL, 0, entity, NULL, NULL, NULL, NULL)) {
        dev = xf86FindOptionValue(pDev->options, "device");
        if (dev == NULL) {
            dev = AST_DEFAULT_DEVICE_PATH;
        }

        if (((fd = open(dev, O_RDWR, 0)) >= 0)) {
            if (ASTGetRec(pScrn)) {
                foundScreen = TRUE;
                info = ASTPTR(pScrn);
                info->deviceName = dev;
                info->fd = fd;
            }
        } else  {
	    xf86DrvMsg(pScrn->scrnIndex, X_ERROR, 
				"Cannot open device %s\n", dev);
	    return NULL;
	}
    }
    return pScrn;
}


pointer
ASTMapVidMem(ScrnInfoPtr pScrn, unsigned int flags, CARD32 pciTag, 
			unsigned long base, unsigned long size)
{
    int BUS_BASE = 0;
    pointer memBase;
    int fdd;
    int mapflags = MAP_SHARED;
    memType realBase, alignOff;
    unsigned long realSize;
    int pageSize;
    ASTRecPtr  info = ASTPTR(pScrn);

    fdd = info->fd;
    realBase = base & ~(getpagesize() - 1);
    alignOff = base - realBase;

    pageSize = getpagesize();
    realSize = size + (pageSize - 1) & (~(pageSize - 1));

#ifdef DEBUG
    printf("base: %lx, realBase: %lx, alignOff: %lx \n",
                base, realBase, alignOff);
#endif /* DEBUG */

    memBase = mmap((caddr_t)0, realSize + alignOff, PROT_READ | PROT_WRITE, mapflags, fdd,
                (off_t)(off_t)realBase + BUS_BASE);

    if (memBase == MAP_FAILED) {
#ifdef DEBUG
        printf("ASTMapVidMem: Could not map framebuffer\n");
#endif /* DEBUG */
        return NULL;
    }

    return ((char *)memBase + alignOff);
}

void
ASTUnmapVidMem(ScrnInfoPtr pScrn, pointer base, unsigned long size)
{
    memType alignOff = (memType)base - ((memType)base & ~(getpagesize() - 1));

    munmap((caddr_t)((memType)base - alignOff), (size + alignOff));

    return;
}


void
ASTNotifyModeChanged(ScrnInfoPtr pScrn)
{
    struct vis_video_mode mode;
    ASTRecPtr  info = ASTPTR(pScrn);
    int status;

    if (pScrn->currentMode->name != NULL) {
	strlcpy(mode.mode_name, pScrn->currentMode->name, VIS_MAX_VMODE_LEN);
    } else {
	strlcpy(mode.mode_name, " ", VIS_MAX_VMODE_LEN);
    }
    mode.vRefresh = pScrn->currentMode->VRefresh;

    status = ioctl(info->fd, VIS_STOREVIDEOMODENAME, &mode);
}

void
ASTSaveHW(ScrnInfoPtr pScrn)
{
   ASTRecPtr pAST = ASTPTR(pScrn);
   ASTRegPtr astReg;
   int i, icount=0;
   UCHAR jReg;

   astReg = &pAST->SavedReg;

   /* Save Misc */
   astReg->MISC = GetReg(MISC_PORT_READ);

   /* Save SR */
   for (i=0; i<4; i++)
       GetIndexReg(SEQ_PORT, (UCHAR) (i), astReg->SEQ[i]);

   /* Save CR */
   for (i=0; i<25; i++)
       GetIndexReg(CRTC_PORT, (UCHAR) (i), astReg->CRTC[i]);

   /* Save GR */
   for (i=0; i<9; i++)
       GetIndexReg(GR_PORT, (UCHAR) (i), astReg->GR[i]);

   /* Save AR */
   jReg = GetReg(INPUT_STATUS1_READ);
   for (i=0; i<20; i++)
      GetIndexReg(AR_PORT_WRITE, (UCHAR) (i), astReg->AR[i]);
   jReg = GetReg(INPUT_STATUS1_READ);
   SetReg (AR_PORT_WRITE, 0x20);                /* set POS */

   /* Save DAC */
   for (i=0; i<256; i++)
      VGA_GET_PALETTE_INDEX (i, astReg->DAC[i][0], astReg->DAC[i][1], astReg->DAC[i][2]);
}


void
ASTRestoreHW(ScrnInfoPtr pScrn)
{
   ASTRecPtr pAST = ASTPTR(pScrn);
   ASTRegPtr astReg;
   int i, icount=0;
   UCHAR jReg;

   astReg = &pAST->SavedReg;

   /* Restore Misc */
   SetReg(MISC_PORT_WRITE, astReg->MISC);

   /* Restore SR */
   for (i=0; i<4; i++)
       SetIndexReg(SEQ_PORT, (UCHAR) (i), astReg->SEQ[i]);
  
   /* Restore CR */
   SetIndexRegMask(CRTC_PORT,0x11, 0x7F, 0x00);
   for (i=0; i<25; i++)
       SetIndexReg(CRTC_PORT, (UCHAR) (i), astReg->CRTC[i]);
  
   /* Restore GR */
   for (i=0; i<9; i++)
       SetIndexReg(GR_PORT, (UCHAR) (i), astReg->GR[i]);
  
   /* Restore AR */
   jReg = GetReg(INPUT_STATUS1_READ);
   for (i=0; i<20; i++)
   {
        SetReg(AR_PORT_WRITE, (UCHAR) i);
        SetReg(AR_PORT_WRITE, astReg->AR[i]);
   }
   SetReg(AR_PORT_WRITE, 0x14);
   SetReg(AR_PORT_WRITE, 0x00);

   jReg = GetReg(INPUT_STATUS1_READ);
   SetReg (AR_PORT_WRITE, 0x20);                /* set POS */
  
   /* Restore DAC */
   for (i=0; i<256; i++)
      VGA_LOAD_PALETTE_INDEX (i, astReg->DAC[i][0], astReg->DAC[i][1], astReg->DAC[i][2]);
}


#endif /* __sparc__ */
