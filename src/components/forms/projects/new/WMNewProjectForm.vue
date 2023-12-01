<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <WMNewProjectFormGeneralDetails />

      <Divider layout="horizontal" />

      <WMNewProjectFormClassification />

      <Divider class="mb-0" layout="horizontal" />

      <WMNewProjectFormLocation />

      <Divider class="mb-0" layout="horizontal" />

      <WMNewProjectFormTeam />
    </div>
    <WMFormButtons
      v-if="isSidebar"
      @save-form="onSubmit()"
      @cancel-form="onCancel()"
    />
  </div>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from "vue";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useForm } from "vee-validate";

const { createProject, parseProject } = useProjects();

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
  const parsedProject = parseProject(values);

  console.log(parsedProject);

  createProject(parsedProject)
    .then((data) => {
      dialog.confirmNewService(data.data.id);
      toast.successAction("service", "created");
    })
    .catch((error) => {
      console.log(error);
      toast.error("service", "not-created");
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
