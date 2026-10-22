/*
 * Copyright (c) 2026, Oracle and/or its affiliates.
 *
 * Solaris stream transport and normal HTTP lifecycle regression tests.
 * This file is distributed under the same LGPLv2.1+ terms as libmicrohttpd.
 */
#include "platform.h"
#include <microhttpd.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

struct stream {
  const char *input;
  size_t offset;
  char output[8192];
  size_t written;
  unsigned int reads, writes, started, closed, completed, requests;
  unsigned int pending;
  int mode, eof, failed, defer, immediate;
};

#define CHECK(x) do { if (!(x)) { \
  fprintf(stderr, "check failed at line %d: %s\n", __LINE__, #x); \
  exit(1); } } while (0)

static ssize_t
stream_read(struct MHD_Connection *c, void *buf, size_t len)
{
  struct stream *s = MHD_get_stream_connection_data(c);
  size_t left = strlen(s->input) - s->offset;
  ++s->reads;
  if (s->reads == 1 || s->reads == 2) {
    errno = s->reads == 1 ? EINTR : EAGAIN;
    return -1;
  }
  if (s->failed) { errno = EIO; return -1; }
  if (!left) {
    if (s->eof) return 0;
    errno = EAGAIN;
    return -1;
  }
  if (len > left) len = left;
  if (len > 7) len = 7;
  memcpy(buf, s->input + s->offset, len);
  s->offset += len;
  return (ssize_t)len;
}

static ssize_t
stream_write(struct MHD_Connection *c, const void *buf, size_t len)
{
  struct stream *s = MHD_get_stream_connection_data(c);
  ++s->writes;
  if (s->writes == 1 || s->writes == 2) {
    errno = s->writes == 1 ? EAGAIN : EINTR;
    return -1;
  }
  if (len > 5) len = 5;
  CHECK(s->written + len < sizeof(s->output));
  memcpy(s->output + s->written, buf, len);
  s->written += len;
  s->output[s->written] = 0;
  return (ssize_t)len;
}

static void
connection_notify(void *cls, struct MHD_Connection *c, void **ctx,
                  enum MHD_ConnectionNotificationCode code)
{
  struct stream *s = cls;
  CHECK(MHD_get_stream_connection_data(c) == s);
  if (code == MHD_CONNECTION_NOTIFY_STARTED) {
    ++s->started;
    *ctx = s;
  } else {
    CHECK(*ctx == s);
    ++s->closed;
  }
}

static void
request_completed(void *cls, struct MHD_Connection *c, void **ctx,
                  enum MHD_RequestTerminationCode code)
{
  struct stream *s = cls;
  CHECK(*ctx == s);
  CHECK(code == MHD_REQUEST_TERMINATED_COMPLETED_OK);
  ++s->completed;
  *ctx = NULL;
}

static ssize_t
body_reader(void *cls, uint64_t pos, char *buf, size_t max)
{
  const char *body = "stream-body";
  size_t len = strlen(body);
  if (pos == len) return MHD_CONTENT_READER_END_OF_STREAM;
  CHECK(pos < len);
  len -= (size_t)pos;
  if (len > max) len = max;
  memcpy(buf, body + pos, len);
  return (ssize_t)len;
}

/* These int callbacks are the source interface used by unchanged ON. */
static int
request(void *cls, struct MHD_Connection *c, const char *url,
        const char *method, const char *version, const char *data,
        size_t *size, void **ctx)
{
  struct stream *s = cls;
  struct MHD_Response *r;
  int result;
  if (!*ctx) {
    *ctx = s;
    if (!s->immediate) return MHD_YES;
  }
  if (*size) { *size = 0; return MHD_YES; }
  if (s->defer) { ++s->pending; return MHD_YES; }
  ++s->requests;
  if (s->mode == 1)
    r = MHD_create_response_from_callback(MHD_SIZE_UNKNOWN, 8,
                                         body_reader, NULL, NULL);
  else if (s->mode == 2) {
    static const struct MHD_IoVec iov[] = {
      {"stream-", 7}, {"body", 4}
    };
    r = MHD_create_response_from_iovec(iov, 2, NULL, NULL);
  } else if (s->mode == 3) {
    char name[] = "/var/tmp/mhd-stream-XXXXXX";
    int fd = mkstemp(name);
    CHECK(fd >= 0);
    CHECK(unlink(name) == 0);
    CHECK(write(fd, "stream-body", 11) == 11);
    r = MHD_create_response_from_fd(11, fd);
  } else
    r = MHD_create_response_from_buffer(11, (void *)"stream-body",
                                       MHD_RESPMEM_PERSISTENT);
  CHECK(r != NULL);
  result = MHD_queue_response(c, MHD_HTTP_OK, r);
  MHD_destroy_response(r);
  return result;
}

