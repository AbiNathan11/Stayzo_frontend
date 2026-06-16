import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as http from 'http';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const port = 3000;
const isWindows = /^win/.test(process.platform);

async function fetchNgrokUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:4040/api/tunnels', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const tunnels = JSON.parse(data).tunnels;
          if (tunnels && tunnels.length > 0) {
            const httpsTunnel = tunnels.find((t: any) => t.public_url.startsWith('https'));
            resolve(httpsTunnel ? httpsTunnel.public_url : tunnels[0].public_url);
          } else {
            reject(new Error('No tunnels found in daemon'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function startDev() {
  console.log('Starting local dev server...');

  // 1. Spawn Ngrok CLI natively
  const ngrokProcess: ChildProcess = spawn(
    isWindows ? 'npx.cmd' : 'npx',
    [
      'ngrok', 'http', port.toString(), 
      '--authtoken', process.env.NGROK_AUTH_TOKEN || ''
    ],
    { stdio: 'ignore', shell: isWindows } // shell: true is required for .cmd files on Windows
  );

  // 2. Wait for Ngrok to boot and connect
  console.log('Waiting for Ngrok tunnel...');
  let url = '';
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      url = await fetchNgrokUrl();
      break;
    } catch (e) {
      // still waiting
    }
  }

  if (!url) {
    console.error('Failed to get Ngrok URL. Is Ngrok crashing or rate-limited?');
    ngrokProcess.kill();
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log(`🚀 NGROK TUNNEL CREATED NATIVELY!`);
  console.log(`🔗 Public URL: ${url}`);
  console.log('======================================================\n');

  // 3. Write URL to file
  fs.writeFileSync(
    path.resolve(__dirname, '../ngrok.json'), 
    JSON.stringify({ url })
  );

  // 4. Start Next.js
  const nextProcess: ChildProcess = spawn(
    isWindows ? 'npm.cmd' : 'npm',
    ['run', 'next-dev'],
    {
      stdio: 'inherit',
      shell: isWindows,
      env: { ...process.env, NEXT_PUBLIC_NGROK_URL: url }
    }
  );

  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    ngrokProcess.kill();
    process.exit(code ?? 0);
  });

  process.on('SIGINT', () => {
    console.log('\nClosing native Ngrok tunnel...');
    ngrokProcess.kill();
    nextProcess.kill('SIGINT');
    process.exit(0);
  });
}

startDev();
