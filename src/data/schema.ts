import { priceList, seo } from '~/data/landing'
import { site } from '~/data/site'

// Schema.org для главной: организация, сайт, страница и каталог услуг с ценами из прайса.
// Рейтинг (aggregateRating) не указываем: без реальных отзывов на сайте Google
// считает такую разметку недопустимой.
export function homeJsonLd() {
  const orgId = `${site.url}/#organization`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': orgId,
        name: site.name,
        alternateName: site.brand,
        legalName: site.legal.name,
        taxID: site.legal.inn,
        description: seo.description,
        url: site.url,
        telephone: site.phone,
        email: site.email,
        image: `${site.url}${site.ogImage}`,
        logo: `${site.url}/logo.png`,
        priceRange: '₽₽',
        currenciesAccepted: 'RUB',
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: 'RU'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: site.geo.lat,
          longitude: site.geo.lng
        },
        areaServed: { '@type': 'City', name: site.city },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: site.openingHours.opens,
          closes: site.openingHours.closes
        },
        sameAs: [site.telegram],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Монтаж систем безопасности',
          itemListElement: priceList.categories.map(category => ({
            '@type': 'OfferCatalog',
            name: category.name,
            itemListElement: category.items.map(item => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: item.service, areaServed: site.city },
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                priceCurrency: 'RUB',
                minPrice: item.from,
                ...(item.unit && { unitCode: item.unit })
              }
            }))
          }))
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: 'ru-RU',
        publisher: { '@id': orgId }
      },
      {
        '@type': 'WebPage',
        '@id': `${site.url}/#webpage`,
        url: site.url,
        name: seo.title,
        description: seo.description,
        inLanguage: 'ru-RU',
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': orgId },
        primaryImageOfPage: `${site.url}${site.ogImage}`
      },
      {
        '@type': 'Service',
        serviceType: 'Установка систем видеонаблюдения',
        name: 'Установка видеонаблюдения, СКУД и домофонов под ключ',
        provider: { '@id': orgId },
        areaServed: { '@type': 'City', name: site.city }
      }
    ]
  }
}
