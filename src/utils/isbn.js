// people type ISBNs with dashes sometimes
export function cleanIsbn(value) {
  return value.replace(/[\s-]/g, '').toUpperCase();
}
