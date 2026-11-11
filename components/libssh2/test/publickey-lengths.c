/* Copyright (c) 2026, Oracle and/or its affiliates. */

/*
 * Exercise the actual publickey parsers with synthetic subsystem replies.
 * Replace channel I/O so the tests need no SSH server. Including publickey.c
 * makes its private initialization parser available; other implementation
 * dependencies come from the matching build's static libssh2 archive.
 */
#define _libssh2_channel_read fixture_read
#define _libssh2_channel_write fixture_write
#define _libssh2_channel_close fixture_close
#include "publickey.c"
#include <stdlib.h>
#include <stdio.h>

#define CHECK(c) do { \
    if(!(c)) { \
        fprintf(stderr, "%s:%d: %s\n", __FILE__, __LINE__, #c); \
        exit(1); \
    } \
} while(0)

enum field { COMMENT, NAME, BLOB, ATTR_NAME, ATTR_VALUE, DESCRIPTION, LANGUAGE };
static const char *field_names[] = {
    "comment", "name", "blob", "attribute name", "attribute value",
    "description", "language"
};
static unsigned char wire[3 * LIBSSH2_PACKET_MAXPAYLOAD];
static size_t used, consumed;
static unsigned cases;

ssize_t fixture_read(LIBSSH2_CHANNEL *channel, int stream, char *buf, size_t n)
{
    (void)channel;
    (void)stream;
    if(n > used - consumed)
        return LIBSSH2_ERROR_CHANNEL_PACKET_EXCEEDED;
    memcpy(buf, wire + consumed, n);
    consumed += n;
    return (ssize_t)n;
}

ssize_t fixture_write(LIBSSH2_CHANNEL *channel, int stream,
                      const unsigned char *buf, size_t n)
{
    (void)channel;
    (void)stream;
    (void)buf;
    return (ssize_t)n;
}

int fixture_close(LIBSSH2_CHANNEL *channel)
{
    (void)channel;
    return 0;
}

static void number(uint32_t n)
{
    CHECK(used + 4 <= sizeof(wire));
    _libssh2_htonu32(wire + used, n);
    used += 4;
}

static size_t begin(const char *type)
{
    size_t start = used, n = strlen(type);
    number(0);
    number((uint32_t)n);
    CHECK(used + n <= sizeof(wire));
    memcpy(wire + used, type, n);
    used += n;
    return start;
}

static void end(size_t start)
{
    _libssh2_htonu32(wire + start, (uint32_t)(used - start - 4));
}

/* Return true when the selected string is truncated. */
static int string_field(enum field current, enum field selected,
                        uint32_t declared, size_t available)
{
    if(current != selected) {
        number(0);
        return 0;
    }
    number(declared);
    CHECK(used + available <= sizeof(wire));
    memset(wire + used, 'x', available);
    used += available;
    return available != declared;
}

static void key_reply(unsigned version, enum field field,
                      uint32_t declared, size_t available)
{
    size_t start = begin("publickey");
    if(version == 1 && string_field(COMMENT, field, declared, available))
        goto done;
    if(string_field(NAME, field, declared, available))
        goto done;
    if(string_field(BLOB, field, declared, available))
        goto done;
    if(version == 2) {
        number(field == ATTR_NAME || field == ATTR_VALUE ? 1 : 0);
        if(field == ATTR_NAME || field == ATTR_VALUE) {
            if(string_field(ATTR_NAME, field, declared, available))
                goto done;
            (void)string_field(ATTR_VALUE, field, declared, available);
        }
    }
done:
    end(start);
}

static void status_reply(enum field field, uint32_t declared, size_t available)
{
    size_t start = begin("status");
    number(LIBSSH2_PUBLICKEY_SUCCESS);
    if(!string_field(DESCRIPTION, field, declared, available))
        (void)string_field(LANGUAGE, field, declared, available);
    end(start);
}

static void parse(unsigned version, int initializing, int expected,
                  const char *field, uint32_t length)
{
    LIBSSH2_SESSION *session = libssh2_session_init();
    LIBSSH2_CHANNEL channel;
    LIBSSH2_PUBLICKEY pkey;
    libssh2_publickey_list *list = NULL;
    unsigned long count = 0;
    int rc;

    CHECK(session);
    libssh2_session_set_blocking(session, 0);
    memset(&channel, 0, sizeof(channel));
    memset(&pkey, 0, sizeof(pkey));
    channel.session = session;
    pkey.channel = &channel;
    pkey.version = version;
    consumed = 0;
    if(initializing) {
        session->pkeyInit_state = libssh2_NB_state_sent3;
        session->pkeyInit_channel = &channel;
        session->pkeyInit_pkey = LIBSSH2_CALLOC(session, sizeof(pkey));
        CHECK(session->pkeyInit_pkey);
        session->pkeyInit_pkey->channel = &channel;
        CHECK(!publickey_init(session));
        rc = -1;
        /* A complete STATUS is an initialization protocol failure. */
        if(!expected)
            expected = LIBSSH2_ERROR_PUBLICKEY_PROTOCOL;
        CHECK(session->pkeyInit_state == libssh2_NB_state_idle);
    }
    else
        rc = libssh2_publickey_list_fetch(&pkey, &count, &list);

    if((expected && (rc != -1 ||
                     libssh2_session_last_errno(session) != expected)) ||
       (!expected && rc != 0)) {
        fprintf(stderr, "version %u %s %s length 0x%08lx: "
                "rc=%d error=%d, expected %d\n", version,
                initializing ? "init" : "list", field, (unsigned long)length,
                rc, libssh2_session_last_errno(session), expected);
        if(list && count)
            fprintf(stderr, "returned name_len=0x%08lx\n", list[0].name_len);
        exit(1);
    }
    if(!initializing && !expected)
        CHECK(consumed == used);
    libssh2_publickey_list_free(&pkey, list);
    CHECK(libssh2_session_free(session) == 0);
    cases++;
}

