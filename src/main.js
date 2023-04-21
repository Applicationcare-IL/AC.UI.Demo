import { createApp, reactive } from 'vue'
import App from './App.vue'
// import 'maze-components/dist/index.css'

import mazeComponents from 'maze-components'
import PrimeVue from 'primevue/config';
import router from './router';


import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText  from 'primevue/inputtext';
import Badge  from 'primevue/badge';
import Divider  from 'primevue/divider';
import SelectButton  from 'primevue/selectbutton';
import ScrollPanel  from 'primevue/scrollpanel';
import BadgeDirective from 'primevue/badgedirective';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Tag from 'primevue/tag';


import '@/assets/styles.scss';
import '@/assets/themes/mytheme/theme.scss';

const app = createApp(App)
.use(PrimeVue, {ripple:true})
.use(mazeComponents)
.use(router)
.component('Column', Column)
.component('DataTable', DataTable)
.component('InputText', InputText)
.component('Badge', Badge)
.component('Divider', Divider)
.component('SelectButton', SelectButton)
.component('ScrollPanel', ScrollPanel)
.component('Button', Button)
.component('Card', Card)
.component('Chart', Chart)
.component('Tag', Tag);


app.config.globalProperties.$appState = reactive({ isRTL: false, isNewThemeLoaded: false, layoutMode: 'light' });
app.directive('badge', BadgeDirective);

app.mount('#app')
  