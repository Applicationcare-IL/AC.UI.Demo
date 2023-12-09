import { createApp, reactive, markRaw } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
// import 'maze-components/dist/index.css'

import mazeComponents from "maze-components";
import PrimeVue from "primevue/config";
import router from "./router";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import AutoComplete from "primevue/autocomplete";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Badge from "primevue/badge";
import Divider from "primevue/divider";
import Skeleton from "primevue/skeleton";
import SelectButton from "primevue/selectbutton";
import ScrollPanel from "primevue/scrollpanel";
import BadgeDirective from "primevue/badgedirective";
import Button from "primevue/button";
import Menu from "primevue/menu";
import ContextMenu from "primevue/contextmenu";
import Card from "primevue/card";
import Chart from "primevue/chart";
import Chip from "primevue/chip";
import Chips from "primevue/chips";
import TabView from "primevue/tabview";
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import TabPanel from "primevue/tabpanel";
import FileUpload from "primevue/fileupload";
import Tag from "primevue/tag";
import Steps from "primevue/steps";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmationService from "primevue/confirmationservice";
import Sidebar from "primevue/sidebar";
import Password from "primevue/password";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import OverlayPanel from "primevue/overlaypanel";
import Calendar from "primevue/calendar";
import InputSwitch from "primevue/inputswitch";
import ProgressSpinner from "primevue/progressspinner";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";

import VueGoogleMaps from "@fawmi/vue-google-maps";

import i18nInstance from "@/i18n";

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import "@/assets/styles.scss";
import "@/assets/themes/mytheme/theme.scss";

const app = createApp(App)
  .use(PrimeVue, { ripple: true })
  .use(mazeComponents)
  .use(ConfirmationService)
  .use(ToastService)
  .use(VueGoogleMaps, {
    load: {
      key: "",
    },
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
  .component("AccordionTab", AccordionTab);

app.config.globalProperties.$appState = reactive({
  isRTL: true,
  isNewThemeLoaded: false,
  layoutMode: "light",
});
app.directive("badge", BadgeDirective);
app.use(i18nInstance);

const pinia = createPinia();

pinia.use(({ store }) => {
  store.router = markRaw(router);
});

app.use(pinia);
app.use(router);

app.mount("#app");
