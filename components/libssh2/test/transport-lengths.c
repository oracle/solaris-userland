/* Copyright (c) 2026, Oracle and/or its affiliates. */

/*
 * Exercise the actual transport reader with synthetic packet headers.
 * A MAC callback detects invalid read lengths without reading the buffer.
 * The cipher callback leaves test bytes unchanged. No SSH server is needed.
 */
#define _libssh2_transport_read length_test_read
#define _libssh2_transport_send length_test_send
#include "transport.c"
#include <stdlib.h>
#include <stdio.h>

#define CHECK(c) do { \
    if(!(c)) { \
        fprintf(stderr, "%s:%d: %s\n", __FILE__, __LINE__, #c); \
        exit(1); \
    } \
} while(0)

enum mode { ETM, FULL_PACKET, PLAINTEXT, CLASSIC };
static unsigned allocations, hash_calls, crypt_calls, cases;
static int counting;

static void *count_alloc(size_t n, void **abstract)
{
    (void)abstract;
    if(counting)
        allocations++;
    return malloc(n);
}

static void count_free(void *p, void **abstract)
{
    (void)abstract;
    free(p);
}

static void *count_realloc(void *p, size_t n, void **abstract)
{
    (void)abstract;
    if(counting)
        allocations++;
    return realloc(p, n);
}

static LIBSSH2_RECV_FUNC(recv_again)
{
    (void)socket;
    (void)buffer;
    (void)length;
    (void)flags;
    (void)abstract;
    return -EAGAIN;
}

static int get_length(LIBSSH2_SESSION *session, unsigned seq,
                      unsigned char *p, size_t n, unsigned *length,
                      void **abstract)
{
    (void)session;
    (void)seq;
    (void)abstract;
    CHECK(n >= 4);
    *length = _libssh2_ntohu32(p);
    return 0;
}

static int crypt_bytes(LIBSSH2_SESSION *session, unsigned seq,
                       unsigned char *p, size_t n, void **abstract, int flags)
{
    (void)session;
    (void)seq;
    (void)p;
    (void)abstract;
    (void)flags;
    CHECK(n <= MAX_BLOCKSIZE);
    crypt_calls++;
    return 0;
}

static int hash_bytes(LIBSSH2_SESSION *session, unsigned char *out,
                      uint32_t seq, const unsigned char *packet, size_t n,
                      const unsigned char *additional, size_t additional_len,
                      void **abstract)
{
    (void)seq;
    (void)packet;
    (void)additional;
    (void)abstract;
    hash_calls++;
    if(n > session->packet.total_num ||
       additional_len > session->packet.total_num) {
        fprintf(stderr, "MAC read length %lu exceeds allocation %lu\n",
                (unsigned long)n, (unsigned long)session->packet.total_num);
        exit(2);
    }
    memset(out, 0, session->remote.mac->mac_len);
    return 0;
}

static void run(enum mode mode, uint32_t length, uint32_t previous,
                unsigned mac_length, size_t input, int expected)
{
    LIBSSH2_CRYPT_METHOD crypt;
    LIBSSH2_MAC_METHOD mac;
    LIBSSH2_SESSION *session;
    int rc;

    counting = 0;
    session = libssh2_session_init_ex(count_alloc, count_free,
                                     count_realloc, NULL);
    CHECK(session);
    libssh2_session_set_blocking(session, 0);
    memset(&crypt, 0, sizeof(crypt));
    memset(&mac, 0, sizeof(mac));
    crypt.name = "fixture";
    crypt.blocksize = 16;
    crypt.crypt = crypt_bytes;
    if(mode == FULL_PACKET) {
        crypt.flags = LIBSSH2_CRYPT_FLAG_REQUIRES_FULL_PACKET |
                      LIBSSH2_CRYPT_FLAG_PKTLEN_AAD;
        crypt.auth_len = 16;
        crypt.get_len = get_length;
    }
    mac.name = "fixture";
    mac.mac_len = mac_length;
    mac.etm = mode == ETM;
    mac.hash = hash_bytes;
    session->remote.crypt = &crypt;
    session->remote.mac = &mac;
    session->recv = recv_again;
    session->state = mode == PLAINTEXT ? 0 : LIBSSH2_STATE_NEWKEYS;
    session->packet.packet_length = previous;
    CHECK(input <= sizeof(session->packet.buf));
    memset(session->packet.buf, 0, input);
    _libssh2_htonu32(session->packet.buf, length);
    if(input >= 6 && length >= 2) {
        session->packet.buf[4] = (unsigned char)(length - 2);
        session->packet.buf[5] = SSH_MSG_IGNORE;
    }
    session->packet.writeidx = input;
    allocations = hash_calls = crypt_calls = 0;
    counting = 1;
    rc = length_test_read(session);
    counting = 0;
    if(rc != expected) {
        fprintf(stderr, "mode=%u length=0x%08lx previous=0x%08lx "
                "MAC=%u: rc=%d expected=%d\n", mode,
                (unsigned long)length, (unsigned long)previous,
                mac_length, rc, expected);
        exit(1);
    }
    if(mode == ETM)
        CHECK(session->packet.packet_length == length);
    if(expected == LIBSSH2_ERROR_EAGAIN) {
        CHECK(allocations == 1 && hash_calls == 0 && crypt_calls == 0);
        CHECK(session->packet.total_num == 4 + (size_t)length + mac_length);
    }
    else if(expected == SSH_MSG_IGNORE) {
        CHECK(allocations == (mode == ETM ? 2 : 1));
        CHECK(hash_calls == (mode == PLAINTEXT ? 0 : 1));
        CHECK(crypt_calls == (mode == PLAINTEXT ? 0 : 2));
    }
    else if(mode == ETM && length > 0 && length < 16) {
        /* A bounded but short ciphertext reaches the CVE-2026-66035 guard. */
        CHECK(allocations == 1 && hash_calls == 1 && crypt_calls == 0);
        CHECK(session->packet.payload == NULL);
    }
    else {
        CHECK(allocations == 0 && hash_calls == 0);
        CHECK(session->packet.payload == NULL);
        if(mode == ETM || mode == FULL_PACKET)
            CHECK(crypt_calls == 0);
    }
    session->remote.crypt = NULL;
    session->remote.mac = NULL;
    session->state = 0;
    session->socket_state = LIBSSH2_SOCKET_DISCONNECTED;
    CHECK(libssh2_session_free(session) == 0);
    cases++;
}

