/*
 * Copyright (c) 2012, Oracle and/or its affiliates. All rights reserved.
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

#ifndef _MGA_H
#define	_MGA_H

/* BEGIN CSTYLED */

	/* MGA PCI Specific Registers */

#define	MGAPCI_AGP_CMD					      0xf8
#define	MGAPCI_AGP_IDENT				      0xf0
#define	MGAPCI_AGP_STS					      0xf4
#define	MGAPCI_FB_BASE					      0x10
#define	MGAPCI_CONTROL_BASE				      0x14
#define	MGAPCI_ILOAD_BASE				      0x18
#define	MGAPCI_MGA_DATA					      0x48
#define	MGAPCI_MGA_INDEX				      0x44
#define	MGAPCI_OPTION					      0x40
#define	MGAPCI_OPTION2					      0x50
#define	MGAPCI_PMCSR					      0xe0
#define	MGAPCI_PMIDENT					      0xdc
#define	MGAPCI_SUBSYSID					      0x4c

#define	MGAREG_FB						 1
#define	MGAREG_CONTROL						 2
#define	MGAREG_ILOAD						 3
#define	MGAREG_ROM						 4

#define	MGASIZE_FB					0x01000000
#define	MGASIZE_CONTROL					    0x4000
#define	MGASIZE_ILOAD					0x00800000
#define	MGASIZE_ROM					   0x10000

	/* MGA PCI AGP Command 0xf8 */

#define	MGAPCI_AGPCMD_RQ_DEPTH_MASK			0x1f000000
#define	MGAPCI_AGPCMD_RQ_DEPTH_SHIFT				24
#define	MGAPCI_AGPCMD_SBA_ENABLE			0x00000200
#define	MGAPCI_AGPCMD_AGP_ENABLE			0x00000100
#define	MGAPCI_AGPCMD_DATA_RATE_MASK			0x00000007
#define	MGAPCI_AGPCMD_DATA_RATE_1			0x00000001
#define	MGAPCI_AGPCMD_DATA_RATE_2			0x00000002

	/* MGA PCI AGP Capability Identifier 0xf0 */

#define	MGAPCI_AGPIDENT_AGP_REV_MASK			0x00ff0000
#define	MGAPCI_AGPIDENT_AGP_REV_SHIFT				16
#define	MGAPCI_AGPIDENT_AGP_NEXT_MASK			0x0000ff00
#define	MGAPCI_AGPIDENT_AGP_CAP_ID_MASK			0x000000ff
#define	MGAPCI_AGPIDENT_AGP_CAP_ID			0x00000002

	/* MGA PCI AGP Status 0xf4 */

#define	MGAPCI_AGPSTS_RQ_MASK				0xff000000
#define	MGAPCI_AGPSTS_RQ_SHIFT					24
#define	MGAPCI_AGPSTS_SBA_CAP				0x00000200
#define	MGAPCI_AGPSTS_RATE_CAP_MASK			0x00000003

	/* MGA PCI Vendor and Device 0x00 */

#define	MGAPCI_VENDOR_MATROX				    0x102b

#define	MGAPCI_DEVICE_MGA_G200				    0x0520
#define	MGAPCI_DEVICE_MGA_G200AGP			    0x0521
#define	MGAPCI_DEVICE_MGA_G200E				    0x0522

	/* MGA PCI Indirect Access Data 0x48 */

	/* MGA PCI Indirect Access Index 0x44 */

#define	MGAPCI_INDEX_MASK				0x00003ffc
#define	MGAPCI_INDEX_SHIFT					 2

	/* MGA PCI Option 0x40 */

#define	MGAPCI_OPTION_POWERPC				0x80000000
#define	MGAPCI_OPTION_BIOSEN				0x40000000
#define	MGAPCI_OPTION_NORETRY				0x20000000
#define	MGAPCI_OPTION_ENHMEMACC				0x04000000
#define	MGAPCI_OPTION_RFHCNT_MASK			0x001f8000
#define	MGAPCI_OPTION_RFHCNT_SHIFT				15
#define	MGAPCI_OPTION_HARDPWMSK				0x00004000
#define	MGAPCI_OPTION_MEMCONFIG_MASK			0x00001c00
#define	MGAPCI_OPTION_MEMORG_MASK			0x00001800
#define	MGAPCI_OPTION_MEMORG_2_128K_32			0x00000000
#define	MGAPCI_OPTION_MEMORG_2_256K_32			0x00000800
#define	MGAPCI_OPTION_MEMORG_2_512K_16			0x00001000
#define	MGAPCI_OPTION_MEMORG_4_128K_32			0x00001800
#define	MGAPCI_OPTION_MEMBANK_MASK			0x00000400
#define	MGAPCI_OPTION_MEMBANK_ONE_BANK			0x00000000
#define	MGAPCI_OPTION_MEMBANK_TWO_BANKS			0x00000400
#define	MGAPCI_OPTION_VGAIOEN				0x00000100
#define	MGAPCI_OPTION_PLLSEL				0x00000040
#define	MGAPCI_OPTION_SYSPLLPDN				0x00000020
#define	MGAPCI_OPTION_MCLKDIV				0x00000010
#define	MGAPCI_OPTION_GCLKDIV				0x00000008
#define	MGAPCI_OPTION_SYSCLKDIS				0x00000004
#define	MGAPCI_OPTION_SYSCLKSL_MASK			0x00000003
#define	MGAPCI_OPTION_SYSCLKSL_PCI			0x00000000
#define	MGAPCI_OPTION_SYSCLKSL_PLL			0x00000001
#define	MGAPCI_OPTION_SYSCLKSL_MCLK			0x00000002

	/* MGA PCI Option2 0x50 */

#define	MGAPCI_OPTION2_MODCLKP_MASK			0x00380000
#define	MGAPCI_OPTION2_MODCLKP_SHIFT				19
#define	MGAPCI_OPTION2_WCLKDIV				0x00020000
#define	MGAPCI_OPTION2_NOWCLKDIV			0x00010000
#define	MGAPCI_OPTION2_NOMCLKDIV			0x00008000
#define	MGAPCI_OPTION2_NOGCLKDIV			0x00004000
#define	MGAPCI_OPTION2_MBUFTYPE1			0x00002000
#define	MGAPCI_OPTION2_MBUFTYPE0			0x00001000
#define	MGAPCI_OPTION2_EEPROMWT				0x00000100

	/* MGA PCI Power Management Control Status 0xe0 */

#define	MGAPCI_PMCSR_POWER_MASK				0x00000003
#define	MGAPCI_PMCSR_POWER_D0				0x00000000
#define	MGAPCI_PMCSR_POWER_D3				0x00000003

	/* MGA PCI Power Management Identifier 0xdc */

#define	MGAPCI_PMIDENT_D2_SUP				0x04000000
#define	MGAPCI_PMIDENT_D1_SUP				0x02000000
#define	MGAPCI_PMIDENT_DSI				0x00200000
#define	MGAPCI_PMIDENT_PM_VERSION			0x00070000
#define	MGAPCI_PMIDENT_PM_NEXT_MASK			0x0000ff00
#define	MGAPCI_PMIDENT_PM_CAP_ID_MASK			0x000000ff
#define	MGAPCI_PMIDENT_PM_CAP_ID			0x00000001

	/* MGA PCI Subsysid 0x4c */

#define	MGAPCI_SUBSYSID_SUBSYSVID			0xffff0000
#define	MGAPCI_SUSSYSID_SUBSYSVID_SHIFT				16
#define	MGAPCI_SUBSYSID_SUBSYSID			0x0000ffff

	/* MGA Memory */

#define	MGA_AGP_PLL					    0x1e4c
#define	MGA_ALPHACTRL					    0x2c7c
#define	MGA_ALPHASTART					    0x2c70
#define	MGA_ALPHAXINC					    0x2c74
#define	MGA_ALPHAYINC					    0x2c78
#define	MGA_AR0						    0x1c60
#define	MGA_AR1						    0x1c64
#define	MGA_AR2						    0x1c68
#define	MGA_AR3						    0x1c6c
#define	MGA_AR4						    0x1c70
#define	MGA_AR5						    0x1c74
#define	MGA_AR6						    0x1c78
#define	MGA_BCOL					    0x1c20
#define	MGA_BESA1CORG					    0x3d10
#define	MGA_BESA1ORG					    0x3d00
#define	MGA_BESA2CORG					    0x3d14
#define	MGA_BESA2ORG					    0x3d04
#define	MGA_BESB1CORG					    0x3d18
#define	MGA_BESB1ORG					    0x3d08
#define	MGA_BESB2CORG					    0x3d1c
#define	MGA_BESB2ORG					    0x3d0c
#define	MGA_BESCTL					    0x3d20
#define	MGA_BESGLOBCTL					    0x3dc0
#define	MGA_BESHCOORD					    0x3d28
#define	MGA_BESHISCAL					    0x3d30
#define	MGA_BESHSRCEND					    0x3d3c
#define	MGA_BESHSRCLST					    0x3d50
#define	MGA_BESHSRCST					    0x3d38
#define	MGA_BESPITCH					    0x3d24
#define	MGA_BESSTATUS					    0x3dc4
#define	MGA_BESV1SRCLST					    0x3d54
#define	MGA_BESV2SRCLST					    0x3d58
#define	MGA_BESV1WGHT					    0x3d48
#define	MGA_BESV2WGHT					    0x3d4c
#define	MGA_BESVCOORD					    0x3d2c
#define	MGA_BESVISCAL					    0x3d34
#define	MGA_CODECADDR					    0x3e44
#define	MGA_CODECCTL					    0x3e40
#define	MGA_CODECHARDPTR				    0x3e4c
#define	MGA_CODECHOSTPTR				    0x3e48
#define	MGA_CODECLCODE					    0x3e50
#define	MGA_CXBNDRY					    0x1c80
#define	MGA_CXLEFT					    0x1ca0
#define	MGA_CXRIGHT					    0x1ca4
#define	MGA_DMAWIN					    0x0000
#define	MGA_DMAMAP30					    0x1e30
#define	MGA_DMAMAP74					    0x1e34
#define	MGA_DMAMAPB8					    0x1e38
#define	MGA_DMAMAPFC					    0x1e3c
#define	MGA_DMAPAD					    0x1c54
#define	MGA_DR0_Z32_LSB					    0x2c50
#define	MGA_DR0_Z32_MSB					    0x2c54
#define	MGA_DR2_Z32_LSB					    0x2c60
#define	MGA_DR2_Z32_MSB					    0x2c64
#define	MGA_DR3_Z32_LSB					    0x2c68
#define	MGA_DR3_Z32_MSB					    0x2c6c
#define	MGA_DR0						    0x1cc0
#define	MGA_DR2						    0x1cc8
#define	MGA_DR3						    0x1ccc
#define	MGA_DR4						    0x1cd0
#define	MGA_DR6						    0x1cd8
#define	MGA_DR7						    0x1cdc
#define	MGA_DR8						    0x1ce0
#define	MGA_DR10					    0x1ce8
#define	MGA_DR11					    0x1cec
#define	MGA_DR12					    0x1cf0
#define	MGA_DR14					    0x1cf8
#define	MGA_DR15					    0x1cfc
#define	MGA_DRAW_AR0					    0x1d60
#define	MGA_DRAW_AR1					    0x1d64
#define	MGA_DRAW_AR2					    0x1d68
#define	MGA_DRAW_AR3					    0x1d6c
#define	MGA_DRAW_AR4					    0x1d70
#define	MGA_DRAW_AR5					    0x1d74
#define	MGA_DRAW_AR6					    0x1d78
#define	MGA_DRAW_BCOL					    0x1d20
#define	MGA_DRAW_CXBNDRY				    0x1d80
#define	MGA_DRAW_CXLEFT					    0x1da0
#define	MGA_DRAW_CXRIGHT				    0x1da4
#define	MGA_DRAW_DMAPAD					    0x1d54
#define	MGA_DRAW_DWGCTL					    0x1d00
#define	MGA_DRAW_FCOL					    0x1d24
#define	MGA_DRAW_FXBNDRY				    0x1d84
#define	MGA_DRAW_FXLEFT					    0x1da8
#define	MGA_DRAW_FXRIGHT				    0x1dac
#define	MGA_DRAW_LEN					    0x1d5c
#define	MGA_DRAW_MACCESS				    0x1d04
#define	MGA_DRAW_MCTLWTST				    0x1d08
#define	MGA_DRAW_PAT0					    0x1d10
#define	MGA_DRAW_PAT1					    0x1d14
#define	MGA_DRAW_PITCH					    0x1d8c
#define	MGA_DRAW_PLNWT					    0x1d1c
#define	MGA_DRAW_SGN					    0x1d58
#define	MGA_DRAW_SHIFT					    0x1d50
#define	MGA_DRAW_SRC0					    0x1d30
#define	MGA_DRAW_SRC1					    0x1d34
#define	MGA_DRAW_SRC2					    0x1d38
#define	MGA_DRAW_SRC3					    0x1d3c
#define	MGA_DRAW_XDST					    0x1db0
#define	MGA_DRAW_XYEND					    0x1d44
#define	MGA_DRAW_XYSTRT					    0x1d40
#define	MGA_DRAW_YBOT					    0x1d9c
#define	MGA_DRAW_YDST					    0x1d90
#define	MGA_DRAW_YDSTLEN				    0x1d88
#define	MGA_DRAW_YDSTORG				    0x1d94
#define	MGA_DRAW_YTOP					    0x1d98
#define	MGA_DRAW_ZORG					    0x1d0c
#define	MGA_DSTORG					    0x2cb8
#define	MGA_DWG_INDIR_WT				    0x1e80
#define	MGA_DWG_INDIR_WT0				    0x1e80
#define	MGA_DWG_INDIR_WT1				    0x1e84
#define	MGA_DWG_INDIR_WT2				    0x1e88
#define	MGA_DWG_INDIR_WT3				    0x1e8c
#define	MGA_DWG_INDIR_WT4				    0x1e90
#define	MGA_DWG_INDIR_WT5				    0x1e94
#define	MGA_DWG_INDIR_WT6				    0x1e98
#define	MGA_DWG_INDIR_WT7				    0x1e9c
#define	MGA_DWG_INDIR_WT8				    0x1ea0
#define	MGA_DWG_INDIR_WT9				    0x1ea4
#define	MGA_DWG_INDIR_WTA				    0x1ea8
#define	MGA_DWG_INDIR_WTB				    0x1eac
#define	MGA_DWG_INDIR_WTC				    0x1eb0
#define	MGA_DWG_INDIR_WTD				    0x1eb4
#define	MGA_DWG_INDIR_WTE				    0x1eb8
#define	MGA_DWG_INDIR_WTF				    0x1ebc
#define	MGA_DWGCTL					    0x1c00
#define	MGA_DWGSYNC					    0x2c4c
#define	MGA_FCOL					    0x1c24
#define	MGA_FIFOSTATUS					    0x1e10
#define	MGA_FOGCOL					    0x1cf4
#define	MGA_FOGSTART					    0x1cc4
#define	MGA_FOGXINC					    0x1cd4
#define	MGA_FOGYINC					    0x1ce4
#define	MGA_FXBNDRY					    0x1c84
#define	MGA_FXLEFT					    0x1ca8
#define	MGA_FXRIGHT					    0x1cac
#define	MGA_ICLEAR					    0x1e18
#define	MGA_IEN						    0x1e1c
#define	MGA_LEN						    0x1c5c
#define	MGA_MACCESS					    0x1c04
#define	MGA_MCTLWTST					    0x1c08
#define	MGA_MEMRDBK					    0x1e44
#define	MGA_MODELREV					    0x1e24
#define	MGA_OPMODE					    0x1e54
#define	MGA_PAT0					    0x1c10
#define	MGA_PAT1					    0x1c14
#define	MGA_PITCH					    0x1c8c
#define	MGA_PLNWT					    0x1c1c
#define	MGA_PRIMADDRESS					    0x1e58
#define	MGA_PRIMEND					    0x1e5c
#define	MGA_PRIMPTR					    0x1e50
#define	MGA_RST						    0x1e40
#define	MGA_SECADDRESS					    0x2c40
#define	MGA_SECEND					    0x2c44
#define	MGA_SETUPADDRESS				    0x2cd0
#define	MGA_SETUPEND					    0x2cd4
#define	MGA_SGN						    0x1c58
#define	MGA_SHIFT					    0x1c50
#define	MGA_SOFTRAP					    0x2c48
#define	MGA_SPECBSTART					    0x2c98
#define	MGA_SPECBXINC					    0x2c9c
#define	MGA_SPECBYINC					    0x2ca0
#define	MGA_SPECGSTART					    0x2c8c
#define	MGA_SPECGXINC					    0x2c90
#define	MGA_SPECGYINC					    0x2c94
#define	MGA_SPECRSTART					    0x2c80
#define	MGA_SPECRXINC					    0x2c84
#define	MGA_SPECRYINC					    0x2c88
#define	MGA_SRC0					    0x1c30
#define	MGA_SRC1					    0x1c34
#define	MGA_SRC2					    0x1c38
#define	MGA_SRC3					    0x1c3c
#define	MGA_SRCORG					    0x2cb4
#define	MGA_STATUS					    0x1e14
#define	MGA_TEST0					    0x1e48
#define	MGA_TEXBORDERCOL				    0x2c5c
#define	MGA_TEXCTL					    0x2c30
#define	MGA_TEXCTL2					    0x2c3c
#define	MGA_TEXFILTER					    0x2c58
#define	MGA_TEXHEIGHT					    0x2c2c
#define	MGA_TEXORG					    0x2c24
#define	MGA_TEXORG1					    0x2ca4
#define	MGA_TEXORG2					    0x2ca8
#define	MGA_TEXORG3					    0x2cac
#define	MGA_TEXORG4					    0x2cb0
#define	MGA_TEXTRANS					    0x2c34
#define	MGA_TEXTRANSHIGH				    0x2c38
#define	MGA_TEXWIDTH					    0x2c28
#define	MGA_TMR0					    0x2c00
#define	MGA_TMR1					    0x2c04
#define	MGA_TMR2					    0x2c08
#define	MGA_TMR3					    0x2c0c
#define	MGA_TMR4					    0x2c10
#define	MGA_TMR5					    0x2c14
#define	MGA_TMR6					    0x2c18
#define	MGA_TMR7					    0x2c1c
#define	MGA_TMR8					    0x2c20
#define	MGA_VBIADDR0					    0x3e08
#define	MGA_VBIADDR1					    0x3e0c
#define	MGA_VCOUNT					    0x1e20
#define	MGA_VICLEAR					    0x3e34
#define	MGA_VIEN					    0x3e38
#define	MGA_VINADDR0					    0x3e10
#define	MGA_VINADDR1					    0x3e14
#define	MGA_VINCTL					    0x3e1c
#define	MGA_VINCTL0					    0x3e00
#define	MGA_VINCTL1					    0x3e04
#define	MGA_VINNEXTWIN					    0x3e18
#define	MGA_VSTATUS					    0x3e30
#define	MGA_WCODEADDR					    0x1e6c
#define	MGA_WFLAG					    0x1dc4
#define	MGA_WFLAGNB					    0x1e64
#define	MGA_WGETMSB					    0x1dc8
#define	MGA_WIADDR					    0x1dc0
#define	MGA_WIADDRNB					    0x1e60
#define	MGA_WIMEMADDR					    0x1e68
#define	MGA_WIMEMDATA					    0x2000
#define	MGA_WMISC					    0x1e70
#define	MGA_WR						    0x2d00
#define	MGA_WVRTXSZ					    0x1dcc
#define	MGA_XDST					    0x1cb0
#define	MGA_XYEND					    0x1c44
#define	MGA_XYSTRT					    0x1c40
#define	MGA_YBOT					    0x1c9c
#define	MGA_YDST					    0x1c90
#define	MGA_YDSTLEN					    0x1c88
#define	MGA_YDSTORG					    0x1c94
#define	MGA_YTOP					    0x1c98
#define	MGA_ZORG					    0x1c0c

	/* MGA AGP PLL 0x1e4c */

#define	MGA_AGP_PLL_AGP2XPLLEN				0x00000001

	/* MGA Alpha Control 0x2c7c (wo) */

