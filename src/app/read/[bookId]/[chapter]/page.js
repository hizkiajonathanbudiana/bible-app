"use client";

import { useParams } from "next/navigation";
import { useReaderLogic } from "@/hooks/useReaderLogic";
import ReaderNavbar from "@/components/reader/ReaderNavbar";
import VerseList from "@/components/reader/VerseList";
import BottomPlayer from "@/components/reader/BottomPlayer";
import WordPopup from "@/components/WordPopup";

export default function ReaderPage() {
    const params = useParams();

    // Panggil Otaknya (Logic Hook)
    const { data, settings, audio, popup } = useReaderLogic(params.bookId, params.chapter);

    if (data.loading) return <div className="p-10 text-center">Loading Scripture...</div>;

    // Helper data
    const fullChapterText = data.verses.map(v => v.text).join("。");

    return (
        <div className="min-h-screen bg-[#f8f5f2] pb-48">

            {/* 1. Navbar */}
            <ReaderNavbar
                bookId={params.bookId}
                bookName={data.bookName}
                chapter={params.chapter}
                settings={settings}
                audio={audio}
            />

            {/* 2. List Ayat */}
            <VerseList
                verses={data.verses}
                settings={settings} // Pass settings (pinyin/english state)
                audio={audio}       // Pass audio state & play function
                onWordClick={popup.setSelectedWord}
            />

            {/* 3. Sticky Player */}
            <BottomPlayer
                audio={audio}
                fullChapterText={fullChapterText}
            />

            {/* 4. Popup (Conditional) */}
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
        </div>
    );
}