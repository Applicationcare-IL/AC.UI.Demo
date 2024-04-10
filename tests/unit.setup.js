import { config } from "@vue/test-utils";
import PrimeVue from "primevue/config";

config.global.mocks = {
  $t: (tKey) => tKey,
};

config.global.plugins = [PrimeVue];
