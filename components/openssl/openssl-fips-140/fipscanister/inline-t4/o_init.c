/* o_init.c */
/*
 * Written by Dr Stephen N Henson (steve@openssl.org) for the OpenSSL
 * project.
 */
/* ====================================================================
 * Copyright (c) 2011 The OpenSSL Project.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the
 *    distribution.
 *
 * 3. All advertising materials mentioning features or use of this
 *    software must display the following acknowledgment:
 *    "This product includes software developed by the OpenSSL Project
 *    for use in the OpenSSL Toolkit. (http://www.openssl.org/)"
 *
 * 4. The names "OpenSSL Toolkit" and "OpenSSL Project" must not be used to
 *    endorse or promote products derived from this software without
 *    prior written permission. For written permission, please contact
 *    openssl-core@openssl.org.
 *
 * 5. Products derived from this software may not be called "OpenSSL"
 *    nor may "OpenSSL" appear in their names without prior written
 *    permission of the OpenSSL Project.
 *
 * 6. Redistributions of any form whatsoever must retain the following
 *    acknowledgment:
 *    "This product includes software developed by the OpenSSL Project
 *    for use in the OpenSSL Toolkit (http://www.openssl.org/)"
 *
 * THIS SOFTWARE IS PROVIDED BY THE OpenSSL PROJECT ``AS IS'' AND ANY
 * EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE OpenSSL PROJECT OR
 * ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * ====================================================================
 *
 */

#ifdef __linux__
#define _GNU_SOURCE
#endif
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <dlfcn.h>
#include <e_os.h>
#include <openssl/err.h>
#ifdef OPENSSL_FIPS
# include <openssl/fips.h>
# include <openssl/rand.h>
# include <openssl/fips_rand.h>
#endif

#define	OPENSSL_DRBG_DEFAULT_TYPE	NID_aes_256_ctr
#define	OPENSSL_DRBG_DEFAULT_FLAGS	DRBG_FLAG_CTR_USE_DF

int fips_drbg_type = OPENSSL_DRBG_DEFAULT_TYPE;
int fips_drbg_flags = OPENSSL_DRBG_DEFAULT_FLAGS;

/*
 * FIPS DRBG initialisation code. This sets up the DRBG for use by the rest
 * of OpenSSL.
 */

/*
 * Entropy gatherer: use standard getentropy to seed
 */

static size_t drbg_get_entropy(DRBG_CTX *ctx, unsigned char **pout,
                               int entropy, size_t min_len, size_t max_len)
{
    int		fd;
    ssize_t	rnd_len = 0;
    int		(*getentropy)(void *buf, size_t buflen);

    /* Round up request to multiple of block size */
    min_len = ((min_len + 19) / 20) * 20;
    *pout = OPENSSL_malloc(min_len);
    if (!*pout)
        return 0;

    /* if the OS provides getentropy(), use the function*/
    getentropy = (int (*)())dlsym(RTLD_DEFAULT, "getentropy");
    if (getentropy) {
        if (getentropy(*pout, min_len) != 0) {
            OPENSSL_free(*pout);
            *pout = NULL;
            return 0;
        }
        return (min_len);
    }

    // OS does not provide getentropy() so emulate it ourselves

    fd = open("/dev/urandom", O_RDONLY);
    if (fd < 0) {
            return (0);
    }
    while (rnd_len < min_len) {
        ssize_t result = read(fd, *pout + rnd_len,
            (min_len - rnd_len) > 256 ? 256 : (min_len - rnd_len));
        if (result < 0) {
            (void) close(fd);
            return (0);
        }
        rnd_len += result;
    }
    (void) close(fd);
    return (min_len);
}

static void drbg_free_entropy(DRBG_CTX *ctx, unsigned char *out, size_t olen)
{
    if (out) {
        OPENSSL_cleanse(out, olen);
        OPENSSL_free(out);
    }
}

static size_t drbg_get_adin(DRBG_CTX *ctx, unsigned char **pout)
{
    /* Use of static variables is OK as this happens under a lock */
    static unsigned char buf[16];
    static unsigned long counter;
    FIPS_get_timevec(buf, &counter);
    *pout = buf;
    return sizeof(buf);
}

/*
 * Perform any essential OpenSSL initialization operations. Currently only
 * sets FIPS callbacks
 */

static int solaris_RAND_init_fips(void)
{
    DRBG_CTX *dctx;
    size_t plen;
    unsigned char pers[32], *p;

    dctx = FIPS_get_default_drbg();
    if (FIPS_drbg_init(dctx, fips_drbg_type, fips_drbg_flags) <= 0) {
        return 0;
    }

    FIPS_drbg_set_callbacks(dctx,
                            drbg_get_entropy, drbg_free_entropy, 20,
                            drbg_get_entropy, drbg_free_entropy);
    FIPS_drbg_set_rand_callbacks(dctx, drbg_get_adin, 0,
                                 NULL, NULL);
                                 /*drbg_rand_seed, drbg_rand_add);*/
    /* Personalisation string: a string followed by date time vector */
    strcpy((char *)pers, "OpenSSL DRBG2.0");
    plen = drbg_get_adin(dctx, &p);
    memcpy(pers + 16, p, plen);

    if (FIPS_drbg_instantiate(dctx, pers, sizeof(pers)) <= 0) {
        return 0;
    }
    FIPS_rand_set_method(FIPS_drbg_method());
    return 1;
}

int solaris_fips_OPENSSL_init(void)
{
    static int done = 0;
    if (done)
        return 1;
    done = 1;

    solaris_RAND_init_fips();

#ifndef FIPS_AUTH_USER_PASS
#define FIPS_AUTH_USER_PASS     "Default FIPS Crypto User Password"
#endif
    if (!FIPS_module_mode_set(1, FIPS_AUTH_USER_PASS))
        return 0;

    return 1;
}
