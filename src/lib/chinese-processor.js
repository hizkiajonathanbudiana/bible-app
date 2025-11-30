import pinyin from "pinyin";

const hasSegmenter = typeof Intl !== "undefined" && Intl.Segmenter;
const segmenter = hasSegmenter ? new Intl.Segmenter("zh-Hant", { granularity: "word" }) : null;

export function processVerseText(cleanText) {
    if (!cleanText) return [];

    // Pastikan teks string
    const textStr = String(cleanText || "");

    let processedSegments = [];

    // 1. Coba Intl.Segmenter
    if (segmenter) {
        const segmentsIterator = segmenter.segment(textStr);
        for (const seg of segmentsIterator) {
            const word = seg.segment;
            const isChinese = /[\u4e00-\u9fa5]/.test(word);
            let pinyinStr = "";

            if (isChinese) {
                // Generate Pinyin
                const pinyinArray = pinyin(word, {
                    style: pinyin.STYLE_TONE,
                    segment: true
                });
                pinyinStr = pinyinArray.flat().join(" ");
            }
            processedSegments.push({ text: word, pinyin: pinyinStr });
        }
    }
    // 2. Fallback: Split per karakter
    else {
        const chars = textStr.split("");
        processedSegments = chars.map(char => {
            const isChinese = /[\u4e00-\u9fa5]/.test(char);
            let pinyinStr = isChinese ? pinyin(char, { style: pinyin.STYLE_TONE }).flat().join(" ") : "";
            return { text: char, pinyin: pinyinStr };
        });
    }

    return processedSegments;
}