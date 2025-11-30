import pinyin from "pinyin";

// 1. SETUP SEGMENTER
const hasSegmenter = typeof Intl !== "undefined" && Intl.Segmenter;
const segmenter = hasSegmenter ? new Intl.Segmenter("zh-Hant", { granularity: "word" }) : null;

// 2. CORE FUNCTION: Process Verse Text (Used by API & Admin)
export function processVerseText(cleanText) {
    if (!cleanText) return [];

    // Ensure text is a string
    const textStr = String(cleanText || "");

    let processedSegments = [];

    // Strategy A: Intl.Segmenter (Best for Combo Hanzi)
    if (segmenter) {
        const segmentsIterator = segmenter.segment(textStr);
        for (const seg of segmentsIterator) {
            const word = seg.segment;
            const isChinese = /[\u4e00-\u9fa5]/.test(word);
            let pinyinStr = "";

            if (isChinese) {
                // Generate Pinyin with segment mode true
                const pinyinArray = pinyin(word, {
                    style: pinyin.STYLE_TONE,
                    segment: true
                });
                pinyinStr = pinyinArray.flat().join(" ");
            }
            processedSegments.push({ text: word, pinyin: pinyinStr });
        }
    }
    // Strategy B: Fallback Split (Per Character)
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

// 3. HELPER: Parse Raw Input for Admin CMS (Restored)
function parseLinesToMap(rawInput) {
    if (!rawInput) return {};
    const map = {};

    // Remove newlines to handle blob text, find numbers
    let text = rawInput.replace(/[\r\n]+/g, " ").trim();

    // Regex to find verse numbers
    const numberPattern = /(\d+)/g;
    let match;
    let indices = [];

    while ((match = numberPattern.exec(text)) !== null) {
        indices.push({ num: parseInt(match[0]), index: match.index, raw: match[0] });
    }

    // Filter sequential numbers (1, 2, 3...)
    let validVerses = [];
    let expectedNum = 1;
    for (let i = 0; i < indices.length; i++) {
        if (indices[i].num === expectedNum) {
            validVerses.push(indices[i]);
            expectedNum++;
        }
    }

    // Slice text between numbers
    for (let i = 0; i < validVerses.length; i++) {
        const current = validVerses[i];
        const next = validVerses[i + 1];

        const start = current.index + current.raw.length;
        const end = next ? next.index : text.length;

        let content = text.substring(start, end).trim();
        // Clean leading punctuation (dots, colons)
        content = content.replace(/^[.\s:：]+/, "").trim();

        if (content) map[current.num] = content;
    }

    return map;
}

// 4. EXPORTED FUNCTION: Parse Chapter Input (Restored for Admin)
export function parseChapterInput(rawTextCN, rawTextEN, rawTextID) {
    const mapCN = parseLinesToMap(rawTextCN);
    const mapEN = parseLinesToMap(rawTextEN);
    const mapID = parseLinesToMap(rawTextID);

    // Merge all keys
    const verseNumbers = new Set([
        ...Object.keys(mapCN),
        ...Object.keys(mapEN),
        ...Object.keys(mapID)
    ]);

    const sortedVerses = Array.from(verseNumbers).map(Number).sort((a, b) => a - b);
    const result = [];

    sortedVerses.forEach(num => {
        const textCN = mapCN[num] || "";
        const textEN = mapEN[num] || "";
        const textID = mapID[num] || "";

        if (textCN || textEN || textID) {
            result.push({
                verse: num,
                text: textCN,
                englishText: textEN,
                indonesianText: textID,
                segments: processVerseText(textCN) // Use the processor logic
            });
        }
    });

    return result;
}