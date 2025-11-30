"use client";

import { useState } from "react";
import { useFavoritesLogic } from "@/hooks/useFavoritesLogic"; // Reuse logic yg ada
import WordCard from "@/components/favorites/WordCard";
import WordFormModal from "@/components/favorites/WordFormModal";
import Modal from "@/components/Modal";
import Link from "next/link";

export default function FavoritesQuickView({ isOpen, onClose }) {
    // Reuse logic dari hook yang sudah kamu punya
    const { data, actions, modals } = useFavoritesLogic();
    const { words, loading } = data;

    // Local State untuk Pagination di Popup
    const [displayLimit, setDisplayLimit] = useState(5);

    if (!isOpen) return null;

    // Filter words yang ditampilkan
    const displayedWords = words.slice(0, displayLimit);
    const hasMore = words.length > displayLimit;

    // Handler Show More
    const handleLoadMore = () => setDisplayLimit(prev => prev + 10);

    return (
        // Overlay Z-Index tinggi
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">

            {/* Modal Content */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Quick Favorites</h2>
                        <p className="text-xs text-gray-500">{words.length} saved words</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={modals.openAdd}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition"
                        >
                            + Add
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-bold transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* List Content (Scrollable) */}
                <div className="overflow-y-auto p-4 space-y-3 bg-gray-50 flex-1">
                    {loading ? (
                        <div className="text-center py-10 text-gray-400">Loading words...</div>
                    ) : displayedWords.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">No saved words yet.</div>
                    ) : (
                        displayedWords.map(word => (
                            <WordCard
                                key={word.id}
                                word={word}
                                onPlay={actions.playAudio}
                                onEdit={modals.openEdit}
                                onDelete={modals.confirmDelete}
                            />
                        ))
                    )}

                    {/* Load More Button */}
                    {hasMore && (
                        <button
                            onClick={handleLoadMore}
                            className="w-full py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl border border-dashed border-blue-200 transition"
                        >
                            Load 10 More...
                        </button>
                    )}
                </div>

                {/* Footer: Show All Page */}
                <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
                    <Link
                        href="/favorites"
                        className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition"
                    >
                        Show Full Collection ➔
                    </Link>
                </div>
            </div>

            {/* --- NESTED MODALS (Form & Delete) --- */}
            {/* Karena ini di dalam modal, z-index form harus lebih tinggi */}
            <div className="relative z-[80]">
                <WordFormModal
                    isOpen={modals.isFormOpen}
                    onClose={() => modals.setIsFormOpen(false)}
                    onSubmit={actions.handleSaveWord}
                    initialData={modals.editingWord}
                />
            </div>

            {modals.deleteModal.isOpen && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/20">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                        <h3 className="font-bold text-lg mb-2">Delete Word?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete "{modals.deleteModal.text}"?</p>
                        <div className="flex gap-3">
                            <button onClick={() => modals.setDeleteModal({ ...modals.deleteModal, isOpen: false })} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">Cancel</button>
                            <button onClick={actions.handleDelete} className="flex-1 py-2 bg-red-500 text-white rounded-lg font-bold">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}