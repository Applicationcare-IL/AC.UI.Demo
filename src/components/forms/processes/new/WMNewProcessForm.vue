<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">form processes</div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, watch } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();
const createProcess = useAdminProcess();
const dialog = useDialog();
const toast = useToast();

// INJECT
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
const props = defineProps({
  isSidebar: Boolean,
});

const emit = defineEmits(["newProcessCreated"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getRoleNewFormValidationSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    let data = await createProcess(values);

    emit("newProcessCreated");
    dialog.confirmNewAdminProcess({ id: data.data.id, emit });

    resetForm();

    toast.success({ title: "Process created", message: "Process created successfully" });
  } catch (error) {
    console.error(error);
  }
});

// PROVIDE, EXPOSE
defineExpose({
  onSubmit,
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
