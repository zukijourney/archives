// archives/src/app/page.tsx

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Github, File, Folder } from 'lucide-react';

interface Submission {
  id: string;
  title: string;
  type: 'folder' | 'file';
  path: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const filteredSubmissions = submissions.filter(submission => 
    submission.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isImage = (filename: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
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
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search submissions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-black focus:border-gray-700 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white border-2 border-black rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-600">{submission.id}</span>
                  <span className="text-sm text-gray-500">{submission.type}</span>
                </div>
                <h2 className="text-xl font-bold text-black mb-2">{submission.title}</h2>
                {submission.type === 'file' && isImage(submission.title) && (
                  <div className="mb-4">
                    <Image src={`/submissions${submission.path}`} alt={submission.title} width={300} height={200} objectFit="cover" />
                  </div>
                )}
                <div className="flex justify-end">
                  {submission.type === 'folder' ? <Folder className="text-black" /> : <File className="text-black" />}
                </div>
                {submission.type === 'folder' ? (
                  <Link href={`/submission${submission.path}`} className="mt-4 inline-block text-blue-600 hover:underline">
                    View folder
                  </Link>
                ) : (
                  <a href={`/submissions${submission.path}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-600 hover:underline">
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