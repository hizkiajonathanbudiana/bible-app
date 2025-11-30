// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { db } from "@/lib/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { useToast } from "@/context/ToastContext";
// import Modal from "@/components/Modal";
// import { BIBLE_BOOKS, BOLLS_VERSIONS } from "@/lib/bibleData"; // Import

// const ALLOWED_ADMINS = ["admin@test.com", "weize@test.com", "hizkia.jonathanb@gmail.com"];

// export default function AdminPage() {
//     const { user, loading } = useAuth();
//     const router = useRouter();
//     const { showToast } = useToast();

//     const [activeTab, setActiveTab] = useState("upload");
//     const [books, setBooks] = useState([]);

//     // Form State
//     const [form, setForm] = useState({
//         bookId: "GEN",
//         bookName: "創世記",
//         chapter: "1",
//         // Versi yang dipilih user
//         versionCN: "CUV",
//         versionEN: "WEB",
//         versionID: "TB",
//         // Konten Teks
//         rawTextCN: "",
//         rawTextEN: "",
//         rawTextID: ""
//     });

//     const [status, setStatus] = useState("idle");
//     const [fetchStatus, setFetchStatus] = useState("idle");
//     const [deleteModal, setDeleteModal] = useState({ isOpen: false, bookId: "", bookName: "" });

//     useEffect(() => {
//         if (!loading) {
//             if (!user) router.push("/");
//             else if (!ALLOWED_ADMINS.includes(user.email)) router.push("/");
//         }
//     }, [user, loading, router]);

//     useEffect(() => {
//         if (activeTab === "manage") fetchBooksList();
//     }, [activeTab]);

//     const fetchBooksList = async () => {
//         const snap = await getDocs(collection(db, "books"));
//         setBooks(snap.docs.map(d => d.data()));
//     };

//     // --- AUTO FETCH DARI ADMIN ---
//     const handleAutoFetch = async () => {
//         setFetchStatus("fetching");

//         const selectedBook = BIBLE_BOOKS.find(b => b.id === form.bookId);
//         if (!selectedBook) {
//             showToast("Invalid Book", "error");
//             setFetchStatus("idle");
//             return;
//         }

//         // Fetch sesuai versi yang dipilih di dropdown
//         const fetchText = async (version) => {
//             try {
//                 const res = await fetch(`https://bolls.life/get-chapter/${version}/${selectedBook.bollsId}/${form.chapter}/`);
//                 if (res.ok) {
//                     const json = await res.json();
//                     if (Array.isArray(json) && json.length > 0) {
//                         // FIX 400 ERROR: FORMAT 'NOMOR TEKS'
//                         // 1 Pada mulanya...
//                         return json.map(v => `${v.verse} ${v.text.replace(/<[^>]*>/g, '')}`).join("\n");
//                     }
//                 }
//             } catch (e) { }
//             return "";
//         };

//         const [cn, en, id] = await Promise.all([
//             fetchText(form.versionCN),
//             fetchText(form.versionEN),
//             fetchText(form.versionID)
//         ]);

//         setForm(prev => ({
//             ...prev,
//             rawTextCN: cn,
//             rawTextEN: en,
//             rawTextID: id,
//             bookName: selectedBook.cnName
//         }));

//         showToast("Fetched data from Bolls!", "success");
//         setFetchStatus("idle");
//     };

//     const handleUpload = async (e) => {
//         e.preventDefault();
//         setStatus("processing");
//         try {
//             const res = await fetch("/api/admin/process", {
//                 method: "POST", headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(form),
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.error);

//             showToast(data.message, "success");
//             setStatus("success");
//         } catch (err) {
//             showToast(err.message, "error");
//             setStatus("error");
//         }
//     };

//     const confirmDelete = (book) => {
//         setDeleteModal({ isOpen: true, bookId: book.id, bookName: book.name });
//     };

//     const handleDelete = async () => {
//         const id = deleteModal.bookId;
//         setDeleteModal({ ...deleteModal, isOpen: false });
//         try {
//             await fetch("/api/admin/delete", {
//                 method: "POST", headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ bookId: id }),
//             });
//             showToast(`Deleted book ${id}`, "success");
//             fetchBooksList();
//         } catch (e) {
//             showToast("Failed to delete", "error");
//         }
//     };

//     if (loading || !user || !ALLOWED_ADMINS.includes(user.email)) return null;

//     return (
//         <div className="min-h-screen bg-gray-100 p-8">
//             <div className="max-w-7xl mx-auto bg-white rounded-lg shadow overflow-hidden">
//                 <div className="bg-gray-800 text-white p-6 flex justify-between items-center">
//                     <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//                     <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white">Exit</button>
//                 </div>
//                 <div className="flex border-b">
//                     <button onClick={() => setActiveTab("upload")} className={`flex-1 py-4 font-bold text-center ${activeTab === "upload" ? "border-b-4 border-blue-600 text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-50"}`}>Upload Chapter</button>
//                     <button onClick={() => setActiveTab("manage")} className={`flex-1 py-4 font-bold text-center ${activeTab === "manage" ? "border-b-4 border-blue-600 text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-50"}`}>Manage Books</button>
//                 </div>

