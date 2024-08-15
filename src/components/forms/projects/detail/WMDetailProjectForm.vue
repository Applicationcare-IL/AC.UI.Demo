<template>
  <div v-if="project" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <div class="flex gap-5">
        <div class="flex-1 card-container">
          <WMDetailProjectFormGeneralInformation :project="project" />
        </div>
        <div class="flex flex-1 gap-5 flex-column card-container">
          <Card>
            <template #title> {{ $t("project.classification") }} </template>
            <template #content>
              <WMDetailProjectFormClassification
                :project="project"
                @project-type-update="handleProjectTypeUpdate"
              />
            </template>
          </Card>
          <WMDetailProjectFormExecutionInformation :project="project" />
        </div>
      </div>

      <div class="flex-1 card-container">
        <WMDetailProjectFormLocation :project="project" />
      </div>

      <div v-if="project.budget" class="flex-1 card-container">
        <WMDetailProjectFormBudget :project="project" />
      </div>

      <div
        v-if="project.project_type.value === CONTRACTOR_PROJECT_ID"
        class="flex-1 card-container"
      >
        <Card>
          <template #title>
            {{ $t("project.contractor-selection-method") }}
          </template>
          <template #content>
            <WMDetailProjectFormContractorSection :project="project" />
          </template>
        </Card>
      </div>

      <div v-if="project.project_type.value === TENDER_PROJECT_ID" class="flex-1 card-container">
        <WMDetailProjectFormTenderInformation :project="project" />
      </div>

      <div class="mt-5">
        <WMStepper :steps="stages" :current-step="currentStage" aria-label="Form Steps" />
      </div>

      <Accordion v-if="can('tasks.read')">
        <AccordionTab :header="$t('task.tasks')">
          <WMDetailProjectFormTasksTab :project="project" />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('journal')">
          <WMJournalDataView entity-type="project" :entity-id="project.project_id" />
        </AccordionTab>
      </Accordion>

      <!-- <Accordion>
        <AccordionTab header="גאנט (Gantt)"> NOT DEFINED YET </AccordionTab>
      </Accordion> -->

      <Accordion>
        <AccordionTab :header="$t('team')">
          <WMDetailProjectFormTeamTab />
        </AccordionTab>
      </Accordion>

      <Accordion :active-index="0">
        <AccordionTab :header="$t('documents.documents')">
          <WMDetailProjectFormDocumentsTab />
        </AccordionTab>
      </Accordion>

      <Accordion v-if="project.project_type.value === ROUND_OF_SIGNATURES_PROJECT_ID">
        <AccordionTab :header="$t('round-of-signatures')">
          <WMDetailProjectFormSignatureTasksTab
            :project="project"
            @document-signed="onDocumentSigned"
          />
        </AccordionTab>
      </Accordion>

      <Accordion v-if="project.project_type.value === COMPETITION_PROJECT_ID">
        <AccordionTab :header="$t('project.competition_process')">
          <WMDetailProjectFormCompetitionProcessTab :project="project" />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('milestone.milestones')">
          <WMMilestonesTable :project="project" />
        </AccordionTab>
      </Accordion>

      <Divider />

      <div class="flex-1 tabs-container mt-5">
        <TabView>
          <TabPanel :header="$t('additional-information')">
            <div class="flex flex-column gap-5 m-2">
              <h4 class="h4 mb-0">
                {{ $t("logs") }}
              </h4>
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput
                  name="created_by"
                  type="info"
                  :highlighted="true"
                  :label="$t('created_by') + ':'"
                  :value="project.last_activity.creator.name"
                  width="150"
                />
                <WMInput
                  name="modified_by"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_by') + ':'"
                  :value="project.last_activity.updater.name"
                  width="150"
                />
              </div>
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput
                  name="created_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('created_at') + ':'"
                  :value="project.last_activity.creator.at"
                  width="150"
                />
                <WMInput
                  name="modified_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_at') + ':'"
                  :value="project.last_activity.updater.at"
                  width="150"
                />
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
  <div v-else>
    <div v-if="loading" class="flex flex-column justify-content-center h-screen align-items-center">
      <ProgressSpinner />
    </div>
  </div>
  <WMProjectPendingConfigDialog
    v-if="project"
    v-model="pendingConfigDialogVisibility"
    :project="project"
    @config-updated="onConfigUpdated"
  />
