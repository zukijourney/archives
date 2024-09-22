import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API_URL = 'https://api.github.com/repos/zukijourney/archives/contents';
const BASE_FOLDER = 'submissions';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  size?: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

interface CacheItem {
  data: GitHubContent[];
  timestamp: number;
}

interface FormattedContent {
  name: string;
  type: 'file' | 'dir';
  path: string;
}

const cache = new Map<string, CacheItem>();

async function fetchGitHubContents(path: string = ''): Promise<GitHubContent[]> {
  const fullPath = path ? `${BASE_FOLDER}/${path}` : BASE_FOLDER;
  const encodedPath = fullPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  const url = `${GITHUB_API_URL}/${encodedPath}`;
  
  console.log('Fetching from URL:', url); // For debugging

  // Check cache first
  const cachedItem = cache.get(url);
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
    console.log('Returning cached data for:', url);
    return cachedItem.data;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('GitHub API Error:', response.status, errorText);
    throw new Error(`GitHub API request failed: ${response.statusText}`);
  }

  const data: GitHubContent | GitHubContent[] = await response.json();

  // Ensure data is always an array
  const contentArray = Array.isArray(data) ? data : [data];

  // Cache the result
  cache.set(url, { data: contentArray, timestamp: Date.now() });

  return contentArray;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const folderPath = searchParams.get('path') || '';

  try {
    const contents = await fetchGitHubContents(folderPath);
    const formattedContents: FormattedContent[] = contents.map((item) => ({
      name: item.name,
      type: item.type,
      path: item.path.replace(`${BASE_FOLDER}/`, ''), // Remove the base folder from the path
    }));
    return NextResponse.json(formattedContents);
  } catch (error) {
    console.error('Error fetching GitHub contents:', error);
    return NextResponse.json({ error: 'Error fetching directory contents' }, { status: 500 });
  }
}

export const runtime = 'edge';