#define	MGA_ALPHACTRL_ALPHASEL_MASK			0x03000000
#define	MGA_ALPHACTRL_ALPHASEL_TEXTURE			0x00000000
#define	MGA_ALPHACTRL_ALPHASEL_DIFFUSED			0x01000000
#define	MGA_ALPHACTRL_ALPHASEL_MODULATED		0x02000000
#define	MGA_ALPHACTRL_ALPHASEL_TRANSPARENCY		0x03000000

#define	MGA_ALPHACTRL_ATREF_MASK			0x00ff0000
#define	MGA_ALPHACTRL_ATREF_SHIFT				16

#define	MGA_ALPHACTRL_ATMODE_MASK			0x0000e000
#define	MGA_ALPHACTRL_ATMODE_NOACMP			0x00000000
#define	MGA_ALPHACTRL_ATMODE_AE				0x00004000
#define	MGA_ALPHACTRL_ATMODE_ANE			0x00006000
#define	MGA_ALPHACTRL_ATMODE_ALT			0x00008000
#define	MGA_ALPHACTRL_ATMODE_ALTE			0x0000a000
#define	MGA_ALPHACTRL_ATMODE_AGT			0x0000c000
#define	MGA_ALPHACTRL_ATMODE_AGTE			0x0000e000

#define	MGA_ALPHACTRL_ATEN				0x00001000

#define	MGA_ALPHACTRL_ASTIPPLE				0x00000800

#define	MGA_ALPHACTRL_ALPHAMODE_MASK			0x00000300
#define	MGA_ALPHACTRL_ALPHAMODE_FCOL			0x00000000
#define	MGA_ALPHACTRL_ALPHAMODE_ALPHA_CHANNEL		0x00000100
#define	MGA_ALPHACTRL_ALPHAMODE_VIDEO_ALPHA		0x00000200

#define	MGA_ALPHACTRL_DSTBLENDF_MASK			0x000000f0
#define	MGA_ALPHACTRL_DSTBLENDF_ZERO			0x00000000
#define	MGA_ALPHACTRL_DSTBLENDF_ONE			0x00000010
#define	MGA_ALPHACTRL_DSTBLENDF_SRC_COLOR		0x00000020
#define	MGA_ALPHACTRL_DSTBLENDF_ONE_MINUS_SRC_COLOR	0x00000030
#define	MGA_ALPHACTRL_DSTBLENDF_SRC_ALPHA		0x00000040
#define	MGA_ALPHACTRL_DSTBLENDF_ONE_MINUS_SRC_ALPHA	0x00000050
#define	MGA_ALPHACTRL_DSTBLENDF_DST_ALPHA		0x00000060
#define	MGA_ALPHACTRL_DSTBLENDF_ONE_MINUS_DST_ALPHA	0x00000070

#define	MGA_ALPHACTRL_SRCBLENDF_MASK			0x0000000f
#define	MGA_ALPHACTRL_SRCBLENDF_ZERO			0x00000000
#define	MGA_ALPHACTRL_SRCBLENDF_ONE			0x00000001
#define	MGA_ALPHACTRL_SRCBLENDF_DST_COLOR		0x00000002
#define	MGA_ALPHACTRL_SRCBLENDF_ONE_MINUS_DST_COLOR	0x00000003
#define	MGA_ALPHACTRL_SRCBLENDF_SRC_ALPHA		0x00000004
#define	MGA_ALPHACTRL_SRCBLENDF_ONE_MINUS_SRC_ALPHA	0x00000005
#define	MGA_ALPHACTRL_SRCBLENDF_DST_ALPHA		0x00000006
#define	MGA_ALPHACTRL_SRCBLENDF_ONE_MINUS_DST_ALPHA	0x00000007
#define	MGA_ALPHACTRL_SRCBLENDF_SRC_ALPHA_SATURATE	0x00000008

	/* MGA Alpha Start 0x2c70 (wo) */

#define	MGA_ALPHASTART_MASK				0x00ffffff

	/* MGA Alpha Xinc 0x2c74 (wo) */

#define	MGA_ALPHAXINC_MASK				0x00ffffff

	/* MGA Alpha Yinc 0x2c78 (wo) */

#define	MGA_ALPHAYINC_MASK				0x00ffffff

	/* MGA Address 0 0x1c60 (wo), 0x1d60 (wo) */

#define	MGA_AR0_MASK					0x0003ffff

	/* MGA Address 1 0x1c64 (wo), 0x1d64 (wo) */

#define	MGA_AR1_MASK					0x00ffffff

	/* MGA Address 2 0x1c68 (wo), 0x1d68 (wo) */

#define	MGA_AR2_MASK					0x0003ffff

	/* MGA Address 3 0x1c6c (wo), 0x1d6c (wo) */

#define	MGA_AR3_MASK					0x00ffffff
#define	MGA_AR3_SPAGE_MASK				0x07000000
#define	MGA_AR3_SPAGE_SHIFT					24

	/* MGA Address 4 0x1c70 (wo), 0x1d70 (wo) */

#define	MGA_AR4_MASK					0x0003ffff

	/* MGA Address 5 0x1c74 (wo), 0x1d74 (wo) */

#define	MGA_AR5_MASK					0x0003ffff

	/* MGA Address 6 0x1c78 (wo), 0x1d78 (wo) */

#define	MGA_AR6_MASK					0x0003ffff

	/* MGA Background Color 0x1c20 (wo), 0x1d20 (wo) */

	/* MGA Backend Scaler Buffer A Field 1 Chroma Origin 0x3d10 (wo) */

	/* MGA Backend Scaler Buffer A Field 1 Origin 0x3d00 (wo) */

	/* MGA Backend Scaler Buffer A Field 2 Chroma Origin 0x3d14 (wo) */

	/* MGA Backend Scaler Buffer A Field 2 Origin 0x3d04 (wo) */

	/* MGA Backend Scaler Buffer B Field 1 Chroma Origin 0x3d18 (wo) */

	/* MGA Backend Scaler Buffer B Field 1 Origin 0x3d08 (wo) */

	/* MGA Backend Scaler Buffer B Field 2 Chroma Origin 0x3d1c (wo) */

	/* MGA Backend Scaler Buffer B Field 2 Origin 0x3d0c (wo) */

#define	MGA_BESCORG_MASK				0x00ffffff

#define	MGA_BESORG_MASK					0x00ffffff

	/* MGA Backend Scaler Control 0x3d20 */

#define	MGA_BESCTL_BESFSEL_MASK				0x06000000
#define	MGA_BESCTL_BESFSEL_BUF_A_FIELD_1		0x00000000
#define	MGA_BESCTL_BESFSEL_BUF_A_FIELD_2		0x02000000
#define	MGA_BESCTL_BESFSEL_BUF_B_FIELD_1		0x04000000
#define	MGA_BESCTL_BESFSEL_BUF_B_FIELD_2		0x06000000
#define	MGA_BESCTL_BESFSELM				0x01000000
#define	MGA_BESCTL_BESBLANK				0x00200000
#define	MGA_BESCTL_BESBWEN				0x00100000
#define	MGA_BESCTL_BESHMIR				0x00080000
#define	MGA_BESCTL_BESDITH				0x00040000
#define	MGA_BESCTL_BES420PL				0x00020000
#define	MGA_BESCTL_BESCUPS				0x00010000
#define	MGA_BESCTL_BESHFIXC				0x00001000
#define	MGA_BESCTL_BESVFEN				0x00000800
#define	MGA_BESCTL_BESHFEN				0x00000400
#define	MGA_BESCTL_BESV2SRCSTP				0x00000080
#define	MGA_BESCTL_BESV1SRCSTP				0x00000040
#define	MGA_BESCTL_BESEN				0x00000001

	/* MGA Backend Scaler Global Control 0x3dc0 */

#define	MGA_BESGLOBCTL_BESVCNT_MASK			0x0fff0000
#define	MGA_BESGLOBCTL_BESVCNT_SHIFT				16
#define	MGA_BESGLOBCTL_BESREGHUP			0x00000008
#define	MGA_BESGLOBCTL_BESCORDER			0x00000004
#define	MGA_BESGLOBCTL_BESHZOOMF			0x00000002
#define	MGA_BESGLOBCTL_BESHZOOM				0x00000001

	/* MGA Backend Scaler Horiz Coordinates 0x3d28 */

#define	MGA_BESHCOORD_BESLEFT_MASK			0x07ff0000
#define	MGA_BESHCOORD_BESLEFT_SHIFT				16
#define	MGA_BESHCOORD_BESRIGHT_MASK			0x000007ff

	/* MGA Backend Scaler Horiz Inv Scaling Factor 0x3d30 (wo) */

#define	MGA_BESHISCAL_MASK				0x001ffffc
#define	MGA_BESHISCAL_SHIFT					 2

	/* MGA Backend Scaler Horiz Source Ending 0x3d3c (wo) */

#define	MGA_BESHSRCEND_MASK				0x03fffffc
#define	MGA_BESHSRCEND_SHIFT					 2

	/* MGA Backend Scaler Horiz Source Last 0x3d50 (wo) */

#define	MGA_BESHSRCLST_MASK				0x03ff0000
#define	MGA_BESHSRCLST_SHIFT					16

	/* MGA Backend Scaler Horiz Source Start 0x3d38 (wo) */

#define	MGA_BESHSRCST_MASK				0x03fffffc
#define	MGA_BESHSRCST_SHIFT					 2

	/* MGA Backend Scaler Pitch 0x3d24 (wo) */

#define	MGA_BESPITCH_MASK				0x00000fff

	/* MGA Backend Scaler Status 0x3dc4 (ro) */

#define	MGA_BESSTAT_MASK				0x00000003
#define	MGA_BESSTAT_A1					0x00000000
#define	MGA_BESSTAT_A2					0x00000001
#define	MGA_BESSTAT_B1					0x00000002
#define	MGA_BESSTAT_B2					0x00000003

	/* MGA Backend Scaler Field 1 Vert Source Last Pos 0x3d54 (wo) */

#define	MGA_BESV1SRCLST_MASK				0x000003ff

	/* MGA Backend Scaler Field 2 Vert Source Last Pos 0x3d58 (wo) */

#define	MGA_BESV2SRCLST_MASK				0x000003ff

	/* MGA Backend Scaler Field 1 Vert Weight Start 0x3d48 (wo) */

#define	MGA_BESV1WGHT_BES1WGHTS				0x00010000
#define	MGA_BESV1WGHT_BESV1WGHT_MASK			0x0000fffc
#define	MGA_BESV1WGHT_BESV1WGTH_SHIFT				 2

	/* MGA Backend Scaler Field 2 Vert Weight Start 0x3d4c (wo) */

#define	MGA_BESV2WGHT_BES2WGHTS				0x00010000
#define	MGA_BESV2WGHT_BESV2WGHT_MASK			0x0000fffc
#define	MGA_BESV2WGHT_BESV2WGTH_SHIFT				 2

	/* MGA Backend Scaler Vertical Coordinates 0x3d2c (wo) */

#define	MGA_BESVCOORD_BESTOP_MASK			0x07ff0000
#define	MGA_BESVCOORD_BESTOP_SHIFT				16
#define	MGA_BESVCOORD_BESBOT_MASK			0x000007ff

	/* MGA Backend Scaler Vertical Inverse Scaling Factor 0x3d34 (wo) */

#define	MGA_BESVISCAL_MASK				0x001ffffc
#define	MGA_BESVISCAL_SHIFT					 2

	/* MGA Codec Buffer Start Address 0x3e44 (wo) */

#define	MGA_CODECADDR_CODECSTART_MASK			0x00fffffc
#define	MGA_CODECADDR_CODECSTART_SHIFT				 2
#define	MGA_CODECADDR_CODECBUFSIZE			0x00000001

	/* MGA Codec Control 0x3e40 (wo) */

#define	MGA_CODECCTL_CODECMISCCTL_MASK			0xff000000
#define	MGA_CODECCTL_CODECMISCCTL_SHIFT			24
#define	MGA_CODECCTL_CODECRWIDTH_MASK			0x00003000
#define	MGA_CODECCTL_CODECRWIDTH_SHIFT				12
#define	MGA_CODECCTL_CODECFIFOADDR_MASK			0x00000700
#define	MGA_CODECCTL_CODECFIFOADDR_SHIFT			 8
#define	MGA_CODECCTL_CODECTRANSEN			0x00000040
#define	MGA_CODECCTL_STOPCODEC				0x00000020
#define	MGA_CODECCTL_VMIMODE				0x00000010
#define	MGA_CODECCTL_CODECDATAIN			0x00000008
#define	MGA_CODECCTL_CMDEXECTRIG			0x00000004
#define	MGA_CODECCTL_CODECMODE				0x00000002
#define	MGA_CODECCTL_CODECEN				0x00000001

	/* MGA Codec Hard Pointer 0x3e4c (ro) */

#define	MGA_CODECHARDPTR_MASK				0x0000ffff

	/* MGA Codec Host Pointer 0x3e48 (wo) */

#define	MGA_CODECHOSTPTR_MASK				0x0000ffff

	/* MGA Codec Lcode Pointer 0x3e50 (ro) */

#define	MGA_CODECLCODE_MASK				0x0000ffff

	/* MGA Clipper X Boundary 0x1c80 (wo), 0x1d80 (wo) */

#define	MGA_CXBNDRY_CXRIGHT_MASK			0x0fff0000
#define	MGA_CXBNDRY_CXRIGHT_SHIFT				16
#define	MGA_CXBNDRY_CXLEFT_MASK				0x00000fff

	/* MGA Clipper X Minimum Boundary 0x1ca0 (wo), 0x1da0 (wo) */

#define	MGA_CXLEFT_MASK					0x00000fff

	/* MGA Clipper X Maximum Boundary 0x1ca4 (wo), 0x1da4 (wo) */

#define	MGA_CXRIGHT_MASK				0x00000fff

	/* MGA DMA Map 3 to 0 0x1e30 */

#define	MGA_DMAMAP30_MAP_REG3_MASK			0xff000000
#define	MGA_DMAMAP30_MAP_REG3_SHIFT				24
#define	MGA_DMAMAP30_MAP_REG2_MASK			0x00ff0000
#define	MGA_DMAMAP30_MAP_REG2_SHIFT				16
#define	MGA_DMAMAP30_MAP_REG1_MASK			0x0000ff00
#define	MGA_DMAMAP30_MAP_REG1_SHIFT				 8
#define	MGA_DMAMAP30_MAP_REG0_MASK			0x000000ff

	/* MGA DMA Map 7 to 4 0x1e34 */

#define	MGA_DMAMAP74_MAP_REG7_MASK			0xff000000
#define	MGA_DMAMAP74_MAP_REG7_SHIFT				24
#define	MGA_DMAMAP74_MAP_REG6_MASK			0x00ff0000
#define	MGA_DMAMAP74_MAP_REG6_SHIFT				16
#define	MGA_DMAMAP74_MAP_REG5_MASK			0x0000ff00
#define	MGA_DMAMAP74_MAP_REG5_SHIFT				 8
#define	MGA_DMAMAP74_MAP_REG4_MASK			0x000000ff

	/* MGA DMA Map B to 8 0x1e38 */

#define	MGA_DMAMAPB8_MAP_REGB_MASK			0xff000000
#define	MGA_DMAMAPB8_MAP_REGB_SHIFT				24
#define	MGA_DMAMAPB8_MAP_REGA_MASK			0x00ff0000
#define	MGA_DMAMAPB8_MAP_REGA_SHIFT				16
#define	MGA_DMAMAPB8_MAP_REG9_MASK			0x0000ff00
#define	MGA_DMAMAPB8_MAP_REG9_SHIFT				 8
#define	MGA_DMAMAPB8_MAP_REG8_MASK			0x000000ff

	/* MGA DMA Map F to C 0x1e3c */

#define	MGA_DMAMAPFC_MAP_REGF_MASK			0xff000000
#define	MGA_DMAMAPFC_MAP_REGF_SHIFT				24
#define	MGA_DMAMAPFC_MAP_REGE_MASK			0x00ff0000
#define	MGA_DMAMAPFC_MAP_REGE_SHIFT				16
#define	MGA_DMAMAPFC_MAP_REGD_MASK			0x0000ff00
#define	MGA_DMAMAPFC_MAP_REGD_SHIFT				 8
#define	MGA_DMAMAPFC_MAP_REGC_MASK			0x000000ff

	/* MGA DMA Padding 0x1c54 (wo), 0x1d54 (wo) */

	/* MGA Extended Data ALU 0 Low 0x2c50 (wo) */

	/* MGA Extended Data ALU 0 High 0x2c54 (wo) */

#define	MGA_DR0_Z32MSB_MASK				0x0000ffff

	/* MGA Extended Data ALU 2 Low 0x2c60 (wo) */

	/* MGA Extended Data ALU 2 High 0x2c64 (wo) */

#define	MGA_DR2_Z32MSB_MASK				0x0000ffff

	/* MGA Extended Data ALU 3 Low 0x2c68 (wo) */

	/* MGA Extended Data ALU 3 High 0x2c6c (wo) */

#define	MGA_DR3_Z32MSB_MASK				0x0000ffff

	/* MGA Data ALU 0 0x1cc0 (wo) */

	/* MGA Data ALU 2 0x1cc8 (wo) */

	/* MGA Data ALU 3 0x1ccc (wo) */

	/* MGA Data ALU 4 0x1cd0 (wo) */

#define	MGA_DR4_MASK					0x00ffffff

	/* MGA Data ALU 6 0x1cd8 (wo) */

#define	MGA_DR6_MASK					0x00ffffff

	/* MGA Data ALU 7 0x1cdc (wo) */

#define	MGA_DR7_MASK					0x00ffffff

	/* MGA Data ALU 8 0x1ce0 (wo) */

#define	MGA_DR8_MASK					0x00ffffff

	/* MGA Data ALU 10 0x1ce8 (wo) */

#define	MGA_DR10_MASK					0x00ffffff

	/* MGA Data ALU 11 0x1cec (wo) */

#define	MGA_DR11_MASK					0x00ffffff

	/* MGA Data ALU 12 0x1cf0 (wo) */

#define	MGA_DR12_MASK					0x00ffffff

	/* MGA Data ALU 14 0x1cf8 (wo) */

#define	MGA_DR14_MASK					0x00ffffff

	/* MGA Data ALU 15 0x1cfc (wo) */

#define	MGA_DR15_MASK					0x00ffffff

	/* MGA Destination Origin 0x2cb8 (wo) */

#define	MGA_DSTORG_MASK					0xfffffff8
#define	MGA_DSTORG_SHIFT					 3
#define	MGA_DSTORG_DSTACC				0x00000002
#define	MGA_DSTORG_DSTMAP				0x00000001

	/* MGA Drawing Register Indirect Write 0 0x1e80 (wo) */
	/* MGA Drawing Register Indirect Write 1 0x1e84 (wo) */
	/* MGA Drawing Register Indirect Write 2 0x1e88 (wo) */
	/* MGA Drawing Register Indirect Write 3 0x1e8c (wo) */
	/* MGA Drawing Register Indirect Write 4 0x1e90 (wo) */
	/* MGA Drawing Register Indirect Write 5 0x1e94 (wo) */
	/* MGA Drawing Register Indirect Write 6 0x1e98 (wo) */
	/* MGA Drawing Register Indirect Write 7 0x1e9c (wo) */
	/* MGA Drawing Register Indirect Write 8 0x1ea0 (wo) */
	/* MGA Drawing Register Indirect Write 9 0x1ea4 (wo) */
	/* MGA Drawing Register Indirect Write A 0x1ea8 (wo) */
	/* MGA Drawing Register Indirect Write B 0x1eac (wo) */
	/* MGA Drawing Register Indirect Write C 0x1eb0 (wo) */
	/* MGA Drawing Register Indirect Write D 0x1eb4 (wo) */
	/* MGA Drawing Register Indirect Write E 0x1eb8 (wo) */
	/* MGA Drawing Register Indirect Write F 0x1ebc (wo) */

	/* MGA Drawing Control 0x1c00 (wo), 0x1d00 (wo) */

