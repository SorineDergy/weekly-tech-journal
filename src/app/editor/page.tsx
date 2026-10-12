'use client';

import { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css'; 

export default function EditorPage() {
  const [markdownValue, setMarkdownValue] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append('content', markdownValue);

    const title = formData.get('title');
    const content = formData.get('content');

    console.log('Submitting data:', { title, content });
    };

  return (
    
    <div className="p-6 max-w-3xl mx-auto bg-black text-white rounded-lg shadow mt-10 text-left tracking-tight">
        <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
            <h1 className="max-w-xs text-5xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 text-left mb-5">
                Editor Page
            </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-sm font-bold mb-1">Article Title:</label>
            <input 
                type="text" 
                name="title" 
                required 
                className="w-full flex flex-1 w-full max-w-xl flex-col items-center justify-between p-2 bg-white dark:bg-gray-900 sm:items-start focus:outline-blue-500"
                placeholder="Enter a title"
            />
            </div>

            <div className="w-full flex flex-1 w-full max-w-xl flex-col items-center justify-between p-2 bg-white dark:bg-black sm:items-start focus:outline-blue-500">
            <label className="block text-sm font-bold mb-1">Body:</label>
            <MdEditor 
                value={markdownValue} 
                onChange={setMarkdownValue}
                language="en-US"
                theme="dark"
                style={{ height: '400px' }}
            />
            </div>
            <div className="w-full flex flex-1 gap-4 w-full max-w-xl flex-col items-center justify-between p-2 bg-white dark:bg-black sm:items-start focus:outline-blue-500">
                <button 
                type="submit"
                className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-green-500 transition"
                >
                Preview Article
                </button>
                
                <button 
                type="submit" 
                className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-green-500 transition"
                >
                Submit Article
                </button>
            </div>
        </form>
        </main>
    </div>
  );
}

