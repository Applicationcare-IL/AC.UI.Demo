import "./src/assets/styles.scss";
import "./src/assets/themes/mytheme/theme.scss";
import "./histoire.css";

import { defineSetupVue3 } from "@histoire/plugin-vue";
import i18nInstance from "@/i18n";

// PRIMEVUE
import PrimeVue from "primevue/config";
import { reactive } from "vue";

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(PrimeVue);
  app.use(i18nInstance);

  app.config.globalProperties.$appState = reactive({
    isRTL: true,
    isNewThemeLoaded: false,
    layoutMode: "light",
  });
});
