const os = require('os');

const getLocalIps = () => {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;
    for (const alias of iface) {
      const family = alias.family;
      const isIPv4 = family === 'IPv4' || family === 4 || family.toString().includes('4');
      if (isIPv4 && !alias.internal) {
        ips.push(alias.address);
      }
    }
  }
  return ips;
};

const localIps = getLocalIps();
const ngrokUrl = process.env.NEXT_PUBLIC_NGROK_URL;
let ngrokHost = '';
if (ngrokUrl) {
  try {
    ngrokHost = new URL(ngrokUrl).hostname;
  } catch (e) {}
}

const origins = [
  ...localIps,
  'localhost',
  '127.0.0.1',
  ...(ngrokHost ? [ngrokHost] : [])
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: origins,
};

module.exports = nextConfig;
