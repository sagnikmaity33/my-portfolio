export function sanitizeSubject(raw: string): string {
  const trimmed = raw.trim();
  // Remove CR/LF to avoid header injection and normalize spaces
  const withoutNewlines = trimmed.replace(/[\r\n]+/g, " ");
  // Remove other control characters (except tab)
  const withoutControls = withoutNewlines.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  // Truncate to a safe length
  return withoutControls.slice(0, 200);
}

export function sanitizeMessage(raw: string): string {
  // Normalize all CRLF/CR to LF
  let normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  // Remove control chars except newline and tab
  normalized = normalized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  // Strip obvious script tags to reduce risk if rendered as HTML
  normalized = normalized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  normalized = normalized.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "");
  return normalized.trim();
}

export function sanitizeName(raw: string): string {
  const trimmed = raw.trim();
  // Remove control characters
  const withoutControls = trimmed.replace(/[\x00-\x1F\x7F]/g, "");
  // Collapse multiple whitespace characters to a single space
  const collapsed = withoutControls.replace(/\s+/g, " ");
  // Limit name length to a reasonable size
  return collapsed.slice(0, 120);
}

export function sanitizeEmail(raw: string): string {
  const trimmed = raw.trim();
  // Email addresses are case-insensitive for the local part in most systems;
  // normalizing to lowercase is usually safe and avoids duplicates.
  const lower = trimmed.toLowerCase();
  // Strip control characters just in case
  return lower.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 254);
}


