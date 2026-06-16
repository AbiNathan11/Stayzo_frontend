import * as ngrok from 'ngrok';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local and .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function startDev(): Promise<void> {
  try {
    const port: number = 3000;

    // Kill any existing ngrok processes and disconnect tunnels before starting to prevent tunnel collision
    await ngrok.disconnect().catch(() => {});
    await ngrok.kill().catch(() => {});

    // Connect to Ngrok
    let url: string = '';
    try {
      url = await ngrok.connect({
        addr: port,
        authtoken: process.env.NGROK_AUTH_TOKEN
      });
    } catch (err: any) {
      const errMsg = err?.body?.details?.err || err?.message || err?.body?.msg || '';
      if (typeof errMsg === 'string' && (errMsg.includes('already exists') || errMsg.includes('invalid tunnel configuration'))) {
        // ngrok library race condition: tunnel was created but request timed out and retried
        // Poll the local API until the tunnel actually appears
        let attempts = 0;
        while (attempts < 5) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await fetch('http://127.0.0.1:4040/api/tunnels');
            const data = await response.json();
            if (data && data.tunnels && data.tunnels.length > 0) {
              url = data.tunnels[0].public_url;
              break;
            }
          } catch (e) {
            // Ignore fetch errors during polling
          }
          attempts++;
        }
        
        if (!url) {
          throw new Error('Failed to retrieve ngrok tunnel URL after race condition.');
        }
      } else {
        throw err;
      }
    }

    console.log('\n======================================================');
    console.log(`🚀 NGROK TUNNEL READY!`);
    console.log(`🔗 Public URL: ${url}`);
    console.log('======================================================\n');

    // Make the URL available to the Next.js process
    process.env.NEXT_PUBLIC_NGROK_URL = url;

    // Start Next.js dev server
    const isWindows: boolean = /^win/.test(process.platform);
    const nextProcess: ChildProcess = spawn(
      isWindows ? 'npm.cmd' : 'npm',
      ['run', 'next-dev'],
      {
        stdio: 'inherit',
        env: { ...process.env },
        shell: true
      }
    );

    nextProcess.on('close', (code: number | null) => {
      console.log(`Next.js process exited with code ${code}`);
      process.exit(code ?? 0);
    });

    // Cleanup on exit
    process.on('SIGINT', async () => {
      console.log('\nClosing Ngrok tunnel...');
      await ngrok.kill();
      nextProcess.kill('SIGINT');
      process.exit(0);
    });

  } catch (error: unknown) {
    console.error('Error starting development environment:', error);
    process.exit(1);
  }
}

startDev();
