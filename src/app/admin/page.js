"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/Modal";

const ALLOWED_ADMINS = ["admin@test.com", "weize@test.com", "hizkia.jonathanb@gmail.com"];

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState("upload");
    const [books, setBooks] = useState([]);

    const [form, setForm] = useState({
        bookId: "GEN",
        bookName: "創世記",
        chapter: "1",
        rawTextCN: "",
        rawTextEN: "",
        rawTextID: "",
    });
    const [status, setStatus] = useState("idle");

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, bookId: "", bookName: "" });

    useEffect(() => {
        if (!loading) {
            if (!user) router.push("/");
            else if (!ALLOWED_ADMINS.includes(user.email)) router.push("/");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (activeTab === "manage") fetchBooks();
    }, [activeTab]);

    const fetchBooks = async () => {
        const snap = await getDocs(collection(db, "books"));
        setBooks(snap.docs.map(d => d.data()));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setStatus("processing");
        try {
            const res = await fetch("/api/admin/process", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            showToast(data.message, "success");
            setStatus("success");
        } catch (err) {
            showToast(err.message, "error");
            setStatus("error");
        }
    };

    const confirmDelete = (book) => {
        setDeleteModal({ isOpen: true, bookId: book.id, bookName: book.name });
    };

    const handleDelete = async () => {
        const id = deleteModal.bookId;
        setDeleteModal({ ...deleteModal, isOpen: false });

        try {
            const res = await fetch("/api/admin/delete", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: id }),
            });
            if (!res.ok) throw new Error("Delete failed");

            showToast(`Deleted book ${id}`, "success");
            fetchBooks();
        } catch (e) {
            showToast("Failed to delete book", "error");
        }
    };

    if (loading || !user || !ALLOWED_ADMINS.includes(user.email)) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-800 text-white p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white">Exit</button>
                </div>
                <div className="flex border-b">
                    <button onClick={() => setActiveTab("upload")} className={`flex-1 py-4 font-bold text-center ${activeTab === "upload" ? "border-b-4 border-blue-600 text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-50"}`}>Upload Chapter</button>
                    <button onClick={() => setActiveTab("manage")} className={`flex-1 py-4 font-bold text-center ${activeTab === "manage" ? "border-b-4 border-blue-600 text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-50"}`}>Manage Books</button>
                </div>

                {activeTab === "upload" && (
                    <div className="p-8">
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-sm font-bold">Book Code (GEN)</label><input type="text" value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })} className="w-full border p-2 rounded" /></div>
                                <div><label className="block text-sm font-bold">Book Name (CN)</label><input type="text" value={form.bookName} onChange={(e) => setForm({ ...form, bookName: e.target.value })} className="w-full border p-2 rounded" /></div>
                                <div><label className="block text-sm font-bold">Chapter (1)</label><input type="number" value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} className="w-full border p-2 rounded" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-blue-800">1. Chinese Text</label>
                                    <textarea rows={15} value={form.rawTextCN} onChange={(e) => setForm({ ...form, rawTextCN: e.target.value })} placeholder="Chinese..." className="w-full border p-2 rounded text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-green-800">2. English Text</label>
                                    <textarea rows={15} value={form.rawTextEN} onChange={(e) => setForm({ ...form, rawTextEN: e.target.value })} placeholder="English..." className="w-full border p-2 rounded text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-red-800">3. Indo Text</label>
                                    <textarea rows={15} value={form.rawTextID} onChange={(e) => setForm({ ...form, rawTextID: e.target.value })} placeholder="Indonesian..." className="w-full border p-2 rounded text-sm" />
                                </div>
                            </div>
                            <button type="submit" disabled={status === "processing"} className="px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:bg-gray-400 w-full">
                                {status === "processing" ? "Uploading..." : "Process & Save"}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === "manage" && (
                    <div className="p-8">
                        <h2 className="text-lg font-bold mb-4">Existing Books in Library</h2>
                        {books.length === 0 ? <p className="text-gray-400">No books found.</p> : (
                            <div className="space-y-3">
                                {books.map((book) => (
                                    <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm bg-gray-50">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{book.name}</h3>
                                            <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-mono">{book.id}</span>
                                        </div>
                                        <button
                                            onClick={() => confirmDelete(book)}
                                            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-bold"
                                        >
                                            Delete Book
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Modal
                isOpen={deleteModal.isOpen}
                title="Delete Book?"
                message={`Are you sure you want to delete "${deleteModal.bookName}"? This will remove ALL chapters and verses associated with it. This action cannot be undone.`}
                confirmText="Yes, Delete Everything"
                isDanger={true}
                onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleDelete}
            />
        </div>
    );
}