<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <WMNewProjectFormGeneralDetails />
      <Divider layout="horizontal" />

      <WMNewProjectFormClassification />
      <Divider class="mb-0" layout="horizontal" />

      <WMNewProjectFormLocation />
      <Divider class="mb-0" layout="horizontal" />

      <h2 class="h2 mb-0">{{ $t("team.team") }}</h2>

      <WMSetTeamContactsTable
        :contacts="selectedContacts"
        :columns="getSelectedContactsForNewProjectColumns()"
        related-entity="project"
        @change:selected-contacts="handleChangeSelectedContacts"
        @unlink="handleUnlinkContact"
      />

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
const { createProject, parseProject } = useProjects();
const { getSelectedContactsForNewProjectColumns } = useListUtils();
const toast = useToast();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();

// INJECT
const isFormDirty = inject("isFormDirty");
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
});

// REFS
const teamMembers = ref([]);
const selectedContacts = ref([]); // the selectedContacts is only used to pass to the table so it recognizes it as external

// COMPUTED
// COMPONENT METHODS AND LOGIC
const handleChangeSelectedContacts = (contacts) => {
  teamMembers.value = contacts;
};

const handleUnlinkContact = (contactId) => {
  const filteredSelectedContacts = selectedContacts.value.filter((contact) => {
    return contact.id !== contactId;
  });

  selectedContacts.value = filteredSelectedContacts;
};

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getNewProjectFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  const newFormValues = {
    ...values,
    team_members: teamMembers.value,
  };

  let parsedProject = parseProject(newFormValues);

  parsedProject = {
    ...parsedProject,
    number: Math.floor(Math.random() * 1000) + 1,
  };

  createProject(parsedProject)
    .then((data) => {
      dialog.confirmNewProject(data.data.id);

      resetForm();
      isFormDirty.value = false;

      closeSidebar();

      toast.successAction("project", "created");
    })
    .catch((error) => {
      console.error(error);
      toast.error("project", "not-created");
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
    isFormDirty.value = value.dirty;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
