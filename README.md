# OPNsense Dnsmasq Lease Widget

This is a fork of [jbaconsult](https://github.com/jbaconsult) greate [OPNsense DHCPv4 Lease Widget](https://github.com/jbaconsult/opnsense_stuff), modified to display Dnsmasq leases:

<img width="2942" height="946" alt="image" src="https://github.com/user-attachments/assets/708e6591-afc3-4d2e-85a5-363bc064bb12" />

## Install

Open a `ssh` session.

## Install via [OPNware repo](https://github.com/mietzen/OPNware):

```sh
fetch -o /usr/local/etc/pkg/repos/opnware.conf https://mietzen.github.io/OPNware/opnware.conf
pkg update
pkg install opnsense_leases_widget
```

## Direct install:

```sh
fetch -o /usr/local/opnsense/www/js/widgets/Leases.js https://raw.githubusercontent.com/mietzen/opnsense_leases_widget/refs/heads/main/Leases.js
fetch -o /usr/local/opnsense/www/js/widgets/Metadata/Leases.xml https://raw.githubusercontent.com/mietzen/opnsense_leases_widget/refs/heads/main/Leases.xml
```

---

**Tested on:**
- OPNsense 25.7

