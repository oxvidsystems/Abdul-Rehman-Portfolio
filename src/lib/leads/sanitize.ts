/**
 * Text hygiene for user-controlled input.
 *
 * Two separate jobs, deliberately not conflated:
 *
 *  1. SANITISE ON INPUT (this file) — remove what has no business being in
 *     a lead field at all: C0/C1 control characters, zero-width and
 *     bidirectional-override characters, absurd lengths. Stripping CR/LF
 *     from single-line fields is what stops a name or an address being
 *     used for email-header injection later.
 *
 *  2. ESCAPE ON OUTPUT (`escapeHtml`, `csvCell`) — done by whatever renders
 *     a lead, at the moment it renders it. HTML-escaping at storage time is
 *     a classic mistake: the value gets double-escaped the first time
 *     someone renders it correctly, and afterwards you can never tell what
 *     the visitor actually typed.
 *
 * Nothing here is a substitute for validation — see `validate.ts`.
 */

/** C0/C1 controls and DEL. \t \n \r are left for the whitespace pass. */
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;

/**
 * Invisible and direction-flipping characters. Left in place these let a
 * value render as something other than what is stored — the "trojan
 * source" trick — so they come out at the door.
 */
const INVISIBLE = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g;

function strip(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.normalize("NFC").replace(CONTROL, "").replace(INVISIBLE, "");
}

/** Single-line field: all whitespace (CR/LF included) collapses to one space. */
export function cleanLine(raw: unknown, max: number): string {
  return strip(raw).replace(/\s+/g, " ").trim().slice(0, max);
}

/**
 * Multi-line field: paragraph breaks survive, runs of blank lines and
 * trailing spaces do not, and CR is normalised away.
 */
export function cleanBlock(raw: unknown, max: number): string {
  return strip(raw)
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim()
    .slice(0, max);
}

/** For rendering a lead into HTML (a notification email, an admin page). */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * For rendering a lead into CSV. A cell beginning =, +, -, @, tab or CR is
 * executed as a formula by Excel and Sheets, so a lead whose name is
 * `=HYPERLINK(...)` becomes a live link in whatever spreadsheet it lands
 * in. Prefix with an apostrophe and quote the cell.
 */
export function csvCell(value: string): string {
  const guarded = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${guarded.replace(/"/g, '""')}"`;
}

/** Count of URL-ish tokens — recorded as a spam signal, never a rejection. */
export function countLinks(value: string): number {
  return (value.match(/\b(?:https?:\/\/|www\.)\S+/gi) ?? []).length;
}
