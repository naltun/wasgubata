#!/usr/bin/env -S deno run --allow-net
/** This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { isIP } from "https://deno.land/std@0.112.0/node/_net.ts";

const usage = "usage: wgb [-h|--help || <IP address|domain>]";

let target = Deno.args[0];
if (target == undefined) {
  console.error(usage);
  Deno.exit(1);
} else if (target === "-h" || target === "--help") {
  console.log(usage);
  Deno.exit(0);
}

if (isIP(target) === 0) {
  const ip_array = await Deno.resolveDns(target, "A");
  target = ip_array[0];
}

/** I prefer M3O's `IP to Geo' service, but it requires an API key. This adds complexity, but is normal
 * for free services. Despite this, M3O is *incredibly* cool. Desc: "M3O is an open source AWS alternative
 * built for the next generation of developers." Show some love and learn more: https://m3o.com/explore. */
const geo = await fetch(`https://ipinfo.io/${target}/geo`)
  .then((r) => r.json());

console.log(`IP:             ${geo.ip}
City:           ${geo.city}
Region:         ${geo.region}
Country:        ${geo.country}
Coordinates:    ${geo.loc}
Organization:   ${geo.org}
Post Code:      ${geo.postal}
Timezone:       ${geo.timezone}`);
