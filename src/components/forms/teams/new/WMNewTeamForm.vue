<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["team.team"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">

          <WMInput
              name="team-name"
              :required="true"
              type="input-text"
              :label="$t('team-name') + ':'"
          />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInputDropdownManager size="sm" />
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

import WMInput from "@/components/forms/WMInput.vue";
import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();

// INJECT
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
defineProps({
  isSidebar: Boolean,
});

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit } = useForm({
  validationSchema: formUtilsStore.getTeamNewFormValidationSchema,
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
