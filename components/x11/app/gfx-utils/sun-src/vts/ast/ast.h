/*
 * Copyright (c) 2006, 2013, Oracle and/or its affiliates. All rights reserved.
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

#ifndef AST_H
#define	AST_H

#define	AST_REG_SIZE_LOG2	18

#define	PCI_MAP_MEMORY			0x00000000
#define	PCI_MAP_IO			0x00000001

#define	PCI_MAP_MEMORY_TYPE		0x00000007
#define	PCI_MAP_IO_TYPE			0x00000003

#define	PCI_MAP_MEMORY_TYPE_32BIT	0x00000000
#define	PCI_MAP_MEMORY_TYPE_32BIT_1M	0x00000002
#define	PCI_MAP_MEMORY_TYPE_64BIT	0x00000004
#define	PCI_MAP_MEMORY_TYPE_MASK	0x00000006
#define	PCI_MAP_MEMORY_CACHABLE		0x00000008
#define	PCI_MAP_MEMORY_ATTR_MASK	0x0000000e
#define	PCI_MAP_MEMORY_ADDRESS_MASK	0xfffffff0

#define	PCI_MAP_IO_ATTR_MASK		0x00000003
#define	PCI_MAP_IS_IO(b)		((b) & PCI_MAP_IO)
#define	PCI_MAP_IO_ADDRESS_MASK		0xfffffffc

#define	PCIGETIO(b)			((b) & PCI_MAP_IO_ADDRESS_MASK)

#define	PCI_MAP_IS64BITMEM(b)	\
	(((b) & PCI_MAP_MEMORY_TYPE) == PCI_MAP_MEMORY_TYPE_64BIT)

#define	PCIGETMEMORY(b)			((b) & PCI_MAP_MEMORY_ADDRESS_MASK)

#define	PCI_REGION_BASE(_pcidev, _b, _type)	\
	(((_type) == REGION_MEM) ? (_pcidev)->memBase[(_b)] : \
	(_pcidev)->ioBase[(_b)])

#define	AR_PORT_WRITE			0x40
#define	MISC_PORT_WRITE			0x42
#define	SEQ_PORT			0x44
#define	DAC_INDEX_READ			0x47
#define	DAC_INDEX_WRITE			0x48
#define	DAC_DATA			0x49
#define	GR_PORT				0x4E
#define	CRTC_PORT			0x54
#define	INPUT_STATUS1_READ		0x5A
#define	MISC_PORT_READ			0x4C

#define	AST_MMIO_SIZE			0x00020000
#define	AST_VRAM_SIZE_08M		0x00800000
#define	AST_VRAM_SIZE_16M		0x01000000
#define	AST_VRAM_SIZE_32M		0x02000000
#define	AST_VRAM_SIZE_64M		0x04000000
#define	AST_VRAM_SIZE_128M		0x08000000


#define	MASK_SRC_PITCH			0x1FFF
#define	MASK_DST_PITCH			0x1FFF
#define	MASK_DST_HEIGHT			0x7FF
#define	MASK_SRC_X			0xFFF
#define	MASK_SRC_Y			0xFFF
#define	MASK_DST_X			0xFFF
#define	MASK_DST_Y			0xFFF
#define	MASK_RECT_WIDTH			0x7FF
#define	MASK_RECT_HEIGHT		0x7FF
#define	MASK_CLIP			0xFFF

#define	MASK_LINE_X			0xFFF
#define	MASK_LINE_Y			0xFFF
#define	MASK_LINE_ERR			0x3FFFFF
#define	MASK_LINE_WIDTH			0x7FF
#define	MASK_LINE_K1			0x3FFFFF
#define	MASK_LINE_K2			0x3FFFFF
#define	MASK_AIPLINE_X			0xFFF
#define	MASK_AIPLINE_Y			0xFFF


/* CMDQ Reg */
#define	CMDQREG_SRC_BASE		(0x00 << 24)
#define	CMDQREG_SRC_PITCH		(0x01 << 24)
#define	CMDQREG_DST_BASE		(0x02 << 24)
#define	CMDQREG_DST_PITCH		(0x03 << 24)
#define	CMDQREG_DST_XY			(0x04 << 24)
#define	CMDQREG_SRC_XY			(0x05 << 24)
#define	CMDQREG_RECT_XY			(0x06 << 24)
#define	CMDQREG_FG			(0x07 << 24)
#define	CMDQREG_BG			(0x08 << 24)
#define	CMDQREG_FG_SRC			(0x09 << 24)
#define	CMDQREG_BG_SRC			(0x0A << 24)
#define	CMDQREG_MONO1			(0x0B << 24)
#define	CMDQREG_MONO2			(0x0C << 24)
#define	CMDQREG_CLIP1			(0x0D << 24)
#define	CMDQREG_CLIP2			(0x0E << 24)
#define	CMDQREG_CMD			(0x0F << 24)
#define	CMDQREG_PAT			(0x40 << 24)

