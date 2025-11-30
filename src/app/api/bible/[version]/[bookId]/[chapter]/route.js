import { NextResponse } from "next/server";
import { processVerseText } from "@/lib/chinese-processor";

// Pastikan selalu render ulang (dynamic)
export const dynamic = 'force-dynamic';

// Helper: Ekstrak teks super kuat (Recursive)
function extractTextFromContent(contentArray) {
    let text = "";
    if (!Array.isArray(contentArray)) return "";

    for (const item of contentArray) {
        // 1. Jika string biasa
        if (typeof item === "string") {
            text += item;
        }
        // 2. Jika object punya properti 'text' (kadang beda format)
        else if (item.text && typeof item.text === "string") {
            text += item.text;
        }
        // 3. Jika object punya content string
        else if (typeof item.content === "string") {
            text += item.content;
        }
        // 4. Jika object punya content array (Recursive)
        else if (Array.isArray(item.content)) {
            text += extractTextFromContent(item.content);
        }
    }
    return text;
}

// Helper: Fetch satu chapter
async function fetchChapterData(version, bookId, chapter) {
    if (!version) return null;

    // URL API External
    const url = `https://bible.helloao.org/api/${version}/${bookId}/${chapter}.json`;

    try {
        console.log(`[API FETCHING] ${version} -> ${url}`);

        // PENTING: cache: 'no-store' agar tidak nyangkut data lama/kosong
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            console.error(`[API FAIL] ${version} Status: ${res.status}`);
            return null;
        }

        const json = await res.json();

        // Validasi isi JSON
        if (!json.chapter || !json.chapter.content) {
            console.error(`[API EMPTY] ${version} - Struktur JSON tidak valid`);
            return null;
        }

        // Parsing Verse ke Map
        const verseMap = new Map();

        json.chapter.content.forEach(item => {
            if (item.type === "verse") {
                const vNum = parseInt(item.number);
                let raw = extractTextFromContent(item.content);

                // Bersihkan spasi khusus Mandarin (CUV, etc)
                // Deteksi jika ada karakter Hanzi
                const hasChinese = /[\u4e00-\u9fa5]/.test(raw);
                const clean = hasChinese ? raw.replace(/\s+/g, "") : raw.trim();

                verseMap.set(vNum, clean);
            }
        });

        console.log(`[API SUCCESS] ${version} - Found ${verseMap.size} verses`);
        return {
            bookName: json.book?.name || bookId,
            verses: verseMap
        };

    } catch (e) {
        console.error(`[API ERROR] ${version}:`, e.message);
        return null;
    }
}

export async function GET(request, { params }) {
    try {
        const { version, bookId, chapter } = await params;

        // Ambil Query Params
        const { searchParams } = new URL(request.url);
        const enVersion = searchParams.get('en');
        const indVersion = searchParams.get('ind');

        console.log(`=== REQUEST START: ${bookId} Ch ${chapter} ===`);
        console.log(`Main: ${version}, EN: ${enVersion}, IND: ${indVersion}`);

        // Fetch Parallel
        const [mainData, engData, indData] = await Promise.all([
            fetchChapterData(version, bookId, chapter),
            fetchChapterData(enVersion, bookId, chapter),
            fetchChapterData(indVersion, bookId, chapter)
        ]);

        // Kalau Main Version (Chinese) gagal, matikan proses
        if (!mainData) {
            return NextResponse.json({ error: `Gagal memuat versi utama: ${version}` }, { status: 404 });
        }

        const mergedVerses = [];
        // Urutkan ayat
        const sortedVerses = Array.from(mainData.verses.keys()).sort((a, b) => a - b);

        for (const verseNum of sortedVerses) {
            const mainText = mainData.verses.get(verseNum);

            // Ambil text pendamping (default string kosong jika null)
            // Tambahan: Trim biar bersih
            const textEn = engData?.verses.get(verseNum) || "";
            const textInd = indData?.verses.get(verseNum) || "";

            // Proses Segmentasi Pinyin hanya untuk mainText
            const segments = processVerseText(mainText);

            mergedVerses.push({
                bookId,
                chapter: parseInt(chapter),
                verse: verseNum,
                text: mainText,
                englishText: textEn,
                indonesianText: textInd,
                segments: segments
            });
        }

        return NextResponse.json({
            bookName: mainData.bookName,
            chapter: parseInt(chapter),
            verses: mergedVerses
        });

    } catch (error) {
        console.error("[SERVER ERROR]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}