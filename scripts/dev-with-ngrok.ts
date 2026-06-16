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

    // Connect to Ngrok
    const url: string = await ngrok.connect({
      addr: port,
      authtoken: process.env.NGROK_AUTH_TOKEN
    });

    console.log('\n======================================================');
    console.log(`🚀 NGROK TUNNEL CREATED!`);
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
        env: { ...process.env }
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
