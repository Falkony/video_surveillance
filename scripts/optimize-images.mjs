// Ужимает исходные фото до разумного размера перед добавлением в src/assets.
// Дальше Astro сам нарежет из них webp нужных ширин при сборке.
//
// Использование:
//   npm run images -- <папка-с-исходниками> <папка-назначения> [макс. сторона, px]
// Пример (новые фото работ):
//   npm run images -- ~/Desktop/new-photos src/assets/images/examples 1920
import { mkdir, readdir } from 'node:fs/promises'
import { extname, join, parse } from 'node:path'
import sharp from 'sharp'

const [inputDir, outputDir, maxSizeArg] = process.argv.slice(2)

if (!inputDir || !outputDir) {
  console.error('Использование: npm run images -- <input> <output> [maxSize]')
  process.exit(1)
}

const maxSize = Number(maxSizeArg) || 1920
const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic'])

await mkdir(outputDir, { recursive: true })

const files = (await readdir(inputDir)).filter(f => exts.has(extname(f).toLowerCase()))

for (const file of files) {
  const target = join(outputDir, `${parse(file).name}.jpg`)
  const info = await sharp(join(inputDir, file))
    .rotate() // учитываем EXIF-ориентацию с телефона
    .resize({ width: maxSize, height: maxSize, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#171717' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(target)
  console.log(`${file} → ${target} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} КБ)`)
}
