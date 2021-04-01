/*
 * Copyright (c) 2004, 2021, Oracle and/or its affiliates.
 */

#include <stdlib.h>

#include "k5-int.h"
#include "rc-int.h"
#include "memrcache.h"

static k5_mutex_t	rc_mtx = K5_MUTEX_PARTIAL_INITIALIZER;
static k5_memrcache	rc_memrcache = NULL;

static void
krb5_rc_mem_atexit(void)
{
	(void) k5_mutex_destroy(&rc_mtx);
	if (rc_memrcache != NULL) {
		k5_memrcache_free(NULL, rc_memrcache);
		rc_memrcache = NULL;
	}
}

/*ARGSUSED*/
static krb5_error_code KRB5_CALLCONV
krb5_rc_mem_resolve(krb5_context context, const char *residual,
                    void **rcdata_out)
{
	krb5_error_code rv;

	k5_mutex_lock(&rc_mtx);
	if (rc_memrcache == NULL) {
		rv = k5_memrcache_create(context, &rc_memrcache);
		if (rv == 0) {
			(void) atexit(krb5_rc_mem_atexit);
			*rcdata_out = NULL;
		}
	} else {
		rv = 0;
		*rcdata_out = NULL;
	}
	k5_mutex_unlock(&rc_mtx);

	return (rv);
}

/*
 * We want the replay cache to be persistent since we can't
 * read from a file to retrieve the rcache, so we must not free
 * here.  Just return success.
 */
/* ARGSUSED */
static void KRB5_CALLCONV
krb5_rc_mem_close(krb5_context context, void *rcdata)
{
	return;
}

/*
 * of course, list is backwards
 * hash could be forwards since we have to search on match, but naaaah
 */
/* ARGSUSED */
static krb5_error_code KRB5_CALLCONV
krb5_rc_mem_store(krb5_context context, void *rcdata, const krb5_data *tag)
{
	krb5_error_code	rv;

	k5_mutex_lock(&rc_mtx);
	if (rc_memrcache != NULL) {
		rv = k5_memrcache_store(context, rc_memrcache, tag);
	} else {
		rv = KRB5_RC_IO_UNKNOWN;
	}
	k5_mutex_unlock(&rc_mtx);

	return (rv);
}

const krb5_rc_ops k5_rc_mem_ops = {
    "MEMORY",
    krb5_rc_mem_resolve,
    krb5_rc_mem_close,
    krb5_rc_mem_store,
};
