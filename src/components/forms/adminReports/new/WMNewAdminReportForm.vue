<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["admin-report.report"]) }}</h1>
      <div class="flex flex-column gap-2">
        <pre>{{ values }}</pre>
        <WMInput name="name" required size="md" type="input-text" :label="$t('name') + ':'" />
        <WMInput
          id="description"
          type="text-area"
          :label="$t('description') + ':'"
          name="description"
          size="md"
          required
        />
      </div>

      <div class="flex flex-column gap-2">
        <WMInput
          v-if="entities.length > 0"
          name="entity"
          type="input-select"
          :highlighted="true"
          :label="$t('entity') + ':'"
          :options="entities"
          custom-option-label="name"
          required
          size="md"
        />
      </div>

      <div class="flex mt-4 gap-2">
        <WMInputCheckbox :value="false" name="private" :label="$t('private')" />
      </div>

      <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, ref, watch } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();
const { createReport, parseReport } = useAdminReports();
const { getEasymazeEntitiesList } = useAdminSystem();

const toast = useToast();
const dialog = useDialog();

// INJECT
const closeSidebar = inject("closeSidebar");
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
const props = defineProps({
  isSidebar: Boolean,
});

const emit = defineEmits(["newReportCreated"]);

// REFS
const entities = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema: formUtilsStore.getAdminReportNewFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  const newReport = {
    ...values,
    order_dir: "desc",
  };

  createReport(parseReport(newReport))
    .then((data) => {
      console.log("createReport", data);
      emit("newReportCreated");
      dialog.confirmNewAdminReport({ id: data.data.id, emit });

      resetForm();

      if (props.isSidebar) {
        isFormDirty.value = false;
        closeSidebar();
      }

      toast.success({ title: "Report created", message: "Report created successfully" });
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error");
    });
});

const onCancel = () => {
  closeSidebar();
};

const fetchEntities = () => {
  getEasymazeEntitiesList().then((result) => {
    entities.value = result.data;
  });
};

fetchEntities();

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

<style scoped lang="scss"></style>
