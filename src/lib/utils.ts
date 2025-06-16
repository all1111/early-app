// frontend/src/lib/utils.ts
// 共通ユーティリティ

/* ---------------- cn (className 合成) ---------------- */
export function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/* ---------------- 国旗絵文字取得 -------------------- */
export const flagEmoji = (countryCode: string): string => {
  // ISO 2 文字 → Regional Indicator Symbols へ
  return countryCode
    .toUpperCase()
    .replace(/./g, (c) =>
      String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)
    );
};

/* ---------------- 500 文字に収める ------------------- */
export const trimTo500Ja = (text: string): string => {
  const max = 500;
  return text.length <= max ? text : text.slice(0, max - 1) + "…";
};
