// При сборке с build.format: 'file' Astro.url.pathname равен '/index.html' или '/privacy.html'.
// Приводим к виду, по которому страница реально открывается: '/' и '/privacy'.
export function cleanPath(url: URL) {
  return url.pathname.replace(/(index)?\.html$/, '').replace(/\/$/, '') || '/'
}

// Якоря на главной работают как есть, с других страниц ведут на главную
export function anchorPrefix(url: URL) {
  return cleanPath(url) === '/' ? '' : '/'
}
