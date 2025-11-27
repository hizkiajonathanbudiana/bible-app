"use client";

import { BIBLE_BOOKS } from "@/lib/bibleData";
import Link from "next/link";

export default function LibraryPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-20">
            <div className="max-w-md mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Scripture Library</h1>
                        <p className="text-xs text-gray-500 mt-1">Select a book to start reading</p>
                    </div>
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                        Home
                    </Link>
                </div>

                {/* Book List Grid */}
                <div className="grid gap-3">
                    {BIBLE_BOOKS.map((book) => (
                        <Link
                            key={book.id}
                            href={`/read/${book.id}`}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:border-blue-500 hover:shadow-md transition group active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar Singkatan Buku */}
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    {book.id.substring(0, 2)}
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition">
                                        {book.name}
                                        <span className="ml-2 text-gray-400 font-normal text-sm">{book.cnName}</span>
                                    </h2>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                                        {book.chapters} Chapters
                                    </p>
                                </div>
                            </div>

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition">
                                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}