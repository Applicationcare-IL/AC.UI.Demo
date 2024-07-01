import "./src/assets/styles.scss";
import "./src/assets/themes/mytheme/theme.scss";
import "./histoire.css";

import { defineSetupVue3 } from "@histoire/plugin-vue";
import i18nInstance from "@/i18n";
import { createPinia } from "pinia";

// PRIMEVUE
import PrimeVue from "primevue/config";
import { reactive } from "vue";

const pinia = createPinia();

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(PrimeVue);
  app.use(i18nInstance);

  pinia.use(({ store }) => {
    store.router = markRaw(router);
  });

  app.use(pinia);

  app.config.globalProperties.$appState = reactive({
    isRTL: true,
    isNewThemeLoaded: false,
    layoutMode: "light",
  });
});
