import { defineStore } from "pinia";

import { LANGUAGES } from "@/constants";
import { i18n } from "@/i18n";
import axiosConfig from "@/service/axiosConfig";
import { useTasksStore } from "@/stores/tasksStore";

// const i18n = useI18n();

export const useOptionSetsStore = defineStore("optionSets", {
  state: () => ({
    optionSetsToPreload: [
      "state",
      "gender",
      "service_status",
      "service_street",
      "customer_type",
      "customer_rating",
      "customer_status",
      "contact_customer_role",
      "contact_project_role",
      "service_area",
      "service_type",
      "service_sla",
      "service_site",
      "service_site_type",
      "service_city",
      "service_street",
      "service_neighborhood",
      "service_site_contact_relationship_role",
      "service_priority",
      "service_urgent",
      "project_type",
      "project_area",
      "project_detail",
      "task_sla",
      "task_status",
      "task_family",
      "document_detail",
      "document_type",
      "customer_project_status",
      "zip",
    ],
    optionSets: {},
    taskTypes: {},
    optionSetsPreloaded: false,

    yesNo: [
      { value: true, translationKey: "yes" },
      { value: false, translationKey: "no" },
    ],
    communicationChannels: [
      { value: "sms", translationKey: "communication-channels.sms" },
      // { value: "whatsapp", translationKey: "communication-channels.whatsapp" },
    ],
  }),
  getters: {
    isOptionSetsPreloaded() {
      return this.optionSetsToPreload.every((r) => Object.keys(this.optionSets).includes(r));
    },
  },
  actions: {
    getValueId(optionSet, optionSetValue) {
      return this.getOptionSetValuesFromApi(optionSet).then((data) => {
        return data.find((option) => option.value === optionSetValue).id;
      });
    },

    getOptionSetValues(optionSet) {
      // If the option set is defined in the store, return it otherwise get it from API
      if (this[optionSet]) {
        return this[optionSet].map((option) => ({
          value: option.value,
          name: i18n.global.t(option.translationKey),
          label: i18n.global.t(option.translationKey),
          value_en: i18n.global.t(option.translationKey),
          value_he: i18n.global.t(option.translationKey),
        }));
      }

      return this.getOptionSetValuesFromApi(optionSet);
    },

    getOptionSetValuesFromApi(optionSet) {
      return axiosConfig
        .get("/options-set", { params: { name: optionSet } })
        .then((response) => {
          const optionSetValues = response.data.data.map((option) => {
            const returnOption = {
              value: option.value,
              id: option.id,
              attributes: option.attributes,
            };

            for (const lang of LANGUAGES) {
              returnOption["value_" + lang.value] = option["value_" + lang.value];
            }

            return returnOption;
          });
          return optionSetValues;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getOptionSetValuesFromApiRaw(optionSet, dependant) {
      return axiosConfig
        .get("/options-set", {
          params: { name: optionSet, depends_on: dependant },
        })
        .then((response) => {
          const optionSetValues = response.data.data.map((option) => {
            let returnOption = {
              value: option.value,
              id: option.id,
              name: option.value,
              label: option.value,
            };

            for (const lang of LANGUAGES) {
              returnOption["value_" + lang.value] = option["value_" + lang.value];
            }

            return returnOption;
          });

          return optionSetValues;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    //Get the id of a value from an option set and if it does not exist, create it
    getOptionSetValueByName(optionSet, value, dependant) {
      return axiosConfig
        .post("/options-set/add", {
          option_set: optionSet,
          value: value,
          depends_on: dependant,
        })
        .then((response) => {
          return response.data.data;
        });
    },

    async preloadOptionSets() {
      // Iterate the option set to preload list to load them from the API
      for (const optionSet of this.optionSetsToPreload) {
        await this.getOptionSetValuesFromApi(optionSet).then((data) => {
          this.optionSets[optionSet] = data;
        });
      }

      const tasksStore = useTasksStore();
      await tasksStore.getTasksTypesFromApi().then((data) => {
        this.taskTypes = data.data;
      });

      return Promise.resolve();
    },

    async getId(optionSet, value) {
      if (this.optionSetsToPreload.includes(optionSet) && !this.optionSets[optionSet]) {
        await this.preloadOptionSets();
      }

      return this.optionSets[optionSet].find((option) => option.value === value).id;
    },
  },
});
