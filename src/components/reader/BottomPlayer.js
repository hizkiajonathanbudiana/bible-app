"use client";

export default function BottomPlayer({ audio, fullChapterText, isDarkMode }) {
    const { isPlaying, playText, speed, handleSpeedChange } = audio;

    // Theme Config
    const theme = {
        bg: isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200",
        textMain: isDarkMode ? "text-gray-100" : "text-gray-900",
        textSub: isDarkMode ? "text-gray-400" : "text-gray-500",
        sliderTrack: isDarkMode ? "bg-gray-700" : "bg-gray-200",
        sliderContainer: isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200",
    };

    return (
        <div className={`fixed bottom-0 left-0 right-0 ${theme.bg} border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 transition-colors duration-300`}>
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">

                {/* PLAY BUTTON */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => playText(fullChapterText, "chapter")}
                        className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition active:scale-95"
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>

                    <div className="hidden sm:block">
                        <h3 className={`font-bold text-sm ${theme.textMain}`}>Whole Chapter</h3>
                        <p className={`text-xs ${theme.textSub}`}>Tap to listen all</p>
                    </div>
                </div>

                {/* SPEED CONTROL */}
                <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${theme.sliderContainer}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.textSub}`}>Speed</span>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={speed}
                        onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                        className={`w-24 h-1.5 rounded-lg appearance-none cursor-pointer ${theme.sliderTrack} accent-blue-600`}
                    />
                    <span className="text-xs font-bold text-blue-500 w-8 text-right font-mono">{speed.toFixed(1)}x</span>
                </div>
            </div>
        </div>
    );
}