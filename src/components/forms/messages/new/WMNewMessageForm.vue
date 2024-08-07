<template>
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
              name="is_important"
              type="input-select-button"
              :highlighted="true"
              :label="$t('message.rating') + ':'"
              :options="normalImportantOptions"
              :value="normalImportantOptions[1]"
          />
        </div>
      </div>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
              type="date"
              :label="$t('start-date') + ':'"
              name="start_date"
              :required="true"
          />

          <WMInput
              type="date"
              :label="$t('end-date') + ':'"
              name="end_date"
          />
        </div>
      </div>

      <Divider/>

      <h2 class="h2 my-0">{{ $t("message.content") }}</h2>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
              type="text-area"
              name="message"
              size="full"
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
import {inject, ref} from "vue";
import { useFormUtilsStore } from "@/stores/formUtils";
import WMInput from "@/components/forms/WMInput.vue";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();

// INJECT
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
defineProps({
  isSidebar: Boolean,
});

// REFS
const normalImportantOptions = [ { "value": true, "name": "Important", "label": "Important", "value_en": "Important", "value_he": "Important" }, { "value": false, "name": "Normal", "label": "Normal", "value_en": "Normal", "value_he": "Normal" } ];


// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit } = useForm({
  validationSchema: formUtilsStore.getMessageNewFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  console.log("values", values);
});

const onCancel = () => {
  closeSidebar();
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
