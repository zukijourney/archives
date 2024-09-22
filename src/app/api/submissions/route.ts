// archives/src/app/api/submissions/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Submission {
  id: string;
  title: string;
  type: 'folder' | 'file';
  path: string;
}

export async function GET() {
  const submissionsDir = path.join(process.cwd(), 'submissions');
  const submissions: Submission[] = [];

  const items = fs.readdirSync(submissionsDir, { withFileTypes: true });
  items.forEach((item) => {
    const fullPath = path.join(submissionsDir, item.name);
    submissions.push({
      id: Buffer.from(item.name).toString('base64'),
      title: item.name,
      type: item.isDirectory() ? 'folder' : 'file',
      path: '/' + item.name,
    });
  });

  return NextResponse.json(submissions);
}