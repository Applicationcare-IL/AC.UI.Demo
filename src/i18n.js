import { createI18n } from 'vue-i18n'
import en from '/locales/en.json';
import he from '/locales/he.json';
import { setLocale } from 'yup';

const messages = {
  en,
  he
}

const instance  = createI18n({
  legacy: false, 
  locale: 'he', // set the default locale
  fallbackLocale: 'he', // set the fallback locale
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

export default instance 
export const i18n = instance.global