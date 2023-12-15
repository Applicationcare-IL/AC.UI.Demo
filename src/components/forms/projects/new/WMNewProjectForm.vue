<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <WMNewProjectFormGeneralDetails />

      <Divider layout="horizontal" />

      <WMNewProjectFormClassification />

      <Divider class="mb-0" layout="horizontal" />

      <WMNewProjectFormLocation />

      <Divider class="mb-0" layout="horizontal" />

      <h2 class="h2 mb-0">TEAM</h2>
      <WMContactsTable
        :contacts="selectedContacts"
        :columns="getSelectedContactsForNewProjectColumns()"
        :showControls="false"
        :showAddContact="true"
        :multiselect="false"
        related-entity="project"
        @change:selected-contacts="handleChangeSelectedContacts"
      />

      <WMFormButtons
        v-if="isSidebar"
        @save-form="onSubmit()"
        @cancel-form="onCancel()"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useForm } from "vee-validate";

const { createProject, parseProject } = useProjects();
const { getSelectedContactsForNewProjectColumns } = useListUtils();

const teamMembers = ref([]);
const selectedContacts = ref([]);

const handleChangeSelectedContacts = (contacts) => {
  teamMembers.value = contacts;
};

const props = defineProps({
  isSidebar: {
    type: Boolean,
    default: false,
  },
});

const selectedProjectType = ref(false);

const toast = useToast();
const dialog = useDialog();
const formUtilsStore = useFormUtilsStore();

const { handleSubmit } = useForm({
  validationSchema: formUtilsStore.getNewProjectFormValidationSchema,
});

const emit = defineEmits(["closeSidebar"]);

const onSubmit = handleSubmit((values) => {
  const newFormValues = {
    ...values,
    teamMembers: teamMembers.value,
  };

  let parsedProject = parseProject(newFormValues);

  parsedProject = {
    ...parsedProject,
    number: Math.floor(Math.random() * 1000) + 1,
  };

  createProject(parsedProject)
    .then((data) => {
      dialog.confirmNewProject(data.data.id);
      toast.successAction("project", "created");
    })
    .catch((error) => {
      console.log(error);
      toast.error("project", "not-created");
    });
});

const onCancel = () => {
  emit("closeSidebar");
};

defineExpose({
  onSubmit,
  onCancel,
});
</script>

<style scoped lang="scss"></style>
