'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Github, File, Folder, ArrowLeft } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Content {
  name: string;
  type: 'file' | 'dir';
  path: string;
}

export default function FolderPage({ params }: { params: { path: string[] } }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [contents, setContents] = useState<Content[]>([]);
  const decodedPath = decodeURIComponent(params.path.join('/'));

  useEffect(() => {
    fetchContents();
  }, [decodedPath]);

  const fetchContents = async () => {
    try {
      const response = await fetch(`/api/getContents?path=${encodeURIComponent(decodedPath)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contents');
      }
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error('Error fetching contents:', error);
      setContents([]);
    }
  };

  const filteredContents = contents.filter(content => 
    content.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isImage = (filename: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const getImageUrl = (path: string) => {
    return `https://raw.githubusercontent.com/zukijourney/archives/refs/heads/main/submissions/${path}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-black text-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Community Archives</h1>
          <div className="w-[100px]"></div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Link href="/" className="flex items-center text-blue-600 hover:underline mb-4">
          <ArrowLeft className="mr-2" /> Back to Home
        </Link>
        <h2 className="text-2xl font-bold mb-4">Folder: {decodedPath}</h2>
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search in this folder"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-black focus:border-gray-700 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <div key={content.path} className="bg-white border-2 border-black rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-600">{content.path}</span>
                  <span className="text-sm text-gray-500">{content.type}</span>
                </div>
                <h2 className="text-xl font-bold text-black mb-2">{content.name}</h2>
                {content.type === 'file' && isImage(content.name) && (
                  <div className="mb-4">
                    <Image src={getImageUrl(content.path)} alt={content.name} width={300} height={200} objectFit="cover" />
                  </div>
                )}
                <div className="flex justify-end">
                  {content.type === 'dir' ? <Folder className="text-black" /> : <File className="text-black" />}
                </div>
                {content.type === 'dir' ? (
                  <Link href={`/folder/${encodeURIComponent(content.path)}`} className="mt-4 inline-block text-blue-600 hover:underline">
                    View folder
                  </Link>
                ) : (
                  <a href={getImageUrl(content.path)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-600 hover:underline">
                    View file
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center md:text-left mb-4 md:mb-0">
              © 2023 AI Community Archives. All rights reserved.
            </p>
            <div className="flex items-center">
              <span className="mr-2">Contribute to our archives:</span>
              <Link href="https://github.com/zukijourney/archives">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export const runtime = 'edge';