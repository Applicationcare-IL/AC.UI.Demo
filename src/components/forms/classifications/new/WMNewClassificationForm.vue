<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">

      <h2 class="h2 my-0">{{ $t("classification.classification") }}</h2>

      <div class="wm-form-column align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
              name="value"
              :required="true"
              type="input-text"
              size="md"
              :label="$t('classification.value') + ':'"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput
              name="value_he"
              :required="true"
              type="input-text"
              size="md"
              :label="$t('classification.value-he') + ':'"
          />
          <WMInput
              name="value_en"
              :required="true"
              type="input-text"
              size="md"
              :label="$t('classification.value-en') + ':'"
          />
        </div>
      </div>

      <Divider/>

    </div>
  </div>
</template>

<script setup>
// IMPORTS
import {useForm} from "vee-validate";
import {inject, watch} from "vue";

import {useFormUtilsStore} from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();

// INJECT
const closeSidebar = inject("closeSidebar");
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS

const emit = defineEmits(["newClassificationCreated"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const {handleSubmit, values, resetForm, meta} = useForm({
  validationSchema: formUtilsStore.getMessageNewFormValidationSchema,
});

const onSubmit = handleSubmit(() => {

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
watch(
    () => meta.value,
    (value) => {
      if (!isFormDirty) return;

      isFormDirty.value = value.dirty;
    }
);
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
