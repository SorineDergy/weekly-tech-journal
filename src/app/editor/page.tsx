'use client';

// import Image from 'next/image'; // gonna fix this later(probably * ahem *), gonna use the default img tag for now
import React, { useState, ChangeEvent } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css'; 

export default function EditorPage() {
    const [markdownValue, setMarkdownValue] = useState('');
    const [images, setImages] = useState<{ file: File; url: string }[]>([]);
    const MAX_IMAGES = 5;

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const availableSlots = MAX_IMAGES - images.length;
        const filesToUpload = files.slice(0, availableSlots);

        const newImages = filesToUpload.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages((prevImages) => [...prevImages, ...newImages]);
        
        // Reset input value so the same file can be uploaded again if removed
        e.target.value = '';
    };

  const removeImage = (indexToRemove: number) => {
    setImages((prevImages) => {
      // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(prevImages[indexToRemove].url);
      return prevImages.filter((_, index) => index !== indexToRemove);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append('content', markdownValue);
    images.forEach(({ file }) => formData.append('images', file));

    const title = formData.get('title');
    const content = formData.get('content');
    const submittedImages = formData.getAll('images');

    console.log('Submitting data:', { title, content, images: submittedImages }); // Put the API Post request here to replace this thingie with once yall have a backend and an API lol
  };

  return (
    
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="mx-auto flex w-full max-w-4xl flex-col items-stretch gap-8 bg-white px-4 py-8 dark:bg-black sm:px-8">
            <h1 className="text-5xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Editor Page
            </h1>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                <label className="block text-sm font-bold mb-1">Article Title:</label>
                <input 
                    type="text" 
                    name="title" 
                    required 
                    className="w-full p-2 bg-white dark:bg-gray-900 focus:outline-blue-500"
                    placeholder="Enter a title"
                />
                </div>

                <div className="w-full p-2 bg-white dark:bg-black focus:outline-blue-500">
                <label className="block text-sm font-bold mb-1">Body:</label>
                <MdEditor 
                    value={markdownValue} 
                    onChange={setMarkdownValue}
                    language="en-US"
                    theme="dark"
                    style={{ height: 'clamp(320px, 55vh, 640px)', width: '100%' }}
                />
                </div>
                <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4 text-white">
                                Upload Images ({images.length}/{MAX_IMAGES})
                            </h2>
                    
                            <div className="flex flex-wrap gap-4">
         
                            {images.map(({ url }, index) => (
                            <div 
                                key={url} 
                                className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden group bg-gray-50"
                            >
                                <img 
                                src={url} 
                                alt={`Preview ${index + 1}`} 
                                className="w-full h-full object-cover" 
                                />
                                <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium"
                                >
                                Remove
                                </button>
                            </div>
                        ))}

                        {images.length < MAX_IMAGES && (
                        <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors">
                            <svg 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-6 h-6 text-gray-400"
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                                <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                        )}
                        </div>
                    </div>
                            <div className="flex w-full flex-col gap-4 p-2 bg-white dark:bg-black">
                    <button 
                    type="submit"
                    className="bg-gray-800 text-white font-medium py-2 px-4 rounded hover:bg-green-900 transition"
                    >
                    Preview Article
                    </button>
                    
                    <button 
                    type="submit" 
                    className="bg-gray-800 text-white font-medium py-2 px-4 rounded hover:bg-green-900 transition"
                    >
                    Submit Article
                    </button>
                </div>
            </form>
        </main>
    </div>
  );
}

