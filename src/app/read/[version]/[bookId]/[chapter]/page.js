"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useReaderLogic } from "@/hooks/useReaderLogic";
import ReaderNavbar from "@/components/reader/ReaderNavbar";
import VerseList from "@/components/reader/VerseList";
import BottomPlayer from "@/components/reader/BottomPlayer";
import WordPopup from "@/components/WordPopup";
import FavoritesQuickView from "@/components/favorites/FavoritesQuickView";

export default function ReaderPage() {
    const params = useParams();
    const { version, bookId, chapter } = params;

    // Logic Hook (Sudah include Dark Mode State)
    const { data, settings, audio, popup } = useReaderLogic(version, bookId, chapter);
    const [showFavModal, setShowFavModal] = useState(false);

    // Tentukan Warna Background & Teks berdasarkan Mode
    const pageTheme = settings.isDarkMode
        ? "bg-[#121212] text-gray-300" // Warna Dark Mode
        : "bg-[#f8f5f2] text-gray-900"; // Warna Light Mode (Kertas)

    if (data.loading) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center ${pageTheme}`}>
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="opacity-70 font-medium">Loading Scripture...</p>
            </div>
        );
    }

    const fullChapterText = data.verses ? data.verses.map(v => v.text).join("。") : "";

    return (
        <div className={`min-h-screen pb-48 transition-colors duration-300 ${pageTheme}`}>

            {/* Navbar dengan Kontrol Lengkap */}
            <ReaderNavbar
                bookId={bookId}
                bookName={data.bookName || bookId}
                chapter={chapter}
                versions={{ current: version }}
                settings={settings} // Pass settings ke navbar buat toggle dark mode
                onOpenFavorites={() => setShowFavModal(true)}
            />

            {/* List Ayat */}
            {/* Kita perlu passing isDarkMode ke VerseList biar text color ayatnya menyesuaikan */}
            <VerseList
                verses={data.verses || []}
                settings={settings}
                audio={audio}
                onWordClick={popup.setSelectedWord}
            />

            <BottomPlayer
                audio={audio}
                fullChapterText={fullChapterText}
                isDarkMode={settings.isDarkMode} // Pass ke player biar warnanya nyatu
            />

            {popup.selectedWord && (
                <WordPopup
                    wordData={popup.selectedWord}
                    onClose={() => popup.setSelectedWord(null)}
                    onSave={popup.handleSaveWord}
                    onPlay={(txt) => audio.playText(txt, 'word')}
                    currentSpeed={audio.speed}
                    onSpeedChange={audio.handleSpeedChange}
                />
            )}

            <FavoritesQuickView
                isOpen={showFavModal}
                onClose={() => setShowFavModal(false)}
            />
        </div>
    );
}