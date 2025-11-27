export default function VerseList({ verses, settings, audio, onWordClick }) {
    const { isPlaying, currentScope, playText } = audio;
    // Tambah showIndonesian
    const { showPinyin, showEnglish, showIndonesian, fontSize } = settings;

    return (
        <main className="max-w-3xl mx-auto p-4 space-y-6">
            {verses.map((verse) => (
                <div key={verse.verse} className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex gap-3 items-start">

                        {/* Speaker Button */}
                        <div className="flex flex-col items-center gap-2 pt-1 min-w-[2.5rem] flex-shrink-0">
                            <span className="font-serif font-bold text-gray-400 text-sm select-none">{verse.verse}</span>
                            <button
                                onClick={() => playText(verse.text, `verse-${verse.verse}`)}
                                className={`p-2 rounded-full transition-all ${isPlaying && currentScope === `verse-${verse.verse}` ? 'text-red-500 bg-red-50 scale-110 shadow-sm' : 'text-blue-400 hover:text-blue-600 hover:bg-blue-50'}`}
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

                        {/* Text Content */}
                        <div className="flex-1">
                            {/* Mandarin Text */}
                            <div className="text-gray-800 leading-[2.5] tracking-wide" style={{ fontSize: `${fontSize}rem` }}>
                                {verse.segments.map((seg, idx) => (
                                    <span
                                        key={idx}
                                        onClick={() => { if (/[\u4e00-\u9fa5]/.test(seg.text)) onWordClick(seg) }}
                                        className={`
                                            inline-flex flex-col-reverse justify-end items-center align-middle
                                            cursor-pointer rounded-sm hover:bg-blue-100 transition-colors duration-100
                                            mx-[1px]
                                            ${/[\u4e00-\u9fa5]/.test(seg.text) ? 'hover:text-blue-900' : ''}
                                        `}
                                    >
                                        <span>{seg.text}</span>
                                        {showPinyin && seg.pinyin && (
                                            <span className="text-gray-400 font-normal select-none pointer-events-none mb-[-0.3em]" style={{ fontSize: '0.45em' }}>
                                                {seg.pinyin}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>

                            {/* English Text */}
                            {showEnglish && verse.englishText && (
                                <p className="mt-4 text-gray-500 font-serif text-lg border-t border-gray-50 pt-3 leading-relaxed">
                                    {verse.englishText}
                                </p>
                            )}

                            {/* INDONESIAN TEXT (NEW) */}
                            {showIndonesian && verse.indonesianText && (
                                <p className="mt-2 text-gray-800 font-sans text-base leading-relaxed italic border-l-2 border-red-200 pl-3">
                                    {verse.indonesianText}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </main>
    );
}