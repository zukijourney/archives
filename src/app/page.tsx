'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Github, File, Folder, Moon, Sun, ExternalLink } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/components/ui/toaster';

interface Content {
  name: string;
  type: 'file' | 'dir';
  path: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contents, setContents] = useState<Content[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContents();
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/getContents?path=');
      if (!response.ok) {
        throw new Error('Failed to fetch contents');
      }
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contents. Please try again later.",
        variant: "destructive",
      });
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
    return `https://raw.githubusercontent.com/zukijourney/archives/main/submissions/${path}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Success",
        description: "URL copied to clipboard!",
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "Failed to copy URL. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 to-purple-100 text-gray-900'} flex flex-col transition-colors duration-300`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white shadow-md p-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold italic">g4f-archives</h1>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setDarkMode(!darkMode)}
              variant="outline"
              size="icon"
              className="text-white border-white hover:bg-white hover:text-gray-900"
            >
              {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Link href="https://zukijourney.com">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                Visit zukijourney.com <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Contribute to our archives</h2>
          <p className="mb-4">
            1. Fork the repository on GitHub<br/>
            2. Create a new folder for your submission<br/>
            3. Add your files and a README.txt with details<br/>
            4. Create a pull request to contribute
          </p>
          <Link href="https://github.com/zukijourney/archives">
            <Button variant="outline" className={`${darkMode ? 'text-white border-white hover:bg-white hover:text-gray-900' : 'text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white'}`}>
              <Github className="mr-2 h-4 w-4" /> GitHub Repository
            </Button>
          </Link>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <Input
              type="text"
              placeholder="Search submissions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-full border-2 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-800 text-white focus:border-gray-400' 
                  : 'border-purple-500 focus:border-blue-500'
              } focus:ring focus:ring-opacity-50`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <div key={content.path} className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-purple-300'} border-2 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{content.path}</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{content.type}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{content.name}</h2>
                {content.type === 'file' && isImage(content.name) && (
  <div className="mb-4">
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-48 relative cursor-pointer overflow-hidden rounded-md">
          <Image 
            src={getImageUrl(content.path)} 
            alt={content.name} 
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-110"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <Image 
            src={getImageUrl(content.path)} 
            alt={content.name} 
            layout="fill"
            objectFit="contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  </div>
)}
                <div className="flex justify-between items-center mt-4">
                  {content.type === 'dir' ? (
                    <Link href={`/folder/${encodeURIComponent(content.path)}`}>
                      <Button variant="outline" className={`${darkMode ? 'text-white border-white hover:bg-white hover:text-gray-900' : 'text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white'}`}>
                        <Folder className="mr-2 h-4 w-4" /> View Folder
                      </Button>
                    </Link>
                  ) : (
                    <a href={getImageUrl(content.path)} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className={`${darkMode ? 'text-white border-white hover:bg-white hover:text-gray-900' : 'text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white'}`}>
                        <File className="mr-2 h-4 w-4" /> View Original
                      </Button>
                    </a>
                  )}
                  <Button 
                    onClick={() => copyToClipboard(getImageUrl(content.path))}
                    variant="outline" 
                    className={`${darkMode ? 'text-white border-white hover:bg-white hover:text-gray-900' : 'text-green-600 border-green-600 hover:bg-green-600 hover:text-white'}`}
                  >
                    Copy URL
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white py-8`}>
        <div className="container mx-auto px-4">
          <p className="text-center">
            © 2024 g4f-archives by zukijourney. All rights reserved.
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}