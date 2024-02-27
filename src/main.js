import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@/assets/styles.scss";
import "@/assets/themes/mytheme/theme.scss";

import VueGoogleMaps from "@fawmi/vue-google-maps";
// import 'maze-components/dist/index.css'
import { createHead } from "@unhead/vue";
import { QuillEditor } from "@vueup/vue-quill";
import Echo from "laravel-echo";
import mazeComponents from "maze-components";
import { createPinia } from "pinia";
import BadgeDirective from "primevue/badgedirective";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Pusher from "pusher-js";
// OTHERS
import { createApp, markRaw, reactive } from "vue";
import Vue3Signature from "vue3-signature";

import i18nInstance from "@/i18n";

import App from "./App.vue";
import router from "./router";

window.Pusher = Pusher;

if (import.meta.env.VITE_PUSHER_APP_KEY) {
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
  });
}

const app = createApp(App)
  .use(PrimeVue, { ripple: true })
  .use(mazeComponents)
  .use(ConfirmationService)
  .use(ToastService)
  .use(Vue3Signature)
  .use(VueGoogleMaps, {
    load: {
      version: 3.53,

      key: import.meta.env.VITE_GMAPS_API_KEY,
      language: "iw",
      region: "IL",
    },
    libraries: ["places"],
  })
  .component("ConfirmDialog", ConfirmDialog)
  .component("Toast", Toast)
  .component("QuillEditor", QuillEditor)
  .component("DataViewLayoutOptions", DataViewLayoutOptions);

app.config.globalProperties.$appState = reactive({
  isRTL: true,
  isNewThemeLoaded: false,
  layoutMode: "light",
});
app.directive("badge", BadgeDirective);
app.use(i18nInstance);

const pinia = createPinia();

// Create a global head instance
const head = createHead();

pinia.use(({ store }) => {
  store.router = markRaw(router);
});

app.use(pinia);
app.use(head);
app.use(router);

app.mount("#app");
