/*
 * Copyright (c) 2017, Oracle and/or its affiliates. All rights reserved.
 */

#include "crypto_int.h"
#include <libucrypto.h>

krb5_error_code
k5_sha256(const krb5_data *in, uint8_t out[K5_SHA256_HASHLEN])
{
    int r;
    size_t outlen = K5_SHA256_HASHLEN;

    r = ucrypto_digest(CRYPTO_SHA256, NULL, 0, (uchar_t *)in->data, 
                       (size_t)in->length, (uchar_t *)out, &outlen);
    return ((r == CRYPTO_SUCCESS) ? 0 : KRB5_CRYPTO_INTERNAL);
}
