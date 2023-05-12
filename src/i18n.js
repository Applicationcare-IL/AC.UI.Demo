import { createI18n } from 'vue-i18n'
import en from '/locales/en.json';
import he from '/locales/he.json';
import { setLocale } from 'yup';

const messages = {
  en,
  he
}

const i18n = createI18n({
  legacy: false, 
  locale: 'en', // set the default locale
  fallbackLocale: 'en', // set the fallback locale
  messages, // set the messages
  globalInjection: true,
})

setLocale({
  mixed: {
    required: 'validation.required',
  },
  string: {
    min: ({ min }) => ({ key: 'test', values: { min } }),
  },
});

export default i18n