/* Copyright (c) 1993, 2026, Oracle and/or its affiliates.
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


/*
 *
 *
 *      @@@@   @@@@@  @   @          @@@@  @@@@    @@@   @@@@
 *      @   @    @    @@  @         @      @   @  @   @  @   @
 *      @@@@     @    @ @ @         @ @@@  @@@@   @@@@@  @@@@
 *      @  @     @    @  @@         @   @  @  @   @   @  @   @
 *      @   @    @    @   @  @@@@@   @@@@  @   @  @   @  @@@@
 *
 *      DGA shared retained window access routines
 *
 *	int
 *	dga_rtn_active(clientp)
 *	    Dga_window clientp;
 *
 *	u_char
 *	dga_rtn_cached(clientp)
 *	    Dga_window clientp;
 *
 *	void *
 *	dga_rtn_devinfo(clientp)
 *	    Dga_window clientp;
 *
 *	void
 *	dga_rtn_devtype(clientp, type, name)
 *	    Dga_window   clientp;
 *	    u_char      *type;
 *	    char       **name;
 *
 *	void
 *	dga_rtn_dimensions(clientp, width, height, linebytes)
 *	    Dga_window  clientp;
 *	    short      *width;
 *	    short      *height;
 *	    u_int      *linebytes;
 *
 *	int
 *	dga_rtn_grab(clientp)
 *	    Dga_window  clientp;
 *
 *	void *
 *	dga_rtn_pixels(clientp)
 *	    Dga_window clientp;
 *
 *	int
 *	dga_rtn_ungrab(clientp)
 *	    Dga_window  clientp;
 *
 *	int
 *	_dga_rtn_map(clientp)
 *	    Dga_window  clientp;
 *
 *	int
 *	_dga_rtn_unmap(clientp)
 *	    Dga_window clientp;
 *
 */

#include "dga_incls.h"
#include "rtn_grab.h"

/*
 *
 *  dga_rtn_active()
 *
 *  DGA Retained Windows Active.  This function is called to determine
 *  if DGA to the retained portion of the specified dga_window is currently
 *  active.  Since the server can drop support for this functionality at
 *  any time, the client should always call this function when a change has
 *  been has been recorded in the retained window information.  This function
 *  should be called prior to accessing any other retained window information.
 *  The function returns a non-zero result if DGA to the retained portion
 *  of the window is active.  A zero result is returned if support has
 *  been dropped.
 *
 *  Inputs:     Dga_window - Pointer to the client structure.
 *
 *  Outputs:     0 - DGA Retained window support has been dropped.
 *		-1 - DGA Retained window support continues.
 *
 *  Globals:    None.
 *
 *  Externals:  None.
 *
 */
int
dga_rtn_active(Dga_window clientpi _X_UNUSED)
{
    return (RTN_FAILED);
}

/*
 *
 *  dga_rtn_cached()
 *
 *  DGA Retained HW Cache status.  This function returns a non-zero
 *  value if the retained raster is cached in hardware.  If set to
 *  DGA_RTN_NEW_DEV then the server has re-cached the retained
 *  raster from one device to another.  If set to DGA_RTN_SAME_DEV
 *  the raster remains cached in the same device as previously
 *  recorded.  If the retained raster is not cached in hw then the
 *  function returns DGA_RTN_NOT_CACHED (0).
 *
 *  Inputs:     Dga_window - Pointer to the client structure.
 *
 *  Outputs:    DGA_RTN_NOT_CACHED - not cached in hw
 *		DGA_RTN_SAME_DEV   - cached in the same hw device
 *		DGA_RTN_NEW_DEV    - cached in the new hw device
 *
 *  Globals:    None.
 *
 *
 */
int
dga_rtn_cached(Dga_window clientpi _X_UNUSED)
{
    return (DGA_RTN_NOT_CACHED);
}

/*
 *
 *  dga_rtn_devinfop()	<---external interface just to be consistent
 *  dga_rtn_devinfo()
 *
 *  DGA Retained Device Info.  This function returns a pointer to
 *  the shared device specific retained raster information when
 *  the retained raster is cached in hw.  The pointer is invalid
 *  if the retained raster isn't cached in hw.
 *
 *  Inputs:     Dga_window - Pointer to the client structure.
 *
 *  Outputs:    void *  - Pointer to the device specific information
 *
 *  Globals:    None.
 *
 */
void *
dga_rtn_devinfo(Dga_window clientpi _X_UNUSED)
{
    return (NULL);
}

void *
dga_rtn_devinfop(Dga_window clientpi _X_UNUSED)
{
    return (NULL);
}

/*
 *
 *  dga_rtn_devtype()
 *
 *  DGA Retained Device Type.  This function is used to obtain
 *  the retained raster hardware cache device type and name.
 *
 *  Inputs:     Dga_window - Pointer to the client structure.
 *		Unsign8 *  - Pointer to location to store device type.
 *		char **    - Pointer to location to store name string pointer.
 *
 *  Outputs:    None.
 *
 *  Globals:    None.
 *
 */
void
dga_rtn_devtype(
    Dga_window  clientpi _X_UNUSED,
    u_char     *type,
    char      **name)
{
    *type = 0;
    *name = NULL;
}

