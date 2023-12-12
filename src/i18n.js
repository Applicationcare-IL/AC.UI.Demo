// DOCUMENTATION: https://kazupon.github.io/vue-i18n/guide/lazy-loading.html

import { nextTick } from "vue";
import { createI18n } from "vue-i18n";
import axiosConfig from "@/service/axiosConfig";

export const SUPPORT_LOCALES = ["en", "he"];

export function setupI18n(options = { locale: "he" }) {
  // console.log("setupI18n", options);
  const i18n = createI18n(options);

  loadLocaleMessages(i18n.global, options.locale);
  // console.log("i18n", i18n);
  setI18nLanguage(i18n.global, options.locale);
  return i18n;
}

export function setI18nLanguage(i18n, locale) {
  if (i18n.mode === "legacy") {
    i18n.locale = locale;
  } else {
    i18n.locale.value = locale;
  }
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector("html").setAttribute("lang", locale);
}

export async function loadLocaleMessages(i18n, locale) {
  // load locale messages with dynamic import
  // const messages = await import(
  //   /* webpackChunkName: "locale-[request]" */ `/locales/${locale}.json`
  // );

  return axiosConfig
    .get(
      `https://admin.dev-easymaze.mazemateapp.com/storage/translations/${locale}/contacts.json`
    )
    .then((response) => {
      console.log("loadLocaleMessages", response.data);
      i18n.setLocaleMessage(locale, messages);

      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  // set locale and locale message

  return nextTick();
}

export const i18n = setupI18n({
  legacy: false,
  locale: "he", // set the default locale
  fallbackLocale: "he", // set the fallback locale
  globalInjection: true,
});

console.log("i18n.js", i18n);

export default i18n;
