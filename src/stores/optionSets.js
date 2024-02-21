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

    gender: [
      { value: "male", translationKey: "genders.male" },
      { value: "female", translationKey: "genders.female" },
      { value: "other", translationKey: "genders.other" },
    ],
    status: [
      { value: "open", translationKey: "statuses.open" },
      { value: "closed", translationKey: "statuses.closed" },
      { value: "active", translationKey: "statuses.active" },
      { value: "not_active", translationKey: "statuses.not_active" },
    ],
    type: [
      { value: "private", translationKey: "customer-type.private" },
      { value: "business", translationKey: "customer-type.business" },
    ],
    rating: [
      { value: "vip", translationKey: "customer-rating.vip" },
      { value: "regular", translationKey: "customer-rating.regular" },
    ],
    area: [
      { value: "water_service", translationKey: "area.water_service" },
      { value: "funeral_service", translationKey: "area.funeral_service" },
      { value: "municipality", translationKey: "area.municipality" },
    ],
    classification1: [
      {
        value: "urban-architect",
        translationKey: "classification1.urban-architect",
      },
      {
        value: "sharp-internet-jokes",
        translationKey: "classification1.sharp-internet-jokes",
      },
      {
        value: "people-named-robert",
        translationKey: "classification1.people-named-robert",
      },
    ],
    classification4: [
      {
        value: "urban-architect",
        translationKey: "classification1.urban-architect",
      },
      {
        value: "sharp-internet-jokes",
        translationKey: "classification1.sharp-internet-jokes",
      },
      {
        value: "people-named-robert",
        translationKey: "classification1.people-named-robert",
      },
    ],
    classification5: [
      {
        value: "urban-architect",
        translationKey: "classification1.urban-architect",
      },
      {
        value: "sharp-internet-jokes",
        translationKey: "classification1.sharp-internet-jokes",
      },
      {
        value: "people-named-robert",
        translationKey: "classification1.people-named-robert",
      },
    ],
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
      return this.optionSetsToPreload.every((r) =>
        Object.keys(this.optionSets).includes(r)
      );
    },
  },
  actions: {
    getOptionSetValues(optionSet) {
      return this[optionSet].map((option) => ({
        value: option.value,
        name: i18n.global.t(option.translationKey),
        label: i18n.global.t(option.translationKey),
      }));
    },
    getOptionSetValuesFromApi(optionSet) {
      return axiosConfig
        .get("/options-set", { params: { name: optionSet } })
        .then((response) => {
          const optionSetValues = response.data.data.map((option) => {
            const returnOption = {
              value: option.value,
              id: option.id,
            };

            for (const lang of LANGUAGES) {
              returnOption["value_" + lang.value] =
                option["value_" + lang.value];
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
              returnOption["value_" + lang.value] =
                option["value_" + lang.value];
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
      //Iterate the option set to preload list to load them from the API
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

    getId(optionSet, value) {
      return this.optionSets[optionSet].find((option) => option.value === value)
        .id;
    },
  },
});
