// Реквизиты и контакты — единый источник для шапки, футера, формы и Schema.org.
export const site = {
  url: 'https://nnvss.ru',
  brand: 'NNVSS',
  name: 'Видеонаблюдение в Нижнем Новгороде',
  city: 'Нижний Новгород',
  region: 'Нижегородская область',
  geo: { lat: 56.326887, lng: 44.005986 },
  openingHours: { opens: '09:00', closes: '21:00' },

  phone: '+79047829997',
  phoneDisplay: '+7 904 782-99-97',
  email: 'vss@nn-video.ru',
  telegram: 'https://t.me/vssnnvideo',
  telegramHandle: '@vssnnvideo',

  legal: {
    name: 'ИП Лебедев Андрей Владимирович',
    inn: '526098859192',
    ogrn: '325527500022552'
  },

  yandexVerification: 'ff62661255bc9bec',
  ogImage: '/og-image.jpg'
}

export const nav = [
  { label: 'Услуги', href: '#services' },
  { label: 'Прайс-лист', href: '#projects' },
  { label: 'Отзывы', href: '#reviews' }
]