#define	MGA_DWGCTL_CLIPDIS				0x80000000
#define	MGA_DWGCTL_TRANSC				0x40000000
#define	MGA_DWGCTL_PATTERN				0x20000000
#define	MGA_DWGCTL_BLTMOD_MASK				0x1e000000
#define	MGA_DWGCTL_BLTMOD_BMONOLEF			0x00000000
#define	MGA_DWGCTL_BLTMOD_BPLAN				0x02000000
#define	MGA_DWGCTL_BLTMOD_BFCOL				0x04000000
#define	MGA_DWGCTL_BLTMOD_BU32BGR			0x06000000
#define	MGA_DWGCTL_BLTMOD_BMONOWF			0x08000000
#define	MGA_DWGCTL_BLTMOD_BU32RGB			0x0e000000
#define	MGA_DWGCTL_BLTMOD_BU24BGR			0x16000000
#define	MGA_DWGCTL_BLTMOD_BU24RGB			0x1e000000
#define	MGA_DWGCTL_TRANS_MASK				0x00f00000
#define	MGA_DWGCTL_TRANS_SHIFT					20
#define	MGA_DWGCTL_BOP_MASK				0x000f0000
#define	MGA_DWGCTL_BOP_CLEAR				0x00000000
#define	MGA_DWGCTL_BOP_NOR				0x00010000
#define	MGA_DWGCTL_BOP_ANDINVERTED			0x00020000
#define	MGA_DWGCTL_BOP_COPYINVERTED			0x00030000
#define	MGA_DWGCTL_BOP_ANDREVERSE			0x00040000
#define	MGA_DWGCTL_BOP_INVERT				0x00050000
#define	MGA_DWGCTL_BOP_XOR				0x00060000
#define	MGA_DWGCTL_BOP_NAND				0x00070000
#define	MGA_DWGCTL_BOP_AND				0x00080000
#define	MGA_DWGCTL_BOP_EQUIV				0x00090000
#define	MGA_DWGCTL_BOP_NOOP				0x000a0000
#define	MGA_DWGCTL_BOP_ORINVERTED			0x000b0000
#define	MGA_DWGCTL_BOP_COPY				0x000c0000
#define	MGA_DWGCTL_BOP_ORREVERSE			0x000d0000
#define	MGA_DWGCTL_BOP_OR				0x000e0000
#define	MGA_DWGCTL_BOP_SET				0x000f0000
#define	MGA_DWGCTL_SHFTZERO				0x00004000
#define	MGA_DWGCTL_SGNZERO				0x00002000
#define	MGA_DWGCTL_ARZERO				0x00001000
#define	MGA_DWGCTL_SOLID				0x00000800
#define	MGA_DWGCTL_ZMODE_MASK				0x00000700
#define	MGA_DWGCTL_ZMODE_NOZCMP				0x00000000
#define	MGA_DWGCTL_ZMODE_ZE				0x00000200
#define	MGA_DWGCTL_ZMODE_ZNE				0x00000300
#define	MGA_DWGCTL_ZMODE_ZLT				0x00000400
#define	MGA_DWGCTL_ZMODE_ZLTE				0x00000500
#define	MGA_DWGCTL_ZMODE_ZGT				0x00000600
#define	MGA_DWGCTL_ZMODE_ZGTE				0x00000700
#define	MGA_DWGCTL_LINEAR				0x00000080
#define	MGA_DWGCTL_ATYPE_MASK				0x00000070
#define	MGA_DWGCTL_ATYPE_RPL				0x00000000
#define	MGA_DWGCTL_ATYPE_RSTR				0x00000010
#define	MGA_DWGCTL_ATYPE_ZI				0x00000030
#define	MGA_DWGCTL_ATYPE_BLK				0x00000040
#define	MGA_DWGCTL_ATYPE_I				0x00000070
#define	MGA_DWGCTL_OPCOD_MASK				0x0000000f
#define	MGA_DWGCTL_OPCOD_LINE_OPEN			0x00000000
#define	MGA_DWGCTL_OPCOD_AUTOLINE_OPEN			0x00000001
#define	MGA_DWGCTL_OPCOD_LINE_CLOSE			0x00000002
#define	MGA_DWGCTL_OPCOD_AUTOLINE_CLOSE			0x00000003
#define	MGA_DWGCTL_OPCOD_TRAP				0x00000004
#define	MGA_DWGCTL_OPCOD_TEXTURE_TRAP			0x00000006
#define	MGA_DWGCTL_OPCOD_BITBLT				0x00000008
#define	MGA_DWGCTL_OPCOD_ILOAD				0x00000009

	/* MGA Drawing Synchronization 0x2c4c */

#define	MGA_DWGSYNC_MASK				0xfffffffc

	/* MGA Foreground Color 0x1c24 (wo), 0x1d24 (wo) */

	/* MGA Fifo Status 0x1e10 (ro) */

#define	MGA_FIFOSTATUS_BEMPTY				0x00000200
#define	MGA_FIFOSTATUS_BFULL				0x00000100
#define	MGA_FIFOSTATUS_FIFOCOUNT_MASK			0x0000007f

	/* MGA Fog Color 0x1cf4 (wo) */

#define	MGA_FOGCOL_MASK					0x00ffffff

	/* MGA Fog Startr 0x1cc4 (wo) */

#define	MGA_FOGSTART_MASK				0x00ffffff

	/* MGA Fog X Increment 0x1cd4 (wo) */

#define	MGA_FOGXINC_MASK				0x00ffffff

	/* MGA Fog Y Increment 0x1ce4 (wo) */

#define	MGA_FOGYINC_MASK				0x00ffffff

	/* MGA Fog X Address Boundary 0x1c84 (wo), 0x1d84 (wo) */

#define	MGA_FXBNDRY_FXRIGHT_MASK			0xffff0000
#define	MGA_FXBNDRY_FXRIGHT_SHIFT				16
#define	MGA_FXBNDRY_FXLEFT_MASK				0x0000ffff

	/* MGA Fox X Address Left 0x1ca8 (wo), 0x1da8 (wo) */

#define	MGA_FXLEFT_MASK					0x0000ffff

	/* MGA Fox X Address Right 0x1cac (wo), 0x1dac (wo) */

#define	MGA_FXRIGHT_MASK				0x0000ffff

	/* MGA Interrupt Clear 0x1e18 (wo) */

#define	MGA_ICLEAR_WCICLR				0x00000100
#define	MGA_ICLEAR_WICLR				0x00000080
#define	MGA_ICLEAR_VLINEICLR				0x00000020
#define	MGA_ICLEAR_PICKICLR				0x00000004
#define	MGA_ICLEAR_SOFTRAPICLR				0x00000001

	/* MGA Interrupt Enable 0x1e1c */

#define	MGA_IEN_WCIEN					0x00000100
#define	MGA_IEN_WIEN					0x00000080
#define	MGA_IEN_EXTIEN					0x00000040
#define	MGA_IEN_VLINEIEN				0x00000020
#define	MGA_IEN_PICKIEN					0x00000004
#define	MGA_IEN_SOFTRAPIEN				0x00000001

	/* MGA Length 0x1c5c (wo), 0x1d5c (wo) */

#define	MGA_LENGTH_MASK					0x0000ffff

	/* MGA Memory Access 0x1c04 (wo), 0x1d04 (wo) */

#define	MGA_MACCESS_DIT555				0x80000000
#define	MGA_MACCESS_NODITHER				0x40000000
#define	MGA_MACCESS_TLUTLOAD				0x20000000
#define	MGA_MACCESS_FOGEN				0x04000000
#define	MGA_MACCESS_MEMRESET				0x00008000
#define	MGA_MACCESS_ZWIDTH				0x00000008
#define	MGA_MACCESS_PWIDTH_MASK				0x00000003
#define	MGA_MACCESS_PWIDTH_PW8				0x00000000
#define	MGA_MACCESS_PWIDTH_PW16				0x00000001
#define	MGA_MACCESS_PWIDTH_PW32				0x00000002
#define	MGA_MACCESS_PWIDTH_PW24				0x00000003

	/* MGA Memory Control Wait State 0x1c08 (wo) */

#define	MGA_MCTLWTST_BPLDELAY_MASK			0xe0000000
#define	MGA_MCTLWTST_BPLDELAY_SHIFT				29
#define	MGA_MCTLWTST_BPLDELAY_1_CYCLE			0x00000000
#define	MGA_MCTLWTST_BPLDELAY_2_CYCLES			0x20000000
#define	MGA_MCTLWTST_BPLDELAY_3_CYCLES			0x40000000
#define	MGA_MCTLWTST_BPLDELAY_4_CYCLES			0x60000000
#define	MGA_MCTLWTST_BPLDELAY_5_CYCLES			0x80000000
#define	MGA_MCTLWTST_BPLDELAY_6_CYCLES			0xa0000000
#define	MGA_MCTLWTST_BWCDELAY_MASK			0x0c000000
#define	MGA_MCTLWTST_BWCDELAY_SHIFT				26
#define	MGA_MCTLWTST_BWCDELAY_1_CYCLE			0x00000000
#define	MGA_MCTLWTST_BWCDELAY_2_CYCLES			0x04000000
#define	MGA_MCTLWTST_SMRDELAY_MASK			0x01800000
#define	MGA_MCTLWTST_SMRDELAY_SHIFT				23
#define	MGA_MCTLWTST_SMRDELAY_1_CYCLE			0x00000000
#define	MGA_MCTLWTST_SMRDELAY_2_CYCLES			0x00800000
#define	MGA_MCTLWTST_RDDELAY				0x00200000
#define	MGA_MCTLWTST_RDDELAY_SHIFT				21
#define	MGA_MCTLWTST_WRDELAY_MASK			0x000c0000
#define	MGA_MCTLWTST_WRDELAY_SHIFT				18
#define	MGA_MCTLWTST_WRDELAY_1_CYCLE			0x00000000
#define	MGA_MCTLWTST_WRDELAY_2_CYCLES			0x00040000
#define	MGA_MCTLWTST_RPDELAY_MASK			0x0000c000
#define	MGA_MCTLWTST_RPDELAY_SHIFT				14
#define	MGA_MCTLWTST_RPDELAY_2_CYCLES			0x00000000
#define	MGA_MCTLWTST_RPDELAY_3_CYCLES			0x00004000
#define	MGA_MCTLWTST_RPDELAY_4_CYCLES			0x00008000
#define	MGA_MCTLWTST_RPDELAY_5_CYCLES			0x0000c000
#define	MGA_MCTLWTST_RASMIN_MASK			0x00001c00
#define	MGA_MCTLWTST_RASMIN_SHIFT				10
#define	MGA_MCTLWTST_RASMIN_3_CYCLES			0x00000000
#define	MGA_MCTLWTST_RASMIN_4_CYCLES			0x00000400
#define	MGA_MCTLWTST_RASMIN_5_CYCLES			0x00000800
#define	MGA_MCTLWTST_RASMIN_6_CYCLES			0x00000c00
#define	MGA_MCTLWTST_RASMIN_7_CYCLES			0x00001000
#define	MGA_MCTLWTST_RASMIN_8_CYCLES			0x00001400
#define	MGA_MCTLWTST_RASMIN_9_CYCLES			0x00001800
#define	MGA_MCTLWTST_RASMIN_10_CYCLES			0x00001c00
#define	MGA_MCTLWTST_RCDDELAY_MASK			0x00000180
#define	MGA_MCTLWTST_RCDDELAY_SHIFT				 7
#define	MGA_MCTLWTST_RCDDELAY_2_CYCLES			0x00000000
#define	MGA_MCTLWTST_RCDDELAY_3_CYCLES			0x00000080
#define	MGA_MCTLWTST_RCDDELAY_4_CYCLES			0x00000100
#define	MGA_MCTLWTST_RRDDELAY_MASK			0x00000030
#define	MGA_MCTLWTST_RRDDELAY_SHIFT				 4
#define	MGA_MCTLWTST_RRDDELAY_1_CYCLE			0x00000000
#define	MGA_MCTLWTST_RRDDELAY_2_CYCLES			0x00000010
#define	MGA_MCTLWTST_RRDDELAY_3_CYCLES			0x00000020
#define	MGA_MCTLWTST_CASLNTCY_MASK			0x00000007
#define	MGA_MCTLWTST_CASLNTCY_2_CYCLES			0x00000000
#define	MGA_MCTLWTST_CASLNTCY_3_CYCLES			0x00000001
#define	MGA_MCTLWTST_CASLNTCY_4_CYCLES			0x00000002
#define	MGA_MCTLWTST_CASLNTCY_5_CYCLES			0x00000003

	/* MGA Memory Read Back 0x1e44 */

#define	MGA_MEMRDBK_MRSOPCOD_MASK			0x1e000000
#define	MGA_MEMRDBK_MRSOPCOD_SHIFT				25
#define	MGA_MEMRDBK_STRMFCTL_MASK			0x00c00000
#define	MGA_MEMRDBK_STRMFCTL_DONTBLOCK			0x00000000
#define	MGA_MEMRDBK_STRMFCTL_TWOCMDS			0x00400000
#define	MGA_MEMRDBK_STRMFCTL_ONECMD			0x00800000
#define	MGA_MEMRDBK_MCLKBRD1_MASK			0x000001e0
#define	MGA_MEMRDBK_MCLKBRD1_SHIFT				 5
#define	MGA_MEMRDBK_MCLKBRD0_MASK			0x0000000f

	/* MGA Operating Mode 0x1e54 */

#define	MGA_OPMODE_DIRDATASIZ_MASK			0x00030000
#define	MGA_OPMODE_DIRDATASIZ_8BPP			0x00000000
#define	MGA_OPMODE_DIRDATASIZ_16BPP			0x00010000
#define	MGA_OPMODE_DIRDATASIZ_32BPP			0x00020000
#define	MGA_OPMODE_DIRDATASIZ_SHIFT				16
#define	MGA_OPMODE_DMADATASIZ_MASK			0x00000300
#define	MGA_OPMODE_DMADATASIZ_8BPP			0x00000000
#define	MGA_OPMODE_DMADATASIZ_16BPP			0x00000100
#define	MGA_OPMODE_DMADATASIZ_32BPP			0x00000200
#define	MGA_OPMODE_DMADATASIZ_SHIFT				 8
#define	MGA_OPMODE_DMAMOD_MASK				0x0000000c
#define	MGA_OPMODE_DMAMOD_WRITE				0x00000000
#define	MGA_OPMODE_DMAMOD_BLIT				0x00000004
#define	MGA_OPMODE_DMAMOD_VECTOR			0x00000008
#define	MGA_OPMODE_DMAMOD_VERTEX			0x0000000c

	/* MGA Pattern 0 0x1c10 (wo), 0x1d10 (wo) */
	/* MGA Pattern 1 0x1c14 (wo), 0x1d14 (wo) */

#define	MGA_PITCH_YLIN					0x00008000
#define	MGA_PITCH_IY_MASK				0x00001fff

	/* MGA Plane Write Mask 0x1c1c (wo), 0x1d1c (wo) */

	/* MGA Primary DMA Current Address 0x1e58 */

#define	MGA_PRIMADDRESS_MASK				0xfffffffc
#define	MGA_PRIMADDRESS_PRIMOD_MASK			0x00000003
#define	MGA_PRIMADDRESS_PRIMOD_WRITE			0x00000000
#define	MGA_PRIMADDRESS_PRIMOD_BLIT			0x00000001
#define	MGA_PRIMADDRESS_PRIMOD_VECTOR			0x00000002
#define	MGA_PRIMADDRESS_PRIMOD_VERTEX			0x00000003

	/* MGA Primary DMA End Address 0x1e5c */

#define	MGA_PRIMEND_MASK				0xfffffffc
#define	MGA_PRIMEND_PAGPXFER				0x00000002
#define	MGA_PRIMEND_PRIMNOSTART				0x00000001

	/* MGA Primary List Status Fetch Pointer 0x1e50 */

#define	MGA_PRIMPTR_MASK				0xfffffff8
#define	MGA_PRIMPTR_PRIMPTREN1				0x00000002
#define	MGA_PRIMPTR_PRIMPTREN0				0x00000001

	/* MGA Reset 0x1e40 */

#define	MGA_RESET_DUMMY_RST_MASK			0xffff8000
#define	MGA_RESET_DUMMY_RST_SHIFT				15
#define	MGA_RESET_POWERMDIR				0x00000100
#define	MGA_RESET_SOFTEXTRST				0x00000002
#define	MGA_RESET_SOFTRESET				0x00000001

	/* MGA Secondary DMA Current Address 0x2c40 */

#define	MGA_SECADDRESS_MASK				0xfffffffc
#define	MGA_SECADDRESS_SECMOD_MASK			0x00000003
#define	MGA_SECADDRESS_SECMOD_WRITE			0x00000000
#define	MGA_SECADDRESS_SECMOD_BLIT			0x00000001
#define	MGA_SECADDRESS_SECMOD_VECTOR			0x00000002
#define	MGA_SECADDRESS_SECMOD_VERTEX			0x00000003

	/* MGA Secondary DMA End Address 0x2c44 */

#define	MGA_SECEND_MASK					0xfffffffc
#define	MGA_SECEND_SAGPXFER				0x00000002

	/* MGA Setup DMA Current Address 0x2cd0 */

#define	MGA_SETUPADDRESS_MASK				0xfffffffc
#define	MGA_SETUPADDRESS_SETUPMOD_MASK			0x00000003
#define	MGA_SETUPADDRESS_SETUPMOD_SETUP			0x00000000

	/* MGA Setup DMA End Address 0x2cd4 */

#define	MGA_SETUPEND_MASK				0xfffffffc
#define	MGA_SETUPEND_SETUPAGPXFER			0x00000002

	/* MGA Sign 0x1c58 (wo), 0x1d58 (wo) */

#define	MGA_SGN_ERRORINIT				0x80000000
#define	MGA_SGN_BRKLEFT					0x00000100
#define	MGA_SGN_SDXR					0x00000020
#define	MGA_SGN_SDY					0x00000004
#define	MGA_SGN_SDXL					0x00000002
#define	MGA_SGN_SDYDXL					0x00000001
#define	MGA_SGN_SCANLEFT				0x00000001

	/* MGA Shifter Control 0x1c50 (wo), 0x1d50 (wo) */

#define	MGA_SHIFT_STYLELEN_MASK				0x007f0000
#define	MGA_SHIFT_STYLELEN_SHIFT				16
#define	MGA_SHIFT_FUNOFF_MASK				0x003f0000
#define	MGA_SHIFT_FUNOFF_SHIFT					16
#define	MGA_SHIFT_FUNCNT_MASK				0x0000007f
#define	MGA_SHIFT_Y_OFF_MASK				0x00000070
#define	MGA_SHIFT_Y_OFF_SHIFT					 4
#define	MGA_SHIFT_X_OFF_MASK				0x0000000f

	/* MGA Soft Trap Handle 0x2c48 */

#define	MGA_SOFTRAP_MASK				0xfffffffc

	/* MGA Specular Lighting Blue Start 0x2c98 */
	/* MGA Specular Lighting Blue X Increment 0x2c9c */
	/* MGA Specular Lighting Blue Y Increment 0x2ca0 */
	/* MGA Specular Lighting Green Start 0x2c8c */
	/* MGA Specular Lighting Green X Increment 0x2c90 */
	/* MGA Specular Lighting Green Y Increment 0x2c94 */
	/* MGA Specular Lighting Red Start 0x2c80 */
	/* MGA Specular Lighting Red X Increment 0x2c84 */
	/* MGA Specular Lighting Red Y Increment 0x2c88 */

#define	MGA_SPECSTART_MASK				0x00ffffff

#define	MGA_SPECXINC_MASK				0x00ffffff

#define	MGA_SPECYINC_MASK				0x00ffffff

	/* MGA Source 0 0x1c30 (wo), 0x1d30 (wo) */
	/* MGA Source 1 0x1c34 (wo), 0x1d34 (wo)  */
	/* MGA Source 2 0x1c38 (wo), 0x1d38 (wo)  */
	/* MGA Source 3 0x1c3c (wo), 0x1d3c (wo)  */

	/* MGA Source Origin 0x2cb4 (wo) */