static void check_field(unsigned version, int initializing, enum field field,
                        uint32_t length, size_t available, int expected)
{
    used = 0;
    if(field == DESCRIPTION || field == LANGUAGE)
        status_reply(field, length, available);
    else {
        key_reply(version, field, length, available);
        status_reply(DESCRIPTION, 0, 0);
    }
    parse(version, initializing, expected, field_names[field], length);
}

static void parse_success_response(int expected)
{
    LIBSSH2_SESSION *session = libssh2_session_init();
    LIBSSH2_CHANNEL channel;
    LIBSSH2_PUBLICKEY pkey;
    int rc;

    CHECK(session);
    memset(&channel, 0, sizeof(channel));
    memset(&pkey, 0, sizeof(pkey));
    channel.session = session;
    pkey.channel = &channel;
    consumed = 0;
    rc = publickey_response_success(&pkey);
    CHECK(rc == expected);
    CHECK(libssh2_session_last_errno(session) == expected);
    CHECK(pkey.receive_packet == NULL);
    CHECK(libssh2_session_free(session) == 0);
    cases++;
}

static void field_cases(unsigned version, int initializing, enum field field)
{
    check_field(version, initializing, field, 0, 0, 0);
    check_field(version, initializing, field, LIBSSH2_PACKET_MAXPAYLOAD,
                LIBSSH2_PACKET_MAXPAYLOAD, 0);
    check_field(version, initializing, field, 8, 0,
                LIBSSH2_ERROR_BUFFER_TOO_SMALL);
    check_field(version, initializing, field, LIBSSH2_PACKET_MAXPAYLOAD + 1,
                0, LIBSSH2_ERROR_OUT_OF_BOUNDARY);
    check_field(version, initializing, field, UINT32_C(0xfffffff8), 0,
                LIBSSH2_ERROR_OUT_OF_BOUNDARY);
    check_field(version, initializing, field, UINT32_MAX, 0,
                LIBSSH2_ERROR_OUT_OF_BOUNDARY);
}

int main(int argc, char **argv)
{
    unsigned version;
    size_t start;
    CHECK(libssh2_init(0) == 0);
    /* Kryten's exact 21-byte version-1 packet, then successful STATUS. */
    used = 0;
    key_reply(1, NAME, UINT32_C(0xfffffff8), 0);
    CHECK(used == 4 + 21);
    status_reply(DESCRIPTION, 0, 0);
    parse(1, 0, LIBSSH2_ERROR_OUT_OF_BOUNDARY, "review reproducer",
          UINT32_C(0xfffffff8));
    if(argc > 1 && !strcmp(argv[1], "reproducer")) {
        puts("PASS: exact 21-byte review reproducer rejected");
        libssh2_exit();
        return 0;
    }
    for(version = 1; version <= 2; version++) {
        field_cases(version, 0, NAME);
        field_cases(version, 0, BLOB);
    }
    field_cases(1, 0, COMMENT);
    field_cases(2, 0, ATTR_NAME);
    field_cases(2, 0, ATTR_VALUE);
    field_cases(2, 0, DESCRIPTION);
    field_cases(2, 0, LANGUAGE);
    field_cases(2, 1, DESCRIPTION);
    field_cases(2, 1, LANGUAGE);
    /* Fixed-width name and status fields must also fit after the type. */
    for(version = 1; version <= 2; version++) {
        used = 0;
        start = begin("publickey");
        if(version == 1)
            number(0);
        memset(wire + used, 0, 3);
        used += 3;
        end(start);
        parse(version, 0, LIBSSH2_ERROR_BUFFER_TOO_SMALL, "short name header", 0);
    }
    for(version = 0; version <= 1; version++) {
        used = 0;
        start = begin("status");
        number(0);
        end(start);
        parse(2, version, LIBSSH2_ERROR_BUFFER_TOO_SMALL, "short status", 0);
    }
    /* Exact fixed-width truncations reported by review. */
    used = 0;
    start = begin("version");
    end(start);
    CHECK(used == 4 + 11);
    parse(2, 1, LIBSSH2_ERROR_BUFFER_TOO_SMALL, "missing version", 0);
    used = 0;
    start = begin("status");
    end(start);
    CHECK(used == 4 + 10);
    parse_success_response(LIBSSH2_ERROR_BUFFER_TOO_SMALL);
    printf("PASS: %u publickey length cases (%u-bit)\n", cases,
           (unsigned)(8 * sizeof(void *)));
    libssh2_exit();
    return 0;
}