#define	CMDQREG_LINE_XY			(0x04 << 24)
#define	CMDQREG_LINE_ERR		(0x05 << 24)
#define	CMDQREG_LINE_WIDTH		(0x06 << 24)
#define	CMDQREG_LINE_K1			(0x09 << 24)
#define	CMDQREG_LINE_K2			(0x0A << 24)
#define	CMDQREG_LINE_STYLE1		(0x0B << 24)
#define	CMDQREG_LINE_STYLE2		(0x0C << 24)
#define	CMDQREG_LINE_XY2		(0x05 << 24)
#define	CMDQREG_LINE_NUMBER		(0x06 << 24)

#define	CMD_BITBLT			0x00000000
#define	CMD_LINEDRAW			0x00000001
#define	CMD_COLOREXP			0x00000002
#define	CMD_ENHCOLOREXP			0x00000003
#define	CMD_TRANSPARENTBLT		0x00000004
#define	CMD_MASK			0x00000007

#define	CMD_DISABLE_CLIP		0x00000000
#define	CMD_ENABLE_CLIP			0x00000008

#define	CMD_COLOR_08			0x00000000
#define	CMD_COLOR_16			0x00000010
#define	CMD_COLOR_32			0x00000020

#define	CMD_SRC_SIQ			0x00000040

#define	CMD_TRANSPARENT			0x00000080

#define	CMD_PAT_FGCOLOR			0x00000000
#define	CMD_PAT_MONOMASK		0x00010000
#define	CMD_PAT_PATREG			0x00020000

#define	CMD_OPAQUE			0x00000000
#define	CMD_FONT_TRANSPARENT		0x00040000

#define	CMD_X_INC			0x00000000
#define	CMD_X_DEC			0x00200000

#define	CMD_Y_INC			0x00000000
#define	CMD_Y_DEC			0x00100000

#define	CMD_NT_LINE			0x00000000
#define	CMD_NORMAL_LINE			0x00400000

#define	CMD_DRAW_LAST_PIXEL		0x00000000
#define	CMD_NOT_DRAW_LAST_PIXEL		0x00800000

#define	CMD_DISABLE_LINE_STYLE		0x00000000
#define	CMD_ENABLE_LINE_STYLE		0x40000000

#define	CMD_RESET_STYLE_COUNTER		0x80000000
#define	CMD_NOT_RESET_STYLE_COUNTER	0x00000000

#define	QUEUE_MEMORY_MAP		0x02000000
#define	STAT_BUSY			0x80000000

#define	BURST_FORCE_CMD			0x80000000

#define	MMIOREG_DST_BASE		0x8008
#define	MMIOREG_DST_PITCH		0x800C
#define	MMIOREG_DST_XY			0x8010
#define	MMIOREG_SRC_XY			0x8014
#define	MMIOREG_RECT_XY			0x8018
#define	MMIOREG_FG			0x801C
#define	MMIOREG_BG			0x8020
#define	MMIOREG_MONO1			0x802C
#define	MMIOREG_MONO2			0x8030
#define	MMIOREG_CLIP1			0x8034
#define	MMIOREG_CLIP2			0x8038
#define	MMIOREG_CMD			0x803C
#define	MMIOREG_QUEUE			0x8044
#define	MMIOREG_STAT			0x804C
#define	MMIOREG_PAT			0x8100

#define	MMIOREG_LINE_XY			0x8010
#define	MMIOREG_LINE_ERR		0x8014
#define	MMIOREG_LINE_WIDTH		0x8018
#define	MMIOREG_LINE_K1			0x8024
#define	MMIOREG_LINE_K2			0x8028


#endif /* AST_H */