static struct MHD_Daemon *
start(struct stream *s, unsigned int flags)
{
  return MHD_start_daemon(flags, 0, NULL, NULL, request, s,
                         MHD_OPTION_NOTIFY_COMPLETED, request_completed, s,
                         MHD_OPTION_NOTIFY_CONNECTION, connection_notify, s,
                         MHD_OPTION_END);
}

/* Verify the complete payload, including the chunked content-reader path. */
static void
check_body(const char *output, int chunked)
{
  const char *p = strstr(output, "\r\n\r\n");
  char body[32];
  size_t used = 0;
  CHECK(p != NULL);
  p += 4;
  if (!chunked) {
    CHECK(strncmp(p, "stream-body", 11) == 0);
    return;
  }
  for (;;) {
    char *end;
    unsigned long len = strtoul(p, &end, 16);
    CHECK(end != p && strncmp(end, "\r\n", 2) == 0);
    p = end + 2;
    if (!len) break;
    CHECK(used + len < sizeof(body));
    CHECK(strlen(p) >= len + 2 && strncmp(p + len, "\r\n", 2) == 0);
    memcpy(body + used, p, len);
    used += len;
    p += len + 2;
  }
  body[used] = 0;
  CHECK(strcmp(body, "stream-body") == 0);
}

static void
run_response(int mode)
{
  struct stream s;
  struct MHD_Daemon *d;
  unsigned int n;
  uint64_t timeout;
  memset(&s, 0, sizeof(s));
  s.mode = mode;
  s.defer = 1;
  s.input = "GET / HTTP/1.1\r\nHost: localhost\r\n\r\n";
  d = start(&s, MHD_USE_STREAM_CONNS);
  CHECK(d != NULL);
  CHECK(MHD_add_stream_connection(d, &s, stream_read, stream_write) == MHD_YES);
  for (n = 0; n < 10000 && !s.pending; ++n) CHECK(MHD_run(d) == MHD_YES);
  CHECK(s.pending != 0);
  CHECK(MHD_get_timeout64(d, &timeout) == MHD_YES && timeout == 0);
  s.defer = 0;
  for (n = 0; n < 10000 && s.completed != 1; ++n) CHECK(MHD_run(d) == MHD_YES);
  CHECK(s.requests == 1 && s.completed == 1 && s.started == 1 && !s.closed);
  CHECK(strstr(s.output, "200 OK") != NULL);
  check_body(s.output, mode == 1);
  if (mode == 1) CHECK(strstr(s.output, "Transfer-Encoding: chunked") != NULL);
  /* Finished work must not keep an idle application scheduling a zero wait. */
  CHECK(MHD_run(d) == MHD_YES);
  CHECK(MHD_get_timeout64(d, &timeout) == MHD_NO);

  /* Reuse the same connection after upstream releases the first response. */
  s.input = "POST / HTTP/1.1\r\nHost: localhost\r\nContent-Length: 4\r\n"
            "Expect: 100-continue\r\n\r\ndata";
  s.offset = 0;
  for (n = 0; n < 10000 && s.completed != 2; ++n) CHECK(MHD_run(d) == MHD_YES);
  CHECK(s.requests == 2 && s.completed == 2);
  CHECK(strstr(s.output, "100 Continue") != NULL);
  s.eof = 1;
  for (n = 0; n < 100 && !s.closed; ++n) CHECK(MHD_run(d) == MHD_YES);
  CHECK(s.closed == 1 && s.completed == 2);
  CHECK(MHD_get_timeout64(d, &timeout) == MHD_NO);
  MHD_stop_daemon(d);
  CHECK(s.closed == 1 && s.completed == 2);
}

/* RAD answers bodyless GET/HEAD/DELETE in the initial access callback. */
static void
run_rad_response(int mode)
{
  static const char *requests[] = {
    "GET / HTTP/1.1\r\nHost: localhost\r\n\r\n",
    "HEAD / HTTP/1.1\r\nHost: localhost\r\n\r\n",
    "DELETE / HTTP/1.1\r\nHost: localhost\r\n\r\n",
    "GET / HTTP/1.1\r\nHost: localhost\r\nContent-Length: 0\r\n\r\n"
  };
  struct stream s;
  struct MHD_Daemon *d;
  unsigned int i, n;
  memset(&s, 0, sizeof(s));
  s.mode = mode;
  s.immediate = 1;
  s.input = requests[0];
  d = start(&s, MHD_USE_STREAM_CONNS);
  CHECK(d != NULL);
  CHECK(MHD_add_stream_connection(d, &s, stream_read, stream_write) == MHD_YES);
  for (i = 0; i < sizeof(requests)/sizeof(requests[0]); ++i) {
    size_t before = s.written;
    const char *reply;
    s.input = requests[i];
    s.offset = 0;
    for (n = 0; n < 10000 && s.completed != i + 1; ++n)
      CHECK(MHD_run(d) == MHD_YES);
    CHECK(s.requests == i + 1 && s.completed == i + 1);
    CHECK(s.started == 1 && !s.closed);
    reply = s.output + before;
    CHECK(strstr(reply, "200 OK") != NULL);
    CHECK(strstr(reply, "Connection: close") == NULL);
    if (i == 1) {
      const char *body = strstr(reply, "\r\n\r\n");
      CHECK(body != NULL && body[4] == 0);
    } else
      check_body(reply, mode == 1);
  }
  s.eof = 1;
  for (n = 0; n < 100 && !s.closed; ++n) CHECK(MHD_run(d) == MHD_YES);
  CHECK(s.closed == 1 && s.completed == 4);
  MHD_stop_daemon(d);
  CHECK(s.closed == 1 && s.completed == 4);
}

