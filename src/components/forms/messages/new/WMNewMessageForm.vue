<template>
<!--  <pre>{{ values }}</pre>-->
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["message.message"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">

          <WMInput
              name="topic"
              :required="true"
              type="input-text"
              :label="$t('message.header') + ':'"
          />

        </div>
      </div>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
              name="important"
              type="input-select-button"
              :highlighted="true"
              :label="$t('message.rating') + ':'"
              :options="normalImportantOptions"
              :value="normalImportantOptions[0]"
          />
        </div>
      </div>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
              type="date"
              :label="$t('start-date') + ':'"
              name="start_date"
              required
          />

          <WMInput
              v-if="values.start_date"
              type="date"
              :label="$t('end-date') + ':'"
              name="end_date"
              :minDate="values.start_date"
          />
        </div>
      </div>

      <Divider/>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
              :label="$t('message.content')"
              label-size="large"
              type="text-area"
              name="message"
              size="full"
              required
          />
        </div>
      </div>

      <div class="flex gap-2">
        <WMSelectableButtonGroup
            :options="options"
            @update:selected-option="handleSelectedOption"
        />
      </div>

      {{ selectedOption?.value }}

      <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import {inject} from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import {useI18n} from "vue-i18n";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();
const { t } = useI18n();

// INJECT
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
defineProps({
  isSidebar: Boolean,
});

// REFS
const normalImportantOptions = [
  { value: "false", name: t("message.normal") },
  { value: "true", name: t("message.important") },
];

const selectedOption = ref(null);

const options = ref([
  {
    label: t("employee.employees"),
    value: "users",
  },
  {
    label: t("project.projects"),
    value: "projects",
  },
  // {
  //   label: t("sale.sales"),
  //   value: "sales",
  // },
  {
    label: t("customer.customers"),
    value: "customers",
  },
  {
    label: t("service.services"),
    value: "services",
  },
]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, values } = useForm({
  validationSchema: formUtilsStore.getMessageNewFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  console.log("values", values);
});

const onCancel = () => {
  closeSidebar();
};

const handleSelectedOption = (option) => {
  selectedOption.value = option;
};

// PROVIDE, EXPOSE
defineExpose({
  onSubmit,
  onCancel,
});

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