int main(int argc, char **argv)
{
    static const unsigned mac_sizes[] = { 16, 32, 64 };
    static const uint32_t previous[] = { 0, 32, LIBSSH2_PACKET_MAXPAYLOAD + 1 };
    static const uint32_t bad[] = {
        0, LIBSSH2_PACKET_MAXPAYLOAD + 1, UINT32_C(0xfffffff0), UINT32_MAX
    };
    unsigned i, j, k;

    CHECK(libssh2_init(0) == 0);
    /* Previously wrapped to a 20-byte allocation before MAC hashing. */
    run(ETM, UINT32_C(0xfffffff0), 32, 32, 20,
        LIBSSH2_ERROR_OUT_OF_BOUNDARY);
    if(argc > 1 && !strcmp(argv[1], "reproducer")) {
        puts("PASS: ETM wraparound rejected before allocation or MAC hashing");
        libssh2_exit();
        return 0;
    }
    for(i = 0; i < sizeof(mac_sizes) / sizeof(mac_sizes[0]); i++) {
        unsigned mac = mac_sizes[i];
        uint32_t limit = LIBSSH2_PACKET_MAXPAYLOAD - 4 - mac;
        for(j = 0; j < sizeof(previous) / sizeof(previous[0]); j++) {
            for(k = 0; k < sizeof(bad) / sizeof(bad[0]); k++)
                run(ETM, bad[k], previous[j], mac, 20,
                    bad[k] ? LIBSSH2_ERROR_OUT_OF_BOUNDARY :
                             LIBSSH2_ERROR_DECRYPT);
            run(ETM, 32, previous[j], mac, 4 + 32 + mac, SSH_MSG_IGNORE);
        }
        run(ETM, limit, 32, mac, 16, LIBSSH2_ERROR_EAGAIN);
        run(ETM, limit + 1, 32, mac, 16, LIBSSH2_ERROR_OUT_OF_BOUNDARY);
        run(ETM, 15, 32, mac, 4 + 15 + mac, LIBSSH2_ERROR_DECRYPT);
    }
    for(k = 0; k < sizeof(bad) / sizeof(bad[0]); k++)
        run(FULL_PACKET, bad[k], 32, 32, 16,
            bad[k] ? LIBSSH2_ERROR_OUT_OF_BOUNDARY : LIBSSH2_ERROR_DECRYPT);
    run(PLAINTEXT, 32, 0, 0, 36, SSH_MSG_IGNORE);
    run(PLAINTEXT, LIBSSH2_PACKET_MAXPAYLOAD + 1, 0, 0, 16,
        LIBSSH2_ERROR_OUT_OF_BOUNDARY);
    run(CLASSIC, 28, 0, 32, 4 + 28 + 32, SSH_MSG_IGNORE);
    run(CLASSIC, LIBSSH2_PACKET_MAXPAYLOAD + 1, 0, 32, 16,
        LIBSSH2_ERROR_OUT_OF_BOUNDARY);
    printf("PASS: %u transport length cases (%u-bit)\n", cases,
           (unsigned)(8 * sizeof(void *)));
    libssh2_exit();
    return 0;
}
