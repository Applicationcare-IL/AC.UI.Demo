<template>
  <div v-if="process" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">Detail Process Form</div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const route = useRoute();

const formUtilsStore = useFormUtilsStore();
const toast = useToast();
const { t } = useI18n();

const updateProcess = useAdminProcess();

// INJECT

// PROPS, EMITS
const props = defineProps({
  process: {
    type: Object,
    required: true,
  },
  formKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["processUpdated"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm({
  //   validationSchema: formUtilsStore.,
});

const onSave = handleSubmit((values) => {
  updateProcess(route.params.id, values)
    .then(() => {
      toast.success({ process: "Process updated successfully" });
      resetForm({ values: values });
      emit("processUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating process");
    });
});

// PROVIDE, EXPOSE
defineExpose({
  onSave,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    if (value.touched) {
      formUtilsStore.formMeta = value;
      formUtilsStore.setFormMetas(value, props.formKey);
    }
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  formUtilsStore.formEntity = "process";
});
</script>
