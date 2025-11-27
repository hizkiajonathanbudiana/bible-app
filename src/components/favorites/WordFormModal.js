"use client";
import { useState, useEffect } from "react";
import pinyin from "pinyin";

export default function WordFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        text: "",
        pinyin: "",
        translation: "",
        definitionDetails: [] // Default awal aman
    });
    const [fetching, setFetching] = useState(false);

    // FIX: Saat load data, pastikan definitionDetails tidak undefined
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setForm({
                    ...initialData,
                    // KALAU DATA LAMA GAK PUNYA DETAILS, KASIH ARRAY KOSONG BIAR GAK CRASH
                    definitionDetails: initialData.definitionDetails || []
                });
            } else {
                // Mode Add Baru
                setForm({ text: "", pinyin: "", translation: "", definitionDetails: [] });
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    // --- LOGIC AUTO FETCH ---
    const handleAutoFetch = async () => {
        if (!form.text) return alert("Please enter Chinese text first.");
        setFetching(true);
        try {
            const res = await fetch(`/api/dictionary?text=${encodeURIComponent(form.text)}`);
            const data = await res.json();

            const pyArray = pinyin(form.text, { style: pinyin.STYLE_TONE });
            const pyString = pyArray.flat().join(" ");

            setForm(prev => ({
                ...prev,
                pinyin: pyString,
                translation: data.main || prev.translation,
                definitionDetails: data.details || []
            }));
        } catch (e) {
            alert("Failed to fetch definitions.");
        } finally {
            setFetching(false);
        }
    };

    // --- LOGIC MANIPULASI DEFINISI (CRUD LOCAL) ---
    const handleDetailChange = (index, field, value) => {
        const newDetails = [...form.definitionDetails];
        if (field === "meanings") {
            newDetails[index][field] = value.split(/,|，/).map(s => s.trim());
        } else {
            newDetails[index][field] = value;
        }
        setForm({ ...form, definitionDetails: newDetails });
    };

    const addDetail = () => {
        setForm({
            ...form,
            definitionDetails: [...form.definitionDetails, { type: "", meanings: [] }]
        });
    };

    const removeDetail = (index) => {
        const newDetails = form.definitionDetails.filter((_, i) => i !== index);
        setForm({ ...form, definitionDetails: newDetails });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-800">{initialData ? "Edit Word" : "Add New Word"}</h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* 1. Hanzi Input + Auto Fetch */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Chinese Text</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={form.text}
                                onChange={(e) => setForm({ ...form, text: e.target.value })}
                                className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. 信仰"
                                required
                                disabled={!!initialData}
                            />
                            <button
                                type="button"
                                onClick={handleAutoFetch}
                                disabled={fetching || !form.text}
                                className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-200 transition disabled:opacity-50 flex items-center gap-1"
                            >
                                {fetching ? (
                                    <span className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                                ) : "Auto-Fetch"}
                            </button>
                        </div>
                    </div>

                    {/* 2. Pinyin & Translation */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Pinyin</label>
                            <input
                                type="text"
                                value={form.pinyin}
                                onChange={(e) => setForm({ ...form, pinyin: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Main Translation</label>
                            <input
                                type="text"
                                value={form.translation}
                                onChange={(e) => setForm({ ...form, translation: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* 3. DYNAMIC DEFINITIONS */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Detailed Definitions</label>
                            <button
                                type="button"
                                onClick={addDetail}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-200 transition"
                            >
                                + Add Row
                            </button>
                        </div>

                        {/* SAFE CHECK: Ensure definitionDetails exists */}
                        {(!form.definitionDetails || form.definitionDetails.length === 0) && (
                            <p className="text-center text-sm text-gray-400 py-2">No details yet. Click Auto-Fetch or Add Row.</p>
                        )}

                        <div className="space-y-3">
                            {form.definitionDetails && form.definitionDetails.map((detail, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="w-1/4">
                                        <input
                                            type="text"
                                            value={detail.type}
                                            onChange={(e) => handleDetailChange(index, 'type', e.target.value)}
                                            placeholder="Type"
                                            className="w-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none uppercase"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={detail.meanings ? detail.meanings.join(", ") : ""} // Safe check
                                            onChange={(e) => handleDetailChange(index, 'meanings', e.target.value)}
                                            placeholder="Meanings"
                                            className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeDetail(index)}
                                        className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t mt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-bold transition">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow transition">Save Word</button>
                    </div>
                </form>
            </div>
        </div>
    );
}