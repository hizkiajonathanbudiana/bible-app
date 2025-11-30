"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function ChapterSelectPage() {
    const params = useParams();
    const searchParams = useSearchParams(); // AMBIL

    const version = params?.version;
    const bookId = params?.bookId;

    // SUSUN KEMBALI QUERY STRING
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";

    const [loading, setLoading] = useState(true);
    const [chapters, setChapters] = useState(50);

    useEffect(() => {
        async function fetchInfo() {
            try {
                const res = await fetch(`https://bible.helloao.org/api/${version}/books.json`);
                const data = await res.json();
                const b = data.books.find(x => x.id === bookId);
                if (b) setChapters(b.numberOfChapters);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        fetchInfo();
    }, [version, bookId]);

    const list = Array.from({ length: chapters }, (_, i) => i + 1);

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/read" className="text-blue-600 font-bold">← Back Library</Link>
                    <h1 className="text-2xl font-bold mt-2">{bookId}</h1>

                    {/* INDIKATOR DEBUGGING */}
                    <p className="text-xs text-gray-400 mt-1">
                        Active: {queryString || "No extra languages selected"}
                    </p>
                </div>

                <div className="grid grid-cols-5 gap-3">
                    {list.map(num => (
                        <Link
                            key={num}
                            // TEMPEL QUERY STRING KE LINK
                            href={`/read/${version}/${bookId}/${num}${queryString}`}
                            className="aspect-square flex items-center justify-center bg-white rounded-xl shadow-sm hover:border-blue-500 border-2 border-transparent font-bold"
                        >
                            {num}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}