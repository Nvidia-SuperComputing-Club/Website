import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname } from 'path';

const DIR = join(import.meta.dirname, '..', 'src', 'assets', 'exploding-frames-dgx-h200');
const QUALITY = 30;

async function main() {
  const files = (await readdir(DIR))
    .filter(f => extname(f) === '.jpg')
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const src = join(DIR, file);
    const dst = src.replace(/\.jpg$/, '.webp');
    const sizeBefore = (await stat(src)).size;
    totalBefore += sizeBefore;

    await sharp(src)
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(dst);

    const sizeAfter = (await stat(dst)).size;
    totalAfter += sizeAfter;

    console.log(`${file} → ${file.replace(/\.jpg$/, '.webp')}  (${(sizeBefore / 1024).toFixed(1)} KB → ${(sizeAfter / 1024).toFixed(1)} KB)`);
  }

  console.log(`\n--- Done ---`);
  console.log(`Converted ${files.length} files`);
  console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`After:  ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved:  ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
