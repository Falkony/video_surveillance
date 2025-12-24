export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || 'https://nnvss.ru';

  return [
    {
      loc: '/',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 1.0
    }
  ].map(route => ({
    ...route,
    loc: `${siteUrl}${route.loc}`
  }));
});

