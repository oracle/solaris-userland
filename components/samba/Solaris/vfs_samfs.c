/*
 * Support for offline files with Sun SAM-QFS
 *
 * Copyright (C) Dirk Nitschke, 2009
 *
 * Modified by Jiri Sasek, 2010
 * To conform the samba-vfs api
 *
 * for details see:
 * https://bugzilla.samba.org/show_bug.cgi?id=5780
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see <http://www.gnu.org/licenses/>.
 *
 */

#include "includes.h"
#include "smbd/smbd.h"
/*
 * Include files for Sun SAM-QFS
 *
 */
#include <samfs/stat.h>
#include <samfs/lib.h>

#undef DBGC_CLASS
#define DBGC_CLASS DBGC_VFS

#define SAMFS_MODULE_NAME "samfs"

/*
 * samfs_is_offline()
 * check if the local file is offline in the sense of SAM-QFS
 *
 * A segmented file is offline if the file's index inode is
 * offline or at least one of it's segments is offline.
 *
 * See sam_stat(3) and sam_segment_stat(3) for details.
 *
 * If something goes wrong we assume that the file is offline.
 */
static bool samfs_is_offline(struct vfs_handle_struct *handle, const struct smb_filename *fname, SMB_STRUCT_STAT *sbuf)
{
	struct sam_stat file_info;
	struct sam_stat *seg_info_ptr;
	int number_of_segments, number_of_segments_offline = 0;
	int result;
	int i;
	NTSTATUS status;
	char *path;

        status = get_full_smb_filename(talloc_tos(), fname, &path);
        if (!NT_STATUS_IS_OK(status)) {
                errno = map_errno_from_nt_status(status);
                return false;
        }

	if (ISDOT(path) || ISDOTDOT(path)) {
		return false;
	}

	/*
	 * Initialize file_info to be all zero bits
	 */
	memset((void *)&file_info, 0, sizeof(struct sam_stat));

	/*
	 * Stat the file using the regular sam_stat function
	 */
	result = sam_stat(path, &file_info, sizeof(struct sam_stat));

	if (result != 0) {
		DEBUG(10,("samfs_is_offline: cannot sam_stat %s, %s\nAssuming file is offline.\n", \
			path, strerror(errno)));
		return true;
	}

	/*
	 * Check if file is offline
	 */
	if (SS_ISOFFLINE(file_info.attr)) {
		DEBUG(10,("samfs_is_offline: file %s is offline.\n", path));
		return true;
	}

	/*
	 * Check for segmented file
	 */
	if (SS_ISSEGMENT_F(file_info.attr)) {
		number_of_segments = NUM_SEGS(&file_info);
		seg_info_ptr = (struct sam_stat *)talloc_zero_array(talloc_tos(),
						struct sam_stat, number_of_segments);
		if (seg_info_ptr == NULL) {
			DEBUG(10,("samfs_is_offline: cannot talloc for "
				"segment stat info %s\nAssuming file is offline.\n",
				path));
			return true;
		}

		/*
		 * Stat all segments
		 */
		result = sam_segment_stat(path, seg_info_ptr,
			number_of_segments * sizeof(struct sam_stat));
		if (result != 0) {
			DEBUG(10,("samfs_is_offline: cannot sam_segment_stat %s, "
				"%s\nAssuming file is offline.\n",
				path, strerror(errno)));
			TALLOC_FREE(seg_info_ptr);
			return true;
		}
		/*
		 * Loop over segments until we have checked all segments
		 * or found one which is offline.
		 */
		for (i = 0; i < number_of_segments; i++) {
			if (SS_ISOFFLINE(seg_info_ptr[i].attr)) {
				number_of_segments_offline++;
			}
		}
		DEBUG(10,("samfs_is_offline: file %s has %d offline segments\n"
			, path, number_of_segments_offline));
		TALLOC_FREE(seg_info_ptr);
	}
	return (number_of_segments_offline) ? true : false ;
}

/*
 * samfs_set_offline()
 *
 * Release the local file in the sense of SAM-QFS.
 * See sam_release(3) for details.
 *
 */
