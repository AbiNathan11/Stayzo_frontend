import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const ngrokFilePath = path.join(process.cwd(), 'ngrok.json');
    if (fs.existsSync(ngrokFilePath)) {
      const fileContents = fs.readFileSync(ngrokFilePath, 'utf8');
      const data = JSON.parse(fileContents);
      return NextResponse.json({ ngrokUrl: data.url });
    }
  } catch (error) {
    console.error('Failed to read ngrok URL:', error);
  }

  return NextResponse.json({ ngrokUrl: null });
}
