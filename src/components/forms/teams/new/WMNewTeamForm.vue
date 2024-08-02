<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["team.team"]) }}</h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput name="name" :required="true" type="input-text" :label="$t('team-name') + ':'" />
        </div>
      </div>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInputDropdownManager size="sm" />
        </div>
      </div>

      <Divider/>

       <WMAdminUserSelectorTable />

      <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, watch } from "vue";

import WMInput from "@/components/forms/WMInput.vue";
import useAdminTeams from "@/composables/useAdminTeams";
import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();
const { createTeam, parseTeam } = useAdminTeams();
const toast = useToast();
const dialog = useDialog();

// INJECT
const closeSidebar = inject("closeSidebar");
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
const props = defineProps({
  isSidebar: Boolean,
});

const emit = defineEmits(["newTeamCreated"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getTeamNewFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  createTeam(parseTeam(values))
    .then((data) => {
      emit("newTeamCreated");
      dialog.confirmNewAdminTeam({ id: data.data.id, emit });

      resetForm();

      if (props.isSidebar) {
        isFormDirty.value = false;
        closeSidebar();
      }

      toast.success({ title: "Team created", message: "Team created successfully" });
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
