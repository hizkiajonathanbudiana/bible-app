"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BIBLE_BOOKS, CURATED_TRANSLATIONS } from "@/lib/bibleData";

export default function ReaderNavbar({ bookId, bookName, chapter, versions, settings, onOpenFavorites }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Ambil params saat ini agar tidak hilang
    const enParam = searchParams.get("en");
    const indParam = searchParams.get("ind");

    const currentCh = parseInt(chapter);
    const currentMainVer = versions?.current || "cmn_cuv";

    // Filter Options
    const chineseOpts = CURATED_TRANSLATIONS.filter(t => t.language === "cmn");
    const englishOpts = CURATED_TRANSLATIONS.filter(t => t.language === "eng");
    const indoOpts = CURATED_TRANSLATIONS.filter(t => t.language === "ind");

    // --- HANDLERS ---

    // Ganti Versi Utama (Redirect URL)
    const changeMainVer = (newVer) => {
        const query = new URLSearchParams();
        if (enParam) query.set("en", enParam);
        if (indParam) query.set("ind", indParam);
        router.push(`/read/${newVer}/${bookId}/${currentCh}?${query.toString()}`);
    };

    // Ganti Versi Pendamping (Update Query Params)
    const changeParallelVer = (type, val) => {
        const query = new URLSearchParams(searchParams.toString());
        if (val === "none") query.delete(type);
        else query.set(type, val);

        // Update URL tanpa refresh page penuh
        router.push(`/read/${currentMainVer}/${bookId}/${currentCh}?${query.toString()}`);

        // Auto toggle switch di settings
        if (type === "en") settings.setSettings(s => ({ ...s, showEnglish: val !== "none" }));
        if (type === "ind") settings.setSettings(s => ({ ...s, showIndonesian: val !== "none" }));
    };

    // Ganti Chapter / Buku
    const navigate = (newBookId, newChapter) => {
        const query = new URLSearchParams(searchParams.toString());
        router.push(`/read/${currentMainVer}/${newBookId}/${newChapter}?${query.toString()}`);
    };

    // Styles berdasarkan Dark Mode
    const theme = settings.isDarkMode
        ? "bg-gray-900 border-gray-800 text-gray-200"
        : "bg-white/95 border-gray-200 text-gray-800";

    const selectTheme = settings.isDarkMode
        ? "bg-gray-800 text-gray-200 border-gray-700 focus:ring-gray-600"
        : "bg-gray-50 text-gray-700 border-gray-200 focus:ring-blue-500";

    return (
        <nav className={`${theme} backdrop-blur sticky top-0 z-40 border-b shadow-sm transition-colors duration-300`}>
            <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-3">

                {/* ROW 1: Navigation & Title */}
                <div className="flex justify-between items-center">
                    {/* BACK BUTTON */}
                    <Link
                        href={`/read/${currentMainVer}/${bookId}?en=${enParam}&ind=${indParam}`}
                        className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-lg transition ${settings.isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600'}`}
                    >
                        ← Back
                    </Link>

                    {/* CENTER CONTROLS (Prev - Title - Next) */}
                    <div className="flex items-center gap-3">
                        <button
                            disabled={currentCh <= 1}
                            onClick={() => navigate(bookId, currentCh - 1)}
                            className="p-2 rounded-full hover:bg-gray-200/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ◀
                        </button>

                        <div className="flex flex-col items-center">
                            {/* Book Dropdown */}
                            <select
                                value={bookId}
                                onChange={(e) => navigate(e.target.value, 1)}
                                className={`text-center font-bold text-lg appearance-none bg-transparent cursor-pointer outline-none ${settings.isDarkMode ? 'text-white' : 'text-gray-900'}`}
                            >
                                {BIBLE_BOOKS.map(b => (
                                    <option key={b.id} value={b.id} className="text-black">{b.cnName}</option>
                                ))}
                            </select>
                            <span className="text-xs font-mono opacity-70">Chapter {currentCh}</span>
                        </div>

                        <button
                            onClick={() => navigate(bookId, currentCh + 1)}
                            className="p-2 rounded-full hover:bg-gray-200/20"
                        >
                            ▶
                        </button>
                    </div>

                    {/* RIGHT: Favorites */}
                    <button onClick={onOpenFavorites} className="text-yellow-500 hover:text-yellow-400 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* ROW 2: 3 Version Selectors */}
                <div className="grid grid-cols-3 gap-2">
                    {/* Main (Chinese) */}
                    <select
                        value={currentMainVer}
                        onChange={(e) => changeMainVer(e.target.value)}
                        className={`w-full text-xs p-2 rounded border ${selectTheme}`}
                    >
                        {chineseOpts.map(v => <option key={v.id} value={v.id} className="text-black">{v.name}</option>)}
                    </select>

                    {/* English */}
                    <select
                        value={enParam || "none"}
                        onChange={(e) => changeParallelVer("en", e.target.value)}
                        className={`w-full text-xs p-2 rounded border ${selectTheme}`}
                    >
                        <option value="none" className="text-black">None (English)</option>
                        {englishOpts.map(v => <option key={v.id} value={v.id} className="text-black">{v.id} - {v.name}</option>)}
                    </select>

                    {/* Indonesian */}
                    <select
                        value={indParam || "none"}
                        onChange={(e) => changeParallelVer("ind", e.target.value)}
                        className={`w-full text-xs p-2 rounded border ${selectTheme}`}
                    >
                        <option value="none" className="text-black">None (Indo)</option>
                        {indoOpts.map(v => <option key={v.id} value={v.id} className="text-black">{v.id} - {v.name}</option>)}
                    </select>
                </div>

                {/* ROW 3: Appearance Controls (Font & Dark Mode) */}
                <div className={`flex justify-between items-center px-2 py-1 rounded-lg ${settings.isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>

                    {/* Font Adjuster */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold opacity-60">SIZE</span>
                        <button
                            onClick={() => settings.setSettings(s => ({ ...s, fontSize: Math.max(0.8, s.fontSize - 0.1) }))}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200/50 rounded hover:bg-gray-300/50"
                        >
                            -
                        </button>
                        <span className="text-xs font-mono w-8 text-center">{settings.fontSize.toFixed(1)}</span>
                        <button
                            onClick={() => settings.setSettings(s => ({ ...s, fontSize: Math.min(2.5, s.fontSize + 0.1) }))}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200/50 rounded hover:bg-gray-300/50"
                        >
                            +
                        </button>
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => settings.setSettings(s => ({ ...s, isDarkMode: !s.isDarkMode }))}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition ${settings.isDarkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-200 text-gray-600'}`}
                    >
                        {settings.isDarkMode ? '☀ Light' : '☾ Dark'}
                    </button>
                </div>

            </div>
        </nav>
    );
}