//                 {activeTab === "upload" && (
//                     <div className="p-8">
//                         <form onSubmit={handleUpload} className="space-y-6">

//                             {/* --- 1. Select Book & Chapter --- */}
//                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
//                                 <div>
//                                     <label className="block text-sm font-bold text-gray-700">Book</label>
//                                     <select
//                                         value={form.bookId}
//                                         onChange={(e) => {
//                                             const selected = BIBLE_BOOKS.find(b => b.id === e.target.value);
//                                             setForm({ ...form, bookId: e.target.value, bookName: selected.cnName });
//                                         }}
//                                         className="w-full border p-2 rounded mt-1 bg-white"
//                                     >
//                                         {BIBLE_BOOKS.map(b => (
//                                             <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-bold text-gray-700">Name (CN)</label>
//                                     <input type="text" value={form.bookName} onChange={(e) => setForm({ ...form, bookName: e.target.value })} className="w-full border p-2 rounded mt-1" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-bold text-gray-700">Chapter</label>
//                                     <input type="number" value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} className="w-full border p-2 rounded mt-1" />
//                                 </div>

//                                 <button
//                                     type="button"
//                                     onClick={handleAutoFetch}
//                                     disabled={fetchStatus === "fetching"}
//                                     className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50 transition flex items-center justify-center gap-2 h-[42px]"
//                                 >
//                                     {fetchStatus === "fetching" ? "Fetching..." : "Auto-Fill"}
//                                 </button>
//                             </div>

//                             <hr />

//                             {/* --- 2. Select Versions & Text Areas --- */}
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//                                 {/* MANDARIN */}
//                                 <div className="space-y-2">
//                                     <div className="flex justify-between">
//                                         <label className="block text-sm font-bold text-blue-800">Chinese Text</label>
//                                         <select value={form.versionCN} onChange={(e) => setForm({ ...form, versionCN: e.target.value })} className="text-xs border rounded p-1">
//                                             {BOLLS_VERSIONS.CN.map(v => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
//                                         </select>
//                                     </div>
//                                     <textarea rows={15} value={form.rawTextCN} onChange={(e) => setForm({ ...form, rawTextCN: e.target.value })} className="w-full border p-2 rounded text-sm font-mono focus:ring-2 focus:ring-blue-500" required />
//                                 </div>

//                                 {/* ENGLISH */}
//                                 <div className="space-y-2">
//                                     <div className="flex justify-between">
//                                         <label className="block text-sm font-bold text-green-800">English Text</label>
//                                         <select value={form.versionEN} onChange={(e) => setForm({ ...form, versionEN: e.target.value })} className="text-xs border rounded p-1">
//                                             {BOLLS_VERSIONS.EN.map(v => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
//                                         </select>
//                                     </div>
//                                     <textarea rows={15} value={form.rawTextEN} onChange={(e) => setForm({ ...form, rawTextEN: e.target.value })} className="w-full border p-2 rounded text-sm font-mono focus:ring-2 focus:ring-green-500" />
//                                 </div>

//                                 {/* INDONESIAN */}
//                                 <div className="space-y-2">
//                                     <div className="flex justify-between">
//                                         <label className="block text-sm font-bold text-red-800">Indo Text</label>
//                                         <select value={form.versionID} onChange={(e) => setForm({ ...form, versionID: e.target.value })} className="text-xs border rounded p-1">
//                                             {BOLLS_VERSIONS.ID.map(v => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
//                                         </select>
//                                     </div>
//                                     <textarea rows={15} value={form.rawTextID} onChange={(e) => setForm({ ...form, rawTextID: e.target.value })} className="w-full border p-2 rounded text-sm font-mono focus:ring-2 focus:ring-red-500" />
//                                 </div>

//                             </div>

//                             <button type="submit" disabled={status === "processing"} className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 shadow-lg">
//                                 {status === "processing" ? "Processing & Saving..." : "Process & Save to Database"}
//                             </button>
//                         </form>
//                     </div>
//                 )}

//                 {/* MANAGE BOOKS TAB */}
//                 {activeTab === "manage" && (
//                     <div className="p-8">
//                         {books.length === 0 ? <p>No books.</p> : (
//                             <div className="space-y-2">
//                                 {books.map((book) => (
//                                     <div key={book.id} className="flex justify-between p-3 border rounded">
//                                         <span>{book.name} ({book.id})</span>
//                                         <button onClick={() => confirmDelete(book)} className="text-red-500 text-sm font-bold">Delete</button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             <Modal
//                 isOpen={deleteModal.isOpen}
//                 title="Delete Book?"
//                 message={`Delete ${deleteModal.bookName}?`}
//                 confirmText="Delete"
//                 isDanger={true}
//                 onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
//                 onConfirm={handleDelete}
//             />
//         </div>
//     );
// }