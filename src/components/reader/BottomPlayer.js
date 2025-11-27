export default function BottomPlayer({ audio, fullChapterText }) {
    const { isPlaying, currentScope, playText, speed, handleSpeedChange } = audio;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 p-4 pb-6 safe-area-bottom">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">

                {/* Play Chapter Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => playText(fullChapterText, 'chapter')}
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all transform active:scale-95 ${isPlaying && currentScope === 'chapter' ? 'bg-red-500 ring-4 ring-red-100' : 'bg-blue-600 ring-4 ring-blue-50'}`}
                    >
                        {isPlaying && currentScope === 'chapter' ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        ) : (
                            <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        )}
                    </button>
                    <div className="hidden md:block">
                        <p className="font-bold text-gray-800 text-sm">Whole Chapter</p>
                        <p className="text-xs text-gray-500">{isPlaying && currentScope === 'chapter' ? "Playing..." : "Tap to listen all"}</p>
                    </div>
                </div>

                {/* Speed Slider */}
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Speed</span>
                        <input
                            type="range" min="0.1" max="2.0" step="0.1"
                            value={speed}
                            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                            className="w-24 md:w-40 accent-blue-600 h-2 bg-gray-300 rounded-lg cursor-pointer"
                        />
                        <span className="text-xs font-bold text-blue-600 w-8 text-right font-mono">{speed}x</span>
                    </div>
                    <p className="text-[10px] text-gray-400 pr-2">Controls Verse, Popup & Chapter</p>
                </div>
            </div>
        </div>
    );
}