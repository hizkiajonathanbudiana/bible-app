import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, writeBatch, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { bookId } = await request.json();

        if (!bookId) return NextResponse.json({ error: "No Book ID" }, { status: 400 });

        const batch = writeBatch(db);

        // 1. Delete Dokumen Buku di collection 'books'
        const bookRef = doc(db, "books", bookId);
        batch.delete(bookRef);

        // 2. Delete Semua Ayat (Verses) yang bookId-nya sama
        // Query dulu semua ayatnya
        const qVerses = query(collection(db, "verses"), where("bookId", "==", bookId));
        const versesSnap = await getDocs(qVerses);
        versesSnap.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // 3. Delete Subcollection Chapters (Optional tapi bersih)
        const qChapters = collection(db, "books", bookId, "chapters");
        const chaptersSnap = await getDocs(qChapters);
        chaptersSnap.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Jalankan penghapusan massal
        await batch.commit();

        return NextResponse.json({ success: true, message: `Deleted ${bookId} and ${versesSnap.size} verses.` });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}