#define	MGA_SRCORG_MASK					0xfffffff8
#define	MGA_SRCORG_SRCACC				0x00000002
#define	MGA_SRCORG_SRCMAP				0x00000001

	/* MGA Status 0x1e14 */

#define	MGA_STATUS_SWFLAG_MASK				0xf0000000
#define	MGA_STATUS_SWFLAG_SHIFT					28
#define	MGA_STATUS_WBUSY				0x00040000
#define	MGA_STATUS_ENDPRDMASTS				0x00020000
#define	MGA_STATUS_DSTENGSTS				0x00010000
#define	MGA_STATUS_WCPEN				0x00000100
#define	MGA_STATUS_WPEN					0x00000080
#define	MGA_STATUS_EXTPEN				0x00000040
#define	MGA_STATUS_VLINEPEN				0x00000020
#define	MGA_STATUS_VSYNCPEN				0x00000010
#define	MGA_STATUS_VSYNCSTS				0x00000008
#define	MGA_STATUS_PICKPEN				0x00000004
#define	MGA_STATUS_SOFTRAPEN				0x00000001

	/* MGA Test 0 0x1e48 */

#define	MGA_TEST0_BIOSBOOT				0x80000000
#define	MGA_TEST0_RINGCNTCLKSL				0x40000000
#define	MGA_TEST0_RINGCNT_MASK				0x3ffc0000
#define	MGA_TEST0_RINGCNT_SHIFT					18
#define	MGA_TEST0_RINGCNTEN				0x00020000
#define	MGA_TEST0_TCLKSEL_MASK				0x0001c000
#define	MGA_TEST0_TCLKSEL_PIXPLL			0x00000000
#define	MGA_TEST0_TCLKSEL_PIXPLL_DIV4			0x00004000
#define	MGA_TEST0_TCLKSEL_SYSPLL			0x00008000
#define	MGA_TEST0_TCLKSEL_SYSPLL_DIV4			0x0000c000
#define	MGA_TEST0_TCLKSEL_AGPPLL			0x00010000
#define	MGA_TEST0_TCLKSEL_AGPPLL_DIV4			0x00014000
#define	MGA_TEST0_TMODE_MASK				0x00003800
#define	MGA_TEST0_TMODE_NORMAL				0x00000000
#define	MGA_TEST0_TMODE_OBSERVE				0x00000800
#define	MGA_TEST0_TMODE_SELFTEST			0x00001000
#define	MGA_TEST0_HITEN					0x00000400
#define	MGA_TEST0_APLLBYP				0x00000200
#define	MGA_TEST0_RINGEN				0x00000100
#define	MGA_TEST0_BESRAMTSTPASS				0x00000040
#define	MGA_TEST0_LUTTSTPASS				0x00000020
#define	MGA_TEST0_TLUTTSTPASS				0x00000010
#define	MGA_TEST0_TCACHETSTPASS				0x00000008
#define	MGA_TEST0_WRAMTSTPASS				0x00000004
#define	MGA_TEST0_RAMTSTDONE				0x00000002
#define	MGA_TEST0_RAMTSTEN				0x00000001

	/* MGA Texture Border Color 0x2c5c (wo) */

	/* MGA Texture Map Control 0x2c30 (wo) */

#define	MGA_TEXCTL_ITRANS				0x80000000
#define	MGA_TEXCTL_STRANS				0x40000000
#define	MGA_TEXCTL_TMODULATE				0x20000000
#define	MGA_TEXCTL_CLAMPU				0x10000000
#define	MGA_TEXCTL_CLAMPV				0x08000000
#define	MGA_TEXCTL_TAMASK				0x04000000
#define	MGA_TEXCTL_TAKEY				0x02000000
#define	MGA_TEXCTL_DECACLKEY				0x01000000
#define	MGA_TEXCTL_AZEROEXTEND				0x00800000
#define	MGA_TEXCTL_OWALPHA				0x00400000
#define	MGA_TEXCTL_TPITCHEXT_MASK			0x000ffe00
#define	MGA_TEXCTL_TPITCHEXT_SHIFT				 9
#define	MGA_TEXCTL_TPITCH_MASK				0x00070000
#define	MGA_TEXCTL_TPITCH_SHIFT					16
#define	MGA_TEXCTL_TPICHLIN				0x00000100
#define	MGA_TEXCTL_PALSEL_MASK				0x00000070
#define	MGA_TEXCTL_PALSEL_SHIFT					 4
#define	MGA_TEXCTL_TFORMAT_MASK				0x0000000f
#define	MGA_TEXCTL_TFORMAT_TW4				0x00000000
#define	MGA_TEXCTL_TFORMAT_TW8				0x00000001
#define	MGA_TEXCTL_TFORMAT_TW15				0x00000002
#define	MGA_TEXCTL_TFORMAT_TW16				0x00000003
#define	MGA_TEXCTL_TFORMAT_TW12				0x00000004
#define	MGA_TEXCTL_TFORMAT_TW32				0x00000006
#define	MGA_TEXCTL_TFORMAT_TW422			0x0000000a

	/* MGA Texture Map Control 2 0x2c3c (wo) */

#define	MGA_TEXCTL2_SPECEN				0x00000040
#define	MGA_TEXCTL2_BORDEREN				0x00000020
#define	MGA_TEXCTL2_CKSTRANSDIS				0x00000010
#define	MGA_TEXCTL2_DECALDIS				0x00000004
#define	MGA_TEXCTL2_IDECAL				0x00000002
#define	MGA_TEXCTL2_DECALBLEND				0x00000041

	/* MGA Texture Filtering 0x2c58 (wo) */

#define	MGA_TEXFILTER_MAPNB_MASK			0xe0000000
#define	MGA_TEXFILTER_MAPNB_SHIFT				29
#define	MGA_TEXFILTER_FTHRES_MASK			0x1fe00000
#define	MGA_TEXFILTER_FTHRES_SHIFT				21
#define	MGA_TEXFILTER_FILTERALPHA			0x00100000
#define	MGA_TEXFILTER_AVGSTRIDE				0x00080000
#define	MGA_TEXFILTER_MAGFILTER_MASK			0x000000f0
#define	MGA_TEXFILTER_MAGFILTER_NEAREST			0x00000000
#define	MGA_TEXFILTER_MAGFILTER_BILIN			0x00000020
#define	MGA_TEXFILTER_MAGFILTER_CNST			0x00000030
#define	MGA_TEXFILTER_MINFILTER_MASK			0x0000000f
#define	MGA_TEXFILTER_MINFILTER_NEAREST			0x00000000
#define	MGA_TEXFILTER_MINFILTER_BILIN			0x00000002
#define	MGA_TEXFILTER_MINFILTER_CNST			0x00000003
#define	MGA_TEXFILTER_MINFILTER_MM1S			0x00000008
#define	MGA_TEXFILTER_MINFILTER_MM2S			0x00000009
#define	MGA_TEXFILTER_MINFILTER_MM4S			0x0000000a
#define	MGA_TEXFILTER_MINFILTER_MM8S			0x0000000c

	/* MGA Texture Height 0x2c2c (wo) */

#define	MGA_TEXHEIGHT_THMASK_MASK			0x1ffc0000
#define	MGA_TEXHEIGHT_THMASK_SHIFT				18
#define	MGA_TEXHEIGHT_RFH_MASK				0x00007e00
#define	MGA_TEXHEIGHT_RFH_SHIFT					 9
#define	MGA_TEXHEIGHT_TH_MASK				0x0000003f

	/* MGA Texture Origin 0x2c24 (wo) */

	/* MGA Texture Origin 1 0x2ca4 (wo) */

	/* MGA Texture Origin 2 0x2ca8 (wo) */

	/* MGA Texture Origin 3 0x2cac (wo) */

	/* MGA Texture Origin 4 0x2cb0 (wo) */

	/* MGA Texture Transparency 0x2c34 (wo) */

#define	MGA_TEXORG_MASK					0xffffffe0
#define	MGA_TEXORG_SHIFT					 5
#define	MGA_TEXORG_TEXORGACC				0x00000002
#define	MGA_TEXORG_TEXORGMAP				0x00000001

#define	MGA_TEXTRANS_TKMASK_MASK			0xffff0000
#define	MGA_TEXTRANS_TKMASK_SHIFT				16
#define	MGA_TEXTRANS_TCKEY_MASK				0x0000ffff

	/* MGA Texture Transparency High 0x2c38 (wo) */

#define	MGA_TEXTRANSHIGH_TKMASKH_MASK			0xffff0000
#define	MGA_TEXTRANSHIGH_TKMASKH_SHIFT				16
#define	MGA_TEXTRANSHIGH_TCKEYH_MASK			0x0000ffff

	/* MGA Texture Width 0x2c28 (wo) */

#define	MGA_TEXWIDTH_TWMASK_MASK			0x1ffc0000
#define	MGA_TEXWIDTH_TWMASK_SHIFT				18
#define	MGA_TEXWIDTH_RFW_MASK				0x00007e00
#define	MGA_TEXWIDTH_RFW_SHIFT					 9
#define	MGA_TEXWIDTH_TW_MASK				0x0000003f

	/* MGA Texture Mapping ALU 0 0x2c00 (wo) */
	/* MGA Texture Mapping ALU 1 0x2c04 (wo) */
	/* MGA Texture Mapping ALU 2 0x2c08 (wo) */
	/* MGA Texture Mapping ALU 3 0x2c0c (wo) */
	/* MGA Texture Mapping ALU 4 0x2c10 (wo) */
	/* MGA Texture Mapping ALU 5 0x2c14 (wo) */
	/* MGA Texture Mapping ALU 6 0x2c18 (wo) */
	/* MGA Texture Mapping ALU 7 0x2c1c (wo) */
	/* MGA Texture Mapping ALU 8 0x2c20 (wo) */

	/* MGA VBI Address Window 0 0x3e08 (wo) */
	/* MGA VBI Address Window 1 0x3e0c (wo) */

#define	MGA_VBIADDR_MASK				0x00ffffff

	/* MGA Vertical Count 0x1e20 (ro) */

#define	MGA_VCOUNT_MASK					0x00000fff

	/* MGA Video Interrupt Clear 0x3e34 (wo) */

#define	MGA_VICLEAR_DCMPEOIICLR				0x00000008
#define	MGA_VICLEAR_BLVLIICLR				0x00000004
#define	MGA_VICLEAR_CMDCMPLICLR				0x00000002
#define	MGA_VICLEAR_VINVSYNCICLR			0x00000001

	/* MGA Video Interrupt Enable 0x3e38 */

#define	MGA_VIEN_DCMPEOIIEN				0x00000008
#define	MGA_VIEN_BLVLIEN				0x00000004
#define	MGA_VIEN_CMDCMPLIEN				0x00000002
#define	MGA_VIEN_VINVSYNCIEN				0x00000001

	/* MGA Video Input Address Window 0 0x3e10 (wo) */
	/* MGA Video Input Address Window 1 0x3e14 (wo) */

#define	MGA_VINADDR_MASK				0x00ffffff

	/* MGA Video Input Control 0x3e1c (wo) */

#define	MGA_VINCTL_RPVALIDEN				0x01000000
#define	MGA_VINCTL_VBITASKEN				0x00010000
#define	MGA_VINCTL_VBIF1CNT_MASK			0x0000f000
#define	MGA_VINCTL_VBIF1CNT_SHIFT				12
#define	MGA_VINCTL_VBIF0CNT_MASK			0x00000f00
#define	MGA_VINCTL_VBIF0CNT_SHIFT				 8
#define	MGA_VINCTL_VINEN				0x00000001

	/* MGA Video Input Control Window 0 0x3e00 (wo) */
	/* MGA Video Input Control Window 1 0x3e04 (wo) */

#define	MGA_VINCTL_VINPITCH_MASK			0x00000ff8
#define	MGA_VINCTL_VINPITCH_SHIFT				 3
#define	MGA_VINCTL_VBICAP_MASK				0x00000006
#define	MGA_VINCTL_VBICAP_NO				0x00000000
#define	MGA_VINCTL_VBICAP_RAW				0x00000002
#define	MGA_VINCTL_VBICAP_SLICED			0x00000006
#define	MGA_VINCTL_VBICAP				0x00000001

	/* MGA Video Input Next Window 0x3e18 (wo) */

#define	MGA_VINNEXTWIN_AUTOVINNEXTWIN			0x00000002
#define	MGA_VINNEXTWIN_VINNEXTWIN			0x00000001

	/* MGA Video Status 0x3e30 (ro) */

#define	MGA_VSTATUS_CODEC_STALLED			0x00001000
#define	MGA_VSTATUS_SLCVBICAPD				0x00000800
#define	MGA_VSTATUS_RAWVBICAPD				0x00000400
#define	MGA_VSTATUS_VINCAPD				0x00000200
#define	MGA_VSTATUS_VINFIELDDETD			0x00000100
#define	MGA_VSTATUS_DCMPEOIPEN				0x00000008
#define	MGA_VSTATUS_BLVLPEN				0x00000004
#define	MGA_VSTATUS_CMDCMPLPEN				0x00000002
#define	MGA_VSTATUS_VINVSYNCPEN				0x00000001

	/* MGA WARP Microcode Address 0x1e6c (ro) */

#define	MGA_WCODEADDR_MASK				0xffffff00

	/* MGA WARP Flags 0x1dc4 (wo), 0x1e64 (wo) */

#define	MGA_WFLAG_WPRGFLAG_MASK				0xffff0000
#define	MGA_WFLAG_WALUCFGFLAG_MASK			0x0000ff00
#define	MGA_WFLAG_WALUCFGFLAG_H				0x00004000
#define	MGA_WFLAG_WALUCFGFLAG_M				0x00002000
#define	MGA_WFLAG_WALUCFGFLAG_T				0x00001000
#define	MGA_WFLAG_WALUCFGFLAG_U				0x00000800
#define	MGA_WFLAG_WALUCFGFLAG_S				0x00000400
#define	MGA_WFLAG_WALUCFGFLAG_R				0x00000200
#define	MGA_WFLAG_WALUCFGFLAG_L				0x00000100
#define	MGA_WFLAG_WALUSTSFLAG_MASK			0x000000ff
#define	MGA_WFLAG_WALUSTSFLAG_H				0x00000040
#define	MGA_WFLAG_WALUSTSFLAG_M				0x00000020
#define	MGA_WFLAG_WALUSTSFLAG_T				0x00000010
#define	MGA_WFLAG_WALUSTSFLAG_U				0x00000008
#define	MGA_WFLAG_WALUSTSFLAG_S				0x00000004
#define	MGA_WFLAG_WALUSTSFLAG_R				0x00000002
#define	MGA_WFLAG_WALUSTSFLAG_L				0x00000001

	/* MGA WARP GetMSB Value */

#define	MGA_WGETMSB_WGETMSBMAX_MASK			0x00001f00
#define	MGA_WGETMSB_WGETMSBMAX_SHIFT				 8
#define	MGA_WGETMSB_WGETMSBMIN_MASK			0x0000001f

	/* MGA WARP Instruction Address 0x1dc0, 0x1e60 */

#define	MGA_WIADDR_MASK					0xfffffff8
#define	MGA_WIADDR_WAGP					0x00000004
#define	MGA_WIADDR_WMODE_MASK				0x00000003
#define	MGA_WIADDR_WMODE_SUSPEND			0x00000000
#define	MGA_WIADDR_WMODE_RESUME				0x00000001
#define	MGA_WIADDR_WMODE_JUMP				0x00000002
#define	MGA_WIADDR_WMODE_START				0x00000003

	/* MGA WARP Instruction Memory Address 0x1e68 (wo) */

#define	MGA_WIMEMADDR_MASK				0x000000ff

	/* MGA WARP Miscellaneous 0x1e70 */

#define	MGA_WMISC_WCACHEFLUSH				0x00000008
#define	MGA_WMISC_WMASTER				0x00000002
#define	MGA_WMISC_WUCODECACHE				0x00000001

	/* MGA WARP Vertex Size 0x1dcc (wo) */

#define	MGA_WVRTXSZ_MASK				0x0000003f

	/* MGA X Destination Address 0x1cb0 (wo), 0x1db0 (wo)  */

#define	MGA_XDST_MASK					0x0000ffff

	/* MGA XY End Address 0x1c44 (wo), 0x1d44 (wo)	*/

#define	MGA_XYEND_Y_END_MASK				0xffff0000
#define	MGA_XYEND_Y_END_SHIFT					16
#define	MGA_XYEND_X_END_MASK				0x0000ffff

	/* MGA XY Start Address 0x1c40 (wo), 0x1d40 (wo)  */

#define	MGA_XYSTRT_Y_END_MASK				0xffff0000
#define	MGA_XYSTRT_Y_END_SHIFT					16
#define	MGA_XYSTRT_X_END_MASK				0x0000ffff

	/* MGA Y Bottom Boundary 0x1c9c (wo), 0x1d9c (wo)  */

#define	MGA_YBOT_MASK					0x00ffffff

	/* MGA Y Destination 0x1c90 (wo), 0x1d90 (wo)  */

#define	MGA_YDST_SELLIN_MASK				0xe0000000
#define	MGA_YDST_SELLIN_SHIFT					29
#define	MGA_YDST_MASK					0x007fffff

	/* MGA Y Destination and Length 0x1c88 (wo), 0x1d88 (wo)  */

#define	MGA_YDSTLEN_YVAL_MASK				0xffff0000
#define	MGA_YDSTLEN_YVAL_SHIFT					16
#define	MGA_YDSTLEN_LENGTH_MASK				0x0000ffff

	/* MGA Y Destination Origin 0x1c94 (wo), 0x1d94 (wo)  */

#define	MGA_YDSTORG_MASK				0x00ffffff

	/* MGA Y Top Boundary 0x1c98 (wo), 0x1d98 (wo)	*/

#define	MGA_YTOP_MASK					0x00ffffff

	/* MGA Z-Depth Origin 0x1c0c (wo), 0x1d0c (wo)	*/

#define	MGA_ZORG_MASK					0xfffffffc
#define	MGA_ZORG_ZORGACC				0x00000002
#define	MGA_ZORG_ZORGMAP				0x00000001

	/* MGA DAC Cursor position 0x3c0c */

#define	MGA_CURPOS_CURPOSY_MASK				0x0fff0000
#define	MGA_CURPOS_CURPOSY_SHIFT				16
#define	MGA_CURPOS_CURPOSX_MASK				0x00000fff

	/* MGA DAC Palette Ram Data 0x3c01 */

	/* MGA DAC Palette Ram Read Address 0x3c03 */

	/* MGA DAC Palette Ram Write Address 0x3c00 */

	/* MGA DAC Pixel Read Mask 0x3c02 */

	/* MGA DAC Indexed Data 0x3c0a */

