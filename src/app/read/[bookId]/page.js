"use client";

import { getBookInfo } from "@/lib/bibleData";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ChapterSelectPage() {
    const { bookId } = useParams();
    const book = getBookInfo(bookId); // Ambil info buku dari file statis

    if (!book) return <div className="p-10 text-center">Book not found.</div>;

    // Bikin array angka [1, 2, 3 ... 50]
    const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-md mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/read" className="text-gray-500 hover:text-gray-900 flex items-center gap-1">
                        <span>←</span> Library
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{book.name}</h1>
                        <p className="text-sm text-gray-500">{book.cnName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-3">
                    {chapters.map((num) => (
                        <Link
                            key={num}
                            href={`/read/${bookId}/${num}`}
                            className="aspect-square flex items-center justify-center bg-white border border-gray-200 rounded-lg text-lg font-bold text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition shadow-sm"
                        >
                            {num}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}