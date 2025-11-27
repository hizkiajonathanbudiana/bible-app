"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export function useReaderLogic(bookId, chapter) {
    const { user } = useAuth();
    const { showToast } = useToast();

    // DATA STATE
    const [verses, setVerses] = useState([]);
    const [bookName, setBookName] = useState("");
    const [versions, setVersions] = useState(null); // Info versi (CN: CCB, dll)
    const [loading, setLoading] = useState(true);

    // UI SETTINGS
    const [settings, setSettings] = useState({
        showPinyin: true,
        showEnglish: true,
        showIndonesian: true,
        fontSize: 1.5,
    });

    const [selectedWord, setSelectedWord] = useState(null);

    // AUDIO STATE
    const [audioState, setAudioState] = useState({
        isPlaying: false,
        currentScope: "",
        currentText: "",
        speed: 1.0,
        voices: [],
        selectedVoiceURI: ""
    });

    const synthRef = useRef(null);

    // --- 1. FETCH DATA (Panggil API Internal Kita) ---
    useEffect(() => {
        async function fetchChapter() {
            setLoading(true);
            try {
                // INI KUNCINYA: Panggil API Route server-side kita
                const res = await fetch(`/api/bible/${bookId}/${chapter}`);

                if (!res.ok) {
                    // Kalau error, throw biar ditangkap catch
                    const errData = await res.json();
                    throw new Error(errData.error || "Failed to fetch");
                }

                const data = await res.json();

                // Data sudah matang dari server (sudah ada pinyin, segmentasi, dll)
                setVerses(data.verses);
                setBookName(data.bookName);
                setVersions(data.versions); // Set info versi

            } catch (err) {
                console.error("Reader Logic Error:", err);
                showToast(err.message, "error");
            } finally {
                setLoading(false);
            }
        }
        if (bookId && chapter) fetchChapter();
    }, [bookId, chapter]);

    // --- 2. AUDIO SETUP (Sama seperti sebelumnya) ---
    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
            const loadVoices = () => {
                const all = synthRef.current.getVoices();
                const zh = all.filter(v => v.lang.includes("zh") || v.lang.includes("CN") || v.lang.includes("TW"));
                setAudioState(prev => {
                    const tw = zh.find(v => v.lang === "zh-TW");
                    const defaultVoice = tw ? tw.voiceURI : (zh.length > 0 ? zh[0].voiceURI : "");
                    if (!prev.selectedVoiceURI) return { ...prev, voices: zh, selectedVoiceURI: defaultVoice };
                    return { ...prev, voices: zh };
                });
            };
            loadVoices();
            if (synthRef.current.onvoiceschanged !== undefined) synthRef.current.onvoiceschanged = loadVoices;
        }
        return () => { if (synthRef.current) synthRef.current.cancel(); }
    }, []);

    // Play Text
    const playText = (text, scopeId) => {
        if (!synthRef.current) return;
        if (audioState.isPlaying && audioState.currentScope === scopeId) {
            synthRef.current.cancel();
            setAudioState(prev => ({ ...prev, isPlaying: false, currentScope: "", currentText: "" }));
            return;
        }
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "zh-TW";
        utterance.rate = audioState.speed;
        if (audioState.selectedVoiceURI) {
            const voice = synthRef.current.getVoices().find(v => v.voiceURI === audioState.selectedVoiceURI);
            if (voice) utterance.voice = voice;
        }
        utterance.onstart = () => setAudioState(prev => ({ ...prev, isPlaying: true, currentScope: scopeId, currentText: text }));
        utterance.onend = () => setAudioState(prev => ({ ...prev, isPlaying: false, currentScope: "", currentText: "" }));
        utterance.onerror = () => setAudioState(prev => ({ ...prev, isPlaying: false }));
        synthRef.current.speak(utterance);
    };

    // Speed Change
    const handleSpeedChange = (newSpeed) => {
        setAudioState(prev => ({ ...prev, speed: newSpeed }));
        if (audioState.isPlaying && audioState.currentText) {
            synthRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(audioState.currentText);
            utterance.lang = "zh-TW";
            utterance.rate = newSpeed;
            if (audioState.selectedVoiceURI) {
                const voice = synthRef.current.getVoices().find(v => v.voiceURI === audioState.selectedVoiceURI);
                if (voice) utterance.voice = voice;
            }
            utterance.onstart = () => setAudioState(prev => ({ ...prev, isPlaying: true }));
            utterance.onend = () => setAudioState(prev => ({ ...prev, isPlaying: false, currentScope: "" }));
            synthRef.current.speak(utterance);
        }
    };

    const handleVoiceChange = (uri) => {
        setAudioState(prev => ({ ...prev, selectedVoiceURI: uri }));
    };

    // --- 3. SAVE TO FAVORITES ---
    // Ini tetap client-side direct ke Firebase karena ini data User, bukan data Alkitab
    const handleSaveWord = async (wordData) => {
        if (!user) {
            showToast("Please login to save words", "error");
            return;
        }
        try {
            const docId = `${user.uid}_${wordData.text}`;
            await setDoc(doc(db, "favorites", docId), {
                userId: user.uid,
                text: wordData.text,
                pinyin: wordData.pinyin,
                translation: wordData.translation || "",
                definitionDetails: wordData.details || [],
                savedAt: new Date().toISOString()
            });
            showToast(`Saved "${wordData.text}"`, "success");
            setSelectedWord(null);
        } catch (e) {
            showToast("Failed to save", "error");
        }
    };

    return {
        data: { verses, bookName, loading, versions }, // Include versions
        settings: { ...settings, setSettings },
        audio: { ...audioState, playText, handleSpeedChange, handleVoiceChange },
        popup: { selectedWord, setSelectedWord, handleSaveWord }
    };
}