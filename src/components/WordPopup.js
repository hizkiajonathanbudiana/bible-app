"use client";

import { useState, useEffect } from "react";

export default function WordPopup({ wordData, onClose, onSave, onPlay, currentSpeed, onSpeedChange }) {
    const [definition, setDefinition] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch data definition
    useEffect(() => {
        if (!wordData?.text) return;
        setDefinition(null);
        setLoading(true);

        async function fetchDefinition() {
            try {
                const res = await fetch(`/api/dictionary?text=${encodeURIComponent(wordData.text)}`);
                const data = await res.json();
                setDefinition(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchDefinition();
    }, [wordData]);

    if (!wordData) return null;

    const handleSaveClick = () => {
        // KIRIM DATA LENGKAP KE PARENT (READER PAGE)
        onSave({
            ...wordData,
            translation: definition?.main,       // Arti Utama (Mongolian)
            details: definition?.details || []   // Detail (Noun: ..., Verb: ...)
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="bg-white p-6 pb-2 text-center border-b border-gray-50 flex-shrink-0 relative">
                    <button
                        onClick={() => onPlay(wordData.text)}
                        className="absolute right-4 top-4 p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition active:scale-95 z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    </button>

                    <h2 className="text-6xl font-bold text-gray-900 mb-1 mt-2 tracking-wide">{wordData.text}</h2>
                    <p className="text-2xl text-blue-500 font-medium font-serif mb-4">{wordData.pinyin}</p>

                    <div className="bg-gray-100 rounded-full py-2 px-4 inline-flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Speed</span>
                        <input
                            type="range" min="0.1" max="2.0" step="0.1"
                            value={currentSpeed}
                            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                            className="w-24 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-xs font-bold text-blue-600 w-8 text-right">{currentSpeed}x</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-60">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-blue-800">Looking up dictionary...</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="text-center">
                                <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-1">Main Meaning</p>
                                <p className="text-2xl font-serif text-gray-800 capitalize">
                                    {definition?.main || "Not found"}
                                </p>
                            </div>

                            {definition?.details && definition.details.length > 0 ? (
                                <div className="space-y-3 border-t border-gray-200 pt-4">
                                    {definition.details.map((item, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-left">
                                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded mb-1">
                                                {item.type}
                                            </span>
                                            <p className="text-gray-700 leading-relaxed text-sm">
                                                {item.meanings.join(", ")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                !loading && <div className="text-center mt-4"><p className="text-sm text-gray-400">No detailed definitions.</p></div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-3 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSaveClick} // Panggil fungsi wrapper di atas
                        className="px-4 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-md transition flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        Save Word
                    </button>
                </div>

            </div>
        </div>
    );
}