/* An early reply must still close when a payload has not been consumed. */
static void
run_early_close(const char *input)
{
  struct stream s;
  struct MHD_Daemon *d;
  unsigned int n;
  memset(&s, 0, sizeof(s));
  s.immediate = 1;
  s.input = input;
  d = start(&s, MHD_USE_STREAM_CONNS);
  CHECK(d != NULL);
  CHECK(MHD_add_stream_connection(d, &s, stream_read, stream_write) == MHD_YES);
  for (n = 0; n < 10000 && !s.closed; ++n) CHECK(MHD_run(d) == MHD_YES);
  CHECK(s.requests == 1 && s.completed == 1);
  CHECK(s.started == 1 && s.closed == 1);
  CHECK(strstr(s.output, "200 OK") != NULL);
  CHECK(strstr(s.output, "Connection: close") != NULL);
  MHD_stop_daemon(d);
  CHECK(s.closed == 1 && s.completed == 1);
}

int
main(void)
{
  struct stream s;
  struct MHD_Daemon *d;
  int mode;
  char escaped[] = "a%20b";
  unsigned int bad[] = {MHD_USE_TLS, MHD_USE_INTERNAL_POLLING_THREAD,
    MHD_USE_THREAD_PER_CONNECTION, MHD_USE_POLL, MHD_USE_EPOLL, MHD_USE_AUTO,
    MHD_ALLOW_UPGRADE};
  unsigned int n;
  CHECK(MHD_USE_STREAM_CONNS == (65536 | MHD_USE_NO_LISTEN_SOCKET));
  CHECK((MHD_USE_AUTO & 65536) == 0);
  CHECK(MHD_http_unescape(NULL, NULL, escaped) == 3);
  CHECK(strcmp(escaped, "a b") == 0);
  memset(&s, 0, sizeof(s));
  for (n = 0; n < sizeof(bad)/sizeof(bad[0]); ++n)
    CHECK(start(&s, MHD_USE_STREAM_CONNS | bad[n]) == NULL);
  /* Plain NO_LISTEN_SOCKET must retain the normal socket daemon behaviour. */
  d = start(&s, MHD_USE_NO_LISTEN_SOCKET);
  CHECK(d != NULL);
  CHECK(MHD_add_stream_connection(d, &s, stream_read, stream_write) == MHD_NO);
  MHD_stop_daemon(d);
  for (mode = 0; mode != 4; ++mode) {
    run_response(mode);
    run_rad_response(mode);
  }
  run_early_close("GET / HTTP/1.1\r\nHost: localhost\r\n"
                  "Content-Length: 4\r\n\r\ndata");
  run_early_close("GET / HTTP/1.1\r\nHost: localhost\r\n"
                  "Transfer-Encoding: chunked\r\n\r\n4\r\ndata\r\n0\r\n\r\n");
  run_early_close("POST / HTTP/1.1\r\nHost: localhost\r\n"
                  "Content-Length: 0\r\n\r\n");
  run_early_close("GET / HTTP/1.1\r\nHost: localhost\r\n"
                  "Connection: close\r\n\r\n");

  /* Transport errors before a request must only notify connection closure. */
  memset(&s, 0, sizeof(s));
  s.input = "";
  s.failed = 1;
  d = start(&s, MHD_USE_STREAM_CONNS);
  CHECK(d != NULL);
  CHECK(MHD_add_stream_connection(d, &s, NULL, stream_write) == MHD_NO);
  CHECK(MHD_add_stream_connection(d, &s, stream_read, stream_write) == MHD_YES);
  for (n = 0; n < 100 && !s.closed; ++n) CHECK(MHD_run(d) == MHD_YES);
  CHECK(s.started == 1 && s.closed == 1 && !s.completed);
  MHD_stop_daemon(d);
  return 0;
}
