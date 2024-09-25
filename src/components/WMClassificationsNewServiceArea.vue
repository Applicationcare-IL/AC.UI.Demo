<template>
  <template v-if="can('classifications.create')">
    <div class="m-3">
      <div class="flex flex-row justify-content-between align-content-center">
        <h1 class="h1 mb-0">New service area</h1>
      </div>
      <Divider />
    </div>
    <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
      <div class="task-data flex flex-auto flex-column gap-5 mb-5">
        <h2 class="h2 my-0">{{ $t("classification.classification") }}</h2>

        <WMClassificationOptionSetFields />

        <Divider />

        <WMClassificationsNewInnerClassificationsTable />

        <div class="flex flex-row flex-wrap gap-2">
          <WMFormButtons @save-form="onSubmit()" @cancel-form="onCancel()" />
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="m-5">
      {{ $t("permissions.you-dont-have-permission") }}
    </div>
  </template>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const { can } = usePermissions();
const formUtilsStore = useFormUtilsStore();

const { addValue } = useAdminOptionSets();
const toast = useToast();

// INJECT
const closeSidebar = inject("closeSidebar");
// const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
// const emit = defineEmits(["new-service-area"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit } = useForm({
  validationSchema: formUtilsStore.getNewClassificationFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  addValue("service_area", values)
    .then(() => {
      closeSidebar();
      toast.success({
        title: "Classification created",
        message: "New classification created successfully",
      });
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error");
    });
});

const onCancel = () => {
  closeSidebar();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