</template>

<script setup>
// IMPORTS
import { useDateFormat } from "@vueuse/core";
import { useForm } from "vee-validate";
import { onMounted, ref, watch } from "vue";
import { provide } from "vue";
import { useRoute } from "vue-router";

import { CONTRACTOR_PROJECT_ID } from "@/constants";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();

const route = useRoute();

const { can } = usePermissions();
const { setSelectedContacts } = useContacts();

const {
  getProjectFromApi,
  updateProject,
  parseUpdateProject,
  mapContactsFromProjects,
  updateProjectConfig,
  parseUpdateProjectConfig,
} = useProjects();

const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

// REFS
const stages = ref([]);
const currentStage = ref();
const selectedProjectType = ref(false);

const project = ref();

const refreshDocumentsTable = ref(false);

const pendingConfigDialogVisibility = ref(false);

// PROJECT TYPES
// TODO: change this to a CONST file
const COMPETITION_PROJECT_ID = "competition_project";
const ROUND_OF_SIGNATURES_PROJECT_ID = "round_of_signatures";
const TENDER_PROJECT_ID = "tender";

// COMPUTED

// COMPONENT METHODS AND LOGIC

const fetchData = async () => {
  const data = await getProjectFromApi(route.params.id);
  project.value = data;

  utilsStore.selectedElements["project"] = [project.value];

  stages.value = data.process.stages.map((stage) => {
    const completed_at = stage.completed_at ? useDateFormat(stage.completed_at, "DD/MM/YY") : null;

    return {
      label: stage.name,
      date: useDateFormat(stage.sla.due_date, "DD/MM/YY"),
      completed_at,
    };
  });

  currentStage.value = data.process?.current_stage.order;
};

const { handleSubmit, resetForm, meta, values } = useForm({
  validationSchema: formUtilsStore.getProjectDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateProject(route.params.id, parseUpdateProject(values))
    .then(() => {
      toast.successAction("project", "updated");
      resetForm({ values: values });
      fetchData();
    })
    .catch((error) => {
      console.error(error);
      toast.error("project", "not-updated");
    });

  // for now this is only for contractor project type
  if (
    project.value.project_type.value === CONTRACTOR_PROJECT_ID &&
    project.value.status.value === "pending_configuration"
  ) {
    updateProjectConfig(route.params.id, parseUpdateProjectConfig(values))
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error(error);
        toast.error("project", "not-updated");
      });
  }
});

const handleProjectTypeUpdate = (value) => {
  selectedProjectType.value = value;
};

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "project";
utilsStore.entity = "project";

const onDocumentSigned = () => {
  refreshDocumentsTable.value = true;
};

const onConfigUpdated = () => {
  fetchData();
  pendingConfigDialogVisibility.value = false;
};

// PROVIDE, EXPOSE
provide("refreshDocumentsTable", refreshDocumentsTable);

defineExpose({
  onSave,
  fetchData,
});

// WATCHERS

watch(
  () => values,
  () => {
    const formMeta = meta.value;
    formUtilsStore.formMeta = formMeta;
    formUtilsStore.setFormMetas(formMeta, props.formKey);
  },
  { deep: true }
);
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)

onMounted(async () => {
  await fetchData();
  const mappedContacts = mapContactsFromProjects(project.value);
  setSelectedContacts(mappedContacts);

  if (project.value.status.value === "pending_configuration") {
    pendingConfigDialogVisibility.value = true;
  }
});
</script>

<style scoped lang="scss"></style>
