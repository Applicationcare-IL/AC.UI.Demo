<template>
  <div
    v-if="project"
    class="wm-detail-form-container flex flex-auto flex-column overflow-auto"
  >
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">
            {{ $t("project.project") }}: {{ project.project_name }}
          </h1>
          <div :class="statusClass(project.status)" class="status-label">
            {{ $t("statuses." + project.status) }}
          </div>
        </div>
        <div>
          <!-- <WMAnnouncementsButton entity="projects" :id="route.params.id" /> -->
        </div>
      </div>

      <div class="flex gap-5">
        <div class="flex-1 card-container">
          <WMDetailProjectFormGeneralInformation :project="project" />
        </div>
        <div class="flex flex-1 gap-5 flex-column card-container">
          <WMDetailProjectFormClassification
            @project-type-update="handleProjectTypeUpdate"
            :project="project"
          />
          <WMDetailProjectFormExecutionInformation />
        </div>
      </div>

      <!-- <div class="flex-1 card-container">
        <WMDetailProjectFormLocation :project="project" />
      </div> -->

      <!-- <div class="flex-1 card-container">
        <Card>
          <template #title> Budget </template>
          <template #content> Budget </template>
        </Card>
      </div> -->

      <div class="flex-1 card-container">
        <WMDetailProjectFormTenderInformation
          v-if="selectedProjectType === 'tender'"
        />
      </div>

      <div class="mt-5">
        <WMStepper
          :steps="stages"
          :currentStep="currentStage"
          aria-label="Form Steps"
        />
      </div>

      <Accordion>
        <AccordionTab :header="$t('task.tasks')">
          <WMDetailProjectFormTasksTab :project="project" />
        </AccordionTab>
      </Accordion>

      <!-- <Accordion>
        <AccordionTab header="יומן (Journal)">
          <WMJournalDataView />
        </AccordionTab>
      </Accordion> -->

      <!-- <Accordion>
        <AccordionTab header="גאנט (Gantt)"> NOT DEFINED YET </AccordionTab>
      </Accordion> -->

      <Accordion>
        <AccordionTab :header="$t('team')">
          <WMDetailProjectFormTeamTab />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('documents.documents')">
          <WMDetailProjectFormDocumentsTab />
        </AccordionTab>
      </Accordion>

      <!-- <h2>Others tabs</h2> -->

      <!-- <Accordion>
        <AccordionTab header="Round of signatures tasks">
          <WMDetailProjectFormSignatureTasksTab />
        </AccordionTab>
      </Accordion> -->

      <!-- <Accordion>
        <AccordionTab header="תהליך תיחור (Competition process)">
          <WMDetailProjectFormCompetitionProcessTab />
        </AccordionTab>
      </Accordion> -->

      <Divider />

      <div class="flex-1 tabs-container mt-5">
        <WMDetailProjectFormAdditionalInformation />
      </div>
    </div>
  </div>
  <div v-else>
    <div
      v-if="loading"
      class="flex flex-column justify-content-center h-screen align-items-center"
    >
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { useForm } from "vee-validate";
import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";

import { useRoute } from "vue-router";
import { useDateFormat } from "@vueuse/core";

const { setSelectedContacts } = useContacts();
const {
  getProjectFromApi,
  updateProject,
  parseUpdateProject,
  mapContactsFromProjects,
} = useProjects();

const toast = useToast();
const stages = ref([]);
const currentStage = ref();
const selectedProjectType = ref(false);

const project = ref();

const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();

const route = useRoute();

const { getStatusConditionalStyle, getPriorityConditionalStyle } =
  useListUtils();

onMounted(async () => {
  await fetchData();
  const mappedContacts = mapContactsFromProjects(project.value);
  setSelectedContacts(mappedContacts);
});

const fetchData = async () => {
  const data = await getProjectFromApi(route.params.id);
  project.value = data;

  utilsStore.selectedElements["project"] = [project.value];

  stages.value = data.process.stages.map((stage) => ({
    label: stage.name,
    date: useDateFormat(stage.sla.due_date, "DD/MM/YY"),
  }));

  currentStage.value = data.current_stage?.order - 1;
};

const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: formUtilsStore.getServiceDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateProject(route.params.id, parseUpdateProject(values))
    .then((data) => {
      toast.successAction("project", "updated");
      resetForm({ values: values });
    })
    .catch((error) => {
      console.error(error);
      toast.error("project", "not-updated");
    });
});

const priorityClass = (data) => {
  return getPriorityConditionalStyle(data);
};

const handleProjectTypeUpdate = (value) => {
  selectedProjectType.value = value;
};

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "project";
utilsStore.entity = "project";

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

defineExpose({
  onSave,
});

watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    formUtilsStore.setFormMetas(value, props.formKey);
  }
);
</script>

<style scoped lang="scss"></style>
