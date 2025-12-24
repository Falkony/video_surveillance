export const useSchemaOrg = () => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || 'https://nnvss.ru';
  const phone = config.public.phone || '+79047829997';
  const email = config.public.email || 'vss@nn-video.ru';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: 'Видеонаблюдение в Нижнем Новгороде',
    legalName: 'ИП Лебедев Андрей Владимирович',
    description: 'Профессиональные системы видеонаблюдения для дома и бизнеса. Установка, настройка и обслуживание под ключ.',
    url: siteUrl,
    telephone: phone,
    email: email,
    image: `${siteUrl}/images/logo.png`,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/logo.png`,
      width: '250',
      height: '250'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Нижний Новгород',
      addressRegion: 'Нижегородская область',
      addressCountry: 'RU'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '56.326887',
      longitude: '44.005986'
    },
    areaServed: {
      '@type': 'City',
      name: 'Нижний Новгород'
    },
    priceRange: '₽₽',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '09:00',
      closes: '21:00'
    },
    sameAs: [
      'https://t.me/summer_andy'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
      bestRating: '5',
      worstRating: '1'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'Видеонаблюдение в Нижнем Новгороде',
    description: 'Профессиональные системы видеонаблюдения для дома и бизнеса',
    publisher: {
      '@id': `${siteUrl}/#organization`
    },
    inLanguage: 'ru-RU'
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: siteUrl
      }
    ]
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Установка систем видеонаблюдения',
    provider: {
      '@id': `${siteUrl}/#organization`
    },
    areaServed: {
      '@type': 'City',
      name: 'Нижний Новгород'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги видеонаблюдения',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Монтаж камер видеонаблюдения',
            description: 'Профессиональная установка внутренних и уличных камер'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Системы контроля доступа (СКУД)',
            description: 'Установка и настройка систем контроля и управления доступом'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Системы домофонии',
            description: 'Монтаж цифровых и аналоговых домофонов'
          }
        }
      ]
    }
  };

  return {
    organizationSchema,
    websiteSchema,
    breadcrumbSchema,
    serviceSchema
  };
};

