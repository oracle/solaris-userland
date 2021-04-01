/*
 * Copyright (c) 2021, Oracle and/or its affiliates.
 */

#include "crypto_int.h"
#include <libucrypto.h>

/* ARGSUSED */
krb5_error_code
k5_sha256(const krb5_data *in, size_t blocks, uint8_t out[K5_SHA256_HASHLEN])
{
    int r;
    size_t outlen = K5_SHA256_HASHLEN;
    size_t i;
    crypto_ctx_t	ctx;

    r = ucrypto_digest_init(&ctx, CRYPTO_SHA256, NULL, 0);
    for (i = 0; (i < blocks) && (r == CRYPTO_SUCCESS); i++)
	    r = ucrypto_digest_update(&ctx, (uchar_t *)in[i].data, 
	       in[i].length);
    if (r == CRYPTO_SUCCESS)
	    r = ucrypto_digest_final(&ctx, out, &outlen);

    return ((r == CRYPTO_SUCCESS) ? 0 : KRB5_CRYPTO_INTERNAL);
}