#define	MGA_XDATA_XCURADDL				      0x04
#define	MGA_XDATA_XCURADDH				      0x05
#define	MGA_XDATA_XCURCTRL				      0x06
#define	MGA_XDATA_XCURCOL0RED				      0x08
#define	MGA_XDATA_XCURCOL0GREEN				      0x09
#define	MGA_XDATA_XCURCOL0BLUE				      0x0a
#define	MGA_XDATA_XCURCOL1RED				      0x0c
#define	MGA_XDATA_XCURCOL1GREEN				      0x0d
#define	MGA_XDATA_XCURCOL1BLUE				      0x0e
#define	MGA_XDATA_XCURCOL2RED				      0x10
#define	MGA_XDATA_XCURCOL2GREEN				      0x11
#define	MGA_XDATA_XCURCOL2BLUE				      0x12
#define	MGA_XDATA_XVREFCTRL				      0x18
#define	MGA_XDATA_XMULCTRL				      0x19
#define	MGA_XDATA_XPIXCLKCTRL				      0x1a
#define	MGA_XDATA_XGENCTRL				      0x1d
#define	MGA_XDATA_XMISCCTRL				      0x1e
#define	MGA_XDATA_XGENIOCTRL				      0x2a
#define	MGA_XDATA_XGENIODATA				      0x2b
#define	MGA_XDATA_XSYSPLLM				      0x2c
#define	MGA_XDATA_XSYSPLLN				      0x2d
#define	MGA_XDATA_XSYSPLLP				      0x2e
#define	MGA_XDATA_XSYSPLLSTAT				      0x2f
#define	MGA_XDATA_XZOOMCTRL				      0x38
#define	MGA_XDATA_XSENSETEST				      0x3a
#define	MGA_XDATA_XCRCREML				      0x3c
#define	MGA_XDATA_XCRCREMH				      0x3d
#define	MGA_XDATA_XCRCBITSEL				      0x3e
#define	MGA_XDATA_XCOLMSK				      0x40
#define	MGA_XDATA_XCOLKEY				      0x42
#define	MGA_XDATA_XPIXPLLAM				      0x44
#define	MGA_XDATA_XPIXPLLAN				      0x45
#define	MGA_XDATA_XPIXPLLAP				      0x46
#define	MGA_XDATA_XPIXPLLBM				      0x48
#define	MGA_XDATA_XPIXPLLBN				      0x49
#define	MGA_XDATA_XPIXPLLBP				      0x4a
#define	MGA_XDATA_XPIXPLLCM				      0x4c
#define	MGA_XDATA_XPIXPLLCN				      0x4d
#define	MGA_XDATA_XPIXPLLCP				      0x4e
#define	MGA_XDATA_XPIXPLLSTAT				      0x4f
#define	MGA_XDATA_XKEYOPMODE				      0x51
#define	MGA_XDATA_XCOLMSK0RED				      0x52
#define	MGA_XDATA_XCOLMSK0GREEN				      0x53
#define	MGA_XDATA_XCOLMSK0BLUE				      0x54
#define	MGA_XDATA_XCOLKEY0RED				      0x55
#define	MGA_XDATA_XCOLKEY0GREEN				      0x56
#define	MGA_XDATA_XCOLKEY0BLUE				      0x57
#define	MGA_XDATA_XCURCOL3RED				      0x60
#define	MGA_XDATA_XCURCOL3GREEN				      0x61
#define	MGA_XDATA_XCURCOL3BLUE				      0x62
#define	MGA_XDATA_XCURCOL4RED				      0x63
#define	MGA_XDATA_XCURCOL4GREEN				      0x64
#define	MGA_XDATA_XCURCOL4BLUE				      0x65
#define	MGA_XDATA_XCURCOL5RED				      0x66
#define	MGA_XDATA_XCURCOL5GREEN				      0x67
#define	MGA_XDATA_XCURCOL5BLUE				      0x68
#define	MGA_XDATA_XCURCOL6RED				      0x69
#define	MGA_XDATA_XCURCOL6GREEN				      0x6a
#define	MGA_XDATA_XCURCOL6BLUE				      0x6b
#define	MGA_XDATA_XCURCOL7RED				      0x6c
#define	MGA_XDATA_XCURCOL7GREEN				      0x6d
#define	MGA_XDATA_XCURCOL7BLUE				      0x6e
#define	MGA_XDATA_XCURCOL8RED				      0x6f
#define	MGA_XDATA_XCURCOL8GREEN				      0x70
#define	MGA_XDATA_XCURCOL8BLUE				      0x71
#define	MGA_XDATA_XCURCOL9RED				      0x72
#define	MGA_XDATA_XCURCOL9GREEN				      0x73
#define	MGA_XDATA_XCURCOL9BLUE				      0x74
#define	MGA_XDATA_XCURCOL10RED				      0x75
#define	MGA_XDATA_XCURCOL10GREEN			      0x76
#define	MGA_XDATA_XCURCOL10BLUE				      0x77
#define	MGA_XDATA_XCURCOL11RED				      0x78
#define	MGA_XDATA_XCURCOL11GREEN			      0x79
#define	MGA_XDATA_XCURCOL11BLUE				      0x7a
#define	MGA_XDATA_XCURCOL12RED				      0x7b
#define	MGA_XDATA_XCURCOL12GREEN			      0x7c
#define	MGA_XDATA_XCURCOL12BLUE				      0x7d
#define	MGA_XDATA_XCURCOL13RED				      0x7e
#define	MGA_XDATA_XCURCOL13GREEN			      0x7f
#define	MGA_XDATA_XCURCOL13BLUE				      0x80
#define	MGA_XDATA_XCURCOL14RED				      0x81
#define	MGA_XDATA_XCURCOL14GREEN			      0x82
#define	MGA_XDATA_XCURCOL14BLUE				      0x83
#define	MGA_XDATA_XCURCOL15RED				      0x84
#define	MGA_XDATA_XCURCOL15GREEN			      0x85
#define	MGA_XDATA_XCURCOL15BLUE				      0x86

	/* MGA I/O Registers */

#define	MGAIO_ATTR_DATA					    0x03c1
#define	MGAIO_ATTR_INDEX				    0x03c0
#define	MGAIO_MONO_CRTC_DATA				    0x03b5
#define	MGAIO_MONO_CRTC_INDEX				    0x03b4
#define	MGAIO_COLOR_CRTC_DATA				    0x03d5
#define	MGAIO_COLOR_CRTC_INDEX				    0x03d4
#define	MGAIO_CRTCEXT_DATA				    0x03df
#define	MGAIO_CRTCEXT_INDEX				    0x03de
#define	MGAIO_DAC_STATUS				    0x03c7
#define	MGAIO_FEAT_READ					    0x03ca
#define	MGAIO_MONO_FEAT_WRITE				    0x03ba
#define	MGAIO_COLOR_FEAT_WRITE				    0x03da
#define	MGAIO_GCTL_DATA					    0x03cf
#define	MGAIO_GCTL_INDEX				    0x03ce
#define	MGAIO_INPUT_STATUS0				    0x03c2
#define	MGAIO_MONO_INPUT_STATUS1			    0x03ba
#define	MGAIO_COLOR_INPUT_STATUS1			    0x03da
#define	MGAIO_MISCOUT_READ				    0x03cc
#define	MGAIO_MISCOUT_WRITE				    0x03c2
#define	MGAIO_PALETTE_DATA				    0x03c9
#define	MGAIO_PALETTE_READ_ADDRESS			    0x03c7
#define	MGAIO_PALETTE_WRITE_ADDRESS			    0x03c8
#define	MGAIO_PIXEL_READ_MASK				    0x03c6
#define	MGAIO_SEQ_DATA					    0x03c5
#define	MGAIO_SEQ_INDEX					    0x03c4

#define	MGA_ATTR_INDEX					    0x1fc0
#define	MGA_ATTR_DATA					    0x1fc1
#define	MGA_CACHEFLUSH					    0x1fff
#define	MGA_CRTC_INDEX					    0x1fd4
#define	MGA_CRTC_DATA					    0x1fd5
#define	MGA_CRTCEXT_DATA				    0x1fdf
#define	MGA_CRTCEXT_INDEX				    0x1fde
#define	MGA_CURPOSXL					    0x3c0c
#define	MGA_CURPOSXH					    0x3c0d
#define	MGA_CURPOSYL					    0x3c0e
#define	MGA_CURPOSYH					    0x3c0f
#define	MGA_DACSTATUS					    0x1fc7
#define	MGA_FEAT_READ					    0x1fca
#define	MGA_FEAT_WRITE					    0x1fda
#define	MGA_GCTL_DATA					    0x1fcf
#define	MGA_GCTL_INDEX					    0x1fce
#define	MGA_INSTS0					    0x1fc2
#define	MGA_INSTS1					    0x1fda
#define	MGA_MISCOUT_READ				    0x1fcc
#define	MGA_MISCOUT_WRITE				    0x1fc2
#define	MGA_SEQ_DATA					    0x1fc5
#define	MGA_SEQ_INDEX					    0x1fc4
#define	MGA_PALDATA					    0x3c01
#define	MGA_PALRDADD					    0x3c03
#define	MGA_PALWTADD					    0x3c00
#define	MGA_PIXRDMSK					    0x3c02
#define	MGA_X_DATAREG					    0x3c0a

	/* MGA I/O Attribute Controller Index 0x03c0 */

#define	MGA_ATTR_PAS					      0x20
#define	MGA_ATTR_INDEX_MASK				      0x1f
#define	MGA_ATTR_INDEX_COUNT				      0x20
#define	MGA_ATTR_PALETTE_ENTRY_0			      0x00
#define	MGA_ATTR_PALETTE_ENTRY_1			      0x01
#define	MGA_ATTR_PALETTE_ENTRY_2			      0x02
#define	MGA_ATTR_PALETTE_ENTRY_3			      0x03
#define	MGA_ATTR_PALETTE_ENTRY_4			      0x04
#define	MGA_ATTR_PALETTE_ENTRY_5			      0x05
#define	MGA_ATTR_PALETTE_ENTRY_6			      0x06
#define	MGA_ATTR_PALETTE_ENTRY_7			      0x07
#define	MGA_ATTR_PALETTE_ENTRY_8			      0x08
#define	MGA_ATTR_PALETTE_ENTRY_9			      0x09
#define	MGA_ATTR_PALETTE_ENTRY_A			      0x0a
#define	MGA_ATTR_PALETTE_ENTRY_B			      0x0b
#define	MGA_ATTR_PALETTE_ENTRY_C			      0x0c
#define	MGA_ATTR_PALETTE_ENTRY_D			      0x0d
#define	MGA_ATTR_PALETTE_ENTRY_E			      0x0e
#define	MGA_ATTR_PALETTE_ENTRY_F			      0x0f
#define	MGA_ATTR_MODE_CONTROL				      0x10
#define	MGA_ATTR_OVERSCAN_COLOR				      0x11
#define	MGA_ATTR_COLOR_PLANE_ENABLE			      0x12
#define	MGA_ATTR_HORIZ_PEL_PANNING			      0x13
#define	MGA_ATTR_COLOR_SELECT				      0x14

	/* MGA I/O ATTR00 - ATTR0F Attribute Palette */

#define	MGA_ATTR_PALET_DATA_MASK			      0x3f

	/* MGA I/O ATTR10 Attribute Mode Control */

#define	MGA_ATTR_MODE_CTRL_P5P4				      0x80
#define	MGA_ATTR_MODE_CTRL_PELWIDTH			      0x40
#define	MGA_ATTR_MODE_CTRL_PANCOMP			      0x20
#define	MGA_ATTR_MODE_CTRL_BLINKEN			      0x08
#define	MGA_ATTR_MODE_CTRL_LGREN			      0x04
#define	MGA_ATTR_MODE_CTRL_MONO				      0x02
#define	MGA_ATTR_MODE_CTRL_ATCGRMODE			      0x01

	/* MGA I/O ATTR11 Overscan Color */

	/* MGA I/O ATTR12 Color Plane Enable */

#define	MGA_ATTR_COLOR_PLANE_VIDSTMX			      0x30
#define	MGA_ATTR_COLOR_PLANE_VIDSTMX_SHIFT			 4
#define	MGA_ATTR_COLOR_PLANE_COLPLEN			      0x0f

	/* MGA I/O ATTR13 Horizontal Pel Panning */

#define	MGA_ATTR_HORIZ_PEL_HPELCNT			      0x0f

	/* MGA I/O ATTR14 Color Select */

#define	MGA_ATTR_COLOR_SELECT_COLSEL76			      0x0c
#define	MGA_ATTR_COLOR_SELECT_COLSEL76_SHIFT			 2
#define	MGA_ATTR_COLOR_SELECT_COLSEL54			      0x03

	/* MGA I/O CRTC Registers 0x03[bd]4 */

#define	MGA_CRTC_INDEX_MASK				      0x3f
#define	MGA_CRTC_INDEX_COUNT				      0x40
#define	MGA_CRTC_HORIZ_TOTAL				      0x00
#define	MGA_CRTC_HORIZ_DISPLAY_END			      0x01
#define	MGA_CRTC_START_HORIZ_BLANK			      0x02
#define	MGA_CRTC_END_HORIZ_BLANK			      0x03
#define	MGA_CRTC_START_HORIZ_RETRACE			      0x04
#define	MGA_CRTC_END_HORIZ_RETRACE			      0x05
#define	MGA_CRTC_VERT_TOTAL				      0x06
#define	MGA_CRTC_OVERFLOW				      0x07
#define	MGA_CRTC_PRESET_ROW_SCAN			      0x08
#define	MGA_CRTC_MAXIMUM_SCAN_LINE			      0x09
#define	MGA_CRTC_CURSOR_START				      0x0a
#define	MGA_CRTC_CURSOR_END				      0x0b
#define	MGA_CRTC_START_ADDR_HIGH			      0x0c
#define	MGA_CRTC_START_ADDR_LOW				      0x0d
#define	MGA_CRTC_CURSOR_LOC_HIGH			      0x0e
#define	MGA_CRTC_CURSOR_LOC_LOW				      0x0f
#define	MGA_CRTC_VERT_RETRACE_START			      0x10
#define	MGA_CRTC_VERT_RETRACE_END			      0x11
#define	MGA_CRTC_VERT_DISPLAY_END			      0x12
#define	MGA_CRTC_OFFSET					      0x13
#define	MGA_CRTC_UNDERLINE_LOCATION			      0x14
#define	MGA_CRTC_START_VERT_BLANK			      0x15
#define	MGA_CRTC_END_VERT_BLANK				      0x16
#define	MGA_CRTC_MODE_CONTROL				      0x17
#define	MGA_CRTC_LINE_COMPARE				      0x18
#define	MGA_CRTC_CPU_READ_LATCH				      0x22
#define	MGA_CRTC_ATTR_SELECT				      0x24
#define	MGA_CRTC_ATTR_ADDRESS				      0x26

	/* MGA I/O CRTC0 Horizontal Total */

	/* MGA I/O CRTC1 Horizontal Display Enable End */

	/* MGA I/O CRTC2 Start Horizontal Blanking */

	/* MGA I/O CRTC3 End Horizontal Blanking */

#define	MGA_CRTC_END_HBLANK_COMPAT_READ			      0x80
#define	MGA_CRTC_END_HBLANK_HDISPSKEW			      0x60
#define	MGA_CRTC_END_HBLANK_HDISKSKEW_SHIFT			 6
#define	MGA_CRTC_END_HBLANK_HBLKEND			      0x1f

	/* MGA I/I CRTC4 Start Horizontal Retrace Pulse */

	/* MGA I/O CRTC5 End Horizontal Retrace */

#define	MGA_CRTC_END_HRETRACE_HBLKEND5			      0x80
#define	MGA_CRTC_END_HRETRACE_HBLKEND5_SHIFT			 7
#define	MGA_CRTC_END_HRETRACE_HSYNCDEL			      0x60
#define	MGA_CRTC_END_HRETRACE_HSYNCDEL_SHIFT			 4
#define	MGA_CRTC_END_HRETRACE_HSYNCEND			      0x1f

	/* MGA I/O CRTC6 Vertical Total */

	/* MGA I/O CRTC7 Overflow */

#define	MGA_CRTC_OVERFLOW_VSYNCSTR9			      0x80
#define	MGA_CRTC_OVERFLOW_VSYNCSTR9_SHIFT			 7
#define	MGA_CRTC_OVERFLOW_VDISPEND9			      0x40
#define	MGA_CRTC_OVERFLOW_VDISPEND9_SHIFT			 6
#define	MGA_CRTC_OVERFLOW_VTOTAL9			      0x20
#define	MGA_CRTC_OVERFLOW_VTOTAL9_SHIFT				 5
#define	MGA_CRTC_OVERFLOW_LINECOMP8			      0x10
#define	MGA_CRTC_OVERFLOW_LINECOMP8_SHIFT			 4
#define	MGA_CRTC_OVERFLOW_VBLKSTR8			      0x08
#define	MGA_CRTC_OVERFLOW_VBLKSTR8_SHIFT			 3
#define	MGA_CRTC_OVERFLOW_VSYNCSTR8			      0x04
#define	MGA_CRTC_OVERFLOW_VSYNCSTR8_SHIFT			 2
#define	MGA_CRTC_OVERFLOW_VDISPEND8			      0x02
#define	MGA_CRTC_OVERFLOW_VDISPEND8_SHIFT			 1
#define	MGA_CRTC_OVERFLOW_VTOTAL8			      0x01

	/* MGA I/O CRTC8 Preset Row Scan */

#define	MGA_CRTC_PRESET_ROW_BYTEPAN			      0x60
#define	MGA_CRTC_PRESET_ROW_BYTEPAN_SHIFT			 5
#define	MGA_CRTC_PRESET_ROW_PROWSCAN			      0x1f

	/* MGA I/O CRTC9 Maximum Scan Line */

#define	MGA_CRTC_MAX_SCAN_LINE_CONV2T4			      0x80
#define	MGA_CRTC_MAX_SCAN_LINE_LINECOMP9		      0x40
#define	MGA_CRTC_MAX_SCAN_LINE_LINECOMP9_SHIFT			 6
#define	MGA_CRTC_MAX_SCAN_LINE_VBLKSTR9			      0x20
#define	MGA_CRTC_MAX_SCAN_LINE_VBLKSTR9_SHIFT			 5
#define	MGA_CRTC_MAX_SCAN_LINE_MAXSCAN			      0x1f

	/* MGA I/O CRTCA Cursor Start */

#define	MGA_CRTC_CURSOR_START_CUROFF			      0x20
#define	MGA_CRTC_CURSOR_START_CURROWSTR			      0x1f

	/* MGA I/O CRTCB Cursor End */

#define	MGA_CRTC_CURSOR_END_CURSKEW			      0x60
#define	MGA_CRTC_CURSOR_END_CURSKEW_SHIFT			 5
#define	MGA_CRTC_CURSOR_END_CURROWEND			      0x1f

	/* MGA I/O CRTCC Start Address High */

	/* MGA I/O CRTCD Start Address Low */

	/* MGA I/O CRTCE Cursor Location High */

	/* MGA I/O CRTCF Cursor Location Low */

	/* MGA I/O CRTC10 Vertical Retrace Start */

	/* MGA I/O CRTC11 Vertical Retrace End */

#define	MGA_CRTC_VRETRACE_END_CRTCPROTECT		      0x80
#define	MGA_CRTC_VRETRACE_END_SEL5RFS			      0x40
#define	MGA_CRTC_VRETRACE_END_VINTEN			      0x20
#define	MGA_CRTC_VRETRACE_END_VINTCLR			      0x10
#define	MGA_CRTC_VRETRACE_END_VSYNCEND			      0x0f

	/* MGA I/O CRTC12 Vertical Display Enable End */

	/* MGA I/O CRTC13 Offset */

	/* MGA I/O CRTC14 Underline Location */

#define	MGA_CRTC_UNDER_LOC_DWORD			      0x40
#define	MGA_CRTC_UNDER_LOC_COUNT4			      0x20
#define	MGA_CRTC_UNDER_LOC_UNDROW			      0x1f

	/* MGA I/O CRTC15 Start Vertical Blank */

	/* MGA I/O CRTC16 End Vertical Blank */

	/* MGA I/O CRTC17 CRTC Mode Control */

#define	MGA_CRTC_MODE_CTRL_CRTCRSTN			      0x80
#define	MGA_CRTC_MODE_CTRL_WBMODE			      0x40
#define	MGA_CRTC_MODE_CTRL_ADDWRAP			      0x20
#define	MGA_CRTC_MODE_CTRL_COUNT2			      0x08
#define	MGA_CRTC_MODE_CTRL_HSYNCSEL			      0x04
#define	MGA_CRTC_MODE_CTRL_SELROWCAN			      0x02
#define	MGA_CRTC_MODE_CTRL_CMS				      0x01

	/* MGA I/O CRTC18 Line Compare */

	/* MGA I/O CRTC22 Cpu Read Latch */

	/* MGA I/O CRTC24 Attributes Address/Data Select */

#define	MGA_CRTC_ATTR_SELECT_ATTRADSEL			      0x80

	/* MGA I/O CRTC26 Attributes Address */

#define	MGA_CRTC_ATTR_ADDR_PAS				      0x20
#define	MGA_CRTC_ATTR_ADDR_ATTRX			      0x1f

	/* MGA I/O CRTCEXT Registers 0x03de */

