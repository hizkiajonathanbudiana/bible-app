import { db } from "@/lib/firebase";
import { parseChapterInput } from "@/lib/chinese-processor";
import { writeBatch, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import pinyin from "pinyin";

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            bookId, bookName, chapter,
            rawTextCN, rawTextEN, rawTextID,
            // Ambil data versi dari form admin
            versionCN, versionEN, versionID
        } = body;

        if (!bookId || !chapter || !rawTextCN) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Generate Judul Pinyin
        let finalBookName = bookName;
        try {
            const pinyinArray = pinyin(bookName, { style: pinyin.STYLE_TONE });
            const pinyinString = pinyinArray.flat().join(" ");
            // Cek kalau belum ada pinyin
            if (!bookName.includes("(")) {
                finalBookName = `${bookName} (${pinyinString})`;
            }
        } catch (e) { }

        // 2. Parse Text (Pake logic baru yang lebih kuat)
        const versesData = parseChapterInput(rawTextCN, rawTextEN, rawTextID);

        if (versesData.length === 0) {
            return NextResponse.json({ error: "No valid verses found. Ensure text starts with numbers (e.g., '1 In the beginning...')" }, { status: 400 });
        }

        const batch = writeBatch(db);

        // 3. Simpan Ayat
        // Kita tidak simpan ke collection 'verses' lagi karena Reader sekarang baca dari 'chapters_cache'
        // TAPI: Untuk Admin fitur 'Manage', mungkin nanti butuh.
        // UNTUK SEKARANG: Kita fokus update CACHE yang dibaca Reader.

        // Structure Data yang sama persis dengan output API Route Reader
        const cacheData = {
            bookName: finalBookName,
            chapter: parseInt(chapter),
            verses: versesData,
            versions: {
                cn: versionCN || "Manual",
                en: versionEN || "Manual",
                id: versionID || "Manual"
            },
            updatedAt: new Date().toISOString()
        };

        // Simpan ke 'chapters_cache' (Ini yang dibaca Reader Page)
        const docId = `${bookId}_${chapter}`;
        const cacheRef = doc(db, "chapters_cache", docId);
        batch.set(cacheRef, cacheData);

        // 4. Simpan Metadata Buku (Library List)
        const bookRef = doc(db, "books", bookId);
        batch.set(bookRef, {
            id: bookId,
            name: finalBookName,
            lastUpdated: new Date().toISOString()
        }, { merge: true });

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Successfully saved ${versesData.length} verses (v: ${versionCN}/${versionEN}/${versionID}).`,
        });

    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}