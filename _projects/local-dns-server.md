---
project_id: local-dns-server
title: Local DNS Server
github_link: https://github.com/AxelGoetz/local-dns-server
---

[A local DNS server](https://github.com/AxelGoetz/local-dns-server) written for UCL's [COMP3035 - Networked Systems](http://nrg.cs.ucl.ac.uk/mjh/gz01/index.html). Written in `Python2`, it listens on a local port and resolves any DNS queries.

To run the server, just execute `python ncsdns.py -p [port-number]` and then you can query it using `dig 127.0.0.1 -p [port-number] [URL]`.
