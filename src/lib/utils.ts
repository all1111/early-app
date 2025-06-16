// /src/lib/utils.ts
// 共通ユーティリティ

/**
 *  ISO 3166-1 α2 → 国旗絵文字
 *  例: "JP" → "🇯🇵",  "US" → "🇺🇸"
 */
export const flagEmoji = (code: string): string => {
  if (!code || code.length !== 2) return "🏳️";
  // 0x1F1E6 === Regional Indicator Symbol Letter A
  const offset = 0x1F1E6 - "A".charCodeAt(0);
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + offset))
    .join("");
};

/** 文字列を 400〜500 字に丸める（全角 2byte 想定） */
export const trimTo500Ja = (text: string): string => {
  const limit = 500;
  return text.length > limit ? text.slice(0, limit) + "…" : text;
};
