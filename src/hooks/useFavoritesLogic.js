"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export function useFavoritesLogic() {
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);

    // AUDIO STATE
    const [speed, setSpeed] = useState(1.0); // Default speed 1x

    // State Modals
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingWord, setEditingWord] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: "", text: "" });

    // 1. FETCH DATA
    useEffect(() => {
        if (!authLoading && !user) return router.push("/login");

        async function fetchFavorites() {
            if (!user) return;
            try {
                const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
                const snapshot = await getDocs(q);
                const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
                setWords(list);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchFavorites();
    }, [user, authLoading, router]);

    // 2. AUDIO FUNCTION (Updated with Speed)
    const playAudio = (text) => {
        // Stop audio sebelumnya kalau ada
        window.speechSynthesis.cancel();

        const u = new SpeechSynthesisUtterance(text);
        u.lang = "zh-TW";
        u.rate = speed; // Pakai speed variable
        window.speechSynthesis.speak(u);
    };

    // 3. SAVE (ADD / EDIT)
    const handleSaveWord = async (formData) => {
        if (!user) return;
        try {
            if (editingWord) {
                const docRef = doc(db, "favorites", editingWord.id);
                const payload = {
                    text: formData.text,
                    pinyin: formData.pinyin,
                    translation: formData.translation,
                    definitionDetails: formData.definitionDetails || [],
                    updatedAt: new Date().toISOString()
                };
                await updateDoc(docRef, payload);
                setWords(prev => prev.map(w => w.id === editingWord.id ? { ...w, ...payload } : w));
                showToast("Word updated successfully", "success");
            } else {
                const docId = `${user.uid}_${formData.text}`;
                const payload = {
                    userId: user.uid,
                    text: formData.text,
                    pinyin: formData.pinyin,
                    translation: formData.translation,
                    definitionDetails: formData.definitionDetails || [],
                    savedAt: new Date().toISOString()
                };
                await setDoc(doc(db, "favorites", docId), payload);
                setWords(prev => [{ id: docId, ...payload }, ...prev]);
                showToast("New word added", "success");
            }
            setIsFormOpen(false);
            setEditingWord(null);
        } catch (e) {
            console.error(e);
            showToast("Failed to save word", "error");
        }
    };

    // 4. DELETE
    const handleDelete = async () => {
        const id = deleteModal.id;
        setDeleteModal({ ...deleteModal, isOpen: false });
        try {
            await deleteDoc(doc(db, "favorites", id));
            setWords(words.filter(w => w.id !== id));
            showToast("Word removed", "success");
        } catch (e) {
            showToast("Failed to remove word", "error");
        }
    };

    // Helpers UI
    const openAdd = () => { setEditingWord(null); setIsFormOpen(true); };
    const openEdit = (word) => { setEditingWord(word); setIsFormOpen(true); };
    const confirmDelete = (word) => { setDeleteModal({ isOpen: true, id: word.id, text: word.text }); };

    return {
        data: { words, loading, authLoading, speed }, // Export Speed
        actions: { handleSaveWord, handleDelete, playAudio, setSpeed }, // Export setSpeed
        modals: {
            isFormOpen, setIsFormOpen,
            editingWord, openAdd, openEdit,
            deleteModal, setDeleteModal, confirmDelete
        }
    };
}