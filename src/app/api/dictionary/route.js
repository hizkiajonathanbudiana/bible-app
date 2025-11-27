import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");

    if (!text) {
        return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    try {
        // Kita tembak endpoint Google Translate yang support "Dictionary Mode" (dt=bd)
        // sl = source lang (Chinese), tl = target lang (English)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-TW&tl=en&dt=t&dt=bd&q=${encodeURIComponent(text)}`;

        const res = await fetch(url);
        const data = await res.json();

        // Data dari Google itu array berantakan, kita rapikan:
        // data[0][0][0] = Main Translation
        // data[1] = Detailed Dictionary (Noun, Verb, etc)

        const mainTranslation = data[0]?.[0]?.[0] || "No translation found";

        // Parsing bagian detail (jika ada)
        let definitions = [];
        if (data[1]) {
            definitions = data[1].map((item) => ({
                type: item[0], // noun, verb, etc.
                meanings: item[1], // array of words
            }));
        }

        return NextResponse.json({
            main: mainTranslation,
            details: definitions,
        });

    } catch (error) {
        console.error("Dictionary API Error:", error);
        return NextResponse.json({ error: "Failed to fetch definition" }, { status: 500 });
    }
}