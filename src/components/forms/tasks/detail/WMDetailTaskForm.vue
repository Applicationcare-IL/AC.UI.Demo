<template>
  <div
    v-if="task"
    class="wm-detail-form-container flex flex-auto flex-column overflow-auto"
  >
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container top-info-card flex-1">
          <Card>
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="owner"
                    type="info"
                    :highlighted="true"
                    :label="$t('owner') + ':'"
                    :value="task.owner"
                  />
                  <WMInput
                    name="team"
                    type="info"
                    :highlighted="true"
                    :label="$t('team') + ':'"
                    :value="task.team"
                  />
                  <WMInput
                    name="status"
                    type="info"
                    :highlighted="true"
                    :label="$t('status') + ':'"
                    :value="task.status[optionLabelWithLang]"
                  />
                </div>

                <div class="wm-form-row align-items-start gap-5">
                  <WMInput
                    name="started-date"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.started_at')"
                    :value="task.started_at"
                  />
                  <WMInput
                    name="due-date"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.due_date')"
                    :value="task.due_date"
                  />
                  <WMInput
                    name="sla"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.sla')"
                    class="sla"
                  >
                    <WMSLATag
                      v-if="task.sla"
                      :sla="task.sla.sla"
                      :days-for-closing="task.days_for_closing"
                      :state="task.state.value"
                    />
                  </WMInput>
                </div>

                <div class="wm-form-row align-items-start gap-5">
                  <WMInput
                    v-if="task.task_family"
                    name="family"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.family')"
                    :value="task.task_family[optionLabelWithLang]"
                  />
                  <WMInput
                    name="type"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.type')"
                    :value="task.task_type?.name"
                  />
                </div>

                <div class="wm-form-row align-items-start gap-5">
                  <WMInput
                    name="contact"
                    type="info-link"
                    :highlighted="true"
                    :label="$t('contact.contact') + ':'"
                    :value="contactFullName"
                    :to="'/contact/' + task.contact_id"
                  />
                  <WMInput
                    name="customer"
                    type="info-link"
                    :highlighted="true"
                    :label="$t('customer.customer') + ':'"
                    :value="task.customer"
                    :to="'/customer/' + task.customer_id"
                  />
                </div>

                <div class="wm-form-row align-items-start gap-5">
                  <WMInput
                    name="service_number"
                    type="info-link"
                    :highlighted="true"
                    :label="$t('task.service_number')"
                    :value="task.service_number"
                    :to="'/service/' + task.service_number"
                  />

                  <WMInput
                    name="recurring-task"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.recurring_task')"
                    value="No"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <!-- RELATED ENTITY -->
        <WMDetailTaskRelatedService
          v-if="task.related_entity?.type == 'service'"
          :service="service"
        />
        <WMDetailTaskRelatedProject
          v-if="
            task.related_entity?.type == 'project' &&
            checkIfEntityIsActive('projects')
          "
          :project="project"
        />
        <div
          v-if="task.related_entity == null"
          class="card-container top-info-card flex-1"
        >
          <Card class="flex align-items-center justify-content-center">
            <template #content>
              <h3>Task isn’t related to an entity</h3>
            </template>
          </Card>
        </div>
      </div>

      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card flex-1">
          <Card>
            <template #title> {{ $t("task.description") }} </template>
            <template #content>
              <div class="task-description flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <Textarea
                    v-model="task.description"
                    auto-resize
                    rows="5"
                    disabled
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container middle-info-card flex-1">
          <Card>
            <template #title> {{ $t("task.notes") }} </template>
            <template #content>
              <div class="task-notes flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    id="notes"
                    :value="task.notes"
                    type="text-area"
                    name="notes"
                    width="full"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <div
        v-if="task?.related_entity?.type == 'service' && service"
        class="flex flex-row gap-5 flex-wrap mt-5"
      >
        <WMDetailFormLocation :location="service.location" />
        <WMDetailFormSite :site="service.site" />
      </div>

      <WMDetailTaskSubprojectInfo
        v-if="task.task_family?.value === 'subproject' && task.project_created"
        :task="task"
      />

      <div class="flex flex-row gap-5 flex-wrap mt-5">
        <Accordion class="p-accordion--blue" :active-index="0">
          <AccordionTab :header="$t('documents.documents')">
            <WMDocumentsTable
              :columns="documentsColumns"
              :related-entity-id="route.params.id"
              related-entity="task"
              :hide-title="true"
              :project-id="projectId"
            />
          </AccordionTab>
        </Accordion>
      </div>

      <div class="flex flex-row flex-wrap mb-5">
        <Accordion>
          <AccordionTab :header="$t('attachments.attachments')">
            <WMAttachmentsTable
              :entity-id="route.params.id"
              entity-type="task"
            />
          </AccordionTab>
        </Accordion>
      </div>

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
                  :value="task.last_activity.creator.name"
                  width="150"
                />
                <WMInput
                  name="modified_by"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_by') + ':'"
                  :value="task.last_activity.updater.name"
                  width="150"
                />
              </div>
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput
                  name="created_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('created_at') + ':'"
                  :value="task.last_activity.creator.at"
                  width="150"
                />
                <WMInput
                  name="modified_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_at') + ':'"
                  :value="task.last_activity.updater.at"
                  width="150"
                />
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const toast = useToast();
const { updateTask, parseUpdateTask, getTaskFromApi, mapContactsFromTasks } =
  useTasks();
const { optionLabelWithLang } = useLanguages();
const { handleRouteChangeWithUnsavedFormChanges } = useNavigationGuards();
const formUtilsStore = useFormUtilsStore();
const { getTaskDocumentColumns } = useListUtils();
const utilsStore = useUtilsStore();
const route = useRoute();
const { getServiceFromApi } = useServices();
const { setSelectedContacts } = useContacts();
const { getProjectFromApi } = useProjects();
const { checkIfEntityIsActive } = useLicensing();

// PROPS, EMITS
const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

// REFS
const documentsColumns = ref(getTaskDocumentColumns());
const task = ref();
const service = ref();
const project = ref();

// COMPUTED
const contactFullName = computed(() => {
  if (task.value.contact) {
    return task.value.contact.name + " " + task.value.contact.surname;
  }

  return "";
});

const projectId = computed(() => {
  if (task.value.related_entity?.type === "project") {
    return task.value.related_entity.id;
  }

  return null;
});

// COMPONENT METHODS
const { handleSubmit, meta, resetForm } = useForm({
  // validationSchema: formUtilsStore.getContactDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateTask(route.params.id, parseUpdateTask(values))
    .then(() => {
      toast.successAction("task", "updated");
      resetForm({ values: values });
    })
    .catch((error) => {
      console.error(error);
      toast.error("service", "not-updated");
    });
});

formUtilsStore.formEntity = "task";
utilsStore.entity = "task";

handleRouteChangeWithUnsavedFormChanges(meta);

const loadTask = async () => {
  await getTaskFromApi(route.params.id).then((data) => {
    task.value = data;

    utilsStore.selectedElements["task"] = [task.value];
  });
};

// EXPOSE
defineExpose({
  onSave,
  loadTask,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    formUtilsStore.setFormMetas(value, props.formKey);
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadTask();

  if (task.value.related_entity?.type === "service") {
    getServiceFromApi(task.value.related_entity.id).then((data) => {
      service.value = data;
    });
  }

  if (task.value.related_entity?.type === "project") {
    getProjectFromApi(task.value.related_entity.id).then((data) => {
      project.value = data;
    });
  }

  setSelectedContacts(mapContactsFromTasks(task.value));
});
</script>

<style scoped lang="scss"></style>