#define	MGA_CRTCEXT_INDEX_MASK				      0x07
#define	MGA_CRTCEXT_INDEX_COUNT				      0x08
#define	MGA_CRTCEXT_ADDR_GEN_EXT			      0x00
#define	MGA_CRTCEXT_HOR_COUNT_EXT			      0x01
#define	MGA_CRTCEXT_VERT_COUNT_EXT			      0x02
#define	MGA_CRTCEXT_MISC				      0x03
#define	MGA_CRTCEXT_MEM_PAGE				      0x04
#define	MGA_CRTCEXT_HOR_VIDEO_HALF			      0x05
#define	MGA_CRTCEXT_PRIORITY_REQ			      0x06
#define	MGA_CRTCEXT_REQ_CONTROL				      0x07

	/* MGA I/O CRTCEXT0 Address Generator Extensions */

#define	MGA_CRTCEXT_ADDR_GEN_INTERLACE			      0x80
#define	MGA_CRTCEXT_ADDR_GEN_STARTADD20			      0x40
#define	MGA_CRTCEXT_ADDR_GEN_STARTADD20_SHIFT			 6
#define	MGA_CRTCEXT_ADDR_GEN_OFFSET9			      0x20
#define	MGA_CRTCEXT_ADDR_GEN_OFFSET8			      0x10
#define	MGA_CRTCEXT_ADDR_GEN_OFFSET8_9			      0x30
#define	MGA_CRTCEXT_ADDR_GEN_OFFSET8_9_SHIFT			 4
#define	MGA_CRTCEXT_ADDR_GEN_STARTADD19			      0x08
#define	MGA_CRTCEXT_ADDR_GEN_STARTADD18			      0x04
#define	MGA_CRTCEXT_ADDR_GEN_STARTADD17			      0x02
#define	MGA_CRTCEXT_ADDR_GEN_STARTADD16			      0x01
#define	MGA_CRTCEXT_ADDR_GEN_STARTADD16_19		      0x0f

	/* MGA I/O CRTCEXT1 Horizontal Counter Extensions */

#define	MGA_CRTCEXT_HCOUNT_VRSTEN			      0x80
#define	MGA_CRTCEXT_HCOUNT_HBLKEND6			      0x40
#define	MGA_CRTCEXT_HCOUNT_HBLKEND6_SHIFT			 6
#define	MGA_CRTCEXT_HCOUNT_VSYNCOFF			      0x20
#define	MGA_CRTCEXT_HCOUNT_HSYNCOFF			      0x10
#define	MGA_CRTCEXT_HCOUNT_HRSTEN			      0x08
#define	MGA_CRTCEXT_HCOUNT_HSYNCSTR8			      0x04
#define	MGA_CRTCEXT_HCOUNT_HSYNCSTR8_SHIFT			 2
#define	MGA_CRTCEXT_HCOUNT_HBLKSTR8			      0x02
#define	MGA_CRTCEXT_HCOUNT_HBLKSTR8_SHIFT			 1
#define	MGA_CRTCEXT_HCOUNT_HTOTAL8			      0x01

	/* MGA I/O CRTCEXT2 Vertical Counter Extensions */

#define	MGA_CRTCEXT_VCOUNT_LINECOMP10			      0x80
#define	MGA_CRTCEXT_VCOUNT_LINECOMP10_SHIFT			 7
#define	MGA_CRTCEXT_VCOUNT_VSYNCSTR11			      0x40
#define	MGA_CRTCEXT_VCOUNT_VSYNCSTR10			      0x20
#define	MGA_CRTCEXT_VCOUNT_VSYNCSTR10_11		      0x60
#define	MGA_CRTCEXT_VCOUNT_VSYNCSTR10_11_SHIFT			 5
#define	MGA_CRTCEXT_VCOUNT_VBLKSTR11			      0x10
#define	MGA_CRTCEXT_VCOUNT_VBLKSTR10			      0x08
#define	MGA_CRTCEXT_VCOUNT_VBLKSTR10_11			      0x18
#define	MGA_CRTCEXT_VCOUNT_VBLKSTR10_11_SHIFT			 3
#define	MGA_CRTCEXT_VCOUNT_VDISPEND10			      0x04
#define	MGA_CRTCEXT_VCOUNT_VDISPEND10_SHIFT			 2
#define	MGA_CRTCEXT_VCOUNT_VTOTAL11			      0x02
#define	MGA_CRTCEXT_VCOUNT_VTOTAL10			      0x01
#define	MGA_CRTCEXT_VCOUNT_VTOTAL10_11			      0x03

	/* MGA I/O CRTCEXT3 Miscellaneous */

#define	MGA_CRTCEXT_MISC_MGAMODE			      0x80
#define	MGA_CRTCEXT_MISC_CSYNCEN			      0x40
#define	MGA_CRTCEXT_MISC_SLOW256			      0x20
#define	MGA_CRTCEXT_MISC_SCALE_MASK			      0x07
#define	MGA_CRTCEXT_MISC_SCALE_1			      0x00
#define	MGA_CRTCEXT_MISC_SCALE_2			      0x01
#define	MGA_CRTCEXT_MISC_SCALE_3			      0x02
#define	MGA_CRTCEXT_MISC_SCALE_4			      0x03
#define	MGA_CRTCEXT_MISC_SCALE_6			      0x05
#define	MGA_CRTCEXT_MISC_SCALE_8			      0x07

	/* MGA I/O CRTCEXT4 Memory Page */

	/* MGA I/O CRTCEXT5 Horizontal Video Half Count */

	/* MGA I/O CRTCEXT6 Priority Request Control */

#define	MGA_CRTCEXT_PRI_REQ_MAXHIPRI			      0x70
#define	MGA_CRTCEXT_PRI_REQ_MAXHIPRI_SHIFT			 4
#define	MGA_CRTCEXT_PRI_REQ_MAXHIPRI_OFFSET			 1
#define	MGA_CRTCEXT_PRI_REQ_HIPRILVL			      0x07
#define	MGA_CRTCEXT_PRI_REQ_HIPRILVL_OFFSET			 1

	/* MGA I/O CRTCEXT7 Request Control */

#define	MGA_CRTCEXT_REQ_CTRL_MTXECOGENSTS1		      0x80
#define	MGA_CRTCEXT_REQ_CTRL_MTXECOGENSTS2		      0x40
#define	MGA_CRTCEXT_REQ_CTRL_CRTCBLK0			      0x01

	/* MGA I/O DAC Status 0x03c7 */

#define	MGA_DACSTAT_DSTS_MASK				      0x03
#define	MGA_DACSTAT_DSTS_WRITE				      0x00
#define	MGA_DACSTAT_DSTS_READ				      0x03

	/* MGA I/O Feature Control 0x03ca (read), 0x03[bd]a (write) */

#define	MGA_FEATCONT_FEATCB1				      0x02
#define	MGA_FEATCONT_FEATCB0				      0x01

	/* MGA I/O Graphics Controller 0x03ce */

#define	MGA_GCTL_INDEX_MASK				      0x0f
#define	MGA_GCTL_INDEX_COUNT				      0x10
#define	MGA_GCTL_SET_RESET				      0x00
#define	MGA_GCTL_ENABLE_SET_RESET			      0x01
#define	MGA_GCTL_COLOR_COMPARE				      0x02
#define	MGA_GCTL_DATA_ROTATE				      0x03
#define	MGA_GCTL_READ_MAP_SELECT			      0x04
#define	MGA_GCTL_GRAPHIC_MODE				      0x05
#define	MGA_GCTL_MISCELLANEOUS				      0x06
#define	MGA_GCTL_COLOR_DONT_CARE			      0x07
#define	MGA_GCTL_BIT_MASK				      0x08

	/* MGA I/O GCTL0 Graphics Controller Set/Reset */

#define	MGA_GCTL_SET_RESET_SETRST			      0x0f

	/* MGA I/O GCTL1 Graphics Controller Enable Set/Reset */

#define	MGA_GCTL_ENABLE_SET_RESET_SETRSTEN		      0x0f

	/* MGA I/O GCTL2 Color Compare */

#define	MGA_GCTL_COLOR_COMPARE_REFCOL			      0x0f

	/* MGA I/O GCTL3 Data Rotate */

#define	MGA_GCTL_DATAROT_FUNSEL_MASK			      0x18
#define	MGA_GCTL_DATAROT_FUNSEL_SOURCE			      0x00
#define	MGA_GCTL_DATAROT_FUNSEL_AND			      0x08
#define	MGA_GCTL_DATAROT_FUNSEL_OR			      0x10
#define	MGA_GCTL_DATAROT_FUNSEL_XOR			      0x18
#define	MGA_GCTL_DATAROT_ROT				      0x07

	/* MGA I/O GCTL4 Read Map Select */

#define	MGA_GCTL_READMAP_RDMAPSL			      0x03

	/* MGA I/O GCTL5 Graphics Mode */

#define	MGA_GCTL_GRMODE_MODE256				      0x40
#define	MGA_GCTL_GRMODE_SRINTMD				      0x20
#define	MGA_GCTL_GRMODE_GCODDEVMD			      0x10
#define	MGA_GCTL_GRMODE_RDMODE				      0x08
#define	MGA_GCTL_GRMODE_WRMODE_MASK			      0x03
#define	MGA_GCTL_GRMODE_WRMODE_ROTATED			      0x00
#define	MGA_GCTL_GRMODE_WRMODE_DIRECT			      0x01
#define	MGA_GCTL_GRMODE_WRMODE_REPLICATED		      0x02
#define	MGA_GCTL_GRMODE_WRMODE_EXPANDED			      0x03

	/* MGA I/O GCTRL6 Miscellaneous */

#define	MGA_GCTL_MISC_MEMMAPSL_MASK			      0x0c
#define	MGA_GCTL_MISC_MEMMAPSL_A0000_BF000		      0x00
#define	MGA_GCTL_MISC_MEMMAPSL_A0000_AF000		      0x04
#define	MGA_GCTL_MISC_MEMMAPSL_B0000_B7000		      0x08
#define	MGA_GCTL_MISC_MEMMAPSL_B8000_BF000		      0x0c
#define	MGA_GCTL_MISC_CHAIN				      0x02
#define	MGA_GCTL_MISC_GCGRMODE				      0x01

	/* MGA I/O GCTRL7 Color Don't Care */

#define	MGA_GCTL_COLDC_COLCOMPEN			      0x0f

	/* MGA I/O GCRTL8 Bit Mask */

	/* MGA I/O Input Status 0 0x03c2 (Read) */

#define	MGA_INPSTAT0_CRTCINTCRT				      0x80
#define	MGA_INPSTAT0_FEATIN0_1				      0x60
#define	MGA_INPSTAT0_FEATIN1				      0x40
#define	MGA_INPSTAT0_FEATIN0				      0x20
#define	MGA_INPSTAT0_SWITCHSNS				      0x10

	/* MGA I/O Input Status 1 0x03[bd]a */

#define	MGA_INPSTAT1_DIAG_MASK				      0x30
#define	MGA_INPSTAT1_VRETRACE				      0x08
#define	MGA_INPSTAT1_HRETRACE				      0x01

	/* MGA I/O Miscellaneous Output 0x03c2 (Write), 0x03cc (Read) */

#define	MGA_MISCOUT_VSYNCPOL				      0x80
#define	MGA_MISCOUT_HSYNCPOL				      0x40
#define	MGA_MISCOUT_HPGODDEV				      0x20
#define	MGA_MISCOUT_CLKSEL_MASK				      0x0c
#define	MGA_MISCOUT_CLKSEL_25MHZ			      0x00
#define	MGA_MISCOUT_CLKSEL_28MHZ			      0x04
#define	MGA_MISCOUT_CLKSEL_MGAPIXEL0			      0x08
#define	MGA_MISCOUT_CLKSEL_MGAPIXEL1			      0x0c
#define	MGA_MISCOUT_RAMMAPEN				      0x02
#define	MGA_MISCOUT_IOADDSEL				      0x01

	/* MGA I/O Sequencer Registers 0x03c4 */

#define	MGA_SEQ_INDEX_MASK				      0x07
#define	MGA_SEQ_INDEX_COUNT				      0x08
#define	MGA_SEQ_RESET					      0x00
#define	MGA_SEQ_CLOCKING_MODE				      0x01
#define	MGA_SEQ_MAP_MASK				      0x02
#define	MGA_SEQ_CHARACTER_MAP_SELECT			      0x03
#define	MGA_SEQ_MEMORY_MODE				      0x04

	/* MGA I/O SEQ0 Reset */

#define	MGA_SEQ_RESET_SYNCRST				      0x02
#define	MGA_SEQ_RESET_ASYNCRST				      0x01

	/* MGA I/O SEQ1 Clocking Mode */

#define	MGA_SEQ_CLOCK_MODE_SCROFF			      0x20
#define	MGA_SEQ_CLOCK_MODE_SHIFTFOUR			      0x10
#define	MGA_SEQ_CLOCK_MODE_DOTCLKRT			      0x08
#define	MGA_SEQ_CLOCK_MODE_SHFTLDRT			      0x04
#define	MGA_SEQ_CLOCK_MODE_DOTMODE			      0x01

	/* MGA I/O SEQ2 Map Mask */

#define	MGA_SEQ_MAP_MASK_PLWREN				      0x0f

	/* MGA I/O SEQ3 Character Map Select */

#define	MGA_SEQ_CHARMAP_MAPASEL2			      0x20
#define	MGA_SEQ_CHARMAP_MAPASEL2_SHIFT				 5
#define	MGA_SEQ_CHARMAP_MAPBSEL2			      0x10
#define	MGA_SEQ_CHARMAP_MAPBSEL2_SHIFT				 4
#define	MGA_SEQ_CHARMAP_MAPASEL0_1			      0x0c
#define	MGA_SEQ_CHARMAP_MAPASEL0_1_SHIFT			 2
#define	MGA_SEQ_CHARMAP_MAPBSEL0_1			      0x03

	/* MGA I/O SEQ4 Memory Mode */

#define	MGA_SEQ_MEMMODE_CHAIN4				      0x08
#define	MGA_SEQ_MEMMODE_SEQODDEVMD			      0x04
#define	MGA_SEQ_MEMMODE_MEMSZ256			      0x02

	/* MGA DAC Color Key 0x42 */

	/* MGA DAC Color Key 0 r/g/b 0x55, 0x56, 0x57 */

	/* MGA DAC Color Key Mask 0x40 */

	/* MGA DAC Color Mask 0 r/g/b 0x52, 0x53, 0x54 */

	/* MGA DAC CRC Bit Select 0x3e */

#define	MGA_XCRCBITSEL_CRCSEL_MASK			      0x1f
#define	MGA_XCRCBITSEL_BLUE_BASE			      0x00
#define	MGA_XCRCBITSEL_GREEN_BASE			      0x08
#define	MGA_XCRCBITSEL_RED_BASE				      0x10

	/* MGA DAC CRC Remainder High 0x3d */

	/* MGA DAC CRC Remainder Low 0x3c */

	/* MGA DAC Cursor Base Address High 0x05 */

#define	MGA_XCURADDH_MASK				      0x3f

	/* MGA DAC Cursor Base Address Low 0x04 */

#define	MGA_XCURADDR_SHIFT					10

	/* MGA DAC Cursor Color 0 r/g/b 0x08, 0x09, 0x0a */
	/* MGA DAC Cursor Color 1 r/g/b 0x0c, 0x0d, 0x0e */
	/* MGA DAC Cursor Color 2 r/g/b 0x10, 0x11, 0x12 */
	/* MGA DAC Cursor Color 3 r/g/b 0x60, 0x61, 0x62 */
	/* MGA DAC Cursor Color 4 r/g/b 0x63, 0x64, 0x65 */
	/* MGA DAC Cursor Color 5 r/g/b 0x66, 0x67, 0x68 */
	/* MGA DAC Cursor Color 6 r/g/b 0x69, 0x6a, 0x6b */
	/* MGA DAC Cursor Color 7 r/g/b 0x6c, 0x6d, 0x6e */
	/* MGA DAC Cursor Color 8 r/g/b 0x6f, 0x70, 0x71 */
	/* MGA DAC Cursor Color 9 r/g/b 0x72, 0x73, 0x74 */
	/* MGA DAC Cursor Color 10 r/g/b 0x75, 0x76, 0x77 */
	/* MGA DAC Cursor Color 11 r/g/b 0x78, 0x79, 0x7a */
	/* MGA DAC Cursor Color 12 r/g/b 0x7b, 0x7c, 0x7d */
	/* MGA DAC Cursor Color 13 r/g/b 0x7e, 0x7f, 0x80 */
	/* MGA DAC Cursor Color 14 r/g/b 0x81, 0x82, 0x83 */
	/* MGA DAC Cursor Color 15 r/g/b 0x84, 0x85, 0x86 */

	/* MGA DAC Cursor Control 0x06 */

#define	MGA_XCURCTRL_CURMODE_MASK			      0x07
#define	MGA_XCURCTRL_CURMODE_DISABLED			      0x00
#define	MGA_XCURCTRL_CURMODE_THREE_COLOR		      0x01
#define	MGA_XCURCTRL_CURMODE_XGA			      0x02
#define	MGA_XCURCTRL_CURMODE_XWINDOWS			      0x03
#define	MGA_XCURCTRL_CURMODE_PALETTIZED			      0x04

	/* MGA DAC General Control 0x1d */

#define	MGA_XGENCTRL_IOGSYNCDIS				      0x20
#define	MGA_XGENCTRL_PEDON				      0x10
#define	MGA_XGENCTRL_ALPHAEN				      0x02

	/* MGA DAC General Purpose I/O Control 0x2a */

#define	MGA_XGENIOCTRL_MISCOE_MASK			      0x70
#define	MGA_XGENIOCTRL_MISCOE_SHIFT				 4
#define	MGA_XGENIOCTRL_DDCOE_MASK			      0x0f

	/* MGA DAC General Purpose I/O Data 0x2b */

#define	MGA_XGENIODATA_MISCDATA_MASK			      0x70
#define	MGA_XGENIODATA_MISCDATA_SHIFT				 4
#define	MGA_XGENIODATA_DDCDATA_MASK			      0x0f

	/* MGA DAC Keying Operating Mode 0x51 */

#define	MGA_XKEYOPMODE_COLKEYEN0			      0x01

	/* MGA DAC Miscellaneous Control 0x1e */

#define	MGA_XMISCCTRL_VDOUTSEL_MASK			      0x60
#define	MGA_XMISCCTRL_VDOUTSEL_PIXEL			      0x00
#define	MGA_XMISCCTRL_VDOUTSEL_BYTE			      0x40
#define	MGA_XMISCCTRL_RAMCS				      0x10
#define	MGA_XMISCCTRL_VGA8DAC				      0x08
#define	MGA_XMISCCTRL_MFCSEL_MASK			      0x06
#define	MGA_XMISCCTRL_MFCSEL_MAFC			      0x02
#define	MGA_XMISCCTRL_MFCSEL_PANEL_LINK			      0x04
#define	MGA_XMISCCTRL_MFCSEL_DISABLE			      0x06
#define	MGA_XMISCCTRL_DACPDN				      0x01

	/* MGA DAC Multiplex Control 0x19 */

#define	MGA_XMULCTRL_DEPTH_MASK				      0x07
#define	MGA_XMULCTRL_DEPTH_8BPP				      0x00
#define	MGA_XMULCTRL_DEPTH_15BPP_1BPP_OVERLAY		      0x01
#define	MGA_XMULCTRL_DEPTH_16BPP			      0x02
#define	MGA_XMULCTRL_DEPTH_24BPP			      0x03
#define	MGA_XMULCTRL_DEPTH_32BPP_8BPP_OVERLAY		      0x04
#define	MGA_XMULCTRL_DEPTH_32BPP_8BPP_UNUSED		      0x07

	/* MGA DAC Pixel Clock Control 0x1a */

