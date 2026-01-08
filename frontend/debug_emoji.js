
const isBigEmoji = (text) => {
    if (!text) return false;
    // Logic: Remove all valid emojis and spaces. If string is empty, it's a Big Emoji.
    // \p{Emoji_Presentation}: Emojis that default to graphic presentation (excludes "1", "#", etc unless they have Vh)
    // \p{Extended_Pictographic}: Newer emojis
    // \u200d, \ufe0f: Joiners/Selectos
    // We also need to remove keycap sequences explicitly if they don't match above?
    
    // Let's try matching ONLY what we want:
    // Regex matches one or more visual emoji sequences or spaces.
    // If the whole string matches this regex, it's valid.
    
    // Refined Regex excluding plain numbers:
    // This regex looks for:
    // 1. Emoji_Presentation characters (standard graphic emojis)
    // 2. Extended_Pictographic (covers most others)
    // 3. Keycap sequences: [0-9#*]\uFE0F\u20E3
    // 4. Regional Indicators: \p{Ri}\p{Ri}
    // 5. Permitted joiners/modifiers within the sequence are handled by matching "Emoji-like" blocks.
    
    // Simplest robust check for "Does this look like an emoji message?":
    // It must NOT contain any alphanumeric char that isn't part of a sequence.
    
    if (/[a-zA-Z]/.test(text)) return false; // Fail fast on letters
    if (/[0-9]/.test(text) && !/\u20E3/.test(text)) return false; // Fail on numbers unless keycap (approx)
    
    // If we survived, check if it has emojis
    const hasEmoji = /\p{Extended_Pictographic}|\p{Emoji_Presentation}/u.test(text);
    return hasEmoji && text.length < 50; // Simple length check
};

// Test Cases
const cases = [
    "👍", // Simple
    "❤️", // Simple
    "😂", // Face
    "👨‍👩‍👧‍👦", // Family (ZWJ sequence)
    "🏳️‍🌈", // Flag (ZWJ)
    "Hello", // Text
    "👍 Hello", // Mixed
    "123", // Numbers (Should be false ideally unless keycap?)
    "*️⃣", // Keycap
    "👍🏼", // Modifier
    "😶‍🌫️", // Face in clouds (ZWJ)
];

cases.forEach(c => isBigEmoji(c));
