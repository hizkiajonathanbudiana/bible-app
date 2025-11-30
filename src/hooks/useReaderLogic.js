"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export function useReaderLogic(version, bookId, chapter) {
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const enVer = searchParams.get('en');
    const indVer = searchParams.get('ind');

    const [verses, setVerses] = useState([]);
    const [bookName, setBookName] = useState("");
    const [loading, setLoading] = useState(true);

    const [settings, setSettings] = useState({
        showPinyin: true,
        showEnglish: !!enVer,
        showIndonesian: !!indVer,
        fontSize: 1.5,
        isDarkMode: false,
    });

    const [selectedWord, setSelectedWord] = useState(null);
    const synthRef = useRef(null);
    const observerRef = useRef(null); // Ref untuk Scroll Spy

    const [audioState, setAudioState] = useState({
        isPlaying: false, currentScope: "", speed: 1.0, voices: [], selectedVoiceURI: ""
    });

    // 1. Auth Check
    useEffect(() => {
        if (!authLoading && !user) router.push("/login");
    }, [user, authLoading, router]);

    // 2. Fetch Data (Cache First)
    useEffect(() => {
        async function loadData() {
            if (!version || !bookId || !chapter) return;

            const cacheKey = `bible_${version}_${bookId}_${chapter}_${enVer || ''}_${indVer || ''}`;

            // Try Local Cache
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                setVerses(parsed.verses);
                setBookName(parsed.bookName);
                setLoading(false);
            }

            try {
                // Fetch Fresh Data
                let apiUrl = `/api/bible/${version}/${bookId}/${chapter}`;
                const apiParams = new URLSearchParams();
                if (enVer) apiParams.set("en", enVer);
                if (indVer) apiParams.set("ind", indVer);
                const finalUrl = `${apiUrl}?${apiParams.toString()}`;

                const res = await fetch(finalUrl);
                if (!res.ok) throw new Error("Fetch failed");
                const data = await res.json();

                setVerses(data.verses);
                setBookName(data.bookName);
                localStorage.setItem(cacheKey, JSON.stringify(data));

                // Sync to Firestore (Last Read)
                if (user) {
                    await setDoc(doc(db, "users", user.uid), {
                        lastRead: {
                            version, bookId, chapter,
                            enVer: enVer || null,
                            indVer: indVer || null,
                            timestamp: new Date().toISOString()
                        }
                    }, { merge: true });
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                if (!cached) {
                    showToast("Gagal memuat data", "error");
                    setLoading(false);
                }
            }
        }
        if (user) loadData();
    }, [version, bookId, chapter, enVer, indVer, user]);

    // 3. AUTO SCROLL (Restore Position)
    useEffect(() => {
        if (!loading && verses.length > 0) {
            // Delay sedikit biar render DOM selesai
            setTimeout(() => {
                const lastVerseId = localStorage.getItem(`pos_${bookId}_${chapter}`);
                if (lastVerseId) {
                    const el = document.getElementById(lastVerseId); // ID contoh: "verse-18"
                    if (el) {
                        console.log("Restoring scroll to:", lastVerseId);
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }
            }, 500);
        }
    }, [loading, verses, bookId, chapter]);

    // 4. SCROLL SPY (Save Position)
    useEffect(() => {
        if (loading || verses.length === 0) return;

        // Disconnect observer lama
        if (observerRef.current) observerRef.current.disconnect();

        // Setup Observer baru
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Simpan ID ayat yang terlihat di tengah layar
                    const verseId = entry.target.id; // "verse-1", "verse-2", dll
                    localStorage.setItem(`pos_${bookId}_${chapter}`, verseId);
                }
            });
        }, {
            root: null,
            rootMargin: "-45% 0px -45% 0px", // Hanya trigger kalau elemen ada di GARIS TENGAH layar
            threshold: 0
        });

        // Observe semua ayat
        verses.forEach(v => {
            const el = document.getElementById(`verse-${v.verse}`);
            if (el) observerRef.current.observe(el);
        });

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [verses, loading, bookId, chapter]);

    // --- AUDIO LOGIC ---
    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
            return () => { if (synthRef.current) synthRef.current.cancel(); };
        }
    }, []);

    useEffect(() => {
        if (!synthRef.current) return;
        const loadVoices = () => {
            const all = synthRef.current.getVoices();
            const relevant = all.filter(v => v.lang.includes("zh") || v.lang.includes("en") || v.lang.includes("id"));
            setAudioState(prev => ({ ...prev, voices: relevant }));
        };
        loadVoices();
        synthRef.current.onvoiceschanged = loadVoices;
    }, []);

    const playText = (text, scopeId) => {
        if (!synthRef.current) return;

        // Save scroll position manually on play
        localStorage.setItem(`pos_${bookId}_${chapter}`, scopeId);

        if (audioState.isPlaying && audioState.currentScope === scopeId) {
            synthRef.current.cancel();
            setAudioState(prev => ({ ...prev, isPlaying: false, currentScope: "" }));
            return;
        }

        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        if (/[\u4e00-\u9fa5]/.test(text)) utterance.lang = "zh-TW";
        else if (settings.showIndonesian && !settings.showEnglish) utterance.lang = "id-ID";
        else utterance.lang = "en-US";

        utterance.rate = audioState.speed;
        if (audioState.selectedVoiceURI) {
            const v = synthRef.current.getVoices().find(x => x.voiceURI === audioState.selectedVoiceURI);
            if (v) utterance.voice = v;
        }

        utterance.onstart = () => setAudioState(prev => ({ ...prev, isPlaying: true, currentScope: scopeId }));
        utterance.onend = () => setAudioState(prev => ({ ...prev, isPlaying: false, currentScope: "" }));
        utterance.onerror = (e) => {
            if (e.error !== 'interrupted') console.error("Audio Error:", e);
            setAudioState(prev => ({ ...prev, isPlaying: false, currentScope: "" }));
        };

        synthRef.current.speak(utterance);
    };

    const handleSpeedChange = (s) => setAudioState(p => ({ ...p, speed: s }));
    const handleVoiceChange = (v) => setAudioState(p => ({ ...p, selectedVoiceURI: v }));
    const handleSaveWord = async (w) => { /* Code save word */ };

    return {
        data: { verses, bookName, loading },
        settings: { ...settings, setSettings },
        audio: { ...audioState, playText, handleSpeedChange, handleVoiceChange },
        popup: { selectedWord, setSelectedWord, handleSaveWord }
    };
}