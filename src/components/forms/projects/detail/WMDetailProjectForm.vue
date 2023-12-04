<template>
  <div
    v-if="project"
    class="wm-detail-form-container flex flex-auto flex-column overflow-auto"
  >
    <div class="service-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">Project: {{ project.project_name }}</h1>
          <div :class="statusClass(project.state)" class="status-label">
            {{ $t("statuses." + project.state) }}
          </div>
        </div>
        <div>
          <!-- <WMAnnouncementsButton entity="projects" :id="route.params.id" /> -->
        </div>
      </div>

      <div class="flex gap-5">
        <div class="flex-1 card-container">
          <WMDetailProjectFormGeneralInformation />
        </div>
        <div class="flex flex-1 gap-5 flex-column card-container">
          <WMDetailProjectFormClassification />
          <WMDetailProjectFormExecutionInformation />
        </div>
      </div>

      <div class="flex-1 card-container">
        <WMDetailProjectFormLocation />
      </div>

      <div class="flex-1 card-container">
        <Card>
          <template #title> Budget </template>
          <template #content> Budget </template>
        </Card>
      </div>

      <div class="mt-5">
        <WMStepper
          :steps="stages"
          :currentStep="currentStage"
          aria-label="Form Steps"
        />
      </div>

      <Accordion>
        <AccordionTab header="Journal"> Journal </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab header="Tasks">
          <WMDetailProjectFormTasksTab />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab header="Round of signatures tasks">
          <WMDetailProjectFormSignatureTasksTab />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab header="Gantt"> Gantt </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab header="Team">
          <WMDetailProjectFormTeamTab />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab header="Documents"> Documents </AccordionTab>
      </Accordion>

      <div class="flex-1 tabs-container mt-5">
        <WMDetailProjectFormAdditionalInformation />
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, watch, defineExpose } from "vue";

import { useForm } from "vee-validate";
import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useRoute } from "vue-router";
import { useDateFormat } from "@vueuse/core";

const { getTasksFromApi } = useTasks();
const { updateService, parseUpdateService, getServiceFromApi, cancelService } =
  useServices();

const { getProjectFromApi } = useProjects();

const toast = useToast();
const stages = ref([]);
const currentStage = ref();

const tasks = ref();
const project = ref();

const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();

const service = ref();
const route = useRoute();

const {
  getTaskColumns,
  getStatusConditionalStyle,
  getPriorityConditionalStyle,
} = useListUtils();

const taskColumns = ref(getTaskColumns());

const requests2 = ref([]);
const requests3 = ref([]);

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  const data = await getProjectFromApi(route.params.id);
  project.value = data;

  stages.value = data.process.stages.map((stage) => ({
    label: stage.name,
    date: useDateFormat(stage.sla.due_date, "DD/MM/YY"),
  }));

  currentStage.value = data.current_stage?.order - 1;

  // const tasksData = await getTasksFromApi({
  //   entity_type: "service",
  //   entity_id: route.params.id,
  // });

  // tasks.value = tasksData.data;
};

const { errors, handleSubmit, setFieldError, meta } = useForm({
  validationSchema: formUtilsStore.getServiceDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateService(route.params.id, parseUpdateService(values))
    .then((data) => {
      toast.successAction("service", "updated");
      resetForm({ values: values });
    })
    .catch((error) => {
      console.log(error);
      toast.error("service", "not-updated");
    });
});

const priorityClass = (data) => {
  return getPriorityConditionalStyle(data);
};

// formUtilsStore.submit = onSubmit;
formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "service";
utilsStore.entity = "service";

const handleCancelService = (id) => {
  cancelService(id, formUtilsStore.cancelServiceReasons)
    .then((data) => {
      toast.successAction("service", "canceled");
    })
    .catch((error) => {
      console.log(error);
      toast.error("service", "not-canceled");
    });
};

formUtilsStore.cancelService = handleCancelService;

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
