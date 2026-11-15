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
    ogrn: '325527500022552',
    // Адрес Оператора для политики и согласия (ст. 9 152-ФЗ). Лучше указать полный адрес из выписки ЕГРИП.
    address: 'г. Нижний Новгород',
    // Сколько храним заявки, по которым не заключён договор
    leadRetention: '1 года'
  },

  yandexVerification: 'ff62661255bc9bec',
  ogImage: '/og-image.jpg'
}

// Дата редакции политики и согласия — менять при каждой правке их текста
export const legalRevision = '13.11.2026'

export const nav = [
  { label: 'Услуги', href: '#services' },
  { label: 'Прайс-лист', href: '#projects' },
  { label: 'Отзывы', href: '#reviews' }
]
