"use client";

import { useFavoritesLogic } from "@/hooks/useFavoritesLogic";
import FavoritesHeader from "@/components/favorites/FavoritesHeader";
import WordCard from "@/components/favorites/WordCard";
import WordFormModal from "@/components/favorites/WordFormModal";
import Modal from "@/components/Modal";
import Link from "next/link";

export default function FavoritesPage() {
    const { data, actions, modals } = useFavoritesLogic();
    const { words, loading, authLoading, speed } = data; // Ambil speed dari data

    if (loading || authLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* 1. Header with Speed Control */}
            <FavoritesHeader
                count={words.length}
                onAdd={modals.openAdd}
                speed={speed}                // Pass speed
                setSpeed={actions.setSpeed}  // Pass setter
            />

            {/* 2. List Grid */}
            <div className="max-w-4xl mx-auto p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                {words.length === 0 ? (
                    <div className="col-span-2 text-center py-20 text-gray-400">
                        <p>No words saved yet.</p>
                        <Link href="/read" className="text-blue-600 underline mt-2 inline-block">Start Reading</Link>
                    </div>
                ) : (
                    words.map((word) => (
                        <WordCard
                            key={word.id}
                            word={word}
                            onPlay={actions.playAudio}
                            onEdit={modals.openEdit}
                            onDelete={modals.confirmDelete}
                        />
                    ))
                )}
            </div>

            {/* 3. Modal Form */}
            <WordFormModal
                isOpen={modals.isFormOpen}
                onClose={() => modals.setIsFormOpen(false)}
                onSubmit={actions.handleSaveWord}
                initialData={modals.editingWord}
            />

            {/* 4. Modal Delete */}
            <Modal
                isOpen={modals.deleteModal.isOpen}
                title="Remove Word?"
                message={`Remove "${modals.deleteModal.text}" from your vocabulary list?`}
                confirmText="Remove"
                isDanger={true}
                onCancel={() => modals.setDeleteModal({ ...modals.deleteModal, isOpen: false })}
                onConfirm={actions.handleDelete}
            />
        </div>
    );
}