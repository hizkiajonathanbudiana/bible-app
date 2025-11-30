"use client";

export default function VerseList({ verses, settings, audio, onWordClick }) {
    const { isPlaying, currentScope, playText } = audio;

    // Ambil semua setting termasuk Dark Mode
    const { showPinyin, showEnglish, showIndonesian, fontSize, isDarkMode } = settings;

    // --- THEME CONFIGURATION ---
    const theme = {
        cardBg: isDarkMode
            ? "bg-gray-900 border-gray-800 hover:border-gray-700"
            : "bg-white border-gray-100 hover:border-blue-300",

        textMain: isDarkMode ? "text-gray-100" : "text-gray-900",
        textSub: isDarkMode ? "text-gray-400" : "text-gray-600",

        verseNum: isDarkMode ? "text-gray-500" : "text-gray-400",

        borderTop: isDarkMode ? "border-gray-800" : "border-gray-100",
        borderLeft: isDarkMode ? "border-green-900" : "border-green-200",

        charHover: isDarkMode
            ? "hover:bg-gray-700 hover:text-blue-300"
            : "hover:bg-blue-100 hover:text-blue-800",

        pinyin: isDarkMode ? "text-gray-500" : "text-gray-400",

        activeAudioBtn: "text-red-500 bg-red-50 scale-110 shadow-sm",
        inactiveAudioBtn: isDarkMode
            ? "text-gray-600 hover:text-blue-400 hover:bg-gray-800"
            : "text-blue-300 hover:text-blue-600 hover:bg-blue-50"
    };

    return (
        <main className="max-w-4xl mx-auto p-4 space-y-4">
            {verses.map((verse) => (
                <div
                    key={verse.verse}
                    id={`verse-${verse.verse}`} // PENTING: Untuk Auto Scroll
                    className={`${theme.cardBg} p-5 rounded-xl shadow-sm border transition-all duration-200`}
                >
                    <div className="flex gap-4 items-start">

                        {/* --- KOLOM KIRI: NOMOR AYAT & AUDIO --- */}
                        <div className="flex flex-col items-center gap-2 pt-1 min-w-[2.5rem] flex-shrink-0">
                            <span className={`font-serif font-bold text-sm select-none ${theme.verseNum}`}>
                                {verse.verse}
                            </span>

                            <button
                                onClick={() => playText(verse.text, `verse-${verse.verse}`)}
                                className={`p-2 rounded-full transition-all ${isPlaying && currentScope === `verse-${verse.verse}`
                                    ? theme.activeAudioBtn
                                    : theme.inactiveAudioBtn
                                    }`}
                                title="Play Audio"
                            >
                                {isPlaying && currentScope === `verse-${verse.verse}` ? (
                                    <div className="flex gap-0.5 h-3 items-end justify-center">
                                        <div className="w-1 bg-current animate-pulse h-2"></div>
                                        <div className="w-1 bg-current animate-pulse h-3"></div>
                                        <div className="w-1 bg-current animate-pulse h-1"></div>
                                    </div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* --- KOLOM KANAN: ISI TEKS --- */}
                        <div className="flex-1 space-y-3">

                            {/* 1. MANDARIN TEXT */}
                            <div
                                className={`${theme.textMain} leading-[2.2] tracking-wide font-medium flex flex-wrap`}
                                style={{ fontSize: `${fontSize}rem` }}
                            >
                                {verse.segments.map((seg, idx) => (
                                    <span
                                        key={idx}
                                        onClick={() => { if (/[\u4e00-\u9fa5]/.test(seg.text)) onWordClick(seg) }}
                                        className={`
                                            inline-flex flex-col-reverse justify-end items-center align-middle
                                            cursor-pointer rounded-md transition-colors duration-150
                                            mx-[2px] px-[1px]
                                            ${/[\u4e00-\u9fa5]/.test(seg.text) ? theme.charHover : ''}
                                        `}
                                    >
                                        <span>{seg.text}</span>
                                        {showPinyin && seg.pinyin && (
                                            <span
                                                className={`${theme.pinyin} font-light select-none pointer-events-none mb-[-0.2em] font-sans`}
                                                style={{ fontSize: '0.45em' }}
                                            >
                                                {seg.pinyin}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>

                            {/* 2. ENGLISH TRANSLATION */}
                            {showEnglish && (
                                <div className={`pt-3 border-t ${theme.borderTop}`}>
                                    {verse.englishText ? (
                                        <p className={`${theme.textSub} font-serif leading-relaxed`} style={{ fontSize: `${fontSize * 0.65}rem` }}>
                                            {verse.englishText}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-red-300 italic opacity-50">No English data.</p>
                                    )}
                                </div>
                            )}

                            {/* 3. INDONESIAN TRANSLATION */}
                            {showIndonesian && (
                                <div className="pt-1">
                                    {verse.indonesianText ? (
                                        <p
                                            className={`${theme.textSub} font-sans italic leading-relaxed pl-3 border-l-2 ${theme.borderLeft}`}
                                            style={{ fontSize: `${fontSize * 0.6}rem` }}
                                        >
                                            {verse.indonesianText}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-red-300 italic opacity-50">No Indonesian data.</p>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            ))}
        </main>
    );
}