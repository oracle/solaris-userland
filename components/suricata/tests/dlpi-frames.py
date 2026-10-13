#!/usr/bin/python3
#
# Copyright (c) 2026, Oracle and/or its affiliates.
#
"""Raw Ethernet regression probe; use ONLY on isolated Solaris test links.

Start receive on the far endpoint and wait for its JSON ready event, then
run send on the near endpoint with identical src/dst/token/repeat arguments.
The receiver checks exact bytes, missing frames and duplicate forwarding.
No files, network configuration or third-party Python modules are required.
"""
import argparse
from collections import Counter
import ctypes as C
import ipaddress
import json
import select
import struct
import time

SUCCESS, TIMEOUT = 10000, 10006
RAW, ANY_SAP, PHYS, SAP, NOLOOP = 4, 0xffffffff, 1, 2, 0x10000000


def checksum(data):
    if len(data) % 2:
        data += b"\0"
    value = sum(struct.unpack("!%dH" % (len(data) // 2), data))
    while value >> 16:
        value = (value & 0xffff) + (value >> 16)
    return (~value) & 0xffff


def frames(src, dst, token, repeat):
    src, dst = bytes.fromhex(src.replace(":", "")), bytes.fromhex(dst.replace(":", ""))
    if len(src) != 6 or len(dst) != 6:
        raise ValueError("Expected two six-byte Ethernet MAC addresses")
    marker = ("DLPI-SAP-TEST:" + token + ":").encode("ascii")
    ip4s, ip4d = (ipaddress.ip_address(x).packed for x in ("198.18.0.1", "198.18.0.2"))
    ip6s, ip6d = (ipaddress.ip_address(x).packed for x in ("2001:db8:42::1", "2001:db8:42::2"))
    result = {}
    for seq in range(repeat):
        for kind in ("arp", "ipv4", "ipv6", "vlan4", "vlan6", "experimental"):
            payload = marker + ("%s:%d" % (kind, seq)).encode("ascii")
            if kind == "arp":
                ethertype = 0x0806
                body = (struct.pack("!HHBBH", 1, 0x0800, 6, 4, 2)
                        + src + ip4s + dst + ip4d + payload)
            elif kind == "experimental":
                ethertype, body = 0x88b5, payload
            else:
                ipv6 = kind in ("ipv6", "vlan6")
                icmp = struct.pack("!BBHHH", 128 if ipv6 else 8, 0, 0, 0x5a9c, seq) + payload
                pseudo = ip6s + ip6d + struct.pack("!I3xB", len(icmp), 58) if ipv6 else b""
                icmp = icmp[:2] + struct.pack("!H", checksum(pseudo + icmp)) + icmp[4:]
                assert checksum(pseudo + icmp) == 0
                if ipv6:
                    ethertype = 0x86dd
                    body = struct.pack("!IHBB", 6 << 28, len(icmp), 58, 64) + ip6s + ip6d + icmp
                else:
                    ethertype = 0x0800
                    header = (struct.pack("!BBHHHBBH", 0x45, 0, 20 + len(icmp), seq, 0, 64, 1, 0)
                              + ip4s + ip4d)
                    header = header[:10] + struct.pack("!H", checksum(header)) + header[12:]
                    assert checksum(header) == 0
                    body = header + icmp
            tag = struct.pack("!HH", 0x8100, 42) if kind.startswith("vlan") else b""
            frame = (dst + src + tag + struct.pack("!H", ethertype) + body).ljust(60, b"\0")
            result[frame] = kind
    return marker, result


class Link:
    def __init__(self, name, receive):
        self.lib = C.CDLL("libdlpi.so.1", use_errno=True)
        signatures = {
            "dlpi_open": ([C.c_char_p, C.POINTER(C.c_void_p), C.c_uint], C.c_int),
            "dlpi_bind": ([C.c_void_p, C.c_uint, C.POINTER(C.c_uint)], C.c_int),
            "dlpi_promiscon": ([C.c_void_p, C.c_uint], C.c_int),
            "dlpi_send": ([C.c_void_p, C.c_void_p, C.c_size_t,
                           C.c_void_p, C.c_size_t, C.c_void_p], C.c_int),
            "dlpi_recv": ([C.c_void_p, C.c_void_p, C.c_void_p, C.c_void_p,
                           C.POINTER(C.c_size_t), C.c_int, C.c_void_p], C.c_int),
            "dlpi_fd": ([C.c_void_p], C.c_int),
            "dlpi_close": ([C.c_void_p], None),
            "dlpi_strerror": ([C.c_int], C.c_char_p),
        }
        for name_, (args, result) in signatures.items():
            getattr(self.lib, name_).argtypes = args
            getattr(self.lib, name_).restype = result
        self.handle = C.c_void_p()
        self.check(self.lib.dlpi_open(name.encode(), C.byref(self.handle), RAW))
        try:
            sap = C.c_uint()
            self.check(self.lib.dlpi_bind(self.handle, ANY_SAP, C.byref(sap)))
            if receive:
                self.check(self.lib.dlpi_promiscon(self.handle, PHYS | NOLOOP))
                self.check(self.lib.dlpi_promiscon(self.handle, SAP | NOLOOP))
        except BaseException:
            self.close()
            raise

    def check(self, result):
        if result != SUCCESS:
            raise RuntimeError("DLPI %d: %s (errno %d)" %
                               (result, self.lib.dlpi_strerror(result).decode(), C.get_errno()))

    def close(self):
        if self.handle.value:
            self.lib.dlpi_close(self.handle)
            self.handle = C.c_void_p()

    def send(self, frame):
        buf = C.create_string_buffer(frame)
        self.check(self.lib.dlpi_send(self.handle, None, 0, buf, len(frame), None))

    def receive(self, seconds):
        fd = self.lib.dlpi_fd(self.handle)
        buf = C.create_string_buffer(65536)
        deadline = time.monotonic() + seconds
        while time.monotonic() < deadline:
            ready, _, _ = select.select([fd], [], [], max(0, deadline - time.monotonic()))
            if not ready:
                break
            size = C.c_size_t(len(buf))
            result = self.lib.dlpi_recv(self.handle, None, None, buf, C.byref(size), 0, None)
            if result == TIMEOUT:
                continue
            self.check(result)
            yield buf.raw[:size.value]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=("send", "receive", "selftest"))
    parser.add_argument("--link")
    parser.add_argument("--src", default="02:00:00:00:00:01")
    parser.add_argument("--dst", default="02:00:00:00:00:02")
    parser.add_argument("--token", required=True,
                        help="unique ASCII marker for this direction/run")
    parser.add_argument("--repeat", type=int, default=3)
    parser.add_argument("--seconds", type=float, default=12)
    parser.add_argument("--expect", choices=("all", "drop-ip", "none"), default="all")
    args = parser.parse_args()
    if (not 1 <= args.repeat <= 100 or not 0 < args.seconds <= 120
            or not 1 <= len(args.token) <= 64):
        parser.error("repeat=1..100, seconds=0..120, token length=1..64")
    marker, expected = frames(args.src, args.dst, args.token, args.repeat)
    if args.mode == "selftest":
        assert len(expected) == args.repeat * 6
        assert all(marker in frame for frame in expected)
        assert all(frame[12:16] == b"\x81\x00\x00\x2a"
                   for frame, kind in expected.items() if kind.startswith("vlan"))
        print(json.dumps({"selftest": "PASS", "frames": len(expected)}))
        return 0
    if not args.link:
        parser.error("--link is required for send/receive")
    link = Link(args.link, args.mode == "receive")
    try:
        if args.mode == "send":
            for frame in expected:
                link.send(frame)
                time.sleep(.03)
            print(json.dumps({"sent": len(expected), "token": args.token}), flush=True)
            return 0
        print(json.dumps({"ready": True, "link": args.link, "token": args.token}), flush=True)
        seen, unexpected = Counter(), []
        for frame in link.receive(args.seconds):
            if marker not in frame:
                continue
            if frame in expected:
                seen[frame] += 1
            else:
                unexpected.append(frame.hex())
        wanted = Counter({
            f: 1 for f, k in expected.items()
            if args.expect == "all" or (args.expect == "drop-ip" and k in ("arp", "experimental"))
        })
        passed = seen == wanted and not unexpected
        counts = Counter()
        for frame, count in seen.items():
            counts[expected[frame]] += count
        print(json.dumps({"result": "PASS" if passed else "FAIL", "token": args.token,
                          "expect": args.expect, "received": dict(counts),
                          "missing": sum((wanted - seen).values()),
                          "extra_or_duplicate": sum((seen - wanted).values()),
                          "changed_frames": unexpected}), flush=True)
        return 0 if passed else 1
    finally:
        link.close()


if __name__ == "__main__":
    raise SystemExit(main())
