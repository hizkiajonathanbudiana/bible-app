import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, writeBatch, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { bookId } = await request.json();

        if (!bookId) return NextResponse.json({ error: "No Book ID" }, { status: 400 });

        const batch = writeBatch(db);

        // 1. Delete Metadata Buku (Dari collection 'books')
        const bookRef = doc(db, "books", bookId);
        batch.delete(bookRef);

        // 2. Delete Data Manual (Dari collection 'verses')
        const qVerses = query(collection(db, "verses"), where("bookId", "==", bookId));
        const versesSnap = await getDocs(qVerses);
        versesSnap.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // 3. Delete Subcollection Chapters Manual (Jika ada)
        const qChapters = collection(db, "books", bookId, "chapters");
        const chaptersSnap = await getDocs(qChapters);
        chaptersSnap.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // 4. [PENTING] Delete Cache (Dari collection 'chapters_cache')
        // Karena ID Cache formatnya 'GEN_1', 'GEN_2', kita tidak bisa query 'where bookId'.
        // Firestore tidak support regex delete.
        // TAPI, kita bisa fetch semua doc di chapters_cache dan filter manual (agak mahal tapi bersih),
        // ATAU kita asumsikan kita delete sampai 150 chapter (aman buat semua buku).

        // Kita pakai cara aman: Loop delete berdasarkan kemungkinan chapter
        // Maksimal pasal di Alkitab 150 (Mazmur).
        for (let i = 1; i <= 150; i++) {
            const cacheId = `${bookId}_${i}`;
            const cacheRef = doc(db, "chapters_cache", cacheId);
            batch.delete(cacheRef);
        }

        await batch.commit();

        return NextResponse.json({ success: true, message: `Deleted book ${bookId} and all its chapters/cache.` });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}