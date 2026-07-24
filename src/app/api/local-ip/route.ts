import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  try {
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';

    // Prioritize physical network adapters like Wi-Fi/Ethernet and exclude virtual ones
    const sortedInterfaceNames = Object.keys(interfaces).sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aScore = (aLower.includes('wi-fi') || aLower.includes('wlan') || aLower.includes('ethernet') || aLower.includes('en0') || aLower.includes('eth0')) ? 1 : 0;
      const bScore = (bLower.includes('wi-fi') || bLower.includes('wlan') || bLower.includes('ethernet') || bLower.includes('en0') || bLower.includes('eth0')) ? 1 : 0;
      return bScore - aScore;
    });

    for (const name of sortedInterfaceNames) {
      // Ignore common virtual/host-only network adapters
      if (name.toLowerCase().includes('virtualbox') || name.toLowerCase().includes('vmware') || name.toLowerCase().includes('vethernet')) {
        continue;
      }

      const iface = interfaces[name];
      if (!iface) continue;
      for (const alias of iface) {
        const family = alias.family;
        const isIPv4 = family === 'IPv4' || (family as any) === 4 || family.toString().includes('4');
        if (isIPv4 && !alias.internal) {
          localIp = alias.address;
          break;
        }
      }
      if (localIp !== 'localhost') break;
    }

    // Fallback to any external IPv4 address if no preferred physical interfaces were matched
    if (localIp === 'localhost') {
      for (const name of Object.keys(interfaces)) {
        const iface = interfaces[name];
        if (!iface) continue;
        for (const alias of iface) {
          const family = alias.family;
          const isIPv4 = family === 'IPv4' || (family as any) === 4 || family.toString().includes('4');
          if (isIPv4 && !alias.internal) {
            localIp = alias.address;
            break;
          }
        }
        if (localIp !== 'localhost') break;
      }
    }

    return NextResponse.json({ ip: localIp });
  } catch {
    return NextResponse.json({ ip: 'localhost' });
  }
}