#define	MGA_XPIXCLKCTRL_VGAPLLAUTOKILLDJ		      0x80
#define	MGA_XPIXCLKCTRL_PIX_STBY			      0x08
#define	MGA_XPIXCLKCTRL_PIXCLKDIS			      0x04
#define	MGA_XPIXCLKCTRL_PIXCLKSL_MASK			      0x03
#define	MGA_XPIXCLKCTRL_PIXCLKSL_PCI			      0x00
#define	MGA_XPIXCLKCTRL_PIXCLKSL_PIXEL			      0x01
#define	MGA_XPIXCLKCTRL_PIXCLKSL_EXTERNAL		      0x02

	/* MGA DAC Pixel PLL M Value 0x44, 0x48, 0x4c */

#define	MGA_XPIXPLLM_MASK				      0x1f
#define	MGA_XPIXPLLM_MIN					 1
#define	MGA_XPIXPLLM_MAX					31

	/* MGA Dac Pixel PLL N Value 0x45, 0x49, 0x4d */

#define	MGA_XPIXPLLN_MIN_G200					 1
#define	MGA_XPIXPLLN_MAX_G200				       127
#define	MGA_XPIXPLLN_MIN_G200E					16
#define	MGA_XPIXPLLN_MAX_G200E				       255

	/* MGA DAC Pixel PLL P Value 0x46, 0x4a, 0x4e */

#define	MGA_XPIXPLLP_PIXPLLP_MASK			      0x07
#define	MGA_XPIXPLLP_PIXPLLP_DIV1			      0x00
#define	MGA_XPIXPLLP_PIXPLLP_DIV2			      0x01
#define	MGA_XPIXPLLP_PIXPLLP_DIV4			      0x03
#define	MGA_XPIXPLLP_PIXPLLP_DIV8			      0x07
#define	MGA_XPIXPLLP_PIXPLLS_MASK			      0x18
#define	MGA_XPIXPLLP_PIXPLLS_50MHZ_100MHZ		      0x00
#define	MGA_XPIXPLLP_PIXPLLS_100MHZ_140MHZ		      0x08
#define	MGA_XPIXPLLP_PIXPLLS_140MHZ_180MHZ		      0x10
#define	MGA_XPIXPLLP_PIXPLLS_180MHZ_250MHZ		      0x18
#define	MGA_XPIXPLLP_MIN_VCO				  50000000
#define	MGA_XPIXPLLP_MIN_VCO_G200E			   1000000
#define	MGA_XPIXPLLP_S0_MIN_VCO				  50000000
#define	MGA_XPIXPLLP_S0_MAX_VCO				 100000000
#define	MGA_XPIXPLLP_S1_MIN_VCO				 100000000
#define	MGA_XPIXPLLP_S1_MAX_VCO				 140000000
#define	MGA_XPIXPLLP_S2_MIN_VCO				 140000000
#define	MGA_XPIXPLLP_S2_MAX_VCO				 180000000
#define	MGA_XPIXPLLP_S3_MIN_VCO				 180000000
#define	MGA_XPIXPLLP_S3_MAX_VCO				 250000000
#define	MGA_XPIXPLLP_MAX_VCO				 250000000
#define	MGA_XPIXPLLPA_REFCLK				  25172000
#define	MGA_XPIXPLLPB_REFCLK				  28361000
#define	MGA_XPIXPLLPC_REFCLK_G200			  14318000
#define	MGA_XPIXPLLPC_REFCLK_G200E			  25000000

	/* MGA DAC Pixel PLL Status 0x4f (ro) */

#define	MGA_XPIXPLLSTAT_PIXLOCK				      0x40

	/* MGA DAC Sense Test 0x3a */

#define	MGA_XSENSETEST_SENSEPDN				      0x80
#define	MGA_XSENSETEST_RCOMP				      0x04
#define	MGA_XSENSETEST_GCOMP				      0x02
#define	MGA_XSENSETEST_BCOMP				      0x01

	/* MGA DAC SYSPLL M Value 0x2c */

#define	MGA_XSYSPLLM_MASK				      0x1f
#define	MGA_XSYSPLLM_MIN					 1
#define	MGA_XSYSPLLM_MAX					31

	/* MGA DAC SYSPLL N Value 0x2d */

#define	MGA_XSYSPLLN_MIN_G200					 1
#define	MGA_XSYSPLLN_MAX_G200				       127
#define	MGA_XSYSPLLN_MIN_G200E					16
#define	MGA_XSYSPLLN_MAX_G200E				       255

	/* MGA DAC SYSPLL P Value 0x2e */

#define	MGA_XSYSPLLP_SYSPLLS_MASK			      0x18
#define	MGA_XSYSPLLP_SYSPLLS_50MHZ_100MHZ		      0x00
#define	MGA_XSYSPLLP_SYSPLLS_100MHZ_140MHZ		      0x08
#define	MGA_XSYSPLLP_SYSPLLS_140MHZ_180MHZ		      0x10
#define	MGA_XSYSPLLP_SYSPLLS_180MHZ_250MHZ		      0x18
#define	MGA_XSYSPLLP_SYSPLLP_MASK			      0x07
#define	MGA_XSYSPLLP_SYSPLLP_DIV1			      0x00
#define	MGA_XSYSPLLP_SYSPLLP_DIV2			      0x01
#define	MGA_XSYSPLLP_SYSPLLP_DIV4			      0x03
#define	MGA_XSYSPLLP_SYSPLLP_DIV8			      0x07
#define	MGA_XSYSPLLP_MIN_VCO				     50000
#define	MGA_XSYSPLLP_MIN_VCO_G200E			      1000
#define	MGA_XSYSPLLP_S0_MIN_VCO				  50000000
#define	MGA_XSYSPLLP_S0_MAX_VCO				 100000000
#define	MGA_XSYSPLLP_S1_MIN_VCO				 100000000
#define	MGA_XSYSPLLP_S1_MAX_VCO				 140000000
#define	MGA_XSYSPLLP_S2_MIN_VCO				 140000000
#define	MGA_XSYSPLLP_S2_MAX_VCO				 180000000
#define	MGA_XSYSPLLP_S3_MIN_VCO				 180000000
#define	MGA_XSYSPLLP_S3_MAX_VCO				 250000000
#define	MGA_XSYSPLLP_MAX_VCO				 250000000
#define	MGA_XSYSPLLP_REFCLK_G200			  14318000
#define	MGA_XSYSPLLP_REFCLK_G200E			  14318000

	/* MGA DAC SYSPLL Status 0x2f (ro) */

#define	MGA_XSYSPLLSTAT_SYSLOCK				      0x40

	/* MGA DAC Voltage Reference Control 0x18 */

#define	MGA_XVREFCTRL_DACBGEN				      0x20
#define	MGA_XVREFCTRL_DACBGPDN				      0x10
#define	MGA_XVREFCTRL_PIXPLLBGEN			      0x08
#define	MGA_XVREFCTRL_PIXPLLBGPDN			      0x04
#define	MGA_XVREFCTRL_SYSPLLBGEN			      0x02
#define	MGA_XVREFCTRL_SYSPLLBGPDN			      0x01

	/* MGA Dac Zoom Control 0x38 */

#define	MGA_XZOOMCTRL_HZOOM_MASK			      0x03
#define	MGA_XZOOMCTRL_HZOOM_1X				      0x00
#define	MGA_XZOOMCTRL_HZOOM_2X				      0x01
#define	MGA_XZOOMCTRL_HZOOM_4X				      0x03

	/* MGA Indexes */

#define	MGAINDEX_DWGCTL					      0x00
#define	MGAINDEX_MACCESS				      0x01
#define	MGAINDEX_MCTLWTST				      0x02
#define	MGAINDEX_ZORG					      0x03
#define	MGAINDEX_PAT0					      0x04
#define	MGAINDEX_PAT1					      0x05
#define	MGAINDEX_PLNWT					      0x07
#define	MGAINDEX_BCOL					      0x08
#define	MGAINDEX_FCOL					      0x09
#define	MGAINDEX_SRC0					      0x0c
#define	MGAINDEX_SRC1					      0x0d
#define	MGAINDEX_SRC2					      0x0e
#define	MGAINDEX_SRC3					      0x0f
#define	MGAINDEX_XYSTRT					      0x10
#define	MGAINDEX_XYEND					      0x11
#define	MGAINDEX_SHIFT					      0x14
#define	MGAINDEX_DMAPAD					      0x15
#define	MGAINDEX_SGN					      0x16
#define	MGAINDEX_LEN					      0x17
#define	MGAINDEX_AR0					      0x18
#define	MGAINDEX_AR1					      0x19
#define	MGAINDEX_AR2					      0x1a
#define	MGAINDEX_AR3					      0x1b
#define	MGAINDEX_AR4					      0x1c
#define	MGAINDEX_AR5					      0x1d
#define	MGAINDEX_AR6					      0x1e
#define	MGAINDEX_CXBNDRY				      0x20
#define	MGAINDEX_FXBNDRY				      0x21
#define	MGAINDEX_YDSTLEN				      0x22
#define	MGAINDEX_PITCH					      0x23
#define	MGAINDEX_YDST					      0x24
#define	MGAINDEX_YDSTORG				      0x25
#define	MGAINDEX_YTOP					      0x26
#define	MGAINDEX_YBOT					      0x27
#define	MGAINDEX_CXLEFT					      0x28
#define	MGAINDEX_CXRIGHT				      0x29
#define	MGAINDEX_FXLEFT					      0x2a
#define	MGAINDEX_FXRIGHT				      0x2b
#define	MGAINDEX_XDST					      0x2c
#define	MGAINDEX_DR0					      0x30
#define	MGAINDEX_FOGSTART				      0x31
#define	MGAINDEX_DR2					      0x32
#define	MGAINDEX_DR3					      0x33
#define	MGAINDEX_DR4					      0x34
#define	MGAINDEX_FOGXINC				      0x35
#define	MGAINDEX_DR6					      0x36
#define	MGAINDEX_DR7					      0x37
#define	MGAINDEX_DR8					      0x38
#define	MGAINDEX_FOGYINC				      0x39
#define	MGAINDEX_DR10					      0x3a
#define	MGAINDEX_DR11					      0x3b
#define	MGAINDEX_DR12					      0x3c
#define	MGAINDEX_FOGCOL					      0x3d
#define	MGAINDEX_DR14					      0x3e
#define	MGAINDEX_DR15					      0x3f
#define	MGAINDEX_DRAW_DWGCTL				      0x40
#define	MGAINDEX_DRAW_MACCESS				      0x41
#define	MGAINDEX_DRAW_MCTLWTST				      0x42
#define	MGAINDEX_DRAW_ZORG				      0x43
#define	MGAINDEX_DRAW_PAT0				      0x44
#define	MGAINDEX_DRAW_PAT1				      0x45
#define	MGAINDEX_DRAW_PLNWT				      0x47
#define	MGAINDEX_DRAW_BCOL				      0x48
#define	MGAINDEX_DRAW_FCOL				      0x49
#define	MGAINDEX_DRAW_SRC0				      0x4c
#define	MGAINDEX_DRAW_SRC1				      0x4d
#define	MGAINDEX_DRAW_SRC2				      0x4e
#define	MGAINDEX_DRAW_SRC3				      0x4f
#define	MGAINDEX_DRAW_XYSTRT				      0x50
#define	MGAINDEX_DRAW_XYEND				      0x51
#define	MGAINDEX_DRAW_SHIFT				      0x54
#define	MGAINDEX_DRAW_DMAPAD				      0x55
#define	MGAINDEX_DRAW_SGN				      0x56
#define	MGAINDEX_DRAW_LEN				      0x57
#define	MGAINDEX_DRAW_AR0				      0x58
#define	MGAINDEX_DRAW_AR1				      0x59
#define	MGAINDEX_DRAW_AR2				      0x5a
#define	MGAINDEX_DRAW_AR3				      0x5b
#define	MGAINDEX_DRAW_AR4				      0x5c
#define	MGAINDEX_DRAW_AR5				      0x5d
#define	MGAINDEX_DRAW_AR6				      0x5e
#define	MGAINDEX_DRAW_CXBNDRY				      0x60
#define	MGAINDEX_DRAW_FXBNDRY				      0x61
#define	MGAINDEX_DRAW_YDSTLEN				      0x62
#define	MGAINDEX_DRAW_PITCH				      0x63
#define	MGAINDEX_DRAW_YDST				      0x64
#define	MGAINDEX_DRAW_YDSTORG				      0x65
#define	MGAINDEX_DRAW_YTOP				      0x66
#define	MGAINDEX_DRAW_YBOT				      0x67
#define	MGAINDEX_DRAW_CXLEFT				      0x68
#define	MGAINDEX_DRAW_CXRIGHT				      0x69
#define	MGAINDEX_DRAW_FXLEFT				      0x6a
#define	MGAINDEX_DRAW_FXRIGHT				      0x6b
#define	MGAINDEX_DRAW_XDST				      0x6c
#define	MGAINDEX_WIADDR					      0x70
#define	MGAINDEX_WFLAG					      0x71
#define	MGAINDEX_WGETMSB				      0x72
#define	MGAINDEX_WVRTXSZ				      0x73
#define	MGAINDEX_TMR0					      0x80
#define	MGAINDEX_TMR1					      0x81
#define	MGAINDEX_TMR2					      0x82
#define	MGAINDEX_TMR3					      0x83
#define	MGAINDEX_TMR4					      0x84
#define	MGAINDEX_TMR5					      0x85
#define	MGAINDEX_TMR6					      0x86
#define	MGAINDEX_TMR7					      0x87
#define	MGAINDEX_TMR8					      0x88
#define	MGAINDEX_TEXORG					      0x89
#define	MGAINDEX_TEXWIDTH				      0x8a
#define	MGAINDEX_TEXHEIGHT				      0x8b
#define	MGAINDEX_TEXCTL					      0x8c
#define	MGAINDEX_TEXTRANS				      0x8d
#define	MGAINDEX_TEXTRANSHIGH				      0x8e
#define	MGAINDEX_TEXCTL2				      0x8f
#define	MGAINDEX_SECADDRESS				      0x90
#define	MGAINDEX_SECEND					      0x91
#define	MGAINDEX_SOFTRAP				      0x92
#define	MGAINDEX_DWGSYNC				      0x93
#define	MGAINDEX_DR0_Z32_LSB				      0x94
#define	MGAINDEX_DR0_Z32_MSB				      0x95
#define	MGAINDEX_TEXFILTER				      0x96
#define	MGAINDEX_TEXBORDERCOL				      0x97
#define	MGAINDEX_DR2_Z32_LSB				      0x98
#define	MGAINDEX_DR2_Z32_MSB				      0x99
#define	MGAINDEX_DR3_Z32_LSB				      0x9a
#define	MGAINDEX_DR3_Z32_MSB				      0x9b
#define	MGAINDEX_ALPHASTART				      0x9c
#define	MGAINDEX_ALPHAXINC				      0x9d
#define	MGAINDEX_ALPHAYINC				      0x9e
#define	MGAINDEX_ALPHACTRL				      0x9f
#define	MGAINDEX_SPECRSTART				      0xa0
#define	MGAINDEX_SPECRXINC				      0xa1
#define	MGAINDEX_SPECRYINC				      0xa2
#define	MGAINDEX_SPECGSTART				      0xa3
#define	MGAINDEX_SPECGXINC				      0xa4
#define	MGAINDEX_SPECGYINC				      0xa5
#define	MGAINDEX_SPECBSTART				      0xa6
#define	MGAINDEX_SPECBXINC				      0xa7
#define	MGAINDEX_SPECBYINC				      0xa8
#define	MGAINDEX_TEXORG1				      0xa9
#define	MGAINDEX_TEXORG2				      0xaa
#define	MGAINDEX_TEXORG3				      0xab
#define	MGAINDEX_TEXORG4				      0xac
#define	MGAINDEX_SRCORG					      0xad
#define	MGAINDEX_DSTORG					      0xae
#define	MGAINDEX_SETUPADDRESS				      0xb4
#define	MGAINDEX_SETUPEND				      0xb5
#define	MGAINDEX_WR					      0xc0

