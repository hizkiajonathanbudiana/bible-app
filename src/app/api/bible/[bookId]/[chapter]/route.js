import { NextResponse } from "next/server";
import { processVerseText } from "@/lib/chinese-processor";
import { getBookInfo, BOLLS_VERSIONS } from "@/lib/bibleData";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import pinyin from "pinyin";

// Force Dynamic agar tidak di-cache statis oleh Next.js
export const dynamic = 'force-dynamic';

// Helper: Fetch Bolls.life dengan Fallback
async function fetchBollsWithFallback(versions, bollsId, chapter) {
    for (const version of versions) {
        try {
            // URL Bolls: https://bolls.life/get-chapter/TB/1/1/
            const url = `https://bolls.life/get-chapter/${version}/${bollsId}/${chapter}/`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 detik timeout

            const res = await fetch(url, {
                signal: controller.signal,
                cache: 'no-store'
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                // Bolls return array: [{ verse: 1, text: "..." }, ...]
                if (Array.isArray(data) && data.length > 0) {
                    return { data, version }; // Sukses
                }
            }
        } catch (e) {
            // Lanjut ke versi berikutnya kalau gagal
        }
    }
    // Kalau semua gagal
    return { data: [], version: "N/A" };
}

export async function GET(request, { params }) {
    try {
        const { bookId, chapter } = await params;
        const docId = `${bookId}_${chapter}`;

        // --- STRATEGI 1: CEK DATABASE (CACHE) ---
        const docRef = doc(db, "chapters_cache", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(`[CACHE HIT] Serving ${docId}`);
            return NextResponse.json(docSnap.data());
        }

        console.log(`[CACHE MISS] Fetching ${docId} from Bolls...`);

        const bookInfo = getBookInfo(bookId);
        if (!bookInfo) return NextResponse.json({ error: "Book not found" }, { status: 404 });

        // --- STRATEGI 2: FETCH BOLLS (PARALLEL) ---
        const [resCN, resEN, resID] = await Promise.all([
            fetchBollsWithFallback(BOLLS_VERSIONS.CN, bookInfo.bollsId, chapter),
            fetchBollsWithFallback(BOLLS_VERSIONS.EN, bookInfo.bollsId, chapter),
            fetchBollsWithFallback(BOLLS_VERSIONS.ID, bookInfo.bollsId, chapter)
        ]);

        // Validasi: Mandarin Wajib Ada (Ini App Mandarin)
        if (resCN.data.length === 0) {
            return NextResponse.json({ error: "Chinese text unavailable from Bolls" }, { status: 404 });
        }

        // --- STRATEGI 3: MAPPING DATA ---
        // Convert Array ke Map biar cepat
        const mapEN = new Map(resEN.data.map(i => [i.verse, i.text]));
        const mapID = new Map(resID.data.map(i => [i.verse, i.text]));

        const verses = resCN.data.map((item) => {
            const verseNum = item.verse;

            // BERSIHKAN TEXT (CRITICAL)
            // 1. Hapus HTML Tags (<b>, <i>, <br>) dari Bolls
            // 2. Hapus SPASI Mandarin (Biar Zhidao nyambung)
            const rawCN = item.text || "";
            const cleanCN = rawCN.replace(/<[^>]*>?/gm, "").replace(/\s+/g, "");

            const textEN = (mapEN.get(verseNum) || "").replace(/<[^>]*>?/gm, "");
            const textID = (mapID.get(verseNum) || "").replace(/<[^>]*>?/gm, "");

            return {
                bookId: bookId.toUpperCase(),
                chapter: parseInt(chapter),
                verse: verseNum,
                text: cleanCN,
                englishText: textEN,
                indonesianText: textID,
                segments: processVerseText(cleanCN), // Pinyin Generator
            };
        });

        // Generate Judul Pinyin
        let finalBookName = bookInfo.cnName;
        try {
            const pinyinArray = pinyin(bookInfo.cnName, { style: pinyin.STYLE_TONE });
            finalBookName = `${bookInfo.cnName} (${pinyinArray.flat().join(" ")})`;
        } catch (e) { }

        const responseData = {
            bookName: finalBookName,
            chapter: parseInt(chapter),
            verses: verses,
            versions: {
                cn: resCN.version,
                en: resEN.version,
                id: resID.version // Harusnya "TB"
            }
        };

        // --- STRATEGI 4: SIMPAN KE CACHE ---
        try {
            await setDoc(docRef, responseData);
            console.log(`[CACHE SAVED] ${docId}`);
        } catch (dbError) {
            console.error("Firestore Save Error:", dbError);
        }

        return NextResponse.json(responseData);

    } catch (error) {
        console.error("[API ERROR]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}