static NTSTATUS samfs_set_offline(struct vfs_handle_struct *handle, const struct smb_filename *fname)
{
	int result;
	NTSTATUS status;
	char *path;

        status = get_full_smb_filename(talloc_tos(), fname, &path);
        if (!NT_STATUS_IS_OK(status)) {
		return status;
        }

	/*
	 * release a file-command to SAM-stager
	 */
	result = sam_release(path, "i");
	if (result != 0) {
		DEBUG(10,("samfs_set_offline: sam_release %s returned %s\n",
			path, strerror(errno)));
		return NT_STATUS_INTERNAL_ERROR;
	}
	return NT_STATUS_OK;
}

/* DOS attributes operations */

static NTSTATUS samfs_get_dos_attributes(struct vfs_handle_struct *handle,
					 struct smb_filename *fname,
					 uint32_t *dosmode)
{
	bool offline;

	offline = samfs_is_offline(handle, fname, &fname->st);
	if (offline) {
		*dosmode |= FILE_ATTRIBUTE_OFFLINE;
	}

	return SMB_VFS_NEXT_GET_DOS_ATTRIBUTES(handle, fname, dosmode);
}

static NTSTATUS samfs_fget_dos_attributes(struct vfs_handle_struct *handle,
					  files_struct *fsp,
					  uint32_t *dosmode)
{
	bool offline;

	offline = samfs_is_offline(handle, fsp->fsp_name, &fsp->fsp_name->st);
	if (offline) {
		*dosmode |= FILE_ATTRIBUTE_OFFLINE;
	}

	return SMB_VFS_NEXT_FGET_DOS_ATTRIBUTES(handle, fsp, dosmode);
}

static NTSTATUS samfs_set_dos_attributes(struct vfs_handle_struct *handle,
					 const struct smb_filename *smb_fname,
					 uint32_t dosmode)
{
	NTSTATUS status;
	uint32_t old_dosmode;
	struct smb_filename *fname = NULL;

	/* dos_mode() doesn't like const smb_fname */
	fname = cp_smb_filename(talloc_tos(), smb_fname);
	if (fname == NULL) {
		return NT_STATUS_NO_MEMORY;
	}

	old_dosmode = dos_mode(handle->conn, fname);
	TALLOC_FREE(fname);

	status = SMB_VFS_NEXT_SET_DOS_ATTRIBUTES(handle, smb_fname, dosmode);
	if (!NT_STATUS_IS_OK(status)) {
		return status;
	}

	if (!(old_dosmode & FILE_ATTRIBUTE_OFFLINE) &&
	    (dosmode & FILE_ATTRIBUTE_OFFLINE))
	{
		return NT_STATUS_OK;
	}

	return samfs_set_offline(handle, smb_fname);
}

static NTSTATUS samfs_fset_dos_attributes(struct vfs_handle_struct *handle,
					  struct files_struct *fsp,
					  uint32_t dosmode)
{
	NTSTATUS status;
	uint32_t old_dosmode;

	old_dosmode = dos_mode(handle->conn, fsp->fsp_name);

	status = SMB_VFS_NEXT_FSET_DOS_ATTRIBUTES(handle, fsp, dosmode);
	if (!NT_STATUS_IS_OK(status)) {
		return status;
	}

	if (!(old_dosmode & FILE_ATTRIBUTE_OFFLINE) &&
	    (dosmode & FILE_ATTRIBUTE_OFFLINE))
	{
		return NT_STATUS_OK;
	}

	return samfs_set_offline(handle, fsp->fsp_name);
}

/* VFS operations structure */

static struct vfs_fn_pointers samfs_fns = {
	.set_dos_attributes_fn = samfs_set_dos_attributes,
	.fset_dos_attributes_fn = samfs_fset_dos_attributes,
	.get_dos_attributes_fn = samfs_get_dos_attributes,
	.fget_dos_attributes_fn = samfs_fget_dos_attributes,
};

NTSTATUS vfs_samfs_init(TALLOC_CTX *);
NTSTATUS vfs_samfs_init(TALLOC_CTX *ctx)
{
	return smb_register_vfs(SMB_VFS_INTERFACE_VERSION, SAMFS_MODULE_NAME,
		&samfs_fns);
}