typedef struct mga_struct {
	uint8_t mga_dmawin[0x1c00];			/* 0x0000 */
	uint32_t mga_dwgctl;				/* 0x1c00 */
	uint32_t mga_maccess;				/* 0x1c04 */
	uint32_t mga_mctlwtst;				/* 0x1c08 */
	uint32_t mga_zorg;				/* 0x1c0c */
	uint32_t mga_pat0;				/* 0x1c10 */
	uint32_t mga_pat1;				/* 0x1c14 */
	uint32_t mga_reserved_0x1c18;			/* 0x1c18 */
	uint32_t mga_plnwt;				/* 0x1c1c */
	uint32_t mga_bcol;				/* 0x1c20 */
	uint32_t mga_fcol;				/* 0x1c24 */
	uint32_t mga_reserved_0x1c28;			/* 0x1c28 */
	uint32_t mga_reserved_0x1c2c;			/* 0x1c2c */
	uint32_t mga_src0;				/* 0x1c30 */
	uint32_t mga_src1;				/* 0x1c34 */
	uint32_t mga_src2;				/* 0x1c38 */
	uint32_t mga_src3;				/* 0x1c3c */
	uint32_t mga_xystrt;				/* 0x1c40 */
	uint32_t mga_xyend;				/* 0x1c44 */
	uint32_t mga_reserved_0x1c48;			/* 0x1c48 */
	uint32_t mga_reserved_0x1c4c;			/* 0x1c4c */
	uint32_t mga_shift;				/* 0x1c50 */
	uint32_t mga_dmapad;				/* 0x1c54 */
	uint32_t mga_sgn;				/* 0x1c58 */
	uint32_t mga_len;				/* 0x1c5c */
	uint32_t mga_ar0;				/* 0x1c60 */
	uint32_t mga_ar1;				/* 0x1c64 */
	uint32_t mga_ar2;				/* 0x1c68 */
	uint32_t mga_ar3;				/* 0x1c6c */
	uint32_t mga_ar4;				/* 0x1c70 */
	uint32_t mga_ar5;				/* 0x1c74 */
	uint32_t mga_ar6;				/* 0x1c78 */
	uint32_t mga_reserved_0x1c7c;			/* 0x1c7c */
	uint32_t mga_cxbndry;				/* 0x1c80 */
	uint32_t mga_fxbndry;				/* 0x1c84 */
	uint32_t mga_ydstlen;				/* 0x1c88 */
	uint32_t mga_pitch;				/* 0x1c8c */
	uint32_t mga_ydst;				/* 0x1c90 */
	uint32_t mga_ydstorg;				/* 0x1c94 */
	uint32_t mga_ytop;				/* 0x1c98 */
	uint32_t mga_ybot;				/* 0x1c9c */
	uint32_t mga_cxleft;				/* 0x1ca0 */
	uint32_t mga_cxright;				/* 0x1ca4 */
	uint32_t mga_fxleft;				/* 0x1ca8 */
	uint32_t mga_fxright;				/* 0x1cac */
	uint32_t mga_xdst;				/* 0x1cb0 */
	uint32_t mga_reserved_0x1cb4;			/* 0x1cb4 */
	uint32_t mga_reserved_0x1cb8;			/* 0x1cb8 */
	uint32_t mga_reserved_0x1cbc;			/* 0x1cbc */
	uint32_t mga_dr0;				/* 0x1cc0 */
	uint32_t mga_fogstart;				/* 0x1cc4 */
	uint32_t mga_dr2;				/* 0x1cc8 */
	uint32_t mga_dr3;				/* 0x1ccc */
	uint32_t mga_dr4;				/* 0x1cd0 */
	uint32_t mga_fogxinc;				/* 0x1cd4 */
	uint32_t mga_dr6;				/* 0x1cd8 */
	uint32_t mga_dr7;				/* 0x1cdc */
	uint32_t mga_dr8;				/* 0x1ce0 */
	uint32_t mga_fogyinc;				/* 0x1ce4 */
	uint32_t mga_dr10;				/* 0x1ce8 */
	uint32_t mga_dr11;				/* 0x1cec */
	uint32_t mga_dr12;				/* 0x1cf0 */
	uint32_t mga_fogcol;				/* 0x1cf4 */
	uint32_t mga_dr14;				/* 0x1cf8 */
	uint32_t mga_dr15;				/* 0x1cfc */
	uint32_t mga_draw_dwgctl;			/* 0x1d00 */
	uint32_t mga_draw_maccess;			/* 0x1d04 */
	uint32_t mga_reserved_0x1d08;			/* 0x1d08 */
	uint32_t mga_draw_zorg;				/* 0x1d0c */
	uint32_t mga_draw_pat0;				/* 0x1d10 */
	uint32_t mga_draw_pat1;				/* 0x1d14 */
	uint32_t mga_reserved_0x1d18;			/* 0x1d18 */
	uint32_t mga_draw_plnwt;			/* 0x1d1c */
	uint32_t mga_draw_bcol;				/* 0x1d20 */
	uint32_t mga_draw_fcol;				/* 0x1d24 */
	uint32_t mga_reserved_0x1d28;			/* 0x1d28 */
	uint32_t mga_reserved_0x1d2c;			/* 0x1d2c */
	uint32_t mga_draw_src0;				/* 0x1d30 */
	uint32_t mga_draw_src1;				/* 0x1d34 */
	uint32_t mga_draw_src2;				/* 0x1d38 */
	uint32_t mga_draw_src3;				/* 0x1d3c */
	uint32_t mga_draw_xystrt;			/* 0x1d40 */
	uint32_t mga_draw_xyend;			/* 0x1d44 */
	uint32_t mga_reserved_0x1d48;			/* 0x1d48 */
	uint32_t mga_reserved_0x1d4c;			/* 0x1d4c */
	uint32_t mga_draw_shift;			/* 0x1d50 */
	uint32_t mga_draw_dmapad;			/* 0x1d54 */
	uint32_t mga_draw_sgn;				/* 0x1d58 */
	uint32_t mga_draw_len;				/* 0x1d5c */
	uint32_t mga_draw_ar0;				/* 0x1d60 */
	uint32_t mga_draw_ar1;				/* 0x1d64 */
	uint32_t mga_draw_ar2;				/* 0x1d68 */
	uint32_t mga_draw_ar3;				/* 0x1d6c */
	uint32_t mga_draw_ar4;				/* 0x1d70 */
	uint32_t mga_draw_ar5;				/* 0x1d74 */
	uint32_t mga_draw_ar6;				/* 0x1d78 */
	uint32_t mga_reserved_0x1d7c;			/* 0x1d7c */
	uint32_t mga_draw_cxbndry;			/* 0x1d80 */
	uint32_t mga_draw_fxbndry;			/* 0x1d84 */
	uint32_t mga_draw_ydstlen;			/* 0x1d88 */
	uint32_t mga_draw_pitch;			/* 0x1d8c */
	uint32_t mga_draw_ydst;				/* 0x1d90 */
	uint32_t mga_draw_ydstorg;			/* 0x1d94 */
	uint32_t mga_draw_ytop;				/* 0x1d98 */
	uint32_t mga_draw_ybot;				/* 0x1d9c */
	uint32_t mga_draw_cxleft;			/* 0x1da0 */
	uint32_t mga_draw_cxright;			/* 0x1da4 */
	uint32_t mga_draw_fxleft;			/* 0x1da8 */
	uint32_t mga_draw_fxright;			/* 0x1dac */
	uint32_t mga_draw_xdst;				/* 0x1db0 */
	uint32_t mga_reserved_0x1db4;			/* 0x1db4 */
	uint32_t mga_reserved_0x1db8;			/* 0x1db8 */
	uint32_t mga_reserved_0x1dbc;			/* 0x1dbc */
	uint32_t mga_wiaddr;				/* 0x1dc0 */
	uint32_t mga_wflag;				/* 0x1dc4 */
	uint32_t mga_wgetmsb;				/* 0x1dc8 */
	uint32_t mga_wvrtxsz;				/* 0x1dcc */
	uint8_t mga_reserved_0x1dd0[0x1e00 - 0x1dd0];	/* 0x1dd0 */
	uint32_t mga_reserved_0x1e00;			/* 0x1e00 */
	uint32_t mga_reserved_0x1e04;			/* 0x1e04 */
	uint32_t mga_reserved_0x1e08;			/* 0x1e08 */
	uint32_t mga_reserved_0x1e0c;			/* 0x1e0c */
	uint32_t mga_fifostatus;			/* 0x1e10 */
	uint32_t mga_status;				/* 0x1e14 */
	uint32_t mga_iclear;				/* 0x1e18 */
	uint32_t mga_ien;				/* 0x1e1c */
	uint32_t mga_vcount;				/* 0x1e20 */
	uint32_t mga_modelrev;				/* 0x1e24 */
	uint32_t mga_reserved_0x1e28;			/* 0x1e28 */
	uint32_t mga_reserved_0x1e2c;			/* 0x1e2c */
	uint32_t mga_dmamap30;				/* 0x1e30 */
	uint32_t mga_dmamap74;				/* 0x1e34 */
	uint32_t mga_dmamapb8;				/* 0x1e38 */
	uint32_t mga_dmamapfc;				/* 0x1e3c */
	uint32_t mga_rst;				/* 0x1e40 */
	uint32_t mga_memrdbk;				/* 0x1e44 */
	uint32_t mga_test0;				/* 0x1e48 */
	uint32_t mga_agp_pll;				/* 0x1e4c */
	uint32_t mga_primptr;				/* 0x1e50 */
	uint32_t mga_opmode;				/* 0x1e54 */
	uint32_t mga_primaddress;			/* 0x1e58 */
	uint32_t mga_primend;				/* 0x1e5c */
	uint32_t mga_wiaddrnb;				/* 0x1e60 */
	uint32_t mga_wflagnb;				/* 0x1e64 */
	uint32_t mga_wimemaddr;				/* 0x1e68 */
	uint32_t mga_wcodeaddr;				/* 0x1e6c */
	uint32_t mga_wmisc;				/* 0x1e70 */
	uint32_t mga_reserved_0x1e74;			/* 0x1e74 */
	uint32_t mga_reserved_0x1e78;			/* 0x1e78 */
	uint32_t mga_reserved_0x1e7c;			/* 0x1e7c */
	uint32_t mga_dwg_indir_wt[0x10];		/* 0x1e80 */
	uint8_t mga_reserved_0x1ec0[0x1fc0 - 0x1ec0];	/* 0x1ec0 */
	uint8_t mga_attr_index;				/* 0x1fc0 */
	uint8_t mga_attr_data;				/* 0x1fc1 */
	uint8_t mga_insts0;				/* 0x1fc2 */
	uint8_t mga_reserved_0x1fc3;			/* 0x1fc3 */
	uint8_t mga_seq_index;				/* 0x1fc4 */
	uint8_t mga_seq_data;				/* 0x1fc5 */
	uint8_t mga_reserved_0x1fc6;			/* 0x1fc6 */
	uint8_t mga_dacstatus;				/* 0x1fc7 */
	uint8_t mga_reserved_0x1fc8;			/* 0x1fc8 */
	uint8_t mga_reserved_0x1fc9;			/* 0x1fc9 */
	uint8_t mga_feat_read;				/* 0x1fca */
	uint8_t mga_reserved_0x1fcb;			/* 0x1fcb */
	uint8_t mga_miscout_read;			/* 0x1fcc */
	uint8_t mga_reserved_0x1fcd;			/* 0x1fcd */
	uint8_t mga_gctl_index;				/* 0x1fce */
	uint8_t mga_gctl_data;				/* 0x1fcf */
	uint8_t mga_reserved_0x1fd0;			/* 0x1fd0 */
	uint8_t mga_reserved_0x1fd1;			/* 0x1fd1 */
	uint8_t mga_reserved_0x1fd2;			/* 0x1fd2 */
	uint8_t mga_reserved_0x1fd3;			/* 0x1fd3 */
	uint8_t mga_crtc_index;				/* 0x1fd4 */
	uint8_t mga_crtc_data;				/* 0x1fd5 */
	uint8_t mga_reserved_0x1fd6;			/* 0x1fd6 */
	uint8_t mga_reserved_0x1fd7;			/* 0x1fd7 */
	uint8_t mga_reserved_0x1fd8;			/* 0x1fd8 */
	uint8_t mga_reserved_0x1fd9;			/* 0x1fd9 */
	uint8_t mga_insts1;				/* 0x1fda */
	uint8_t mga_reserved_0x1fdb;			/* 0x1fdb */
	uint8_t mga_reserved_0x1fdc;			/* 0x1fdc */
	uint8_t mga_reserved_0x1fdd;			/* 0x1fdd */
	uint8_t mga_crtcext_index;			/* 0x1fde */
	uint8_t mga_crtcext_data;			/* 0x1fdf */
	uint8_t mga_reserved_0x1fe0[0x1fff - 0x1fe0];	/* 0x1fe0 */
	uint8_t mga_cacheflush;				/* 0x1fff */
	uint32_t mga_wimemdata[0x20];			/* 0x2000 */
	uint8_t mga_reserved_0x2080[0x2c00 - 0x2080];	/* 0x2080 */
	uint32_t mga_tmr0;				/* 0x2c00 */
	uint32_t mga_tmr1;				/* 0x2c04 */
	uint32_t mga_tmr2;				/* 0x2c08 */
	uint32_t mga_tmr3;				/* 0x2c0c */
	uint32_t mga_tmr4;				/* 0x2c10 */
	uint32_t mga_tmr5;				/* 0x2c14 */
	uint32_t mga_tmr6;				/* 0x2c18 */
	uint32_t mga_tmr7;				/* 0x2c1c */
	uint32_t mga_tmr8;				/* 0x2c20 */
	uint32_t mga_texorg;				/* 0x2c24 */
	uint32_t mga_texwidth;				/* 0x2c28 */
	uint32_t mga_texheight;				/* 0x2c2c */
	uint32_t mga_texctl;				/* 0x2c30 */
	uint32_t mga_textrans;				/* 0x2c34 */
	uint32_t mga_textranshigh;			/* 0x2c38 */
	uint32_t mga_texctl2;				/* 0x2c3c */
	uint32_t mga_secaddress;			/* 0x2c40 */
	uint32_t mga_secend;				/* 0x2c44 */
	uint32_t mga_softrap;				/* 0x2c48 */
	uint32_t mga_dwgsync;				/* 0x2c4c */
	uint32_t mga_dr0_z32_lsb;			/* 0x2c50 */
	uint32_t mga_dr0_z32_msb;			/* 0x2c54 */
	uint32_t mga_texfilter;				/* 0x2c58 */
	uint32_t mga_texbordercol;			/* 0x2c5c */
	uint32_t mga_dr2_z32_lsb;			/* 0x2c60 */
	uint32_t mga_dr2_z32_msb;			/* 0x2c64 */
	uint32_t mga_dr3_z32_lsb;			/* 0x2c68 */
	uint32_t mga_dr3_z32_msb;			/* 0x2c6c */
	uint32_t mga_alphastart;			/* 0x2c70 */
	uint32_t mga_alphaxinc;				/* 0x2c74 */
	uint32_t mga_alphayinc;				/* 0x2c78 */
	uint32_t mga_alphactrl;				/* 0x2c7c */
	uint32_t mga_specrstart;			/* 0x2c80 */
	uint32_t mga_specrxinc;				/* 0x2c84 */
	uint32_t mga_specryinc;				/* 0x2c88 */
	uint32_t mga_specgstart;			/* 0x2c8c */
	uint32_t mga_specgxinc;				/* 0x2c90 */
	uint32_t mga_specgyinc;				/* 0x2c94 */
	uint32_t mga_specbstart;			/* 0x2c98 */
	uint32_t mga_specbxinc;				/* 0x2c9c */
	uint32_t mga_specbyinc;				/* 0x2ca0 */
	uint32_t mga_texorg1;				/* 0x2ca4 */
	uint32_t mga_texorg2;				/* 0x2ca8 */
	uint32_t mga_texorg3;				/* 0x2cac */
	uint32_t mga_texorg4;				/* 0x2cb0 */
	uint32_t mga_srcorg;				/* 0x2cb4 */
	uint32_t mga_dstorg;				/* 0x2cb8 */
	uint32_t mga_reserved_0x2cbc;			/* 0x2cbc */
	uint32_t mga_reserved_0x2cc0;			/* 0x2cc0 */
	uint32_t mga_reserved_0x2cc4;			/* 0x2cc4 */
	uint32_t mga_reserved_0x2cc8;			/* 0x2cc8 */
	uint32_t mga_reserved_0x2ccc;			/* 0x2ccc */
	uint32_t mga_setupaddress;			/* 0x2cd0 */
	uint32_t mga_setupend;				/* 0x2cd4 */
	uint8_t mga_reserved_0x2cd8[0x2d00 - 0x2cd8];	/* 0x2cd8 */
	uint32_t mga_wr[64];				/* 0x2d00 */
	uint8_t mga_reserved_0x2e00[0x3c00 - 0x2e00];	/* 0x2e00 */
	uint8_t mga_palwtadd;				/* 0x3c00 */
	uint8_t mga_paldata;				/* 0x3c01 */
	uint8_t mga_pixrdmsk;				/* 0x3c02 */
	uint8_t mga_palrdadd;				/* 0x3c03 */
	uint8_t mga_reserved_0x3c04;			/* 0x3c04 */
	uint8_t mga_reserved_0x3c05;			/* 0x3c05 */
	uint8_t mga_reserved_0x3c06;			/* 0x3c06 */
	uint8_t mga_reserved_0x3c07;			/* 0x3c07 */
	uint8_t mga_reserved_0x3c08;			/* 0x3c08 */
	uint8_t mga_reserved_0x3c09;			/* 0x3c09 */
	uint8_t mga_x_datareg;				/* 0x3c0a */
	uint8_t mga_reserved_0x3c0b;			/* 0x3c0b */
	uint8_t mga_curposxl;				/* 0x3c0c */
	uint8_t mga_curposxh;				/* 0x3c0d */
	uint8_t mga_curposyl;				/* 0x3c0e */
	uint8_t mga_curposyh;				/* 0x3c0f */
	uint8_t mga_reserved_0x3c10[0x3d00 - 0x3c10];	/* 0x3c10 */
	uint32_t mga_besa1org;				/* 0x3d00 */
	uint32_t mga_besa2org;				/* 0x3d04 */
	uint32_t mga_besb1org;				/* 0x3d08 */
	uint32_t mga_besb2org;				/* 0x3d0c */
	uint32_t mga_besa1corg;				/* 0x3d10 */
	uint32_t mga_besa2corg;				/* 0x3d14 */
	uint32_t mga_besb1corg;				/* 0x3d18 */
	uint32_t mga_besb2corg;				/* 0x3d1c */
	uint32_t mga_besctl;				/* 0x3d20 */
	uint32_t mga_bespitch;				/* 0x3d24 */
	uint32_t mga_beshcoord;				/* 0x3d28 */
	uint32_t mga_besvcoord;				/* 0x3d2c */
	uint32_t mga_beshiscal;				/* 0x3d30 */
	uint32_t mga_besviscal;				/* 0x3d34 */
	uint32_t mga_beshsrcst;				/* 0x3d38 */
	uint32_t mga_beshsrcend;			/* 0x3d3c */
	uint32_t mga_reserved_0x3d40;			/* 0x3d40 */
	uint32_t mga_reserved_0x3d44;			/* 0x3d44 */
	uint32_t mga_besv1wght;				/* 0x3d48 */
	uint32_t mga_besv2wght;				/* 0x3d4c */
	uint32_t mga_beshsrclst;			/* 0x3d50 */
	uint32_t mga_besv1srclst;			/* 0x3d54 */
	uint32_t mga_besv2srclst;			/* 0x3d58 */
	uint8_t mga_reserved_0x3d5c[0x3dc0 - 0x3d5c];	/* 0x3d5c */
	uint32_t mga_besglobctl;			/* 0x3dc0 */
	uint32_t mga_besstatus;				/* 0x3dc4 */
	uint8_t mga_reserved_0x3dc8[0x3e00 - 0x3dc8];	/* 0x3dc8 */
	uint32_t mga_vinctl0;				/* 0x3e00 */
	uint32_t mga_vinctl1;				/* 0x3e04 */
	uint32_t mga_vbiaddr0;				/* 0x3e08 */
	uint32_t mga_vbiaddr1;				/* 0x3e0c */
	uint32_t mga_vinaddr0;				/* 0x3e10 */
	uint32_t mga_vinaddr1;				/* 0x3e14 */
	uint32_t mga_vinnextwin;			/* 0x3e18 */
	uint32_t mga_vinctl;				/* 0x3e1c */
	uint32_t mga_reserved_0x3e20;			/* 0x3e20 */
	uint32_t mga_reserved_0x3e24;			/* 0x3e24 */
	uint32_t mga_reserved_0x3e28;			/* 0x3e28 */
	uint32_t mga_reserved_0x3e2c;			/* 0x3e2c */
	uint32_t mga_vstatus;				/* 0x3e30 */
	uint32_t mga_viclear;				/* 0x3e34 */
	uint32_t mga_vien;				/* 0x3e38 */
	uint32_t mga_reserved_0x3e3c;			/* 0x3e3c */
	uint32_t mga_codecctl;				/* 0x3e40 */
	uint32_t mga_codecaddr;				/* 0x3e44 */
	uint32_t mga_codechostptr;			/* 0x3e48 */
	uint32_t mga_codechardptr;			/* 0x3e4c */
	uint32_t mga_codeclcode;			/* 0x3e50 */
	uint8_t mga_reserved_0x3e54[0x4000 - 0x3e54];	/* 0x3e54 */
	} mga_t;					/* 0x4000 */

#define	mga_miscout_write	mga_insts0		/* 0x1fc2 */
#define	mga_feat_write		mga_insts1		/* 0x1fda */
#define	mga_dwg_indir_wt0	mga_dwg_indir_wt[0x0]	/* 0x1e80 */
#define	mga_dwg_indir_wt1	mga_dwg_indir_wt[0x1]	/* 0x1e84 */
#define	mga_dwg_indir_wt2	mga_dwg_indir_wt[0x2]	/* 0x1e88 */
#define	mga_dwg_indir_wt3	mga_dwg_indir_wt[0x3]	/* 0x1e8c */
#define	mga_dwg_indir_wt4	mga_dwg_indir_wt[0x4]	/* 0x1e90 */
#define	mga_dwg_indir_wt5	mga_dwg_indir_wt[0x5]	/* 0x1e94 */
#define	mga_dwg_indir_wt6	mga_dwg_indir_wt[0x6]	/* 0x1e98 */
#define	mga_dwg_indir_wt7	mga_dwg_indir_wt[0x7]	/* 0x1e9c */
#define	mga_dwg_indir_wt8	mga_dwg_indir_wt[0x8]	/* 0x1ea0 */
#define	mga_dwg_indir_wt9	mga_dwg_indir_wt[0x9]	/* 0x1ea4 */
#define	mga_dwg_indir_wta	mga_dwg_indir_wt[0xa]	/* 0x1ea8 */
#define	mga_dwg_indir_wtb	mga_dwg_indir_wt[0xb]	/* 0x1eac */
#define	mga_dwg_indir_wtc	mga_dwg_indir_wt[0xc]	/* 0x1eb0 */
#define	mga_dwg_indir_wtd	mga_dwg_indir_wt[0xd]	/* 0x1eb4 */
#define	mga_dwg_indir_wte	mga_dwg_indir_wt[0xe]	/* 0x1eb8 */
#define	mga_dwg_indir_wtf	mga_dwg_indir_wt[0xf]	/* 0x1ebc */

#define	MGAG200_REFRESH_MIN_HZ	66146	/* back solved: 0x22 for 144MHz */

	/* 144.0Mhz memory clock */
#define	MGAG200_DEFAULT_MCLK_HZ			 144000000

#define	MGA_SYNC_XTAG				0x275f4200

#define	MGA_FB_OFFSET				0x00000000
#define	MGA_CONTROL_OFFSET			0x10000000
#define	MGA_ILOAD_OFFSET			0x20000000
#define	MGA_ROM_OFFSET				0x30000000
#define	MGA_LAST_OFFSET				0x40000000

#define	MGA_EDID_CLOCK_MASK			0x02
#define	MGA_EDID_DATA_MASK			0x01

#define	MGA_FB_STEP	(16 * 1024)

/* END CSTYLED */

#endif /* _MGA_H */
