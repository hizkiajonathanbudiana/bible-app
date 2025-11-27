"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Import Auth buat cek admin

// Pastikan list ini SAMA dengan yang di admin page
const ALLOWED_ADMINS = ["admin@test.com", "weize@test.com", "hizkia.jonathanb@gmail.com"];

export default function LibraryPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Ambil data user

    useEffect(() => {
        async function fetchBooks() {
            try {
                const querySnapshot = await getDocs(collection(db, "books"));
                const list = querySnapshot.docs.map(doc => doc.data());
                setBooks(list);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchBooks();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Library...</div>;

    const isAdmin = user && ALLOWED_ADMINS.includes(user.email);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Library</h1>
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">Back Home</Link>
                </div>

                <div className="grid gap-3">
                    {books.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                            <p className="text-gray-400 mb-4">No books available yet.</p>

                            {/* HANYA MUNCUL KALAU ADMIN */}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-200 transition"
                                >
                                    + Upload in Admin
                                </Link>
                            )}
                        </div>
                    ) : (
                        books.map((book) => (
                            <Link
                                key={book.id}
                                href={`/read/${book.id}`}
                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:border-blue-500 hover:shadow-md transition group"
                            >
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition">{book.name}</h2>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{book.id}</p>
                                </div>
                                <span className="text-gray-300 group-hover:text-blue-500 transition">➜</span>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}