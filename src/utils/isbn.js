// Ignore spaces and hyphens so ISBN-13 values compare fairly.
export function normaliseIsbn(value) {
  return value.replace(/[\s-]/g, '').toUpperCase();
}
