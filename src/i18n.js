import { createI18n } from 'vue-i18n'
import en from '/locales/en.json';
import he from '/locales/he.json';


const messages = {
  en,
  he
}

const i18n = createI18n({
  legacy: false, 
  locale: 'he', // set the default locale
  fallbackLocale: 'he', // set the fallback locale
  messages, // set the messages
  // globalInjection: true,
})

export default i18n