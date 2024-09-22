import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  const fullPath = path.join(process.cwd(), 'submissions', ...params.path);

  try {
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      const items = fs.readdirSync(fullPath).map((item) => ({
        name: item,
        type: fs.statSync(path.join(fullPath, item)).isDirectory() ? 'folder' : 'file',
      }));

      return NextResponse.json({ type: 'folder', items });
    } else {
      const contentType = getContentType(fullPath);
      const content = fs.readFileSync(fullPath);

      if (contentType.startsWith('image/')) {
        return new NextResponse(content, {
          headers: { 'Content-Type': contentType },
        });
      } else {
        return NextResponse.json({ type: 'file', content: content.toString('utf-8') });
      }
    }
  } catch (error) {
    return new NextResponse('Not found', { status: 404 });
  }
}

function getContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: { [key: string]: string } = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.json': 'application/json',
  };
  return contentTypes[ext] || 'application/octet-stream';
}