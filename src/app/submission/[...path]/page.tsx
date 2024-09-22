'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Folder, File } from 'lucide-react';

interface Item {
  name: string;
  type: 'folder' | 'file';
}

interface SubmissionProps {
  params: {
    path: string[];
  };
}

export default function Submission({ params }: SubmissionProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFolder, setIsFolder] = useState(true);

  const path = params.path.join('/');

  useEffect(() => {
    fetchSubmissionData();
  }, [path]);

  const fetchSubmissionData = async () => {
    try {
      const response = await fetch(`/api/submissions/${path}`);
      const data = await response.json();

      if (data.type === 'folder') {
        setItems(data.items);
        setContent(null);
        setIsFolder(true);
      } else {
        setItems([]);
        setContent(data.content);
        setIsFolder(false);
      }
    } catch (err) {
      setError('Error loading submission');
      console.error(err);
    }
  };

  const parentPath = '/' + params.path.slice(0, -1).join('/');

  const isImage = (filename: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  if (error) {
    return <div className="container mx-auto px-4 py-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-black text-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Community Archives</h1>
          <div className="w-[100px]"></div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href={parentPath === '/' ? '/' : `/submission${parentPath}`} className="text-blue-600 hover:underline flex items-center">
            <ArrowLeft className="mr-2" /> Back
          </Link>
        </div>

        <h2 className="text-3xl font-bold mb-4">{params.path[params.path.length - 1]}</h2>

        {isFolder && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <Link key={item.name} href={`/submission/${path}/${item.name}`}>
                <div className="border-2 border-black p-4 rounded-lg hover:bg-gray-100">
                  {item.type === 'folder' ? <Folder className="mb-2" /> : <File className="mb-2" />}
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isFolder && (
          <div className="bg-gray-100 p-4 rounded-lg">
            {isImage(params.path[params.path.length - 1]) ? (
              <Image src={`/api/submissions/${path}`} alt={params.path[params.path.length - 1]} width={600} height={400} layout="responsive" objectFit="contain" />
            ) : (
              <pre className="whitespace-pre-wrap">{content}</pre>
            )}
          </div>
        )}
      </main>

      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <p className="text-center">© 2023 AI Community Archives. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}