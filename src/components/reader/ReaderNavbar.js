import Link from "next/link";

export default function ReaderNavbar({ bookId, bookName, chapter, settings, audio, versions }) {
    const { voices, selectedVoiceURI, handleVoiceChange } = audio;

    return (
        <nav className="bg-white sticky top-0 z-40 px-4 py-3 shadow-sm border-b border-gray-100">
            <div className="max-w-3xl mx-auto flex flex-col gap-3">

                {/* TOP ROW: Back - Title - Saved */}
                <div className="flex justify-between items-center relative">

                    {/* LEFT: Back Button */}
                    <Link
                        href={`/read/${bookId}`}
                        className="text-gray-500 font-medium hover:text-gray-800 transition flex items-center gap-1 min-w-[3rem]"
                    >
                        <span>←</span> Back
                    </Link>

                    {/* CENTER: Title & Versions */}
                    <div className="flex flex-col items-center flex-1 px-2">
                        <h1 className="font-bold text-lg text-gray-800 flex items-center justify-center gap-2 text-center leading-tight">
                            <span className="line-clamp-1">{bookName}</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm flex-shrink-0">
                                {chapter}
                            </span>
                        </h1>

                        {/* VERSION BADGES (Menampilkan Versi Aktif) */}
                        {versions && (
                            <div className="flex flex-wrap justify-center gap-2 mt-1.5">
                                {versions.cn && (
                                    <span className="text-[10px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">
                                        CN: {versions.cn}
                                    </span>
                                )}
                                {versions.en && (
                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                                        EN: {versions.en}
                                    </span>
                                )}
                                {versions.id && (
                                    <span className="text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">
                                        ID: {versions.id}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Saved Words Button */}
                    <Link
                        href="/favorites"
                        className="text-yellow-400 hover:text-yellow-600 transition p-1.5 rounded-full hover:bg-yellow-50 min-w-[3rem] flex justify-end"
                        title="My Saved Words"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>

                {/* BOTTOM ROW: Settings Bar */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm bg-gray-50 p-2 rounded-lg">
                    {/* Toggles */}
                    <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-blue-600 transition px-1">
                        <input
                            type="checkbox"
                            checked={settings.showPinyin}
                            onChange={() => settings.setSettings(prev => ({ ...prev, showPinyin: !prev.showPinyin }))}
                            className="accent-blue-600 w-4 h-4"
                        />
                        Pinyin
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-blue-600 transition px-1">
                        <input
                            type="checkbox"
                            checked={settings.showEnglish}
                            onChange={() => settings.setSettings(prev => ({ ...prev, showEnglish: !prev.showEnglish }))}
                            className="accent-blue-600 w-4 h-4"
                        />
                        EN
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-green-600 transition px-1">
                        <input
                            type="checkbox"
                            checked={settings.showIndonesian}
                            onChange={() => settings.setSettings(prev => ({ ...prev, showIndonesian: !prev.showIndonesian }))}
                            className="accent-green-600 w-4 h-4"
                        />
                        ID
                    </label>

                    <div className="h-5 w-[1px] bg-gray-300 mx-1"></div>

                    {/* Audio Selector */}
                    <select
                        value={selectedVoiceURI}
                        onChange={(e) => handleVoiceChange(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs max-w-[120px] cursor-pointer hover:border-blue-500 outline-none bg-white truncate"
                    >
                        {voices.length === 0 && <option>Default Voice</option>}
                        {voices.map(v => (
                            <option key={v.voiceURI} value={v.voiceURI}>{v.name.replace(/Google|Microsoft|Apple/g, '').trim()}</option>
                        ))}
                    </select>
                </div>
            </div>
        </nav>
    );
}