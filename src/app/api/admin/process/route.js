// import { db } from "@/lib/firebase";
// import { parseChapterInput } from "@/lib/chinese-processor";
// import { writeBatch, doc } from "firebase/firestore";
// import { NextResponse } from "next/server";
// import pinyin from "pinyin";

// export async function POST(request) {
//     try {
//         const body = await request.json();
//         const { bookId, bookName, chapter, rawTextCN, rawTextEN } = body;

//         if (!bookId || !chapter || !rawTextCN) {
//             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//         }

//         // --- LOGIC BARU: PINYIN WITH TONES & SPACE ---
//         // 1. Generate Pinyin dengan Nada (Tone)
//         const pinyinArray = pinyin(bookName, {
//             style: pinyin.STYLE_TONE, // a -> ā (Pakai nada)
//         });

//         // 2. Ratakan array dan gabung pakai SPASI biar kebaca
//         // Contoh: "gē lín duō qián shū"
//         const pinyinString = pinyinArray.flat().join(" ");

//         // 3. Format Judul Akhir: "Mandarin (Pinyin)"
//         // Contoh: "哥林多前書 (gē lín duō qián shū)"
//         // Kita kasih kurung biar rapi dan ada jeda jelas sama nomor pasal nanti
//         const finalBookName = bookName.includes(pinyinString)
//             ? bookName
//             : `${bookName} (${pinyinString})`;

//         // ----------------------------------------------

//         // 1. Parse Ayat
//         const versesData = parseChapterInput(rawTextCN, rawTextEN);
//         if (versesData.length === 0) {
//             return NextResponse.json({ error: "No valid verses found." }, { status: 400 });
//         }

//         const batch = writeBatch(db);

//         // 2. Simpan Ayat
//         versesData.forEach((v) => {
//             const docId = `${bookId}_${chapter}_${v.verse}`;
//             const docRef = doc(db, "verses", docId);
//             batch.set(docRef, {
//                 bookId,
//                 bookName: finalBookName, // Nama baru
//                 chapter: parseInt(chapter),
//                 verse: v.verse,
//                 text: v.text,
//                 englishText: v.englishText,
//                 segments: v.segments,
//                 createdAt: new Date().toISOString(),
//             });
//         });

//         // 3. Simpan Metadata Buku (Catalog)
//         const bookRef = doc(db, "books", bookId);
//         batch.set(bookRef, {
//             id: bookId,
//             name: finalBookName, // Nama baru
//             lastUpdated: new Date().toISOString()
//         }, { merge: true });

//         // 4. Simpan Metadata Chapter
//         const chapterRef = doc(db, "books", bookId, "chapters", chapter.toString());
//         batch.set(chapterRef, {
//             number: parseInt(chapter),
//             exists: true
//         });

//         await batch.commit();

//         return NextResponse.json({
//             success: true,
//             message: `Saved ${versesData.length} verses for ${finalBookName}.`,
//         });

//     } catch (error) {
//         console.error("Processing Error:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

import { db } from "@/lib/firebase";
import { parseChapterInput } from "@/lib/chinese-processor";
import { writeBatch, doc } from "firebase/firestore";
import { NextResponse } from "next/server";
import pinyin from "pinyin";

export async function POST(request) {
    try {
        const body = await request.json();
        // Tambah rawTextID di destructuring
        const { bookId, bookName, chapter, rawTextCN, rawTextEN, rawTextID } = body;

        if (!bookId || !chapter || !rawTextCN) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Logic Pinyin Title
        const pinyinArray = pinyin(bookName, { style: pinyin.STYLE_TONE });
        const pinyinString = pinyinArray.flat().join(" ");
        const finalBookName = bookName.includes(pinyinString) ? bookName : `${bookName} (${pinyinString})`;

        // Logic Parse (Pass 3 bahasa)
        const versesData = parseChapterInput(rawTextCN, rawTextEN, rawTextID);

        if (versesData.length === 0) {
            return NextResponse.json({ error: "No valid verses found." }, { status: 400 });
        }

        const batch = writeBatch(db);

        versesData.forEach((v) => {
            const docId = `${bookId}_${chapter}_${v.verse}`;
            const docRef = doc(db, "verses", docId);
            batch.set(docRef, {
                bookId,
                bookName: finalBookName,
                chapter: parseInt(chapter),
                verse: v.verse,
                text: v.text,
                englishText: v.englishText,
                indonesianText: v.indonesianText, // Simpan ke DB
                segments: v.segments,
                createdAt: new Date().toISOString(),
            });
        });

        const bookRef = doc(db, "books", bookId);
        batch.set(bookRef, { id: bookId, name: finalBookName, lastUpdated: new Date().toISOString() }, { merge: true });

        const chapterRef = doc(db, "books", bookId, "chapters", chapter.toString());
        batch.set(chapterRef, { number: parseInt(chapter), exists: true });

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Saved ${versesData.length} verses for ${finalBookName}.`,
        });

    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}