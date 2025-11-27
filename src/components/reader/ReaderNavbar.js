import Link from "next/link";

export default function ReaderNavbar({ bookId, bookName, chapter, settings, audio }) {
    const { voices, selectedVoiceURI, handleVoiceChange } = audio;

    return (
        <nav className="bg-white sticky top-0 z-40 px-4 py-3 shadow-sm border-b border-gray-100">
            <div className="max-w-3xl mx-auto flex flex-col gap-3">

                <div className="flex justify-between items-center">
                    <Link
                        href={`/read/${bookId}`}
                        className="text-gray-500 font-medium hover:text-gray-800 transition flex items-center gap-1 min-w-[3rem]"
                    >
                        <span>←</span> Back
                    </Link>

                    <h1 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <span className="line-clamp-1">{bookName}</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm flex-shrink-0">
                            {chapter}
                        </span>
                    </h1>

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

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm bg-gray-50 p-2 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-600 transition">
                        <input
                            type="checkbox"
                            checked={settings.showPinyin}
                            onChange={() => settings.setSettings(prev => ({ ...prev, showPinyin: !prev.showPinyin }))}
                            className="accent-blue-600"
                        />
                        Pinyin
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-600 transition">
                        <input
                            type="checkbox"
                            checked={settings.showEnglish}
                            onChange={() => settings.setSettings(prev => ({ ...prev, showEnglish: !prev.showEnglish }))}
                            className="accent-blue-600"
                        />
                        English
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-red-600 transition">
                        <input
                            type="checkbox"
                            checked={settings.showIndonesian}
                            onChange={() => settings.setSettings(prev => ({ ...prev, showIndonesian: !prev.showIndonesian }))}
                            className="accent-red-600"
                        />
                        Indo
                    </label>
                    <select
                        value={selectedVoiceURI}
                        onChange={(e) => handleVoiceChange(e.target.value)}
                        className="border rounded px-2 py-1 text-xs max-w-[150px] cursor-pointer hover:border-blue-500 outline-none bg-white"
                    >
                        {voices.length === 0 && <option>Default Voice</option>}
                        {voices.map(v => (
                            <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </nav>
    );
}