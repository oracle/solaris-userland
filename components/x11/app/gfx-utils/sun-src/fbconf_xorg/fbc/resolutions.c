
/*
 * Copyright (c) 2003, 2008, Oracle and/or its affiliates. All rights reserved.
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


#include <stdio.h>		/* NULL */

#include "resolutions.h"	/* Video mode summary table: SunVideoTable[] */


const SunVideoSummary SunVideoTable[] = {

/* 720x400x85 from VESA standard 1.0r7, 12/18/96 */
  {"VESA_STD_720x400x85", 720,400,85, 36,72,108, 1,3,42, 35500, 0,0, 1, 0,1},

/* r640x480x60 from VESA Monitor Timing Standards Version 1.0, Industry
 * Practice */
  {"VESA_STD_640x480x60", 640,480,60, 16,96,48, 10,2,33, 25175, 0,0, 1, 0,0},


/* r640x480x72 from VESA Monitor Timing Standard VS901101 12/2/92 */
  {"VESA_STD_640x480x72", 640,480,72, 24,40,128, 9,3,28, 31500, 0,0, 1, 0,0},

/* r640x480x75 from VESA Monitor Timing Standard VDMT75HZ 10/4/93 */
  {"VESA_STD_640x480x75", 640,480,75, 16,64,120, 1,3,16, 31500, 0,0, 1, 0,0},

/* r640x480x180fsc from Clayton Castle 10/2/01 */
  {"SUNW_STD_640x480x180", 640,480,180, 40,80,120, 1,3,36, 82350, 0,0, 0, 0,0},

/* 800x600x56 from VESA standard 1.0r7, 12/18/96 */
  {"VESA_STD_800x600x56", 800,600,56, 24,72,128, 1,2,22, 36000, 0,0, 1, 1,1},

/* 800x600x60 from VESA standard 1.0r7, 12/18/96 */
  {"VESA_STD_800x600x60", 800,600,60, 40,128,88, 1,4,23, 40000, 0,0, 1, 1,1},

/* 800x600x72 from VESA standard 1.0r7, 12/18/96 */
  {"VESA_STD_800x600x72", 800,600,72, 56,120,64, 37,6,23, 50000, 0,0, 1, 1,1},

/* r800x600x75 from VESA Standard VDMT75HZ */
  {"VESA_STD_800x600x75", 800,600,75, 16,80,160, 1,3,21, 49500, 0,0, 1, 1,1},

/* 800x600x85 from VESA standard 1.0r7, 12/18/96 */
  {"VESA_STD_800x600x85", 800,600,85, 32,64,152, 1,3,27, 56250, 0,0, 1, 1,1},


/* r960x680x108 stereo from ZX 10/21/94 */
  {"SUNW_STEREO_960x680x108", 960,680,108, 64,64,192, 3,4,34, 99900, 0,0, 0, 0,0},

/* r960x680x112s stereo from ZX 10/21/94 */
  {"SUNW_STEREO_960x680x112", 960,680,112, 24,48,216, 2,8,32, 101250, 0,0, 0, 0,0},

/* r1024x768x60 from VESA Monitor Timing Standards Version 1.0 */
  {"VESA_STD_1024x768x60", 1024,768,60, 24,136,160, 3,6,29, 65000, 0,0, 1, 0,0},

/* r1024x768x70 from VESA Monitor Timing Standards VS910801-2 8/9/91 */
  {"VESA_STD_1024x768x70", 1024,768,70, 24,136,144, 3,6,29, 75214, 0,0, 1, 0,0},

/* r1024x768x75 from VESA Monitor Timing Standards Version 1.0 */
  {"VESA_STD_1024x768x75", 1024,768,75, 16,96,176, 1,3,28, 78750, 0,0, 1, 1,1},

/* r1024x768x77 from 15" monitor spec 950-1915-01 rev 51 10/21/94 */
  {"SUNW_STD_1024x768x77", 1024,768,77, 32,64,240, 2,4,31, 84375, 0,0, 0, 0,0},

/* 1024x768x85 from VESA standard 1.0r7, 12/18/96 */
  {"VESA_STD_1024x768x85", 1024,768,85, 48,96,208, 1,3,36, 94500, 0,0, 1, 1,1},

/* r1024x800x84 from tgxplus bootprom 1/6/95 */
  {"SUNW_STD_1024x800x84", 1024,800,86, 16,128,152, 2,4,31, 94500, 0,0, 0, 0,0},

/* 1152x864x75 from VESA standard 1.0r7, 12/18/96 */
  {"VESA_STD_1152x864x75", 1152,864,75, 64,128,256, 1,3,32, 108000, 0,0, 1, 1,1},

/* r1152x900x66 from 20" monitor spec 950-1695-01 Rev11 1/6/95  */
  {"SUNW_STD_1152x900x66", 1152,900,66, 40,128,208, 2,4,31, 94500, 0,0, 0, 0,0},

/* r1152x900x76 from 20" monitor spec 950-1695-01 Rev11 1/6/95 */
  {"SUNW_STD_1152x900x76", 1152,900,76, 32,128,192, 2,8,33, 108000, 0,0, 0, 0,0},

/* r1152x900x120s from John Martin 9/13/2000 */
  {"SUNW_STEREO_1152x900x120", 1152,900,120, 64,136,216, 2,10,44, 180000, 0,1, 1, 1,1},
 
/* r1280x768x56 Pioneer 50" Plasma */
  {"SUNW_STD_1280x768x56", 1280,768,56, 48,112,248, 1,3,30, 76179, 0,0, 1, 0,0},

/* r1280x800x76 from Michele Law 6/26/96 */
  {"SUNW_STD_1280x800x76", 1280,800,76, 20,114,156, 3,7,36, 101250, 0,0, 0, 0,0},

/* r1280x800x112s stereo from John Martin 2/15/2000 */
  {"SUNW_STEREO_1280x800x112", 1280,800,112, 16,176,264, 2,8,36, 164700, 0,1, 1, 1,1},

/* r1280x1024x60 from Michele Law from VESA 4/3/96 */
  {"VESA_STD_1280x1024x60", 1280,1024,60, 48,112,248, 1,3,38, 108000, 0,0, 1, 1,1},

/* The GH18PS flat panel asks for this (same as above, but Composite */
  {"SUNW_STD_1280x1024x60", 1280,1024,60, 48,112,248, 1,3,38, 108000, 0,0, 0, 0,0},

/* r1280x1024x67 from gx (lsc.ref) 10/21/94 */
  {"SUNW_STD_1280x1024x67", 1280,1024,67, 16,112,224, 2,8,33, 117000, 0,0, 0, 0,0},

/* r1280x1024x75 from VESA Standard VDMT75HZ 10/4/93 */
  {"VESA_STD_1280x1024x75", 1280,1024,75, 16,144,248, 1,3,38, 135000, 0,0, 1, 1,1},

/* r1280x1024x76 from gx (lsc.ref) 10/21/94 */
  {"SUNW_STD_1280x1024x76", 1280,1024,76, 32,64,288, 2,8,32, 135000, 0,0, 0, 0,0},

/* r1280x1024x85 from VESA Standard VDMTREV 12/18/96 */
  {"VESA_STD_1280x1024x85", 1280,1024,85, 64,160,224, 1,3,44, 157500, 0,0, 1, 1,1},

/* r1280x1024x96s alternate stereo for Barco 808 3/28/01 John Martin */
  {"SUNW_STEREO_1280x1024x96", 1280,1024,96, 20,160,140, 3,6,30, 163280, 0,1, 1, 0,0},

/* r1280x1024x108s stereo for Christie Digital Mirage 5/25/01 John Martin */
  {"SUNW_STEREO_1280x1024x108", 1280,1024,108, 8,80,56, 2,4,6, 159300, 0,1, 1, 0,0},

/* r1280x1024x112s from Tom Fussy 5/25/99 */
  {"SUNW_STEREO_1280x1024x112", 1280,1024,112, 26,160,320, 1,8,47, 216000, 0,1, 1, 0,0},
 
/* r1440x900x76.res from Michele Law 4/11/96 */
  {"SUNW_STD_1440x900x76", 1440,900,76, 40,160,240, 2,3,39, 135000, 0,0, 0, 0,0},

/* r1600x1000x66.res from Michele Law 6/24/96 */
  {"SUNW_STD_1600x1000x66", 1600,1000,66, 40,136,192, 2,5,32, 135000, 0,0, 0, 0,0},

/* r1600x1000x76.res from Michele Law 4/11/96 */
  {"SUNW_STD_1600x1000x76", 1600,1000,76, 32,216,280, 2,3,46, 170100, 0,0, 0, 0,0},

/* r1600x1024x60 SGI 1600SW FP analog  John Martin 7/25/2001 */
  {"SGI_STD_1600x1024x60", 1600,1024,60, 16,56,36, 2,1,26, 107000, 0,0, 1, 0,0},

/* r1600x1200x60 from VESA Standard VDMTREV 12/18/96 */
  {"VESA_STD_1600x1200x60", 1600,1200,60, 64,192,304, 1,3,46, 162000, 0,0, 1, 1,1},

/* r1600x1200x60d from Joe Miseli, Clayton Castle 4/11/2001 */
  {"SUNW_DIG_1600x1200x60", 1600,1200,60, 4,64,106, 5,10,24, 132300, 0,0, 1, 1,1},

/* 1600x1200x65 from VESA standard 1.0r7, 12/18/96 */
  {"VESA_STD_1600x1200x65", 1600,1200,65, 64,192,304, 1,3,46, 175500, 0,0, 1, 1,1},

/* 1600x1200x70 from VESA standard 1.0r7, 12/18/96 */
  {"VESA_STD_1600x1200x70", 1600,1200,70, 64,192,304, 1,3,46, 189000, 0,0, 1, 1,1},

/* r1600x1200x73 for Siemens SMM 21105 LS 10/25/01 */
  {"SIEMENS_STD_1600x1200x73", 1600,1200,73, 88,216,296, 0,5,43, 200460, 0,0, 1, 1,1},

/* r1600x1200x75 from VESA (1/9/97) */
  {"VESA_STD_1600x1200x75", 1600,1200,75, 64,192,304, 1,3,46, 202500, 0,0, 1, 1,1},

/* 1600x1200x85 from VESA standard 1.0r7, 12/18/96 */
  {"VESA_STD_1600x1200x85", 1600,1200,85, 64,192,304, 1,3,46, 229500, 0,0, 1, 1,1},

/* r1600x1280x76 from gx (lsc.ref) 10/24/94 */
  {"SUNW_STD_1600x1280x76", 1600,1280,76, 24,216,280, 2,8,50, 216000, 0,0, 0, 0,0},

/* r1792x1344x60 from VESA Standard 1.0 Rev 0.8 9/98 */
  {"VESA_STD_1792x1344x60", 1792,1344,60, 128,200,328, 1,3,46, 204750, 0,0, 1, 0,1},
 
/* r1792x1344x75 from VESA Standard 1.0 Rev 0.8 9/98 */
  {"VESA_STD_1792x1344x75", 1792,1344,75, 96,216,352, 1,3,69, 261000, 0,0, 1, 0,1},
 
/* r1856x1392x60 from VESA Standard 1.0 Rev 0.8 9/98 */
  {"VESA_STD_1856x1392x60", 1856,1392,60, 96,224,352, 1,3,43, 219375, 0,0, 1, 0,1},
 
/* r1856x1392x75 from VESA Standard 1.0 Rev 0.8 9/98 */
  {"VESA_STD_1856x1392x75", 1856,1392,75, 128,224,352, 1,3,104, 288000, 0,0, 1, 0,1},

/* r1920x1080x60d from Joe Miseli 4/11/01 */
  {"SUNW_DIG_1920x1080x60", 1920,1080,60, 4,64,68, 2,4,26, 137700, 0,0, 1, 1,1},
 
/* r1920x1080x72 from Marc Klingelhofer's HRV Workstation doc 10/21/94 */
  {"SUNW_STD_1920x1080x72", 1920,1080,72, 48,216,376, 3,3,86, 216000, 0,0, 0, 0,0},

/* r1920x1200x60d from Joe Miseli 4/11/01 */
  {"SUNW_DIG_1920x1200x60", 1920,1200,60, 4,64,68, 2,4,28, 151200, 0,0, 1, 1,1},

/* r1920x1200x70 from Michele Law 6/24/96 */
  {"SUNW_STD_1920x1200x70", 1920,1200,70, 24,228,344, 1,3,36, 219375, 0,0, 0, 0,0},

/* r1920x1200x75 from Michele Law */
  {"SUNW_STD_1920x1200x75", 1920,1200,75, 64,224,352, 3,3,44, 239625, 0,0, 0, 0,0},

/* r640x480x60i ntsc from calculation, monitor group and ZX 10/21/94  */
  {"SUNW_INT_640x240x60", 640,240,60, 20,58,62, 3,3,16, 12273, 1,0, 0, 0,0},

/* r768x575x50i pal from calculation, monitor group and ZX 10/21/94  */
  {"SUNW_INT_768x287x50", 768,287,50, 14,70,84, 3,2,19, 14625, 0,0, 0, 0,0},

/* 1400x1050 @60 for Sparc laptop with NatureTech lcd */
  {"SUNW_DIG_1400x1050x60", 1400,1050,60, 6,112,170, 0,3,13, 108000, 0,0, 0, 0,0},

  {NULL, 0,0,0, 0,0,0, 0,0,0, 0, 0,0, 1, 0,0}
};


/* End of resolutions.c */
