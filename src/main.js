import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@/assets/styles.scss";
import "@/assets/themes/mytheme/theme.scss";

import VueGoogleMaps from "@fawmi/vue-google-maps";
// import 'maze-components/dist/index.css'
import { createHead } from "@unhead/vue";
import { QuillEditor } from "@vueup/vue-quill";
import mazeComponents from "maze-components";
import { createPinia } from "pinia";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import AutoComplete from "primevue/autocomplete";
import Badge from "primevue/badge";
import BadgeDirective from "primevue/badgedirective";
import Breadcrumb from "primevue/breadcrumb";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Card from "primevue/card";
import Chart from "primevue/chart";
import Checkbox from "primevue/checkbox";
import Chip from "primevue/chip";
import Chips from "primevue/chips";
import Column from "primevue/column";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import ContextMenu from "primevue/contextmenu";
import DataTable from "primevue/datatable";
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import FileUpload from "primevue/fileupload";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import Menu from "primevue/menu";
import OverlayPanel from "primevue/overlaypanel";
import Password from "primevue/password";
import ProgressSpinner from "primevue/progressspinner";
import ScrollPanel from "primevue/scrollpanel";
import SelectButton from "primevue/selectbutton";
import Sidebar from "primevue/sidebar";
import Skeleton from "primevue/skeleton";
import Steps from "primevue/steps";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import { createApp, markRaw, reactive } from "vue";
import Vue3Signature from "vue3-signature";

import i18nInstance from "@/i18n";

import App from "./App.vue";
import router from "./router";

const app = createApp(App)
  .use(PrimeVue, { ripple: true })
  .use(mazeComponents)
  .use(ConfirmationService)
  .use(ToastService)
  .use(Vue3Signature)
  .use(VueGoogleMaps, {
    load: {
      key: import.meta.env.VITE_GMAPS_API_KEY,
      language: "iw",
      region: "IL",
    },
    libraries: ["places"],
  })
  .component("QuillEditor", QuillEditor)
  .component("Column", Column)
  .component("DataTable", DataTable)
  .component("AutoComplete", AutoComplete)
  .component("InputText", InputText)
  .component("Textarea", Textarea)
  .component("Dropdown", Dropdown)
  .component("Badge", Badge)
  .component("Divider", Divider)
  .component("Skeleton", Skeleton)
  .component("SelectButton", SelectButton)
  .component("ScrollPanel", ScrollPanel)
  .component("Button", Button)
  .component("Menu", Menu)
  .component("ContextMenu", ContextMenu)
  .component("Card", Card)
  .component("Chart", Chart)
  .component("Chip", Chip)
  .component("Chips", Chips)
  .component("TabView", TabView)
  .component("DataView", DataView)
  .component("DataViewLayoutOptions", DataViewLayoutOptions)
  .component("TabPanel", TabPanel)
  .component("FileUpload", FileUpload)
  .component("Tag", Tag)
  .component("Steps", Steps)
  .component("Sidebar", Sidebar)
  .component("Dialog", Dialog)
  .component("ConfirmDialog", ConfirmDialog)
  .component("Password", Password)
  .component("Toast", Toast)
  .component("OverlayPanel", OverlayPanel)
  .component("Calendar", Calendar)
  .component("InputSwitch", InputSwitch)
  .component("ProgressSpinner", ProgressSpinner)
  .component("Accordion", Accordion)
  .component("AccordionTab", AccordionTab)
  .component("Breadcrumb", Breadcrumb)
  .component("Checkbox", Checkbox);

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
