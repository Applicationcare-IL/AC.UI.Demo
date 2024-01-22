// DOCUMENTATION: https://kazupon.github.io/vue-i18n/guide/lazy-loading.html

import { nextTick } from "vue";
import { createI18n } from "vue-i18n";

import axiosConfig from "@/service/axiosConfig";

export const SUPPORT_LOCALES = ["en", "he"];

export function setupI18n(options = { locale: "he" }) {
  const i18n = createI18n(options);

  loadLocaleMessages(i18n.global, options.locale);

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
  // FROM API
  return axiosConfig
    .get(
      import.meta.env.VITE_ADMIN_URL + `/api/em-translations?locale=${locale}`
    )
    .then((response) => {
      const messages = response.data;

      i18n.setLocaleMessage(locale, messages);

      return nextTick();
    })
    .catch((error) => {
      console.error(error);
    });

  // FROM LOCAL JSON FILE
  const messages = await import(
    /* @vite-ignore */ /* webpackChunkName: "locale-[request]" */ `/locales/${locale}.json`
  );
  i18n.setLocaleMessage(locale, messages.default);

  return nextTick();
}

export const i18n = setupI18n({
  legacy: false,
  locale: import.meta.env.VITE_I18N_LOCALE || "he",
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || "he",
  globalInjection: true,
});

export default i18n;
