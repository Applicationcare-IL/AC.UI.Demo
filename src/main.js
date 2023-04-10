import { createApp } from 'vue'
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

import '@/assets/styles.scss';
import '@/assets/themes/mytheme/theme.scss';

createApp(App)
.use(PrimeVue, {ripple:true})
.use(mazeComponents)
.use(router)
.component('Column', Column)
.component('DataTable', DataTable)
.component('InputText', InputText)
.component('Badge', Badge)
.component('Divider', Divider)
.component('SelectButton', SelectButton)
.mount('#app')
  