"use client";

import { useState } from "react";
import Link from "next/link";
import { CURATED_TRANSLATIONS, BIBLE_BOOKS } from "@/lib/bibleData";

export default function LibraryPage() {
    // STATE SELECTION
    const [selectedChinese, setSelectedChinese] = useState("cmn_cuv"); // Default CUV
    const [selectedEnglish, setSelectedEnglish] = useState("");        // Default None
    const [selectedIndo, setSelectedIndo] = useState("");              // Default None

    // State View Mode: 'config' (pilih versi) atau 'books' (pilih buku)
    const [step, setStep] = useState('config');

    // Filter Data Translation
    const chineseOpts = CURATED_TRANSLATIONS.filter(t => t.language === "cmn");
    const englishOpts = CURATED_TRANSLATIONS.filter(t => t.language === "eng");
    const indoOpts = CURATED_TRANSLATIONS.filter(t => t.language === "ind");

    // Fungsi Generate URL (Primary + Query Params)
    const getBookUrl = (bookId) => {
        let url = `/read/${selectedChinese}/${bookId}`;
        const params = new URLSearchParams();

        if (selectedEnglish) params.set("en", selectedEnglish);
        if (selectedIndo) params.set("ind", selectedIndo);

        const qs = params.toString();
        return qs ? `${url}?${qs}` : url;
    };

    const handleGo = () => {
        setStep('books');
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-20">
            <div className="max-w-xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Library</h1>
                    <Link href="/" className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded border">Home</Link>
                </div>

                {/* STEP 1: CONFIGURATION */}
                {step === 'config' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="font-bold text-lg mb-4 text-gray-800">1. Chinese Version (Mandatory)</h2>
                            <div className="space-y-2">
                                {chineseOpts.map(ver => (
                                    <label key={ver.id} className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${selectedChinese === ver.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="chinese"
                                            value={ver.id}
                                            checked={selectedChinese === ver.id}
                                            onChange={(e) => setSelectedChinese(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="ml-3 font-medium text-gray-700">{ver.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="font-bold text-lg mb-4 text-gray-800">2. Parallel Versions (Optional)</h2>

                            {/* English Select */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-500 mb-1">English</label>
                                <select
                                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={selectedEnglish}
                                    onChange={(e) => setSelectedEnglish(e.target.value)}
                                >
                                    <option value="">-- None --</option>
                                    {englishOpts.map(ver => (
                                        <option key={ver.id} value={ver.id}>{ver.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Indo Select */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-500 mb-1">Indonesian</label>
                                <select
                                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={selectedIndo}
                                    onChange={(e) => setSelectedIndo(e.target.value)}
                                >
                                    <option value="">-- None --</option>
                                    {indoOpts.map(ver => (
                                        <option key={ver.id} value={ver.id}>{ver.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleGo}
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition active:scale-95"
                        >
                            GO / READ ➔
                        </button>
                    </div>
                )}

                {/* STEP 2: BOOK LIST */}
                {step === 'books' && (
                    <>
                        <button
                            onClick={() => setStep('config')}
                            className="mb-4 text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center gap-1"
                        >
                            ← Change Versions
                        </button>

                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg mb-4 text-xs text-blue-700 flex flex-wrap gap-2">
                            <span className="font-bold">Primary: {selectedChinese}</span>
                            {selectedEnglish && <span className="bg-white px-2 py-0.5 rounded border">+ {selectedEnglish}</span>}
                            {selectedIndo && <span className="bg-white px-2 py-0.5 rounded border">+ {selectedIndo}</span>}
                        </div>

                        <div className="grid gap-2">
                            {BIBLE_BOOKS.map((book) => (
                                <Link
                                    key={book.id}
                                    href={getBookUrl(book.id)}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:border-blue-400 hover:shadow-md transition"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-gray-900">{book.cnName}</span>
                                        <span className="text-sm text-gray-400">{book.name}</span>
                                    </div>
                                    <span className="text-gray-300">➜</span>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}