export function normalizeTitle(title: string): string {

  return title

    .toLowerCase()

    .replace(/\.[^/.]+$/, "") // Remove extension

    .replace(/[_\-()[\]{}]/g, " ")

    .replace(/[^\w\s]/g, "")

    .replace(/\s+/g, " ")

    .trim();

}