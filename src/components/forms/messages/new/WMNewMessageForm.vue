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

      <Divider/>

      <h2 class="h2 my-0">{{ $t('message.target') }}</h2>

      <div class="flex gap-2">
        <WMSelectableButtonGroup
            :options="options"
            @update:selected-option="handleSelectedOption"
        />
      </div>

      <div class="flex flex-column gap-5">

        <div v-if="selectedOption?.value === 'services'" class="flex flex-column gap-3">

          <WMInput
              name="service_area"
              type="input-select"
              :highlighted="true"
              :placeholder="$t('message.select-service-area')"
              :label="$t('message.service-area') + ':'"
              :options="[]"
              custom-option-label=""
              size="md"
          />

          <WMInput
              name="service_type_id"
              type="input-select"
              :highlighted="true"
              :placeholder="$t('message.select-service-detail')"
              :label="$t('message.service-detail') + ':'"
              :options="[]"
              custom-option-label=""
              size="md"
          />

          <WMInput
              name="service_request_1_id"
              type="input-select"
              :highlighted="true"
              :placeholder="$t('message.select-request') + ' 1'"
              :label="$t('message.request') + ' 1:'"
              :options="[]"
              custom-option-label=""
              size="md"
          />

          <WMInput
              name="service_request_2_id"
              type="input-select"
              :highlighted="true"
              :placeholder="$t('message.select-request') + ' 2'"
              :label="$t('message.request') + ' 2:'"
              :options="[]"
              custom-option-label=""
              size="md"
          />

          <WMInput
              name="service_request_3_id"
              type="input-select"
              :highlighted="true"
              :placeholder="$t('message.select-request') + ' 3'"
              :label="$t('message.request') + ' 3:'"
              :options="[]"
              custom-option-label=""
              size="md"
          />

        </div>

        <div v-if="selectedOption?.value === 'customers'" class="flex flex-column gap-3">

          <div class="wm-form-label highlighted">{{ $t('message.organization-type') }}:</div>
          <div class="flex gap-3">
            <WMSelectableButton
                v-model="isPrivate"
                :label="$t('private')"
            />

            <WMSelectableButton
                v-model="isBusiness"
                :label="$t('message.business')"
            />
          </div>

          <WMInputSearch
              name="customer_service_areas"
              :label="$t('message.service-area') + ':'"
              :placeholder="$t('message.select-service-area')"
              :multiple="true"
              size="md"
              :options="[{name: 'Hola', id: 1}]"
              :highlighted="true"
          />

          <div class="wm-form-label highlighted">{{ $t('rating') }}:</div>
          <div class="flex gap-3">
            <WMSelectableButton
                v-model="isNormal"
                :label="$t('message.normal')"
            />

            <WMSelectableButton
                v-model="isVip"
                :label="$t('message.vip')"
            />
          </div>

        </div>

        <div v-if="selectedOption?.value === 'sales'" class="flex flex-column gap-3">

          <WMInput
              name="sale_type"
              type="input-select"
              :highlighted="true"
              :placeholder="$t('message.select-sale-type')"
              :label="$t('message.sale-type') + ':'"
              :options="[]"
              custom-option-label=""
              size="md"
          />

          <WMInput
              name="sale_origin"
              type="input-select"
              :highlighted="true"
              :placeholder="$t('message.select-sale-origin')"
              :label="$t('message.sale-origin') + ':'"
              :options="[]"
              custom-option-label=""
              size="md"
          />

          <WMInput
              name="tender"
              type="input-select-button"
              :highlighted="true"
              :label="$t('message.tender') + ':'"
              :options="[{value:'true', name: 'Yes'}, {value: 'false', name:'No'},]"
          />

        </div>

        <div v-if="selectedOption?.value === 'projects'" class="flex flex-column gap-3">

          <WMInput
              name="project_type_id"
              type="input-select"
              :highlighted="true"
              :placeholder="$t('message.select-project-type')"
              :label="$t('message.project-type') + ':'"
              :options="[]"
              custom-option-label=""
              size="md"
          />

          <WMInput
              name="project_area_id"
              type="input-select"
              :highlighted="true"
              :placeholder="$t('message.select-project-area')"
              :label="$t('message.project-area') + ':'"
              :options="[]"
              custom-option-label=""
              size="md"
          />

          <WMInput
              name="project_detail_id"
              type="input-select"
              :highlighted="true"
              :placeholder="$t('message.select-project-detail')"
              :label="$t('message.project-detail') + ':'"
              :options="[]"
              custom-option-label=""
              size="md"
          />

        </div>

        <div v-if="selectedOption?.value === 'users'" class="flex flex-column gap-3">

          <WMInputSearch
              name="teams_id"
              :label="$t('teams') + ':'"
              :placeholder="$t('message.select-teams')"
              :multiple="true"
              size="md"
              :options="[{name: 'Hola', id: 1}]"
              :highlighted="true"
          />

          <WMInputSearch
              name="roles_id"
              :label="$t('roles') + ':'"
              :placeholder="$t('message.select-roles')"
              :multiple="true"
              size="md"
              :options="[{name: 'Hola', id: 1}]"
              :highlighted="true"
          />

          <WMInputSearch
              name="users_id"
              :label="$t('users') + ':'"
              :placeholder="$t('message.select-users')"
              :multiple="true"
              size="md"
              :options="[{name: 'Hola', id: 1}]"
              :highlighted="true"
          />
        </div>

      </div>

      <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import {ref, inject} from "vue";


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

const isPrivate = ref();
const isBusiness = ref();
const isNormal = ref();
const isVip = ref();

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
