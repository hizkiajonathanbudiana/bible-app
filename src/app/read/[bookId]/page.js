"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ChapterSelectPage() {
    const { bookId } = useParams();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChapters() {
            try {
                // Ambil subcollection 'chapters' dari document buku
                const querySnapshot = await getDocs(collection(db, "books", bookId, "chapters"));
                const list = querySnapshot.docs.map(doc => doc.data().number);
                // Urutkan 1, 2, 3...
                list.sort((a, b) => a - b);
                setChapters(list);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        if (bookId) fetchChapters();
    }, [bookId]);

    if (loading) return <div className="p-10 text-center">Loading Chapters...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-md mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/read" className="text-gray-500 hover:text-gray-900">← Back</Link>
                    <h1 className="text-2xl font-bold text-gray-900">{bookId} Chapters</h1>
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

                {chapters.length === 0 && (
                    <p className="text-center text-gray-400 mt-10">No chapters found.</p>
                )}
            </div>
        </div>
    );
}