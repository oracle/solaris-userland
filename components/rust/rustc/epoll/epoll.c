/*
 * Copyright (c) 2020, Oracle and/or its affiliates.
 *
 * epoll fake interface to allow rust build.
 * It's not actually called only used during linking.
 */

#include <assert.h>
#include <inttypes.h>

typedef union epoll_data {
  void    *ptr;
  int      fd;
  uint32_t u32;
  uint64_t u64;
} epoll_data_t;

struct epoll_event {
  uint32_t     events;
  epoll_data_t data;
};

int epoll_create1(int flags) { assert(0); }
int epoll_create(int size) { assert(0); }
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event) { assert(0); }
int epoll_wait(int epfd, struct epoll_event *events, int maxevents, int timeout) { assert(0); }
