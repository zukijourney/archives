import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const folderPath = searchParams.get('path');

  if (folderPath === null) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const decodedPath = decodeURIComponent(folderPath);
  const fullPath = path.join(process.cwd(), 'submissions', decodedPath);

  try {
    const contents = fs.readdirSync(fullPath, { withFileTypes: true });
    const formattedContents = contents.map(item => ({
      name: item.name,
      type: item.isDirectory() ? 'dir' : 'file',
      path: path.join(decodedPath, item.name),
    }));
    return NextResponse.json(formattedContents);
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json({ error: 'Error reading directory' }, { status: 500 });
  }
}