/*
 *
 *  dga_rtn_dimensions()
 *
 *  DGA Retained Raster Dimensions.  This function is used to obtain
 *  the retained raster's dimensions.
 *
 *  Inputs:     Dga_window - Pointer to the client structure.
 *              short    * - Pointer to location to store the width.
 *              short    * - Pointer to location to store the height.
 *		u_int	 * - Pointer to the location to store the linebytes.
 *
 *  Outputs:    None.
 *
 *  Globals:    None.
 *
 */
void
dga_rtn_dimensions(
    Dga_window  clientpi _X_UNUSED,
    short      *width,
    short      *height,
    u_int      *linebytes)
{
    *width = 0;
    *height = 0;
    *linebytes = 0;
}

int
dga_rtn_bitsperpixel(Dga_window clientpi _X_UNUSED)
{
    return (0);
}

/*
 *
 *  dga_rtn_grab()
 *
 *  DGA Retained Window Grab.  This function creates the shared memory
 *  interface to allow the calling process Direct Graphics Access (DGA)
 *  to the retained raster associated with the specified DGA window.
 *  A request to allow DGA access to the retained raster is sent to the
 *  X/NeWS server.  Should the server honor this request, shared memory
 *  mappings within the calling process's address space are then created.
 *  Should any of these steps fail, 0 is returned and the calling process
 *  is not allowed DGA to the retained raster.  A non-zero result is
 *  returned upon success.
 *
 *  Inputs:     Dga_window - Pointer to the Dga_window for which DGA
 *			     to the retained raster is desired.
 *
 *  Outputs:     0 - failed
 *		-1 - passed
 *
 *  Globals:    None.
 *
 */
int
dga_rtn_grab(Dga_window clientpi _X_UNUSED)
{
    return (RTN_FAILED);
}

/*
 *
 *  dga_rtn_pixels()
 *
 *  DGA Retained Pixel Memory .  This function returns a pointer
 *  to the shared retained pixel memory.
 *
 *  Inputs:     Dga_window - Pointer to the client structure.
 *
 *  Outputs:    u_char * - Pointer to retained pixel memory.
 *
 *  Globals:    None.
 *
 *  Externals:  None.
 *
 *
 */
void *
dga_rtn_pixels(Dga_window clientpi _X_UNUSED)
{
    return (NULL);
}

/*
 *
 *  dga_rtn_ungrab()
 *
 *  DGA Retained Window Ungrab.  This function frees the resources
 *  associated with a DGA retained retained raster.  The shared
 *  memory mappings in the calling process's address space are
 *  unmapped, the shared info file is closed, and the server is
 *  notified through a protocol extension to free all its resources
 *  associated with the DGA retained raster.  Should any of these
 *  steps fail, 0 is returned.  A non-zero result is returned upon
 *  success.
 *
 *  Inputs:     Dga_window - Pointer to the Dga_window for which DGA
 *                           to the retained raster is desired.
 *
 *  Outputs:     0 - failed
 *              -1 - passed
 *
 *  Globals:    None.
 *
 */
int
dga_rtn_ungrab(Dga_window clientpi _X_UNUSED)
{
    return (RTN_FAILED);
}

int
dgai_rtn_ungrab_common(
    _Dga_window  clientp _X_UNUSED,
    int	drawableGrabber  _X_UNUSED)
{
    return (RTN_FAILED);
}

/*
 *
 *  _dga_rtn_map()
 *
 *  DGA Retained Window Map.  This function maps the retained window
 *  shared memory into the clients address space after determining
 *  the path to the retained window information file.  The shared
 *  retained info structure is mapped followed by the actual pixel
 *  array used when the pixels are not cached in hardware.  The
 *  address of the shared retained info structure is then place in
 *  the dga_window structure along with the client dependent information.
 *  Should any operation fail, a NULL pointer is placed in the dga_window
 *  structure and 0 is returned.
 *
 *  Inputs:	Dga_window - Pointer to the dga_window structure
 *
 *  Outputs:	 0 - failed
 *		-1 - passed
 *
 *  Globals:	None.
 *
 */
int
_dga_rtn_map(_Dga_window clientp _X_UNUSED)
{
    return (RTN_FAILED);
}

/*
 *
 *  _dga_rtn_unmap()
 *
 *  DGA Retained Window Unmap.  This function unmaps the retained window
 *  shared memory from the clients address space given the pointer to the
 *  dga_window structure.  The pixel array associated with the retained info
 *  structure is unmapped first followed by the shared retained info
 *  structure.  The pointer to the shared memory info structure within the
 *  dga_window structure is set to NULL and the shared memory file is then
 *  closed.  Should any operation fail zero is returned.
 *
 *  Inputs:     Dga_window - Pointer to the dga_window structure for which
 *			     the shared retained info structure is to
 *			     be removed.
 *
 *  Outputs:     0 - failed
 *		-1 - passed
 *
 *  Globals:    None.
 *
 */
int
_dga_rtn_unmap(_Dga_window clientp _X_UNUSED)
{
    return (RTN_FAILED);
}

void *
dga_win_bboxinfop(Dga_window clientpi _X_UNUSED)
{
    return (NULL);
}
